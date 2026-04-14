import { NextResponse } from "next/server";
import { createAlert } from "@/lib/db";

export async function POST(request: Request) {
  let body: { email?: string; productId?: number; priceThreshold?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, productId, priceThreshold } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (!productId || typeof productId !== "number") {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }
  if (!priceThreshold || priceThreshold <= 0) {
    return NextResponse.json({ error: "Price must be greater than 0" }, { status: 400 });
  }

  try {
    const alert = await createAlert(email, productId, priceThreshold);
    return NextResponse.json({ ok: true, alertId: alert.id });
  } catch {
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 });
  }
}
