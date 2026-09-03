// components/seatmap/StadiumModel.tsx
"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { STAND_ARCS, STANDS, BOWL_GEOMETRY } from "@/lib/three/seat-geometry";
import type { VenueLayout } from "@/types/seatmap";

type StadiumModelProps = {
  layout: VenueLayout;
  modelUrl?: string;
};

/**
 * GLB_FIT / CLIP_RADIUS: calibrated against a Google Photorealistic 3D
 * Tiles capture of the Etihad (a baked-texture aerial photogrammetry mesh,
 * not a modeled asset — one material, ~320m bounding box including
 * surrounding site). CLIP_RADIUS crops the distorted "skirt" photogrammetry
 * captures get at their boundary; re-measure and adjust both if you swap
 * in a different GLB.
 */
export const GLB_FIT = {
  scale: 1,
  position: [-0.9, 16, 1.1] as [number, number, number],
  rotation: [0, 0, 0] as [number, number, number],
};
export const CLIP_RADIUS = 130;

export function StadiumModel({ layout, modelUrl }: StadiumModelProps) {
  if (modelUrl) {
    return (
      <group>
        <GLBStadium url={modelUrl} />
        <Pitch width={layout.venue.pitch.width} length={layout.venue.pitch.length} />
        <GoalPosts length={layout.venue.pitch.length} />
      </group>
    );
  }
  return <ProceduralBowl layout={layout} />;
}

function GLBStadium({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  const clipPlanes = useMemo(() => {
    const sides = 16;
    const planes: THREE.Plane[] = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2;
      const inward = new THREE.Vector3(-Math.sin(angle), 0, -Math.cos(angle));
      planes.push(new THREE.Plane(inward, CLIP_RADIUS));
    }
    return planes;
  }, []);

  const cloned = useMemo(() => {
    const s = scene.clone(true);
    s.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((mat) => {
          mat.clippingPlanes = clipPlanes;
          mat.clipShadows = true;
        });
      }
    });
    return s;
  }, [scene, clipPlanes]);

  return (
    <group scale={GLB_FIT.scale} position={GLB_FIT.position} rotation={GLB_FIT.rotation}>
      <primitive object={cloned} />
    </group>
  );
}

const CONCRETE = "#1A2330";
const CONCRETE_LIGHT = "#2A3545";
const TRIM = "#6CABDD";
const ROOF = "#121820";

function ProceduralBowl({ layout }: { layout: VenueLayout }) {
  const outerRadius =
    BOWL_GEOMETRY.innerRadius +
    3 * (BOWL_GEOMETRY.rowsPerTier * BOWL_GEOMETRY.rowDepth + BOWL_GEOMETRY.tierGap) +
    6;
  const roofHeight = 42;

  return (
    <group>
      {STANDS.map((stand) => (
        <StandStructure key={stand.id} standId={stand.id} tiers={stand.tiers} />
      ))}
      <RoofCanopy outerRadius={outerRadius} roofHeight={roofHeight} />
      <Pitch width={layout.venue.pitch.width} length={layout.venue.pitch.length} />
      <GoalPosts length={layout.venue.pitch.length} />
    </group>
  );
}

function StandStructure({ standId, tiers }: { standId: string; tiers: number }) {
  const geometries = useMemo(() => {
    const [arcStart, arcEnd] = STAND_ARCS[standId]!;
    const out: THREE.BufferGeometry[] = [];
    for (let tier = 0; tier < tiers; tier++) out.push(buildTierDeck(arcStart, arcEnd, tier));
    return out;
  }, [standId, tiers]);

  return (
    <group>
      {geometries.map((geo, i) => (
        <mesh key={i} geometry={geo} receiveShadow castShadow>
          <meshStandardMaterial color={i === 0 ? CONCRETE_LIGHT : CONCRETE} roughness={0.88} metalness={0.02} />
        </mesh>
      ))}
      <ConcourseSegment standId={standId} />
    </group>
  );
}

