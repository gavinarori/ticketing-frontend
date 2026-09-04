// types/event.ts

export type EventStatus = "on_sale" | "upcoming" | "sold_out" | "postponed" | "cancelled";

export type Venue = {
  id: string;
  name: string;
  city: string;
};

export type EventSummary = {
  id: string;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  kickoffAt: string; // ISO 8601
  venue: Venue;
  status: EventStatus;
  priceFrom: number; // minor units (pence)
  currency: string;
  /** Whether app/(fan)/events/[eventId]/seatmap has a real 3D layout wired up yet. */
  hasSeatMap: boolean;
  /** High-demand fixtures route through /waiting-room before the seat map. */
  requiresWaitingRoom: boolean;
};

export type EventDetail = EventSummary & {
  description: string;
  broadcaster?: string;
};

export type EventListFilters = {
  competition?: string;
  query?: string;
  sort?: "date_asc" | "price_asc";
};