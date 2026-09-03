// components/seatmap/overlay/SelectedSeatsBar.tsx
"use client";

import { useSeatSelectionStore } from "@/stores/seat-selection";
import { useCameraStore } from "@/stores/camera";
import { useSeatSelection } from "@/hooks/useSeatSelection";
import { formatMoney } from "@/lib/utils";
import type { VenueLayout } from "@/types/seatmap";

export function SelectedSeatsBar({ layout, eventId }: { layout: VenueLayout; eventId: string }) {
  const focusSeat = useSeatSelectionStore((s) => s.focusSeat);
  const openDetail = useSeatSelectionStore((s) => s.openDetail);
  const previewSeat = useCameraStore((s) => s.previewSeat);
  const { selectedSeats, total, holdAndContinue, isHolding, holdError } = useSeatSelection(layout, eventId);

  if (selectedSeats.length === 0) return null;

  return (
    <div className="pointer-events-auto flex w-full max-w-2xl flex-col gap-2">
      {holdError && (
        <p role="alert" className="rounded-lg bg-[var(--color-flag)]/15 px-3 py-1.5 text-center text-xs text-[var(--color-flag)]">
          {holdError instanceof Error ? holdError.message : "Couldn't hold these seats. Try again."}
        </p>
      )}

      <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[var(--color-night)]/90 px-4 py-3 backdrop-blur-md">
        <div className="flex flex-1 flex-wrap gap-1.5 overflow-hidden">
          {selectedSeats.map((seat) => (
            <button
              key={seat.id}
              onClick={() => {
                focusSeat(seat.id);
                openDetail(seat.id);
                previewSeat(seat.id);
              }}
              className="rounded-full border border-[var(--color-sky)]/40 bg-[var(--color-sky)]/10 px-2.5 py-1 font-mono text-[11px] text-[var(--color-sky)] transition-colors hover:bg-[var(--color-sky)]/20"
              title="Preview this seat's view"
            >
              {seat.id}
            </button>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="font-mono text-sm text-white">{formatMoney(total, "GBP")}</span>
          <button
            onClick={holdAndContinue}
            disabled={isHolding}
            className="rounded-full bg-[var(--color-sky)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-night)] transition-transform hover:scale-[1.03] active:scale-[0.98] disabled:opacity-60"
          >
            {isHolding ? "Holding\u2026" : "Hold & continue"}
          </button>
        </div>
      </div>
    </div>
  );
}