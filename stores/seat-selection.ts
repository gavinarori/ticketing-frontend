// stores/seat-selection.ts
import { create } from "zustand";
import type { Seat } from "@/types/seatmap";
import { SEAT_SELECTION_LIMITS } from "@/lib/utils/constants";

type SeatSelectionState = {
  selectedSeatIds: Set<string>;
  hoveredSeatId: string | null;
  focusedSeatId: string | null;
  detailSeatId: string | null;
  holdExpiresAt: number | null;

  hoverSeat: (id: string | null) => void;
  focusSeat: (id: string | null) => void;
  openDetail: (id: string | null) => void;
  toggleSeat: (seat: Seat) => void;
  clearSelection: () => void;
  setHoldExpiry: (expiresAt: number | null) => void;
};

export const useSeatSelectionStore = create<SeatSelectionState>((set, get) => ({
  selectedSeatIds: new Set(),
  hoveredSeatId: null,
  focusedSeatId: null,
  detailSeatId: null,
  holdExpiresAt: null,

  hoverSeat: (id) => set({ hoveredSeatId: id }),
  focusSeat: (id) => set({ focusedSeatId: id }),
  openDetail: (id) => set({ detailSeatId: id }),

  toggleSeat: (seat) => {
    if (seat.status === "sold" || seat.status === "held" || seat.status === "unavailable") return;

    const next = new Set(get().selectedSeatIds);
    if (next.has(seat.id)) {
      next.delete(seat.id);
    } else {
      if (next.size >= SEAT_SELECTION_LIMITS.maxSeatsPerOrder) return;
      next.add(seat.id);
    }
    set({ selectedSeatIds: next });
  },

  clearSelection: () =>
    set({ selectedSeatIds: new Set(), holdExpiresAt: null, detailSeatId: null }),

  setHoldExpiry: (expiresAt) => set({ holdExpiresAt: expiresAt }),
}));