"use client";

import Image from "next/image";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { PackageOpen, RotateCw, ShieldCheck, Sparkles, Truck, WalletCards } from "lucide-react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ProductVisual } from "@/components/store/ProductVisual";
import { formatZar } from "@/lib/products";
import type { GachaPack, GachaPrize } from "@/lib/gacha";

type VaultGachaExperienceProps = {
  packs: GachaPack[];
  prizes: GachaPrize[];
};

type PullState = {
  prize: GachaPrize;
  pack: GachaPack;
  mode: "revealed" | "redeem" | "sellback";
};

const tierColor: Record<GachaPrize["gachaTier"], string> = {
  grail: "#d4af37",
  slab: "#7ec6f0",
  sealed: "#0d4ea2",
  single: "#ff6b5b",
  booster: "#39b86a"
};

function weightedPrize(pack: GachaPack, prizes: GachaPrize[]) {
  const roll = Math.random() * 100;
  let cursor = 0;
  const tier =
    pack.odds.find((entry) => {
      cursor += entry.chance;
      return roll <= cursor;
    })?.tier ?? "single";
  const tierPrizes = prizes.filter((prize) => prize.gachaTier === tier);
  const fallback = prizes.length ? prizes : [];
  const pool = tierPrizes.length ? tierPrizes : fallback;
  return pool[Math.floor(Math.random() * pool.length)] ?? prizes[0];
}

function Capsule({ index, active }: { index: number; active: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  const radius = 1.18 + (index % 4) * 0.08;
  const angle = (index / 16) * Math.PI * 2;
  const color = ["#d4af37", "#ff6b5b", "#7ec6f0", "#fff7e6"][index % 4];

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime * (active ? 1.9 : 0.72) + index * 0.34;
    meshRef.current.position.x = Math.cos(angle + t * 0.28) * radius;
    meshRef.current.position.z = Math.sin(angle + t * 0.28) * radius * 0.42;
    meshRef.current.position.y = 1.36 + Math.sin(t) * 0.22 + (index % 3) * 0.09;
    meshRef.current.rotation.y = t;
    meshRef.current.rotation.z = Math.sin(t * 0.8) * 0.25;
  });

  return (
    <group ref={meshRef}>
      <mesh castShadow>
        <sphereGeometry args={[0.16, 48, 32]} />
        <meshStandardMaterial color={color} emissive={active ? color : "#000000"} emissiveIntensity={active ? 0.15 : 0.02} metalness={0.26} roughness={0.28} />
      </mesh>
      <mesh position={[0.08, 0, 0]} castShadow>
        <sphereGeometry args={[0.16, 48, 32, 0, Math.PI]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.18} transmission={0.4} transparent opacity={0.76} />
      </mesh>
    </group>
  );
}

function PrizeSlab({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * 0.8) * 0.16;
    groupRef.current.position.y = active ? 1.25 + Math.sin(t * 3) * 0.08 : 0.95 + Math.sin(t) * 0.04;
    groupRef.current.scale.setScalar(active ? 1.08 + Math.sin(t * 8) * 0.025 : 1);
  });

  return (
    <group ref={groupRef} position={[0, 0.95, -0.36]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.86, 1.24, 0.07, 8, 8, 1]} />
        <meshPhysicalMaterial color="#dfe8f2" clearcoat={0.8} roughness={0.18} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0.2, 0.045]}>
        <boxGeometry args={[0.58, 0.72, 0.024]} />
        <meshStandardMaterial color={active ? "#ff6b5b" : "#0d4ea2"} emissive={active ? "#ff6b5b" : "#0d4ea2"} emissiveIntensity={active ? 0.38 : 0.12} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.52, 0.064]}>
        <boxGeometry args={[0.7, 0.18, 0.02]} />
        <meshStandardMaterial color="#fff7e6" roughness={0.24} />
      </mesh>
    </group>
  );
}

