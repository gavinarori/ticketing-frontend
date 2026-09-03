// types/seatmap.ts
import type { Venue } from "./venue";

export type SeatStatus = "available" | "held" | "sold" | "selected" | "unavailable";

export type SeatCategory = {
  id: string;
  label: string;
  color: string; // hex — the one place seat-map code is allowed a raw hex, since it feeds Three.js materials, not CSS
  price: number; // minor units
  currency: string;
};

export type Seat = {
  id: string;
  categoryId: string;
  status: SeatStatus;
  section: string;
  row: string;
  number: number;
  position: [number, number, number];
  rotationY: number;
  viewQuality?: "restricted" | "standard" | "premium";
};

/** What app/(fan)/events/[eventId]/seatmap renders — venue shell + per-seat state for one event. */
export type VenueLayout = {
  venue: Venue;
  categories: SeatCategory[];
  seats: Seat[];
};

export type CameraMode = "orbit" | "flying" | "preview" | "seat-view";