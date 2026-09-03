// lib/api/orders.ts
import { apiFetch } from "./client";
import type { Order, OrderItem } from "@/types/order";

export const orderKeys = {
  detail: (id: string) => ["orders", id] as const,
};

type CreateOrderInput = {
  eventId: string;
  items: OrderItem[];
  /** Stripe PaymentIntent id (or the test-mode stand-in) confirming payment succeeded. */
  paymentReference: string;
};

/**
 * Always calls the local /api/orders route handler, same reasoning as
 * lib/api/auth.ts — order creation needs to check the session cookie
 * server-side (see app/api/orders/route.ts), which a client-only mock
 * function can't do. Swap the route handler's internals for a real
 * backend call later; this function's signature doesn't change.
 */
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const { order } = await apiFetch<{ order: Order }>("/api/orders", {
    method: "POST",
    body: input,
  });
  return order;
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  try {
    const { order } = await apiFetch<{ order: Order }>(`/api/orders/${id}`, { cache: "no-store" });
    return order;
  } catch {
    return null;
  }
}