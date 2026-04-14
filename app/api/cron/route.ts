import { NextResponse } from "next/server";
import {
  getAllActiveProducts,
  upsertDeal,
  upsertPriceHistory,
  getTriggeredAlerts,
  markAlertTriggered,
} from "@/lib/db";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("[cron] Checking prices...");

  const products = await getAllActiveProducts();
  let checked = 0;
  let updated = 0;

  for (const product of products) {
    const currentPrice = await checkPrice(product.affiliateUrl);
    if (currentPrice === null) continue;
    checked++;

    const discountPct = Math.round(
      (1 - currentPrice / product.originalPrice) * 100
    );
    if (discountPct > 0) {
      await upsertDeal(
        product.id,
        product.storeId,
        currentPrice,
        product.originalPrice,
        product.affiliateUrl
      );
      updated++;
    }

    await upsertPriceHistory(product.id, currentPrice, product.storeId);
  }

  // Check and log triggered alerts
  const triggered = await getTriggeredAlerts();
  for (const alert of triggered) {
    console.log(
      `[cron] Alert triggered: ${alert.email} — ${alert.productName} at $${alert.currentPrice} (threshold: $${alert.priceThreshold})`
    );
    // TODO: Send email via Resend / Mailchimp
    await markAlertTriggered(alert.alertId);
  }

  console.log(
    `[cron] Done. Checked: ${checked}, Updated: ${updated}, Alerts: ${triggered.length}`
  );

  return NextResponse.json({
    ok: true,
    checked,
    updated,
    alertsTriggered: triggered.length,
  });
}

// Placeholder — replace with Keepa API or Amazon PA API call
async function checkPrice(_url: string): Promise<number | null> {
  return null;
}
