// lib/orders/mock-store.ts
//
// ⚠️ MOCK ONLY — in-memory, resets on server restart, not shared across
// serverless instances. Lives behind app/api/orders/* route handlers
// (rather than a client-side Map, like lib/auth/mock-users.ts does for
// auth) specifically so an order created during checkout is still visible
// to a later page load's server-side fetch — a client-only mock would
// live in a different JS context per request and the two would never see
// each other's data.

import type { Order } from "@/types/order";

const orders = new Map<string, Order>();

export function saveOrder(order: Order) {
  orders.set(order.id, order);
}

export function getOrder(id: string): Order | undefined {
  return orders.get(id);
}