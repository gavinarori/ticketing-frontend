// lib/three/seat-geometry.ts
//
// Procedurally generates an Etihad-style bowl so the 3D seat map has
// something real to render before per-venue data exists in a backend.
// lib/api/venues.ts is the only thing that should call this — components
// take a VenueLayout as a prop, they never generate one themselves.

import type { Seat, SeatCategory, VenueLayout } from "@/types/seatmap";
import type { Stand, Venue } from "@/types/venue";

const CATEGORIES: SeatCategory[] = [
  { id: "premium", label: "Tunnel Club (Premium)", color: "#C9A24B", price: 24000, currency: "GBP" },
  { id: "lower", label: "Lower Tier", color: "#6CABDD", price: 9500, currency: "GBP" },
  { id: "upper", label: "Upper Tier", color: "#2E75B6", price: 6000, currency: "GBP" },
  { id: "family", label: "Family Stand", color: "#7FBF7F", price: 5500, currency: "GBP" },
];

const STANDS: Stand[] = [
  { id: "north", name: "Pep Guardiola Stand", tiers: 2, capacity: 17200 },
  { id: "south", name: "South Stand", tiers: 3, capacity: 18100 },
  { id: "east", name: "East Stand", tiers: 3, capacity: 18100 },
  { id: "west", name: "Colin Bell Stand", tiers: 3, capacity: 13500 },
];
export { STANDS };

export const STAND_ARCS: Record<string, [number, number]> = {
  north: [-0.85, 0.85],
  east: [0.95, Math.PI - 0.95],
  south: [Math.PI - 0.85, Math.PI + 0.85],
  west: [Math.PI + 0.95, 2 * Math.PI - 0.95],
};

/**
 * Calibrated so seats stay inside a ~100m radius — see the GLB clipping
 * note in StadiumModel.tsx for why that specific number.
 */
export const BOWL_GEOMETRY = {
  innerRadius: 45,
  rowDepth: 0.95,
  rowsPerTier: 18,
  tierGap: 3,
  tierBaseHeight: [1.2, 18 * 0.62 + 3 + 1.2, 2 * (18 * 0.62 + 3 + 1.2)] as [number, number, number],
  heightPerRow: [0.62, 0.78, 0.9] as [number, number, number],
  outerScale: 0.82,
};

function seatColorCategory(standId: string, tierIndex: number): string {
  if (standId === "west" && tierIndex === 0) return "premium";
  if (standId === "north" && tierIndex === 1) return "family";
  return tierIndex === 0 ? "lower" : "upper";
}

export function generateEtihadLayout(venueId: string): VenueLayout {
  const venue: Venue = {
    id: venueId,
    name: "Etihad Stadium",
    city: "Manchester",
    pitch: { width: 68, length: 105 },
    stands: STANDS,
  };

  const seats: Seat[] = [];
  const { innerRadius, rowDepth, rowsPerTier, tierGap, outerScale } = BOWL_GEOMETRY;
  const seatsPerSection = 20;
  const sectionGap = 0.06;

  for (const stand of STANDS) {
    const [arcStart, arcEnd] = STAND_ARCS[stand.id]!;
    const arcSpan = arcEnd - arcStart;
    const sectionCount = Math.max(3, Math.round((arcSpan / (Math.PI * 2)) * 20));
    const sectionArc = arcSpan / sectionCount;

    for (let tier = 0; tier < stand.tiers; tier++) {
      const categoryId = seatColorCategory(stand.id, tier);
      const tierBaseRadius = (innerRadius + tier * (rowsPerTier * rowDepth + tierGap)) * outerScale;
      const heightPerRow = BOWL_GEOMETRY.heightPerRow[tier] ?? BOWL_GEOMETRY.heightPerRow.at(-1)!;
      const tierBaseHeight = BOWL_GEOMETRY.tierBaseHeight[tier] ?? BOWL_GEOMETRY.tierBaseHeight.at(-1)!;

      for (let section = 0; section < sectionCount; section++) {
        const sectionStart = arcStart + section * sectionArc + sectionGap / 2;
        const sectionSpan = sectionArc - sectionGap;
        const sectionLabel = `${stand.name.split(" ")[0]}-${tier === 0 ? "L" : tier === 1 ? "U" : "C"}${section + 1}`;

        for (let row = 0; row < rowsPerTier; row++) {
          const radius = tierBaseRadius + row * rowDepth * outerScale;
          const height = tierBaseHeight + row * heightPerRow;
          const rowLetter = String.fromCharCode(65 + (row % 26));

          for (let seatN = 0; seatN < seatsPerSection; seatN++) {
            const t = seatN / (seatsPerSection - 1);
            const angle = sectionStart + t * sectionSpan;
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            const rotationY = Math.atan2(x, z) + Math.PI;

            const rand = pseudoRandom(`${stand.id}-${tier}-${section}-${row}-${seatN}`);
            const status: Seat["status"] =
              rand < 0.62 ? "available" : rand < 0.74 ? "sold" : rand < 0.78 ? "held" : "available";

            seats.push({
              id: `${sectionLabel}-${rowLetter}${seatN + 1}`,
              categoryId,
              status,
              section: sectionLabel,
              row: rowLetter,
              number: seatN + 1,
              position: [x, height, z],
              rotationY,
              viewQuality: tier === 0 && stand.id !== "north" ? "premium" : "standard",
            });
          }
        }
      }
    }
  }

  return { venue, categories: CATEGORIES, seats };
}

function pseudoRandom(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}