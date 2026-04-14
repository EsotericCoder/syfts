"use client";

import { useState } from "react";

export function PriceAlertForm({
  productId,
  currentLowest,
}: {
  productId: number;
  currentLowest: number | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [priceThreshold, setPriceThreshold] = useState(
    currentLowest ? Math.max(1, Math.floor(currentLowest - 10)).toString() : ""
  );
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          productId,
          priceThreshold: parseFloat(priceThreshold),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Failed to create alert. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <p className="text-center font-bold text-emerald-500">
          ✓ Price alert created! We&apos;ll email you when the price drops.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Price Alert</h3>
          <p className="text-sm text-gray-400">
            Get notified when the price drops below your target.
          </p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-400 hover:text-gray-900"
        >
          {isOpen ? "Close" : "Set Price Alert"}
        </button>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {currentLowest && (
            <p className="text-sm text-gray-500">
              Current lowest price:{" "}
              <span className="font-mono font-bold text-gray-900">
                ${currentLowest.toFixed(2)}
              </span>
            </p>
          )}
          <div className="flex gap-3">
            <input
              type="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-400"
            />
            <div className="flex items-center gap-1 rounded-lg border border-gray-200 px-3">
              <span className="text-sm text-gray-400">$</span>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                placeholder="Target price"
                value={priceThreshold}
                onChange={(e) => setPriceThreshold(e.target.value)}
                className="w-28 py-2.5 text-sm text-gray-900 outline-none"
              />
            </div>
          </div>
          {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-lg bg-emerald-400 py-2.5 text-sm font-bold text-gray-900 transition hover:bg-emerald-300 disabled:opacity-50"
          >
            {status === "loading" ? "Creating..." : "Create Alert"}
          </button>
        </form>
      )}
    </div>
  );
}
