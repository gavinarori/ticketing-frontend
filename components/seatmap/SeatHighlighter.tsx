// components/seatmap/SeatHighlighter.tsx
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useSeatSelectionStore } from "@/stores/seat-selection";
import type { VenueLayout } from "@/types/seatmap";

const SELECTED_COLOR = new THREE.Color("#F2C744");
const HOVER_COLOR = new THREE.Color("#FFE08A");

export function SeatHighlighter({ layout }: { layout: VenueLayout }) {
  const selectedSeatIds = useSeatSelectionStore((s) => s.selectedSeatIds);
  const hoveredSeatId = useSeatSelectionStore((s) => s.hoveredSeatId);
  const prevHighlighted = useRef<Set<string>>(new Set());
  const prevHovered = useRef<string | null>(null);
  const meshRefFinder = useRef<THREE.InstancedMesh | null>(null);

  const seatIndexById = useRef<Map<string, number>>(new Map());
  useEffect(() => {
    const map = new Map<string, number>();
    layout.seats.forEach((seat, i) => map.set(seat.id, i));
    seatIndexById.current = map;
  }, [layout.seats]);

  useFrame(({ scene }) => {
    if (!meshRefFinder.current) {
      scene.traverse((obj) => {
        if ((obj as THREE.InstancedMesh).isInstancedMesh && !meshRefFinder.current) {
          meshRefFinder.current = obj as THREE.InstancedMesh;
        }
      });
    }
    const mesh = meshRefFinder.current;
    if (!mesh || !mesh.instanceColor) return;

    const currentHighlighted = new Set(selectedSeatIds);
    const changed = new Set<string>([...currentHighlighted, ...prevHighlighted.current]);
    if (hoveredSeatId) changed.add(hoveredSeatId);
    if (prevHovered.current) changed.add(prevHovered.current);
    if (changed.size === 0) return;

    changed.forEach((seatId) => {
      const idx = seatIndexById.current.get(seatId);
      if (idx === undefined) return;
      const seat = layout.seats[idx]!;
      const category = layout.categories.find((c) => c.id === seat.categoryId);
      const baseColor = new THREE.Color(category?.color ?? "#5BB8E8");

      if (currentHighlighted.has(seatId)) {
        mesh.setColorAt(idx, SELECTED_COLOR);
      } else if (hoveredSeatId === seatId && seat.status === "available") {
        mesh.setColorAt(idx, HOVER_COLOR);
      } else if (seat.status === "sold" || seat.status === "held" || seat.status === "unavailable") {
        // leave as-is, already set by SeatInstances
      } else {
        mesh.setColorAt(idx, baseColor);
      }
    });

    mesh.instanceColor.needsUpdate = true;
    prevHighlighted.current = currentHighlighted;
    prevHovered.current = hoveredSeatId;
  });

  return null;
}