function ProceduralGachaMachine({ active }: { active: boolean }) {
  const machineRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const leverRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (machineRef.current) {
      machineRef.current.rotation.y = Math.sin(t * 0.22) * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * (active ? 1.9 : 0.36);
    }
    if (leverRef.current) {
      leverRef.current.rotation.z = active ? -0.88 + Math.sin(t * 13) * 0.1 : -0.3 + Math.sin(t * 0.8) * 0.03;
    }
  });

  return (
    <group ref={machineRef} position={[0, -0.82, 0]} scale={0.86}>
      <mesh receiveShadow position={[0, -0.34, 0]}>
        <cylinderGeometry args={[1.82, 2.05, 0.54, 96]} />
        <meshStandardMaterial color="#07182c" metalness={0.72} roughness={0.24} />
      </mesh>
      <mesh receiveShadow position={[0, -0.6, 0.16]}>
        <cylinderGeometry args={[2.18, 2.35, 0.22, 128]} />
        <meshStandardMaterial color="#061525" metalness={0.78} roughness={0.2} />
      </mesh>
      <mesh castShadow position={[0, 0.24, 0]}>
        <cylinderGeometry args={[1.42, 1.64, 1.28, 96]} />
        <meshStandardMaterial color="#0d4ea2" metalness={0.55} roughness={0.2} />
      </mesh>
      <mesh castShadow position={[0, 0.95, 0]}>
        <cylinderGeometry args={[1.5, 1.42, 0.16, 128]} />
        <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.08} metalness={0.9} roughness={0.12} />
      </mesh>
      <mesh castShadow position={[0, 1.26, 0]}>
        <sphereGeometry args={[1.5, 96, 64, 0, Math.PI * 2, 0, Math.PI * 0.64]} />
        <meshPhysicalMaterial color="#bfe9ff" clearcoat={1} roughness={0.03} transmission={0.48} transparent opacity={0.42} />
      </mesh>
      <mesh position={[0, 1.72, 0]}>
        <torusGeometry args={[0.54, 0.025, 18, 128]} />
        <meshStandardMaterial color="#fff7e6" emissive="#fff7e6" emissiveIntensity={active ? 0.32 : 0.08} metalness={0.28} roughness={0.18} />
      </mesh>
      {Array.from({ length: 14 }).map((_, index) => {
        const angle = (index / 14) * Math.PI * 2;
        return (
          <mesh key={`jewel-${index}`} position={[Math.cos(angle) * 1.54, 1.08 + (index % 2) * 0.05, Math.sin(angle) * 1.54]}>
            <sphereGeometry args={[0.045, 24, 16]} />
            <meshStandardMaterial color={index % 2 ? "#d4af37" : "#7ec6f0"} emissive={index % 2 ? "#d4af37" : "#7ec6f0"} emissiveIntensity={active ? 0.9 : 0.28} />
          </mesh>
        );
      })}
      <mesh ref={ringRef} position={[0, 1.13, 0.03]}>
        <torusGeometry args={[1.48, 0.055, 24, 160]} />
        <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={active ? 0.3 : 0.08} metalness={0.86} roughness={0.16} />
      </mesh>
      <mesh castShadow position={[0, 0.24, 1.42]}>
        <cylinderGeometry args={[0.64, 0.64, 0.24, 96]} />
        <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.12} />
      </mesh>
      <mesh position={[0, 0.24, 1.56]}>
        <torusGeometry args={[0.36, 0.04, 24, 96]} />
        <meshStandardMaterial color="#fff7e6" emissive="#fff7e6" emissiveIntensity={0.16} />
      </mesh>
      <mesh position={[0, 0.26, 1.68]}>
        <circleGeometry args={[0.31, 96]} />
        <meshStandardMaterial color="#07182c" metalness={0.5} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.34, 1.7]}>
        <circleGeometry args={[0.085, 48]} />
        <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.22} metalness={0.72} roughness={0.12} />
      </mesh>
      <mesh position={[0, 0.18, 1.7]}>
        <boxGeometry args={[0.12, 0.22, 0.025]} />
        <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.18} metalness={0.72} roughness={0.12} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 1.46, 0.12, 0.62]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.13, 0.15, 1.1, 48]} />
            <meshStandardMaterial color="#d4af37" metalness={0.88} roughness={0.14} />
          </mesh>
          <mesh castShadow position={[0, 0.58, 0]}>
            <sphereGeometry args={[0.15, 48, 24]} />
            <meshStandardMaterial color="#fff7e6" emissive="#d4af37" emissiveIntensity={0.12} metalness={0.3} roughness={0.18} />
          </mesh>
        </group>
      ))}
      <mesh castShadow position={[-0.54, -0.08, 1.52]}>
        <boxGeometry args={[0.58, 0.13, 0.06]} />
        <meshStandardMaterial color="#fff7e6" metalness={0.2} roughness={0.22} />
      </mesh>
      <mesh castShadow position={[0.58, -0.08, 1.52]}>
        <boxGeometry args={[0.5, 0.13, 0.06]} />
        <meshStandardMaterial color="#07182c" emissive="#7ec6f0" emissiveIntensity={active ? 0.28 : 0.08} metalness={0.46} roughness={0.18} />
      </mesh>
      <group ref={leverRef} position={[1.7, 0.42, 0.62]}>
        <mesh castShadow position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.78, 32]} />
          <meshStandardMaterial color="#d4af37" metalness={0.82} roughness={0.18} />
        </mesh>
        <mesh castShadow position={[0, -0.74, 0]}>
          <sphereGeometry args={[0.15, 48, 32]} />
          <meshStandardMaterial color="#ff6b5b" emissive="#ff6b5b" emissiveIntensity={active ? 0.45 : 0.08} metalness={0.26} roughness={0.2} />
        </mesh>
      </group>
      {Array.from({ length: 16 }).map((_, index) => (
        <Capsule active={active} index={index} key={index} />
      ))}
      <PrizeSlab active={active} />
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.68, 0]}>
        <circleGeometry args={[2.45, 128]} />
        <meshStandardMaterial color="#fff7e6" roughness={0.46} />
      </mesh>
    </group>
  );
}

