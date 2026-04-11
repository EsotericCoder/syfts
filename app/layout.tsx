import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RunDealz — Running Shoe Deals & Price Drops",
  description: "Never pay full price for running shoes. Daily deals, price drops, and coupon codes on Nike, ASICS, Brooks, Hoka, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
