// hooks/useHoldTimer.ts
"use client";

import { useEffect, useState } from "react";
import { useSeatSelectionStore } from "@/stores/seat-selection";
import { SEAT_SELECTION_LIMITS } from "@/lib/utils/constants";

export function useHoldTimer() {
  const holdExpiresAt = useSeatSelectionStore((s) => s.holdExpiresAt);
  const setHoldExpiry = useSeatSelectionStore((s) => s.setHoldExpiry);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!holdExpiresAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [holdExpiresAt]);

  const isActive = !!holdExpiresAt && holdExpiresAt > now;
  const secondsLeft = holdExpiresAt ? Math.max(0, Math.round((holdExpiresAt - now) / 1000)) : 0;
  const percentRemaining = secondsLeft / SEAT_SELECTION_LIMITS.holdDurationSeconds;

  useEffect(() => {
    if (holdExpiresAt && holdExpiresAt <= now) setHoldExpiry(null);
  }, [holdExpiresAt, now, setHoldExpiry]);

  return { isActive, secondsLeft, percentRemaining };
}