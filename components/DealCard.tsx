"use client";

import Link from "next/link";
import { Deal } from "@/lib/types";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return "Just now";
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function DealCard({ deal }: { deal: Deal }) {
  const card = (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-xl">
      {deal.hot && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white">
          🔥 HOT
        </span>
      )}
      <span className="absolute right-3 top-3 z-10 rounded-full bg-gray-900 px-3 py-1 font-mono text-xs font-bold text-emerald-400">
        -{deal.discount}%
      </span>

      <div className="relative h-44 bg-gray-100">
        <div className="flex h-full items-center justify-center text-4xl opacity-30">
          👟
        </div>
      </div>

      <div className="p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          {deal.brand} · {deal.category}
        </p>
        <h3 className="mt-1 text-base font-bold text-gray-900 leading-tight">
          {deal.name}
        </h3>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-mono text-xl font-extrabold text-gray-900">
            ${deal.dealPrice.toFixed(2)}
          </span>
          <span className="font-mono text-sm text-gray-400 line-through">
            ${deal.originalPrice.toFixed(2)}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">
            {deal.store} · {timeAgo(deal.postedAt)}
          </span>
          <a
            href={deal.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 rounded-lg bg-gray-900 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-emerald-400 hover:text-gray-900"
          >
            Get Deal →
          </a>
        </div>
      </div>
    </div>
  );

  if (deal.slug) {
    return <Link href={`/shoes/${deal.slug}`}>{card}</Link>;
  }

  return card;
}
