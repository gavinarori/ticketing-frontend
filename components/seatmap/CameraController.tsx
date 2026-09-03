// components/seatmap/CameraController.tsx
"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useCameraStore } from "@/stores/camera";
import { useStadiumCamera } from "@/hooks/useStadiumCamera";
import type { VenueLayout } from "@/types/seatmap";

export function CameraController({ layout }: { layout: VenueLayout }) {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const mode = useCameraStore((s) => s.mode);
  const targetSeatId = useCameraStore((s) => s.targetSeatId);
  const flightIntent = useCameraStore((s) => s.flightIntent);
  const { getSeatCameraTarget, getSeatPreviewTarget } = useStadiumCamera(layout);

  const flightProgress = useRef(0);
  const flightStart = useRef(new THREE.Vector3());
  const flightEnd = useRef(new THREE.Vector3());
  const lookStart = useRef(new THREE.Vector3());
  const lookEnd = useRef(new THREE.Vector3());

  useEffect(() => {
    if (mode !== "flying" || !targetSeatId || !flightIntent) return;
    const target = flightIntent === "preview" ? getSeatPreviewTarget(targetSeatId) : getSeatCameraTarget(targetSeatId);
    if (!target) return;

    flightProgress.current = 0;
    flightStart.current.copy(camera.position);
    flightEnd.current.copy(target.cameraPosition);
    lookStart.current.copy(controlsRef.current?.target ?? new THREE.Vector3());
    lookEnd.current.copy(target.lookAt);
  }, [mode, targetSeatId, flightIntent, camera, getSeatCameraTarget, getSeatPreviewTarget]);

  useFrame((_, delta) => {
    if (mode !== "flying") return;
    flightProgress.current = Math.min(1, flightProgress.current + delta * 1.1);
    const t = easeInOutCubic(flightProgress.current);

    camera.position.lerpVectors(flightStart.current, flightEnd.current, t);
    if (controlsRef.current) {
      controlsRef.current.target.lerpVectors(lookStart.current, lookEnd.current, t);
      controlsRef.current.update();
    }

    if (flightProgress.current >= 1) {
      useCameraStore.getState().setMode(flightIntent === "preview" ? "preview" : "seat-view");
    }
  });

  const previewSeatTarget = mode === "preview" && targetSeatId ? getSeatPreviewTarget(targetSeatId)?.seatTarget : null;
  const orbitTarget: [number, number, number] = previewSeatTarget
    ? [previewSeatTarget.x, previewSeatTarget.y, previewSeatTarget.z]
    : [0, 8, 0];
  const isPreview = mode === "preview";

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={mode === "orbit" || mode === "flying" || mode === "preview"}
      enableDamping
      dampingFactor={0.08}
      minDistance={isPreview ? 2.5 : 22}
      maxDistance={isPreview ? 18 : 240}
      // Keep the camera above the seat — never below/under it.
      minPolarAngle={isPreview ? 0.2 : 0.08}
      maxPolarAngle={isPreview ? Math.PI * 0.42 : Math.PI / 2 - 0.05}
      zoomSpeed={isPreview ? 1.0 : 0.85}
      rotateSpeed={isPreview ? 0.5 : 0.65}
      target={orbitTarget}
    />
  );
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}