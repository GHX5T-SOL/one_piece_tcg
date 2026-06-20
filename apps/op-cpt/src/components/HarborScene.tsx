"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import Link from "next/link";
import { useMemo, useRef } from "react";
import { DoubleSide, type Group, type Mesh } from "three";
import { landmarks } from "@/lib/seed-data";

function Sea() {
  const mesh = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.z = Math.sin(clock.elapsedTime * 0.18) * 0.015;
    }
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
      <circleGeometry args={[7.5, 96]} />
      <meshStandardMaterial color="#07304a" roughness={0.42} metalness={0.12} />
    </mesh>
  );
}

function TableMountain() {
  return (
    <group position={[0, 0.4, 2.8]}>
      <mesh>
        <boxGeometry args={[4.5, 0.55, 0.32]} />
        <meshStandardMaterial color="#1b3243" roughness={0.8} />
      </mesh>
      <mesh position={[-1.9, -0.2, 0]}>
        <coneGeometry args={[0.8, 1.2, 4]} />
        <meshStandardMaterial color="#172b38" roughness={0.8} />
      </mesh>
      <mesh position={[1.9, -0.18, 0]}>
        <coneGeometry args={[0.78, 1.1, 4]} />
        <meshStandardMaterial color="#172b38" roughness={0.8} />
      </mesh>
    </group>
  );
}

function SlabPedestal() {
  const slab = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (slab.current) {
      slab.current.rotation.y = Math.sin(clock.elapsedTime * 0.55) * 0.16;
      slab.current.position.y = 0.74 + Math.sin(clock.elapsedTime * 0.9) * 0.035;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[1.0, 1.18, 0.24, 48]} />
        <meshStandardMaterial color="#172d3b" roughness={0.34} metalness={0.4} />
      </mesh>
      <mesh ref={slab} position={[0, 0.72, 0]}>
        <boxGeometry args={[0.74, 1.28, 0.08]} />
        <meshStandardMaterial color="#d4af37" roughness={0.18} metalness={0.55} emissive="#2d2106" />
      </mesh>
      <mesh position={[0, 0.72, 0.055]}>
        <boxGeometry args={[0.54, 0.86, 0.035]} />
        <meshStandardMaterial color="#061925" roughness={0.28} metalness={0.08} emissive="#0d5c68" emissiveIntensity={0.18} />
      </mesh>
    </group>
  );
}

function Beacon({ x, z, color }: { x: number; z: number; color: string }) {
  const beacon = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (beacon.current) {
      beacon.current.position.y = 0.18 + Math.sin(clock.elapsedTime * 1.6 + x) * 0.06;
    }
  });

  return (
    <group position={[x, 0, z]}>
      <mesh>
        <cylinderGeometry args={[0.42, 0.52, 0.16, 32]} />
        <meshStandardMaterial color="#0a1820" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh ref={beacon} position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Ship() {
  const group = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(clock.elapsedTime * 0.28) * 0.08;
      group.current.position.y = Math.sin(clock.elapsedTime * 0.7) * 0.035;
    }
  });

  return (
    <group ref={group} position={[-3.9, 0.18, 1.35]} rotation={[0, -0.35, 0]}>
      <mesh>
        <boxGeometry args={[1.25, 0.28, 0.45]} />
        <meshStandardMaterial color="#4b2818" roughness={0.52} />
      </mesh>
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 1.2, 8]} />
        <meshStandardMaterial color="#d4af37" />
      </mesh>
      <mesh position={[0.18, 0.68, 0]} rotation={[0, 0, -0.2]}>
        <planeGeometry args={[0.58, 0.48]} />
        <meshStandardMaterial color="#d72638" side={DoubleSide} roughness={0.7} />
      </mesh>
    </group>
  );
}

export function HarborScene({ compact = false }: { compact?: boolean }) {
  const overlay = useMemo(
    () =>
      landmarks.map((landmark) => ({
        ...landmark,
        left: `${50 + landmark.x * 8.3}%`,
        top: `${50 - landmark.z * 12.5}%`
      })),
    []
  );

  return (
    <section className={compact ? "harbor harbor--compact" : "harbor"} aria-label="The Vault Room playable harbor">
      <Canvas camera={{ position: [0, 5.4, 6.6], fov: 46 }} dpr={[1, 1.8]} gl={{ antialias: true }}>
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 6, 4]} intensity={1.4} color="#f6d990" />
        <pointLight position={[0, 1.4, 0.4]} intensity={3.6} color="#0fa3a6" />
        <Sea />
        <TableMountain />
        <Ship />
        <SlabPedestal />
        {landmarks.map((landmark) => (
          <Beacon color={landmark.color} key={landmark.id} x={landmark.x} z={landmark.z} />
        ))}
      </Canvas>

      <div className="harbor__grid" aria-hidden />
      <div className="harbor__overlay">
        {overlay.map((landmark) => (
          <Link className="landmark-chip" href={landmark.route} key={landmark.id} style={{ left: landmark.left, top: landmark.top }}>
            <strong>{landmark.label}</strong>
            <span>{landmark.summary}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
