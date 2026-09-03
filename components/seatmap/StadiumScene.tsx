// components/seatmap/StadiumScene.tsx
"use client";

import { ContactShadows } from "@react-three/drei";
import { StadiumModel } from "./StadiumModel";
import { SeatInstances } from "./SeatInstances";
import { SeatHighlighter } from "./SeatHighlighter";
import { CameraController } from "./CameraController";
import { ViewFromSeat } from "./ViewFromSeat";
import { useCameraStore } from "@/stores/camera";
import type { VenueLayout } from "@/types/seatmap";

export function StadiumScene({
  layout,
  skyColor = "#C5D4E8",
  fogColor = "#B8C8DC",
}: {
  layout: VenueLayout;
  skyColor?: string;
  fogColor?: string;
}) {
  const mode = useCameraStore((s) => s.mode);

  return (
    <>
      <color attach="background" args={[skyColor]} />
      <fog attach="fog" args={[fogColor, 200, 520]} />

      <ambientLight intensity={0.75} color="#E8EEF6" />
      <hemisphereLight args={["#D0E0F4", "#4A5A40", 0.55]} />
      <directionalLight position={[40, 60, 30]} intensity={0.9} color="#FFF8F0" />
      <directionalLight position={[-25, 30, -20]} intensity={0.35} color="#C8D8F0" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
        <circleGeometry args={[280, 64]} />
        <meshStandardMaterial color="#8A9A7A" roughness={1} />
      </mesh>

      <StadiumModel layout={layout} modelUrl={layout.venue.modelUrl} />
      <SeatInstances layout={layout} />
      <SeatHighlighter layout={layout} />

      {mode === "seat-view" ? <ViewFromSeat layout={layout} /> : <CameraController layout={layout} />}

      <ContactShadows position={[0, 0.01, 0]} opacity={0.25} scale={200} blur={2.5} far={40} />
    </>
  );
}