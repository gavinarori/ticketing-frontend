// lib/api/venues.ts
import { apiFetch } from "./client";
import { generateEtihadLayout } from "@/lib/three/seat-geometry";
import type { VenueLayout } from "@/types/seatmap";

const USE_MOCK = !process.env.NEXT_PUBLIC_API_URL;

export const venueKeys = {
  layout: (venueId: string, eventId: string) => ["venue-layout", venueId, eventId] as const,
};

/**
 * Layout is fetched per-(venue, event) pair, not just per-venue — seat
 * *status* (sold/held/available) is specific to one event's inventory even
 * though the physical bowl geometry is shared. The mock ignores eventId
 * (one static layout for the one venue it knows about); a real backend
 * would use it to return that event's actual inventory snapshot.
 */
export async function fetchVenueLayout(venueId: string, eventId: string): Promise<VenueLayout | null> {
  if (USE_MOCK) {
    if (venueId !== "etihad") return null;
    await new Promise((r) => setTimeout(r, 250));
    return generateEtihadLayout(venueId);
  }

  return apiFetch<VenueLayout>(`/venues/${venueId}/layout`, {
    searchParams: { eventId },
    cache: "no-store",
  });
}