function GlbVaultGachaMachine({ active }: { active: boolean }) {
  const gltf = useLoader(GLTFLoader, "/models/vault-gacha-machine.glb");
  const modelRef = useRef<THREE.Group>(null);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  useEffect(() => {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        if (object.material instanceof THREE.MeshStandardMaterial || object.material instanceof THREE.MeshPhysicalMaterial) {
          object.material.envMapIntensity = 1.35;
          if (object.material.name.includes("glass")) {
            object.material.transparent = true;
            object.material.opacity = 0.28;
            object.material.depthWrite = false;
            object.material.side = THREE.DoubleSide;
          }
          if (object.material.name.includes("prize_light") || object.material.name.includes("glow")) {
            object.material.emissiveIntensity = active ? 1.1 : 0.55;
          }
          object.material.needsUpdate = true;
        }
      }
    });
  }, [active, scene]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const root = modelRef.current;
    if (!root) return;

    root.rotation.y = Math.sin(t * 0.2) * 0.1;

    const spinRing = root.getObjectByName("spin_ring");
    if (spinRing) spinRing.rotation.z = t * (active ? 2.8 : 0.42);

    const capsules = root.getObjectByName("capsule_cluster");
    if (capsules) {
      capsules.rotation.z = t * (active ? 1.8 : 0.24);
      capsules.position.y = Math.sin(t * (active ? 4 : 1.2)) * 0.04;
    }

    const lever = root.getObjectByName("lever_root");
    if (lever) lever.rotation.x = active ? -0.78 + Math.sin(t * 14) * 0.08 : -0.18 + Math.sin(t) * 0.025;

    const reveal = root.getObjectByName("reveal_slab_root");
    if (reveal) {
      reveal.position.y = -1.1 + Math.sin(t * (active ? 5 : 1.4)) * 0.05;
      reveal.rotation.z = Math.sin(t * 0.8) * 0.08;
      reveal.scale.setScalar(active ? 1.04 + Math.sin(t * 10) * 0.025 : 1);
    }

    const orbit = root.getObjectByName("orbit_card_ring");
    if (orbit) orbit.rotation.z = t * 0.2;
  });

  return (
    <group ref={modelRef} position={[0, -1.72, 0]} rotation={[0, Math.PI, 0]} scale={0.9}>
      <primitive object={scene} />
    </group>
  );
}

function PremiumCapsuleCloud({ active }: { active: boolean }) {
  return (
    <group position={[0, -0.78, 0.46]} scale={0.72}>
      {Array.from({ length: 22 }).map((_, index) => (
        <Capsule active={active} index={index} key={`overlay-capsule-${index}`} />
      ))}
    </group>
  );
}

