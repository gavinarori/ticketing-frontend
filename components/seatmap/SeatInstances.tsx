// components/seatmap/SeatInstances.tsx
"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ThreeEvent, useThree } from "@react-three/fiber";
import { useSeatSelectionStore } from "@/stores/seat-selection";
import { useCameraStore } from "@/stores/camera";
import type { Seat, VenueLayout } from "@/types/seatmap";

const STATUS_COLOR: Record<Seat["status"], string> = {
  available: "",
  selected: "#F2C744",
  held: "#E8703A",
  sold: "#1E252E",
  unavailable: "#12161C",
};

const SEAT_WIDTH = 0.48;
const SEAT_DEPTH = 0.42;
const SEAT_HEIGHT = 0.42;
const BACK_HEIGHT = 0.52;
const BACK_THICKNESS = 0.08;

function buildSeatGeometry(): THREE.BufferGeometry {
  const cushion = new THREE.BoxGeometry(SEAT_WIDTH, SEAT_HEIGHT, SEAT_DEPTH);
  cushion.translate(0, SEAT_HEIGHT / 2, 0);

  const back = new THREE.BoxGeometry(SEAT_WIDTH, BACK_HEIGHT, BACK_THICKNESS);
  back.translate(0, SEAT_HEIGHT + BACK_HEIGHT / 2, -(SEAT_DEPTH / 2 - BACK_THICKNESS / 2));

  const merged = new THREE.BufferGeometry();
  const cPos = cushion.attributes.position!.array as Float32Array;
  const bPos = back.attributes.position!.array as Float32Array;
  const positions = new Float32Array(cPos.length + bPos.length);
  positions.set(cPos, 0);
  positions.set(bPos, cPos.length);

  const cNorm = cushion.attributes.normal!.array as Float32Array;
  const bNorm = back.attributes.normal!.array as Float32Array;
  const normals = new Float32Array(cNorm.length + bNorm.length);
  normals.set(cNorm, 0);
  normals.set(bNorm, cNorm.length);

  const cIdx = cushion.index!.array as Uint16Array | Uint32Array;
  const bIdx = back.index!.array as Uint16Array | Uint32Array;
  const indexOffset = cPos.length / 3;
  const indices = new Uint32Array(cIdx.length + bIdx.length);
  indices.set(cIdx, 0);
  for (let i = 0; i < bIdx.length; i++) indices[cIdx.length + i] = bIdx[i]! + indexOffset;

  merged.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  merged.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  merged.setIndex(new THREE.BufferAttribute(indices, 1));
  merged.computeBoundingSphere();

  cushion.dispose();
  back.dispose();
  return merged;
}

export function SeatInstances({ layout }: { layout: VenueLayout }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const { gl } = useThree();
  const toggleSeat = useSeatSelectionStore((s) => s.toggleSeat);
  const hoverSeat = useSeatSelectionStore((s) => s.hoverSeat);
  const openDetail = useSeatSelectionStore((s) => s.openDetail);
  const selectedSeatIds = useSeatSelectionStore((s) => s.selectedSeatIds);
  const previewSeat = useCameraStore((s) => s.previewSeat);
  const returnToOrbit = useCameraStore((s) => s.returnToOrbit);

  const categoryColor = useMemo(() => {
    const map = new Map<string, string>();
    layout.categories.forEach((c) => map.set(c.id, c.color));
    return map;
  }, [layout.categories]);

  const geometry = useMemo(() => buildSeatGeometry(), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        roughness: 0.62,
        metalness: 0.08,
        emissive: new THREE.Color("#0A1218"),
        emissiveIntensity: 0.15,
      }),
    []
  );

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();

    layout.seats.forEach((seat, i) => {
      dummy.position.set(...seat.position);
      dummy.rotation.set(0, seat.rotationY, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      const base = seat.status === "available" ? categoryColor.get(seat.categoryId) ?? "#5BB8E8" : STATUS_COLOR[seat.status];
      mesh.setColorAt(i, new THREE.Color(base));
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [layout.seats, categoryColor]);

  function handleClick(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    if (e.instanceId === undefined) return;
    const seat = layout.seats[e.instanceId]!;
    if (seat.status === "sold" || seat.status === "held" || seat.status === "unavailable") {
      openDetail(seat.id);
      return;
    }

    const wasSelected = selectedSeatIds.has(seat.id);
    toggleSeat(seat);

    if (!wasSelected) {
      openDetail(seat.id);
      previewSeat(seat.id);
    } else {
      openDetail(null);
      returnToOrbit();
    }
  }

  function handlePointerMove(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    if (e.instanceId === undefined) return;
    const seat = layout.seats[e.instanceId]!;
    gl.domElement.style.cursor = seat.status === "sold" || seat.status === "held" ? "not-allowed" : "pointer";
    hoverSeat(seat.id);
  }

  function handlePointerOut() {
    gl.domElement.style.cursor = "auto";
    hoverSeat(null);
  }

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, layout.seats.length]}
      castShadow
      receiveShadow
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
    />
  );
}