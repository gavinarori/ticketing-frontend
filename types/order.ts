// types/order.ts

export type OrderStatus = "pending_payment" | "paid" | "failed" | "cancelled";

export type OrderItem = {
  seatId: string;
  section: string;
  row: string;
  number: number;
  categoryLabel: string;
  price: number; // minor units
};

export type Order = {
  id: string;
  eventId: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  fees: number;
  total: number;
  currency: string;
  status: OrderStatus;
  createdAt: string;
};