// hooks/useSeatSelection.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSeatSelectionStore } from "@/stores/seat-selection";
import { holdSeats } from "@/lib/api/inventory";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/lib/utils/constants";
import type { VenueLayout } from "@/types/seatmap";

export function useSeatSelection(layout: VenueLayout, eventId: string) {
  const selectedSeatIds = useSeatSelectionStore((s) => s.selectedSeatIds);
  const toggleSeat = useSeatSelectionStore((s) => s.toggleSeat);
  const clearSelection = useSeatSelectionStore((s) => s.clearSelection);
  const setHoldExpiry = useSeatSelectionStore((s) => s.setHoldExpiry);
  const { user } = useAuth();
  const router = useRouter();

  const selectedSeats = layout.seats.filter((s) => selectedSeatIds.has(s.id));
  const total = selectedSeats.reduce((sum, seat) => {
    const category = layout.categories.find((c) => c.id === seat.categoryId);
    return sum + (category?.price ?? 0);
  }, 0);

  const holdMutation = useMutation({
    mutationFn: () => holdSeats(eventId, [...selectedSeatIds]),
    onSuccess: (hold) => setHoldExpiry(new Date(hold.expiresAt).getTime()),
  });

  /** Requires a signed-in fan — redirects to login with a return path rather than calling the API unauthenticated. */
  function holdAndContinue() {
    if (!user) {
      router.push(`${ROUTES.login}?redirect=${encodeURIComponent(ROUTES.seatmap(eventId))}` as never);
      return;
    }
    holdMutation.mutate();
  }

  return {
    selectedSeats,
    selectedCount: selectedSeats.length,
    total,
    toggleSeat,
    clearSelection,
    holdAndContinue,
    isHolding: holdMutation.isPending,
    holdError: holdMutation.error,
  };
}