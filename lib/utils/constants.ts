// lib/utils/constants.ts

export const SEAT_SELECTION_LIMITS = {
  maxSeatsPerOrder: 8,
  holdDurationSeconds: 8 * 60,
} as const;

export const ROUTES = {
  home: "/",
  search: "/search",
  login: "/login",
  register: "/register",
  event: (eventId: string) => `/events/${eventId}`,
  seatmap: (eventId: string) => `/events/${eventId}/seatmap`,
  checkout: (eventId: string) => `/events/${eventId}/checkout`,
} as const;
