"use client";

import { useState } from "react";
import { Deal, CATEGORIES } from "@/lib/types";
import { DealCard } from "./DealCard";

export function DealsPage({ initialDeals }: { initialDeals: Deal[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const filtered = initialDeals.filter((d) => {
    const matchCat = activeCategory === "All" || d.category === activeCategory;
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.brand.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950 text-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👟</span>
            <span className="text-xl font-extrabold tracking-tight">
              Syfts<span className="text-emerald-400">.ai</span>
            </span>
          </div>
          <nav className="flex gap-6 text-sm font-semibold">
            <a href="#" className="text-white/60 hover:text-white transition">About</a>
            <a href="#" className="text-white/60 hover:text-white transition">Submit Deal</a>
            <a href="#alerts" className="text-emerald-400">Alerts</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-950 to-gray-800 px-6 py-14 text-center text-white">
        <h1 className="text-4xl font-black tracking-tight md:text-5xl">
          Never Pay Full Price
          <br />
          for Running Shoes
        </h1>
        <p className="mt-2 text-base text-white/50">
          We sift through thousands of prices so you don&apos;t have to.
        </p>
        <div className="mx-auto mt-7 max-w-md">
          <div className="flex overflow-hidden rounded-xl bg-white shadow-lg">
            <input
              type="text"
              placeholder="Search shoes, brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 text-sm text-gray-900 outline-none"
            />
            <button className="bg-emerald-400 px-5 text-lg">🔍</button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-6 pt-5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              activeCategory === cat
                ? "bg-gray-950 text-emerald-400"
                : "bg-white text-gray-500 shadow-sm hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="mx-auto max-w-6xl px-6 pt-3 text-xs text-gray-400">
        {filtered.length} deal{filtered.length !== 1 && "s"} found
      </p>

      {/* Grid */}
      <main className="mx-auto grid max-w-6xl gap-5 px-6 pb-12 pt-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-20 text-center text-gray-400">
            No deals match your search.
          </p>
        )}
      </main>

      {/* Email Signup */}
      <section id="alerts" className="bg-gray-950 px-6 py-14 text-center text-white">
        <h2 className="text-2xl font-extrabold tracking-tight">
          Get Deals in Your Inbox
        </h2>
        <p className="mt-1 text-sm text-white/40">
          Daily alerts when your favorite shoes drop in price.
        </p>
        {subscribed ? (
          <p className="mt-5 font-bold text-emerald-400">✓ You&apos;re in!</p>
        ) : (
          <div className="mx-auto mt-5 flex max-w-sm overflow-hidden rounded-lg">
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 text-sm text-gray-900 outline-none"
            />
            <button
              onClick={() => email && setSubscribed(true)}
              className="bg-emerald-400 px-5 text-sm font-bold text-gray-900"
            >
              Subscribe
            </button>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 p-6 text-center text-xs text-gray-500">
        Syfts © {new Date().getFullYear()} · Affiliate Disclosure: We earn
        commissions from qualifying purchases.
      </footer>
    </div>
  );
}
