// components/seatmap/overlay/SeatMapUI.tsx
"use client";

import { CategoryLegend } from "./CategoryLegend";
import { HoldTimer } from "./HoldTimer";
import { SelectedSeatsBar } from "./SelectedSeatsBar";
import { SeatDetailPanel } from "./SeatDetailPanel";
import { OnboardingGuide } from "./OnboardingGuide";
import { useCameraStore } from "@/stores/camera";
import type { VenueLayout } from "@/types/seatmap";

type SeatMapUIProps = {
  layout: VenueLayout;
  eventId: string;
  onRequestFallback: () => void;
};

export function SeatMapUI({ layout, eventId, onRequestFallback }: SeatMapUIProps) {
  const mode = useCameraStore((s) => s.mode);
  const returnToOrbit = useCameraStore((s) => s.returnToOrbit);

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="pointer-events-auto">
          <h2 className="font-sans text-lg font-semibold tracking-tight text-[var(--color-ink)]">
            {layout.venue.name}
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink)]/60">
            Select your seats
          </p>
        </div>

        <div className="flex items-center gap-2">
          <HoldTimer />
          <button
            onClick={onRequestFallback}
            className="pointer-events-auto rounded-full border border-white/10 bg-[var(--color-night)]/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white/60 backdrop-blur-md transition-colors hover:text-white"
          >
            2D view
          </button>
          <OnboardingGuide />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end py-4">
        <SeatDetailPanel layout={layout} />
      </div>

      <div className="flex items-end justify-between gap-4">
        <CategoryLegend categories={layout.categories} />

        <div className="flex flex-1 flex-col items-center gap-3">
          {(mode === "seat-view" || mode === "preview") && (
            <button
              onClick={returnToOrbit}
              className="pointer-events-auto rounded-full border border-white/10 bg-[var(--color-night)]/85 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-white backdrop-blur-md transition-colors hover:border-[var(--color-sky)]/50"
            >
              &larr; Back to stadium view
            </button>
          )}
          <SelectedSeatsBar layout={layout} eventId={eventId} />
        </div>

        <div className="w-[168px]" aria-hidden />
      </div>
    </div>
  );
}