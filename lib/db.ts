import { sql } from "@vercel/postgres";
import type { Deal, Product, DealRow, PriceHistoryPoint, TriggeredAlert } from "./types";

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { rows } = await sql`
    SELECT p.id, p.name, p.slug, p.brand_id, b.name AS brand_name,
           p.sport_id, p.category, p.description, p.image_url,
           p.specs, p.previous_version_slug, p.created_at
    FROM products p
    JOIN brands b ON b.id = p.brand_id
    WHERE p.slug = ${slug}
  `;
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    brandId: r.brand_id,
    brandName: r.brand_name,
    sportId: r.sport_id,
    category: r.category,
    description: r.description,
    imageUrl: r.image_url,
    specs: r.specs ?? {},
    previousVersionSlug: r.previous_version_slug,
    createdAt: r.created_at,
  };
}

export async function getDealsByProduct(productId: number): Promise<DealRow[]> {
  const { rows } = await sql`
    SELECT d.id, d.product_id, d.store_id, s.name AS store_name,
           s.domain AS store_domain, d.current_price, d.original_price,
           d.discount_pct, d.affiliate_url, d.is_active, d.updated_at
    FROM deals d
    JOIN stores s ON s.id = d.store_id
    WHERE d.product_id = ${productId} AND d.is_active = true
    ORDER BY d.current_price ASC
  `;
  return rows.map((r) => ({
    id: r.id,
    productId: r.product_id,
    storeId: r.store_id,
    storeName: r.store_name,
    storeDomain: r.store_domain,
    currentPrice: parseFloat(r.current_price),
    originalPrice: parseFloat(r.original_price),
    discountPct: r.discount_pct,
    affiliateUrl: r.affiliate_url,
    isActive: r.is_active,
    updatedAt: r.updated_at,
  }));
}

export async function getHotDeals(sport?: string): Promise<Deal[]> {
  const { rows } = await sql`
    SELECT d.id, p.name, p.slug, b.name AS brand, p.category,
           d.original_price, d.current_price, d.discount_pct,
           s.name AS store, d.affiliate_url, p.image_url, d.updated_at
    FROM deals d
    JOIN products p ON p.id = d.product_id
    JOIN brands b ON b.id = p.brand_id
    JOIN stores s ON s.id = d.store_id
    JOIN sports sp ON sp.id = p.sport_id
    WHERE d.is_active = true
      AND (${sport}::text IS NULL OR sp.slug = ${sport})
    ORDER BY d.discount_pct DESC
    LIMIT 20
  `;
  return rows.map((r) => ({
    id: String(r.id),
    name: r.name,
    slug: r.slug,
    brand: r.brand,
    category: r.category,
    originalPrice: parseFloat(r.original_price),
    dealPrice: parseFloat(r.current_price),
    discount: r.discount_pct,
    store: r.store,
    link: r.affiliate_url,
    image: r.image_url ?? "",
    hot: r.discount_pct >= 35,
    postedAt: r.updated_at,
  }));
}

export async function getPriceHistory(
  productId: number,
  days: number = 30
): Promise<PriceHistoryPoint[]> {
  const { rows } = await sql`
    SELECT recorded_at, price
    FROM price_history
    WHERE product_id = ${productId}
      AND recorded_at >= CURRENT_DATE - ${days}::integer
    ORDER BY recorded_at ASC
  `;
  return rows.map((r) => ({
    date: r.recorded_at,
    price: parseFloat(r.price),
  }));
}

export async function createAlert(
  email: string,
  productId: number,
  priceThreshold: number
): Promise<{ id: number }> {
  const { rows } = await sql`
    INSERT INTO alerts (email, product_id, price_threshold)
    VALUES (${email}, ${productId}, ${priceThreshold})
    RETURNING id
  `;
  return { id: rows[0].id };
}

export async function upsertDeal(
  productId: number,
  storeId: number,
  currentPrice: number,
  originalPrice: number,
  affiliateUrl: string
): Promise<void> {
  const discountPct = Math.round((1 - currentPrice / originalPrice) * 100);
  await sql`
    INSERT INTO deals (product_id, store_id, current_price, original_price, discount_pct, affiliate_url)
    VALUES (${productId}, ${storeId}, ${currentPrice}, ${originalPrice}, ${discountPct}, ${affiliateUrl})
    ON CONFLICT (product_id, store_id)
    DO UPDATE SET
      current_price = ${currentPrice},
      discount_pct = ${discountPct},
      affiliate_url = ${affiliateUrl},
      last_checked = NOW(),
      updated_at = NOW()
  `;
}

export async function upsertPriceHistory(
  productId: number,
  price: number,
  storeId: number
): Promise<void> {
  await sql`
    INSERT INTO price_history (product_id, price, store_id)
    VALUES (${productId}, ${price}, ${storeId})
    ON CONFLICT (product_id, recorded_at)
    DO UPDATE SET
      price = LEAST(price_history.price, EXCLUDED.price),
      store_id = CASE
        WHEN EXCLUDED.price < price_history.price THEN EXCLUDED.store_id
        ELSE price_history.store_id
      END
  `;
}

export async function getTriggeredAlerts(): Promise<TriggeredAlert[]> {
  const { rows } = await sql`
    SELECT a.id AS alert_id, a.email, p.name AS product_name,
           MIN(d.current_price) AS current_price, a.price_threshold
    FROM alerts a
    JOIN products p ON p.id = a.product_id
    JOIN deals d ON d.product_id = a.product_id AND d.is_active = true
    WHERE a.is_active = true
      AND a.triggered_at IS NULL
    GROUP BY a.id, a.email, p.name, a.price_threshold
    HAVING MIN(d.current_price) <= a.price_threshold
  `;
  return rows.map((r) => ({
    alertId: r.alert_id,
    email: r.email,
    productName: r.product_name,
    currentPrice: parseFloat(r.current_price),
    priceThreshold: parseFloat(r.price_threshold),
  }));
}

export async function markAlertTriggered(alertId: number): Promise<void> {
  await sql`
    UPDATE alerts SET triggered_at = NOW() WHERE id = ${alertId}
  `;
}

export async function getAllActiveProducts(): Promise<
  { id: number; name: string; storeId: number; affiliateUrl: string; originalPrice: number }[]
> {
  const { rows } = await sql`
    SELECT p.id, p.name, d.store_id, d.affiliate_url, d.original_price
    FROM products p
    JOIN deals d ON d.product_id = p.id
    WHERE d.is_active = true
  `;
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    storeId: r.store_id,
    affiliateUrl: r.affiliate_url,
    originalPrice: parseFloat(r.original_price),
  }));
}

export async function getPreviousVersion(slug: string): Promise<Product | null> {
  return getProductBySlug(slug);
}
