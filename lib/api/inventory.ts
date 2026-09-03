import { apiFetch } from "./client";
import type { SeatHold } from "@/types/inventory";
import { SEAT_SELECTION_LIMITS } from "@/lib/utils/constants";

const USE_MOCK = !process.env.NEXT_PUBLIC_API_URL;

/**
 * Callers must check useAuth().user before calling this — holding a seat
 * requires a signed-in fan (so it can be tied to an order later), and this
 * function doesn't re-check that itself. Once a real backend exists it
 * will also reject unauthenticated calls with a 401, so treat the
 * client-side check as UX, not the actual enforcement boundary.
 */
export async function holdSeats(eventId: string, seatIds: string[]): Promise<SeatHold> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return {
      eventId,
      seatIds,
      expiresAt: new Date(Date.now() + SEAT_SELECTION_LIMITS.holdDurationSeconds * 1000).toISOString(),
    };
  }

  return apiFetch<SeatHold>("/inventory/hold", {
    method: "POST",
    body: { eventId, seatIds },
  });
}

export async function releaseHold(eventId: string, seatIds: string[]): Promise<void> {
  if (USE_MOCK) return;
  await apiFetch<void>("/inventory/release", { method: "POST", body: { eventId, seatIds } });
}