function buildTierDeck(arcStart: number, arcEnd: number, tier: number): THREE.BufferGeometry {
  const { innerRadius, rowDepth, rowsPerTier, tierGap, outerScale } = BOWL_GEOMETRY;
  const heightPerRow = BOWL_GEOMETRY.heightPerRow[tier] ?? BOWL_GEOMETRY.heightPerRow.at(-1)!;
  const tierBaseHeight = BOWL_GEOMETRY.tierBaseHeight[tier] ?? BOWL_GEOMETRY.tierBaseHeight.at(-1)!;
  const tierBaseRadius = (innerRadius + tier * (rowsPerTier * rowDepth + tierGap)) * outerScale;

  const angularSegments = 64;
  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];
  const angleAt = (t: number) => arcStart + t * (arcEnd - arcStart);

  let vertRow = 0;
  const pushRing = (radius: number, height: number) => {
    for (let i = 0; i <= angularSegments; i++) {
      const angle = angleAt(i / angularSegments);
      positions.push(Math.sin(angle) * radius, height, Math.cos(angle) * radius);
      normals.push(0, 1, 0);
    }
    vertRow++;
    return vertRow - 1;
  };

  const ringIndex: number[] = [];
  for (let row = 0; row <= rowsPerTier; row++) {
    const radiusFront = tierBaseRadius + row * rowDepth * outerScale;
    const heightFront = tierBaseHeight + row * heightPerRow;
    ringIndex.push(pushRing(radiusFront, heightFront));
    if (row < rowsPerTier) {
      ringIndex.push(pushRing(radiusFront + rowDepth * outerScale * 0.92, heightFront));
    }
  }

  const stride = angularSegments + 1;
  for (let r = 0; r < ringIndex.length - 1; r++) {
    const a = ringIndex[r]! * stride;
    const b = ringIndex[r + 1]! * stride;
    for (let i = 0; i < angularSegments; i++) {
      indices.push(a + i, b + i, a + i + 1);
      indices.push(a + i + 1, b + i, b + i + 1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function ConcourseSegment({ standId }: { standId: string }) {
  const geo = useMemo(() => {
    const [arcStart, arcEnd] = STAND_ARCS[standId]!;
    return new THREE.RingGeometry(
      BOWL_GEOMETRY.innerRadius * BOWL_GEOMETRY.outerScale - 3,
      BOWL_GEOMETRY.innerRadius * BOWL_GEOMETRY.outerScale,
      48,
      1,
      arcStart,
      arcEnd - arcStart
    );
  }, [standId]);

  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.3, 0]} receiveShadow>
      <meshStandardMaterial color={TRIM} emissive={TRIM} emissiveIntensity={0.08} roughness={0.55} />
    </mesh>
  );
}

function RoofCanopy({ outerRadius, roofHeight }: { outerRadius: number; roofHeight: number }) {
  return (
    <group>
      <mesh position={[0, roofHeight, 0]} castShadow>
        <torusGeometry args={[outerRadius - 6, 2, 8, 64]} />
        <meshStandardMaterial color={ROOF} roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[0, roofHeight - 1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[BOWL_GEOMETRY.innerRadius + 20, outerRadius - 4, 64]} />
        <meshStandardMaterial color="#0C1018" side={THREE.DoubleSide} roughness={0.85} />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2 + Math.PI / 8;
        const r = outerRadius - 6;
        return (
          <mesh key={i} position={[Math.sin(angle) * r, roofHeight / 2, Math.cos(angle) * r]} rotation={[0, angle, 0]} castShadow>
            <boxGeometry args={[1, roofHeight, 1]} />
            <meshStandardMaterial color={ROOF} roughness={0.55} />
          </mesh>
        );
      })}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const r = outerRadius - 10;
        return (
          <spotLight
            key={i}
            position={[Math.sin(angle) * r, roofHeight - 3, Math.cos(angle) * r]}
            target-position={[0, 0, 0]}
            angle={0.5}
            penumbra={0.5}
            intensity={55}
            color="#F8FAFF"
            castShadow={i % 2 === 0}
            shadow-mapSize={[512, 512]}
          />
        );
      })}
    </group>
  );
}

function Pitch({ width, length }: { width: number; length: number }) {
  const texture = usePitchTexture(width, length);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.05, 0]}>
      <planeGeometry args={[width, length, 1, 1]} />
      <meshStandardMaterial map={texture} roughness={0.88} metalness={0} />
    </mesh>
  );
}

