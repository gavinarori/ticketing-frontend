// lib/api/events.ts
import { apiFetch } from "./client";
import { ApiError } from "@/types/api";
import type { EventDetail, EventListFilters, EventSummary } from "@/types/event";

const USE_MOCK = !process.env.NEXT_PUBLIC_API_URL;

/**
 * React Query key factory. Import `eventKeys` rather than hand-writing
 * array keys in components — keeps cache invalidation (e.g. after a hold
 * expires) consistent as more query call sites get added in later phases.
 */
export const eventKeys = {
  all: ["events"] as const,
  list: (filters: EventListFilters) => [...eventKeys.all, "list", filters] as const,
  detail: (id: string) => [...eventKeys.all, "detail", id] as const,
};

export async function fetchEvents(filters: EventListFilters = {}): Promise<EventSummary[]> {
  if (USE_MOCK) return mockFetchEvents(filters);

  return apiFetch<EventSummary[]>("/events", {
    searchParams: {
      competition: filters.competition,
      query: filters.query,
      sort: filters.sort,
    },
    cache: "no-store",
  });
}

export async function fetchEventById(id: string): Promise<EventDetail | null> {
  if (USE_MOCK) return mockFetchEventById(id);

  try {
    return await apiFetch<EventDetail>(`/events/${id}`, { cache: "no-store" });
  } catch (err) {
    if (err instanceof ApiError && err.isNotFound) return null;
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Mock data layer. Same return shape/signature as the functions above, so
// swapping USE_MOCK off (by setting NEXT_PUBLIC_API_URL) is the only change
// needed once a real backend exists — nothing in components/events or the
// pages that call fetchEvents/fetchEventById needs to change.
// ---------------------------------------------------------------------------

const MOCK_EVENTS: EventDetail[] = [
  {
    id: "etihad-mancity-liverpool",
    competition: "Premier League",
    homeTeam: "Manchester City",
    awayTeam: "Liverpool",
    kickoffAt: "2026-09-13T15:00:00Z",
    venue: { id: "etihad", name: "Etihad Stadium", city: "Manchester" },
    status: "on_sale",
    priceFrom: 4500,
    currency: "GBP",
    hasSeatMap: true,
    requiresWaitingRoom: true,
    description:
      "City host Liverpool in the first meeting between the two sides this season, with both clubs unbeaten through August.",
    broadcaster: "Sky Sports",
  },
  {
    id: "etihad-mancity-realmadrid",
    competition: "Champions League",
    homeTeam: "Manchester City",
    awayTeam: "Real Madrid",
    kickoffAt: "2026-10-01T19:45:00Z",
    venue: { id: "etihad", name: "Etihad Stadium", city: "Manchester" },
    status: "on_sale",
    priceFrom: 6500,
    currency: "GBP",
    hasSeatMap: true,
    requiresWaitingRoom: false,
    description: "A group-stage rematch of two of the last decade's most frequent European ties.",
    broadcaster: "BT Sport",
  },
  {
    id: "etihad-mancity-arsenal",
    competition: "Premier League",
    homeTeam: "Manchester City",
    awayTeam: "Arsenal",
    kickoffAt: "2026-11-08T17:30:00Z",
    venue: { id: "etihad", name: "Etihad Stadium", city: "Manchester" },
    status: "upcoming",
    priceFrom: 5000,
    currency: "GBP",
    hasSeatMap: true,
    requiresWaitingRoom: false,
    description: "Two of the last three title challengers meet at the Etihad in November.",
  },
  {
    id: "emirates-arsenal-chelsea",
    competition: "Premier League",
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    kickoffAt: "2026-09-20T15:00:00Z",
    venue: { id: "emirates", name: "Emirates Stadium", city: "London" },
    status: "on_sale",
    priceFrom: 4000,
    currency: "GBP",
    hasSeatMap: false,
    requiresWaitingRoom: false,
    description: "A London derby to open the autumn fixture run.",
  },
  {
    id: "anfield-liverpool-manutd",
    competition: "Premier League",
    homeTeam: "Liverpool",
    awayTeam: "Manchester United",
    kickoffAt: "2026-09-27T16:30:00Z",
    venue: { id: "anfield", name: "Anfield", city: "Liverpool" },
    status: "sold_out",
    priceFrom: 5500,
    currency: "GBP",
    hasSeatMap: false,
    requiresWaitingRoom: false,
    description: "The oldest rivalry in English football returns to Anfield.",
  },
  {
    id: "stamford-bridge-chelsea-spurs",
    competition: "Premier League",
    homeTeam: "Chelsea",
    awayTeam: "Tottenham Hotspur",
    kickoffAt: "2026-10-04T15:00:00Z",
    venue: { id: "stamford-bridge", name: "Stamford Bridge", city: "London" },
    status: "postponed",
    priceFrom: 4200,
    currency: "GBP",
    hasSeatMap: false,
    requiresWaitingRoom: false,
    description: "Rescheduled pending confirmation from the Premier League.",
  },
];

async function mockDelay() {
  // Small artificial latency so loading states are actually visible/testable
  // during this phase, instead of resolving instantly every time.
  await new Promise((r) => setTimeout(r, 200));
}

async function mockFetchEvents(filters: EventListFilters): Promise<EventSummary[]> {
  await mockDelay();

  let results = [...MOCK_EVENTS];

  if (filters.competition) {
    results = results.filter((e) => e.competition === filters.competition);
  }
  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter((e) =>
      [e.homeTeam, e.awayTeam, e.venue.name, e.venue.city, e.competition]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }

  results.sort((a, b) => {
    if (filters.sort === "price_asc") return a.priceFrom - b.priceFrom;
    return new Date(a.kickoffAt).getTime() - new Date(b.kickoffAt).getTime();
  });

  return results;
}

async function mockFetchEventById(id: string): Promise<EventDetail | null> {
  await mockDelay();
  return MOCK_EVENTS.find((e) => e.id === id) ?? null;
}