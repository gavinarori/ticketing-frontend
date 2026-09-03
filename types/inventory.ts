// types/inventory.ts

export type SeatHold = {
  eventId: string;
  seatIds: string[];
  expiresAt: string; // ISO
};

export type SeatHoldConflict = {
  seatId: string;
  reason: "already_held" | "already_sold";
};