function GoalPosts({ length }: { length: number }) {
  const postH = 2.44;
  const postW = 7.32;
  const postDepth = 0.12;
  const halfL = length / 2;
  const y = postH / 2;

  return (
    <group>
      {([-1, 1] as const).map((side) => (
        <group key={side} position={[0, 0, side * halfL]}>
          <mesh position={[-postW / 2, y, 0]} castShadow>
            <boxGeometry args={[postDepth, postH, postDepth]} />
            <meshStandardMaterial color="#F5F5F5" roughness={0.35} metalness={0.35} />
          </mesh>
          <mesh position={[postW / 2, y, 0]} castShadow>
            <boxGeometry args={[postDepth, postH, postDepth]} />
            <meshStandardMaterial color="#F5F5F5" roughness={0.35} metalness={0.35} />
          </mesh>
          <mesh position={[0, postH, 0]} castShadow>
            <boxGeometry args={[postW + postDepth, postDepth, postDepth]} />
            <meshStandardMaterial color="#F5F5F5" roughness={0.35} metalness={0.35} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function usePitchTexture(width: number, length: number) {
  return useMemo(() => {
    const res = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = res;
    canvas.height = Math.round(res * (length / width));
    const ctx = canvas.getContext("2d")!;
    const w = canvas.width;
    const h = canvas.height;

    const stripeCount = 16;
    for (let i = 0; i < stripeCount; i++) {
      ctx.fillStyle = i % 2 === 0 ? "#1B8A3E" : "#167536";
      ctx.fillRect(0, (i * h) / stripeCount, w, h / stripeCount + 1);
    }

    const imgData = ctx.getImageData(0, 0, w, h);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = ((i * 17) % 13) - 6;
      d[i] = Math.max(0, Math.min(255, d[i]! + n));
      d[i + 1] = Math.max(0, Math.min(255, d[i + 1]! + n));
      d[i + 2] = Math.max(0, Math.min(255, d[i + 2]! + n));
    }
    ctx.putImageData(imgData, 0, 0);

    ctx.strokeStyle = "rgba(255,255,255,0.95)";
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.lineWidth = Math.max(2.5, w * 0.0045);
    const margin = w * 0.025;
    ctx.strokeRect(margin, margin, w - margin * 2, h - margin * 2);
    ctx.beginPath();
    ctx.moveTo(margin, h / 2);
    ctx.lineTo(w - margin, h / 2);
    ctx.stroke();

    const centerR = w * 0.115;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, centerR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, Math.max(3, w * 0.007), 0, Math.PI * 2);
    ctx.fill();

    const boxW = w * 0.52;
    const boxH = h * 0.155;
    const sixW = w * 0.28;
    const sixH = h * 0.055;
    for (const top of [true, false]) {
      const y0 = top ? margin : h - margin - boxH;
      const y6 = top ? margin : h - margin - sixH;
      ctx.strokeRect(w / 2 - boxW / 2, y0, boxW, boxH);
      ctx.strokeRect(w / 2 - sixW / 2, y6, sixW, sixH);
      const spotY = top ? margin + h * 0.11 : h - margin - h * 0.11;
      ctx.beginPath();
      ctx.arc(w / 2, spotY, Math.max(2.5, w * 0.0055), 0, Math.PI * 2);
      ctx.fill();
      const arcR = w * 0.115;
      const arcCy = top ? margin + boxH : h - margin - boxH;
      ctx.beginPath();
      if (top) ctx.arc(w / 2, arcCy, arcR, 0.15 * Math.PI, 0.85 * Math.PI, false);
      else ctx.arc(w / 2, arcCy, arcR, 1.15 * Math.PI, 1.85 * Math.PI, false);
      ctx.stroke();
    }

    const cornerR = w * 0.018;
    const corners: [number, number, number, number][] = [
      [margin, margin, 0, Math.PI / 2],
      [w - margin, margin, Math.PI / 2, Math.PI],
      [w - margin, h - margin, Math.PI, (3 * Math.PI) / 2],
      [margin, h - margin, (3 * Math.PI) / 2, 2 * Math.PI],
    ];
    for (const [cx, cy, a0, a1] of corners) {
      ctx.beginPath();
      ctx.arc(cx, cy, cornerR, a0, a1);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }, [width, length]);
}