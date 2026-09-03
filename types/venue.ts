// types/venue.ts

export type Stand = {
  id: string;
  name: string;
  tiers: number;
  capacity?: number;
};

export type Venue = {
  id: string;
  name: string;
  city: string;
  pitch: { width: number; length: number };
  stands: Stand[];
  /** GLB URL for the static shell. Absent = render the procedural bowl fallback. */
  modelUrl?: string;
};