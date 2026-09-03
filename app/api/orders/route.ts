// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { readSessionCookie } from "@/lib/auth/session";
import { saveOrder } from "@/lib/orders/mock-store";
import type { Order } from "@/types/order";

const orderItemSchema = z.object({
  seatId: z.string(),
  section: z.string(),
  row: z.string(),
  number: z.number(),
  categoryLabel: z.string(),
  price: z.number(),
});

const createOrderSchema = z.object({
  eventId: z.string(),
  items: z.array(orderItemSchema).min(1),
  paymentReference: z.string().min(1),
});

const FEE_RATE = 0.05;

export async function POST(request: Request) {
  const user = await readSessionCookie();
  if (!user) {
    return NextResponse.json({ code: "unauthorized", message: "Sign in to place an order." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ code: "invalid_input", message: "That order didn't come through right." }, { status: 400 });
  }

  const subtotal = parsed.data.items.reduce((sum, item) => sum + item.price, 0);
  const fees = Math.round(subtotal * FEE_RATE);

  const order: Order = {
    id: crypto.randomUUID(),
    eventId: parsed.data.eventId,
    userId: user.id,
    items: parsed.data.items,
    subtotal,
    fees,
    total: subtotal + fees,
    currency: "GBP",
    status: "paid",
    createdAt: new Date().toISOString(),
  };

  saveOrder(order);
  return NextResponse.json({ order }, { status: 201 });
}