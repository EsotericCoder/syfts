import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Syfts — Running Shoe Deals & Price Drops",
  description: "Never pay full price for running shoes. Daily deals, price drops, and coupon codes on Nike, ASICS, Brooks, Hoka, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-gray-950 text-white">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">👟</span>
              <span className="text-xl font-extrabold tracking-tight">
                Syfts<span className="text-emerald-400">.ai</span>
              </span>
            </Link>
            <nav className="flex gap-6 text-sm font-semibold">
              <Link href="/" className="text-white/60 hover:text-white transition">
                Deals
              </Link>
              <a href="#" className="text-white/60 hover:text-white transition">
                About
              </a>
              <a href="#alerts" className="text-emerald-400">
                Alerts
              </a>
            </nav>
          </div>
        </header>

        {children}

        {/* Footer */}
        <footer className="bg-gray-900 p-6 text-center text-xs text-gray-500">
          Syfts &copy; {new Date().getFullYear()} &middot; Affiliate Disclosure: We earn
          commissions from qualifying purchases.
        </footer>

        <script
          defer
          src="https://ltag.lustre.ai/?ref=e7f186812d5e5223a968034860eb439b"
        />
      </body>
    </html>
  );
}
