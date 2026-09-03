// hooks/useStadiumCamera.ts
"use client";

import { useCallback } from "react";
import * as THREE from "three";
import type { VenueLayout } from "@/types/seatmap";

const EYE_HEIGHT = 1.15;
const FORWARD_OFFSET = 0.35;
const PREVIEW_UP = 6.5;
const PREVIEW_BACK = 2.2;

/**
 * Takes the active VenueLayout as a parameter rather than generating its
 * own mock copy — the prototype version of this hook called
 * generateEtihadLayout() internally, which meant it could silently drift
 * out of sync with whatever layout was actually rendered. One layout, one
 * source, passed down from the page.
 */
export function useStadiumCamera(layout: VenueLayout) {
  const getSeat = useCallback((seatId: string) => layout.seats.find((s) => s.id === seatId) ?? null, [layout]);

  const getSeatCameraTarget = useCallback(
    (seatId: string) => {
      const seat = getSeat(seatId);
      if (!seat) return null;
      const [x, y, z] = seat.position;
      const forward = new THREE.Vector3(Math.sin(seat.rotationY), 0, Math.cos(seat.rotationY)).multiplyScalar(
        FORWARD_OFFSET
      );
      const cameraPosition = new THREE.Vector3(x, y + EYE_HEIGHT, z).add(forward);
      const lookAt = new THREE.Vector3(0, 3, 0);
      return { cameraPosition, lookAt };
    },
    [getSeat]
  );

  const getSeatPreviewTarget = useCallback(
    (seatId: string) => {
      const seat = getSeat(seatId);
      if (!seat) return null;
      const [x, y, z] = seat.position;
      const backward = new THREE.Vector3(-Math.sin(seat.rotationY), 0, -Math.cos(seat.rotationY)).multiplyScalar(
        PREVIEW_BACK
      );
      const cameraPosition = new THREE.Vector3(x, y + PREVIEW_UP, z).add(backward);
      const seatPoint = new THREE.Vector3(x, y + EYE_HEIGHT, z);
      const pitchPoint = new THREE.Vector3(0, 1.5, 0);
      const lookAt = seatPoint.clone().lerp(pitchPoint, 0.35);
      return { cameraPosition, lookAt, seatTarget: seatPoint };
    },
    [getSeat]
  );

  return { getSeatCameraTarget, getSeatPreviewTarget, getSeat };
}