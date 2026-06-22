"use client";

import Image from "next/image";
import Link from "next/link";
import { PackageOpen, RotateCw, ShieldCheck, Sparkles, Truck, Volume2, VolumeX, WalletCards } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
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

const cinematicVideo = "/media/gacha/vault-gacha-cinematic-spin.mp4";
const cinematicPoster = "/media/gacha/vault-gacha-cinematic-poster.jpg";
const cinematicFallbackMs = 15100;

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

export function VaultGachaExperience({ packs, prizes }: VaultGachaExperienceProps) {
  const [selectedPackId, setSelectedPackId] = useState(packs[1]?.id ?? packs[0]?.id);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [pull, setPull] = useState<PullState | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fallbackTimerRef = useRef<number | null>(null);
  const pendingPrizeRef = useRef<GachaPrize | null>(null);

  const selectedPack = (packs.find((pack) => pack.id === selectedPackId) ?? packs[0]) as GachaPack;

  const topHits = useMemo(() => prizes.slice(0, 8), [prizes]);
  const featuredPrizes = useMemo(() => {
    const ids = new Set(selectedPack.featuredPrizeIds);
    const selected = prizes.filter((prize) => ids.has(prize.id));
    return selected.length ? selected : topHits.slice(0, 4);
  }, [prizes, selectedPack.featuredPrizeIds, topHits]);

  const finishRip = useCallback(() => {
    if (!pendingPrizeRef.current) return;
    const prize = pendingPrizeRef.current;
    pendingPrizeRef.current = null;
    if (fallbackTimerRef.current) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    setPull({ prize, pack: selectedPack, mode: "revealed" });
    setIsSpinning(false);
  }, [selectedPack]);

  function demoRip() {
    if (isSpinning || !selectedPack) return;
    pendingPrizeRef.current = weightedPrize(selectedPack, prizes);
    setIsSpinning(true);
    setPull(null);

    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.muted = isMuted;
      void video.play().catch(() => {
        finishRip();
      });
    }

    fallbackTimerRef.current = window.setTimeout(finishRip, cinematicFallbackMs);
  }

  function updatePack(packId: string) {
    if (isSpinning) return;
    setSelectedPackId(packId);
    setPull(null);
  }

  function toggleMute() {
    const next = !isMuted;
    setIsMuted(next);
    if (videoRef.current) {
      videoRef.current.muted = next;
    }
  }

  return (
    <div className="gacha-experience">
      <section className="gacha-hero">
        <div className="gacha-hero__copy">
          <span>Visual demo · Coming soon</span>
          <h1>Vault Gacha</h1>
          <p>
            A cinematic pack-rip simulator for future Vault Room drops. Pick a pack, play the vault sequence, reveal a catalogue-backed
            prize, then preview redeem or 70% FMV auto-sell.
          </p>
          <div className="gacha-hero__actions">
            <button className="primary-action" onClick={demoRip} type="button">
              <PackageOpen aria-hidden size={17} />
              Play cinematic demo
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
          <div className={isSpinning ? "gacha-cinematic-wrap is-playing" : "gacha-cinematic-wrap"}>
            <video
              aria-label="The Vault Room cinematic gacha spin demo"
              className="gacha-cinematic-video"
              muted={isMuted}
              onEnded={finishRip}
              playsInline
              poster={cinematicPoster}
              preload="metadata"
              ref={videoRef}
              src={cinematicVideo}
            />
            {!isSpinning && (
              <button className="gacha-video-start" onClick={demoRip} type="button">
                <Sparkles aria-hidden size={30} />
                <span>Run the cinematic spin</span>
              </button>
            )}
            <button aria-label={isMuted ? "Turn gacha demo sound on" : "Turn gacha demo sound off"} className="gacha-sound-toggle" onClick={toggleMute} type="button">
              {isMuted ? <VolumeX aria-hidden size={18} /> : <Volume2 aria-hidden size={18} />}
              <span>{isMuted ? "Muted" : "Sound"}</span>
            </button>
          </div>
          <div className="gacha-machine-panel__bottom">
            <span>{isSpinning ? "Vault sequence playing" : selectedPack.headline}</span>
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
                  disabled={isSpinning}
                  key={pack.id}
                  onClick={() => updatePack(pack.id)}
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
          <h2>{pull ? "You pulled a Vault item" : isSpinning ? "Vault sequence active" : "Ready for the next rip"}</h2>
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
          <button className="gacha-empty-reveal" disabled={isSpinning} onClick={demoRip} type="button">
            <Sparkles aria-hidden size={28} />
            {isSpinning ? "Cinematic vault sequence running..." : "Play the cinematic sequence to reveal a simulated Vault pull."}
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
