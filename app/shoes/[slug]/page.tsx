import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getDealsByProduct, getPriceHistory, getPreviousVersion } from "@/lib/db";
import { PriceHistoryChart } from "@/components/PriceHistoryChart";
import { PriceAlertForm } from "@/components/PriceAlertForm";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Shoe Not Found — Syfts" };

  const deals = await getDealsByProduct(product.id);
  const priceRange =
    deals.length > 0
      ? `$${deals[deals.length - 1].currentPrice.toFixed(2)}–$${deals[0].currentPrice.toFixed(2)}`
      : "";

  return {
    title: `${product.name} Price Comparison — Syfts`,
    description: `Compare prices for ${product.brandName} ${product.name} across ${deals.length} stores. ${priceRange ? `Prices from ${priceRange}.` : ""} ${product.description ?? ""}`.trim(),
  };
}

export default async function ShoePage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [deals, priceHistory] = await Promise.all([
    getDealsByProduct(product.id),
    getPriceHistory(product.id),
  ]);

  const previousVersion = product.previousVersionSlug
    ? await getPreviousVersion(product.previousVersionSlug)
    : null;

  const specs = Object.entries(product.specs);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-6 pt-5">
        <nav className="flex gap-1.5 text-xs text-gray-400">
          <a href="/" className="hover:text-emerald-400 transition">Home</a>
          <span>/</span>
          <span className="text-gray-600">{product.name}</span>
        </nav>
      </div>

      {/* Product Header */}
      <section className="mx-auto max-w-6xl px-6 pt-5 pb-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="flex h-56 w-full items-center justify-center rounded-2xl bg-gray-100 text-6xl opacity-30 md:w-72 md:shrink-0">
            👟
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {product.brandName} · {product.category}
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-gray-900 md:text-4xl">
              {product.name}
            </h1>
            {product.description && (
              <p className="mt-2 max-w-xl text-sm text-gray-500">{product.description}</p>
            )}
            {deals.length > 0 && (
              <p className="mt-3 text-sm text-gray-400">
                From{" "}
                <span className="font-mono text-xl font-extrabold text-gray-900">
                  ${deals[0].currentPrice.toFixed(2)}
                </span>{" "}
                across {deals.length} store{deals.length !== 1 && "s"}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Retailer Comparison */}
      <section className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 p-5">
            <h2 className="text-lg font-bold text-gray-900">Compare Prices</h2>
          </div>
          {deals.length === 0 ? (
            <p className="p-5 text-sm text-gray-400">
              No deals available right now. Check back soon!
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {deals.map((deal, i) => (
                <div
                  key={deal.id}
                  className="flex flex-wrap items-center gap-3 p-5 transition hover:bg-gray-50"
                >
                  {i === 0 && (
                    <span className="rounded-full bg-emerald-400 px-2.5 py-0.5 text-[10px] font-bold text-gray-900">
                      Best Price
                    </span>
                  )}
                  <span className="text-sm font-semibold text-gray-900 sm:w-40">
                    {deal.storeName}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xl font-extrabold text-gray-900">
                      ${deal.currentPrice.toFixed(2)}
                    </span>
                    <span className="font-mono text-sm text-gray-400 line-through">
                      ${deal.originalPrice.toFixed(2)}
                    </span>
                  </div>
                  <span className="rounded-full bg-gray-900 px-3 py-1 font-mono text-xs font-bold text-emerald-400">
                    -{deal.discountPct}%
                  </span>
                  <a
                    href={deal.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto rounded-lg bg-gray-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-400 hover:text-gray-900"
                  >
                    Visit Site →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Price History Chart */}
      <section className="mx-auto max-w-6xl px-6 pb-6">
        <PriceHistoryChart data={priceHistory} />
      </section>

      {/* Product Specs */}
      {specs.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-bold text-gray-900">Specifications</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {specs.map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {key}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Version Comparison */}
      {previousVersion && (
        <section className="mx-auto max-w-6xl px-6 pb-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-bold text-gray-900">
              vs. {previousVersion.name}
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              See how this version compares to the previous model.
            </p>
            {Object.keys(previousVersion.specs).length > 0 &&
              specs.length > 0 && (
                <div className="mt-4">
                  <div className="grid grid-cols-3 gap-2 border-b border-gray-200 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    <span>Spec</span>
                    <span>{product.name}</span>
                    <span>{previousVersion.name}</span>
                  </div>
                  {specs.map(([key, value]) => (
                    <div
                      key={key}
                      className="grid grid-cols-3 gap-2 border-b border-gray-100 py-2 text-sm"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        {key}
                      </span>
                      <span className="font-medium text-gray-900">{value}</span>
                      <span className="text-gray-500">
                        {previousVersion.specs[key] ?? "—"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            <a
              href={`/shoes/${previousVersion.slug}`}
              className="mt-4 inline-block text-sm font-semibold text-emerald-500 hover:text-emerald-400 transition"
            >
              View {previousVersion.name} deals →
            </a>
          </div>
        </section>
      )}

      {/* Price Alert */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <PriceAlertForm productId={product.id} currentLowest={deals[0]?.currentPrice} />
      </section>
    </div>
  );
}