function GachaCanvas({ active }: { active: boolean }) {
  return (
    <Canvas camera={{ fov: 38, position: [0, 1.25, 6.2] }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }} shadows>
      <ambientLight intensity={0.85} />
      <directionalLight castShadow intensity={2.4} position={[3, 5, 4]} shadow-mapSize={[2048, 2048]} />
      <pointLight color="#d4af37" intensity={active ? 56 : 28} position={[0, 1.55, 1.6]} />
      <pointLight color="#7ec6f0" intensity={22} position={[-3, 2.4, 2.2]} />
      <pointLight color="#ff6b5b" intensity={active ? 20 : 8} position={[3, 0.6, 2.4]} />
      <Suspense fallback={<ProceduralGachaMachine active={active} />}>
        <GlbVaultGachaMachine active={active} />
      </Suspense>
      <PremiumCapsuleCloud active={active} />
    </Canvas>
  );
}

export function VaultGachaExperience({ packs, prizes }: VaultGachaExperienceProps) {
  const [selectedPackId, setSelectedPackId] = useState(packs[1]?.id ?? packs[0]?.id);
  const [isSpinning, setIsSpinning] = useState(false);
  const [pull, setPull] = useState<PullState | null>(null);
  const selectedPack = packs.find((pack) => pack.id === selectedPackId) ?? packs[0];

  const topHits = useMemo(() => prizes.slice(0, 8), [prizes]);
  const featuredPrizes = useMemo(() => {
    const ids = new Set(selectedPack.featuredPrizeIds);
    const selected = prizes.filter((prize) => ids.has(prize.id));
    return selected.length ? selected : topHits.slice(0, 4);
  }, [prizes, selectedPack.featuredPrizeIds, topHits]);

  function demoRip() {
    if (isSpinning) return;
    setIsSpinning(true);
    setPull(null);
    window.setTimeout(() => {
      const prize = weightedPrize(selectedPack, prizes);
      setPull({ prize, pack: selectedPack, mode: "revealed" });
      setIsSpinning(false);
    }, 1450);
  }

  return (
    <div className="gacha-experience">
      <section className="gacha-hero">
        <div className="gacha-hero__copy">
          <span>Visual demo · Coming soon</span>
          <h1>Vault Gacha</h1>
          <p>
            A cinematic pack-rip simulator for future Vault Room drops. Pick a pack, spin the vault machine, reveal a catalogue-backed
            prize, then preview redeem or 70% FMV auto-sell.
          </p>
          <div className="gacha-hero__actions">
            <button className="primary-action" onClick={demoRip} type="button">
              <PackageOpen aria-hidden size={17} />
              Demo rip pack
            </button>
            <Link className="secondary-action" href="/shop">
              View real inventory
            </Link>
          </div>
        </div>
        <div className="gacha-hero__art">
          <Image
            alt="Vault Gacha anime collectors ripping packs around a vault machine"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 62vw"
            src="/branding/vault-gacha-hero.jpg"
          />
        </div>
      </section>

      <section className="gacha-stage">
        <div className="gacha-machine-panel">
          <div className="gacha-machine-panel__top">
            <span>{selectedPack.name}</span>
            <strong>{selectedPack.pullRate}</strong>
          </div>
          <div className={isSpinning ? "gacha-canvas-wrap is-spinning" : "gacha-canvas-wrap"}>
            <GachaCanvas active={isSpinning} />
          </div>
          <div className="gacha-machine-panel__bottom">
            <span>{selectedPack.headline}</span>
            <strong>{formatZar(selectedPack.priceZar)} demo price</strong>
          </div>
        </div>

        <aside className="gacha-console" aria-label="Vault Gacha controls">
          <div className="gacha-console__section">
            <span className="console-kicker">Choose a pack</span>
            <div className="gacha-pack-list">
              {packs.map((pack) => (
                <button
                  className={pack.id === selectedPack.id ? "gacha-pack is-active" : "gacha-pack"}
                  key={pack.id}
                  onClick={() => setSelectedPackId(pack.id)}
                  type="button"
                >
                  <strong>{pack.name}</strong>
                  <span>{pack.tagline}</span>
                  <em>
                    {formatZar(pack.priceZar)} · EV {formatZar(pack.estimatedValueZar)}
                  </em>
                </button>
              ))}
            </div>
          </div>

          <div className="gacha-console__section">
            <span className="console-kicker">Demo checkout options</span>
            <div className="payment-cloud">
              {["Crypto", "Visa", "Mastercard", "EFT", "PayPal", "Apple Pay", "Google Pay", "Stripe", "PayFast"].map((method) => (
                <span key={method}>{method}</span>
              ))}
            </div>
            <button className="checkout-button" disabled type="button">
              <WalletCards aria-hidden size={17} />
              Payments coming soon
            </button>
          </div>

          <div className="gacha-console__section">
            <span className="console-kicker">Odds preview</span>
            <div className="odds-list">
              {selectedPack.odds.map((entry) => (
                <div className="odds-row" key={entry.tier}>
                  <div>
                    <strong>{entry.label}</strong>
                    <span>{entry.description}</span>
                  </div>
                  <em>{entry.chance}%</em>
                  <b style={{ width: `${entry.chance}%` }} />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="pull-panel" aria-live="polite">
        <div className="pull-panel__copy">
          <span>Prize reveal simulation</span>
          <h2>{pull ? "You pulled a Vault item" : "Ready for the next rip"}</h2>
          <p>
            Live mode will require finalized odds, payment rules, age/compliance checks, refunds, shipping terms and reserve controls. This
            page currently demonstrates the experience only.
          </p>
        </div>
        {pull ? (
          <article className="pull-card">
            <div className="pull-card__visual">
              <ProductVisual compact product={pull.prize} />
              <Sparkles aria-hidden className="pull-card__spark" size={28} />
            </div>
            <div>
              <span style={{ color: tierColor[pull.prize.gachaTier] }}>{pull.prize.gachaTier}</span>
              <h3>{pull.prize.name}</h3>
              <p>{pull.prize.setName || pull.prize.category}</p>
              <strong>{formatZar(pull.prize.priceZar)} FMV</strong>
              <em>Auto-sell preview: {formatZar(pull.prize.buybackZar)} at 70% FMV</em>
              <div className="pull-card__actions">
                <button className={pull.mode === "redeem" ? "primary-action" : "secondary-action"} onClick={() => setPull({ ...pull, mode: "redeem" })} type="button">
                  <Truck aria-hidden size={16} />
                  Redeem / ship
                </button>
                <button className={pull.mode === "sellback" ? "primary-action" : "secondary-action"} onClick={() => setPull({ ...pull, mode: "sellback" })} type="button">
                  <RotateCw aria-hidden size={16} />
                  Auto-sell 70%
                </button>
              </div>
              {pull.mode !== "revealed" && (
                <p className="gacha-resolution">
                  {pull.mode === "redeem"
                    ? "Demo status: item reserved for redemption workflow preview."
                    : `Demo status: sell-back credit would show ${formatZar(pull.prize.buybackZar)} before fees/terms.`}
                </p>
              )}
            </div>
          </article>
        ) : (
          <button className="gacha-empty-reveal" onClick={demoRip} type="button">
            <Sparkles aria-hidden size={28} />
            Spin the machine to reveal a simulated Vault pull.
          </button>
        )}
      </section>

      <section className="gacha-prize-board">
        <div className="section-title-row">
          <div>
            <h2>Pack highlights</h2>
            <p>These are real catalogue-backed prize candidates from current Vault Room inventory.</p>
          </div>
          <Link className="view-all-link" href="/shop">
            See full shop
          </Link>
        </div>
        <div className="gacha-prize-grid">
          {featuredPrizes.map((prize) => (
            <Link className="gacha-prize-tile" href={`/product/${prize.slug}`} key={prize.id}>
              <ProductVisual compact product={prize} />
              <span>{prize.gachaTier}</span>
              <strong>{prize.name}</strong>
              <em>{formatZar(prize.priceZar)}</em>
            </Link>
          ))}
        </div>
      </section>

      <section className="gacha-rules">
        <article>
          <ShieldCheck aria-hidden size={26} />
          <strong>Transparent odds first</strong>
          <span>Every live pack needs published odds, prize pool limits, stock controls and timestamped results.</span>
        </article>
        <article>
          <Truck aria-hidden size={26} />
          <strong>Redeem or sell back</strong>
          <span>Future winners can choose shipping/collection or sell back to Vault Room at 70% of displayed FMV.</span>
        </article>
        <article>
          <WalletCards aria-hidden size={26} />
          <strong>Payment rails later</strong>
          <span>Crypto, cards, EFT, PayPal, Apple Pay, Google Pay, Stripe and PayFast are shown as planned rails only.</span>
        </article>
      </section>
    </div>
  );
}
