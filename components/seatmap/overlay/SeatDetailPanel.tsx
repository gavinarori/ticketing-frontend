// components/seatmap/overlay/SeatDetailPanel.tsx
"use client";

import { useSeatSelectionStore } from "@/stores/seat-selection";
import { useCameraStore } from "@/stores/camera";
import { formatMoney } from "@/lib/utils";
import { SEAT_SELECTION_LIMITS } from "@/lib/utils/constants";
import type { VenueLayout } from "@/types/seatmap";

export function SeatDetailPanel({ layout }: { layout: VenueLayout }) {
  const detailSeatId = useSeatSelectionStore((s) => s.detailSeatId);
  const selectedSeatIds = useSeatSelectionStore((s) => s.selectedSeatIds);
  const toggleSeat = useSeatSelectionStore((s) => s.toggleSeat);
  const openDetail = useSeatSelectionStore((s) => s.openDetail);

  const returnToOrbit = useCameraStore((s) => s.returnToOrbit);
  const goImmersive = useCameraStore((s) => s.goImmersive);

  if (!detailSeatId) return null;
  const seat = layout.seats.find((s) => s.id === detailSeatId);
  if (!seat) return null;

  const category = layout.categories.find((c) => c.id === seat.categoryId);
  const isSelected = selectedSeatIds.has(seat.id);
  const atLimit = selectedSeatIds.size >= SEAT_SELECTION_LIMITS.maxSeatsPerOrder;
  const statusLabel = seat.status === "sold" ? "Sold" : seat.status === "held" ? "Currently held" : null;

  return (
    <div className="pointer-events-auto w-72 rounded-2xl border border-white/10 bg-[var(--color-night)]/92 p-4 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
            {seat.section} &middot; Row {seat.row}
          </p>
          <h3 className="font-sans text-xl font-semibold text-white">Seat {seat.number}</h3>
        </div>
        <button
          onClick={() => {
            openDetail(null);
            returnToOrbit();
          }}
          aria-label="Close"
          className="rounded-full p-1 text-white/50 transition-colors hover:text-white"
        >
          &times;
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: category?.color ?? "#6CABDD" }} aria-hidden />
        <span className="text-sm text-white">{category?.label ?? "General"}</span>
      </div>

      {statusLabel ? (
        <p className="mt-3 rounded-lg bg-white/10 px-3 py-2 text-xs text-white/60">
          {statusLabel} — try a nearby seat instead.
        </p>
      ) : (
        <>
          <p className="mt-3 font-mono text-2xl text-white">
            {formatMoney(category?.price ?? 0, category?.currency ?? "GBP")}
          </p>

          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={() => goImmersive(seat.id)}
              className="rounded-full border border-[var(--color-sky)]/40 bg-[var(--color-sky)]/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-sky)] transition-colors hover:bg-[var(--color-sky)]/20"
            >
              View from this seat
            </button>

            <button
              onClick={() => {
                openDetail(null);
                returnToOrbit();
              }}
              disabled={!isSelected || atLimit}
              className="rounded-full bg-[var(--color-sky)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-night)] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add another seat
            </button>

            {isSelected && (
              <button
                onClick={() => {
                  toggleSeat(seat);
                  openDetail(null);
                  returnToOrbit();
                }}
                className="text-center text-xs text-white/50 transition-colors hover:text-[var(--color-flag)]"
              >
                Remove this seat
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}