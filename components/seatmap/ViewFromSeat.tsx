// components/seatmap/ViewFromSeat.tsx
"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useCameraStore } from "@/stores/camera";
import { useStadiumCamera } from "@/hooks/useStadiumCamera";
import type { VenueLayout } from "@/types/seatmap";

export function ViewFromSeat({ layout }: { layout: VenueLayout }) {
  const { camera } = useThree();
  const targetSeatId = useCameraStore((s) => s.targetSeatId);
  const { getSeatCameraTarget } = useStadiumCamera(layout);

  useEffect(() => {
    if (!targetSeatId) return;
    const target = getSeatCameraTarget(targetSeatId);
    if (!target) return;
    camera.position.copy(target.cameraPosition);
    camera.lookAt(target.lookAt);
  }, [targetSeatId, camera, getSeatCameraTarget]);

  return null;
}