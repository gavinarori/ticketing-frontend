// components/seatmap/StadiumSeatMap.tsx
"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { StadiumScene } from "./StadiumScene";
import { LoadingStadium } from "./LoadingStadium";
import { Fallback2DMap } from "./Fallback2DMap";
import { SeatMapUI } from "./overlay/SeatMapUI";
import type { VenueLayout } from "@/types/seatmap";

const SKY = "#C5D4E8";
const SKY_FOG = "#B8C8DC";

export function StadiumSeatMap({ layout, eventId }: { layout: VenueLayout; eventId: string }) {
  const [dpr, setDpr] = useState(1.5);
  const [use2DFallback, setUse2DFallback] = useState(false);

  if (use2DFallback) {
    return <Fallback2DMap layout={layout} eventId={eventId} onBackTo3D={() => setUse2DFallback(false)} />;
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl" style={{ background: SKY }}>
      <Canvas
        dpr={dpr}
        shadows
        camera={{ position: [0, 85, 130], fov: 42, near: 0.1, far: 1000 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor(SKY);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.35;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.localClippingEnabled = true; // required for StadiumModel's GLB skirt-cropping planes
        }}
      >
        <PerformanceMonitor
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr(Math.min(2, window.devicePixelRatio))}
        >
          <Suspense fallback={null}>
            <StadiumScene layout={layout} skyColor={SKY} fogColor={SKY_FOG} />
          </Suspense>
        </PerformanceMonitor>
      </Canvas>

      <Suspense fallback={<LoadingStadium />}>
        <SeatMapUI layout={layout} eventId={eventId} onRequestFallback={() => setUse2DFallback(true)} />
      </Suspense>
    </div>
  );
}