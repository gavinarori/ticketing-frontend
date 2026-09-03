// stores/camera.ts
import { create } from "zustand";
import type { CameraMode } from "@/types/seatmap";

type CameraState = {
  mode: CameraMode;
  targetSeatId: string | null;
  flightIntent: "preview" | "immersive" | null;

  setMode: (mode: CameraMode) => void;
  /** Click a seat: fly to a pulled-back angle on it, facing the pitch, zoomable. */
  previewSeat: (seatId: string) => void;
  /** "View from this seat": fly all the way into the seat's exact eye-line. */
  goImmersive: (seatId: string) => void;
  returnToOrbit: () => void;
};

export const useCameraStore = create<CameraState>((set) => ({
  mode: "orbit",
  targetSeatId: null,
  flightIntent: null,

  setMode: (mode) => set({ mode }),
  previewSeat: (seatId) => set({ mode: "flying", targetSeatId: seatId, flightIntent: "preview" }),
  goImmersive: (seatId) => set({ mode: "flying", targetSeatId: seatId, flightIntent: "immersive" }),
  returnToOrbit: () => set({ mode: "orbit", targetSeatId: null, flightIntent: null }),
}));