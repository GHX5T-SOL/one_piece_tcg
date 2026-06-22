"use client";

import Image from "next/image";
import Link from "next/link";
import { Archive, Eye, PackageOpen, RotateCw, ShieldCheck, Sparkles, Truck, Volume2, VolumeX, WalletCards, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProductVisual } from "@/components/store/ProductVisual";
import { formatZar, getProductImage } from "@/lib/products";
import type { GachaPack, GachaPrize } from "@/lib/gacha";

type VaultGachaExperienceProps = {
  packs: GachaPack[];
  prizes: GachaPrize[];
};

type PullState = {
  prize: GachaPrize;
  pack: GachaPack;
  mode: "revealed" | "redeem" | "vault" | "sellback";
};

const tierColor: Record<GachaPrize["gachaTier"], string> = {
  grail: "#d4af37",
  slab: "#7ec6f0",
  sealed: "#0d4ea2",
  single: "#ff6b5b",
  booster: "#39b86a"
};

const idleVideo = "/media/gacha/vault-gacha-machine-idle-loop.mp4";
const idlePoster = "/media/gacha/vault-gacha-machine-idle-poster.jpg";
const ripVideo = "/media/gacha/vault-gacha-pack-rip-reveal.mp4";
const ripPoster = "/media/gacha/vault-gacha-pack-rip-poster.jpg";
const ripFallbackMs = 6800;

function weightedPrize(pack: GachaPack, prizes: GachaPrize[]) {
  const roll = Math.random() * 100;
  let cursor = 0;
  const tier =
    pack.odds.find((entry) => {
      cursor += entry.chance;
      return roll <= cursor;
  })?.tier ?? "single";
  const tierPrizes = prizes.filter((prize) => prize.gachaTier === tier);
  const fallback = prizes.filter((prize) => prize.gachaTier === "booster").length
    ? prizes.filter((prize) => prize.gachaTier === "booster")
    : prizes;
  const pool = tierPrizes.length ? tierPrizes : fallback;
  return pool[Math.floor(Math.random() * pool.length)] ?? prizes[0];
}

function demoPrizeWithMedia(pack: GachaPack, prizes: GachaPrize[]) {
  const featuredIds = new Set(pack.featuredPrizeIds);
  const hasDisplayMedia = (prize: GachaPrize) => {
    const image = getProductImage(prize.id);
    return Boolean(image?.src) && !image?.src.includes("-fallback");
  };
  const isShowcaseHit = (prize: GachaPrize) => (prize.productType === "Graded" || prize.productType === "Sealed") && hasDisplayMedia(prize);
  const featuredHits = prizes.filter((prize) => featuredIds.has(prize.id) && isShowcaseHit(prize));
  const allHits = prizes.filter(isShowcaseHit);
  const pool = featuredHits.length ? featuredHits : allHits;
  return pool[Math.floor(Math.random() * pool.length)] ?? weightedPrize(pack, prizes);
}

function expectedPackValue(pack: GachaPack, prizes: GachaPrize[]) {
  return Math.round(
    pack.odds.reduce((sum, entry) => {
      const tierPrizes = prizes.filter((prize) => prize.gachaTier === entry.tier);
      if (!tierPrizes.length) return sum;
      const average = tierPrizes.reduce((tierSum, prize) => tierSum + prize.priceZar, 0) / tierPrizes.length;
      return sum + average * (entry.chance / 100);
    }, 0)
  );
}

export function VaultGachaExperience({ packs, prizes }: VaultGachaExperienceProps) {
  const [selectedPackId, setSelectedPackId] = useState(packs[1]?.id ?? packs[0]?.id);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isChamberOpen, setIsChamberOpen] = useState(false);
  const [isRevealReady, setIsRevealReady] = useState(false);
  const [pull, setPull] = useState<PullState | null>(null);
  const ripVideoRef = useRef<HTMLVideoElement>(null);
  const fallbackTimerRef = useRef<number | null>(null);
  const pendingPrizeRef = useRef<GachaPrize | null>(null);

  const selectedPack = (packs.find((pack) => pack.id === selectedPackId) ?? packs[0]) as GachaPack;
  const selectedExpectedValue = expectedPackValue(selectedPack, prizes);

  const topHits = useMemo(() => prizes.slice(0, 8), [prizes]);
  const featuredPrizes = useMemo(() => {
    const ids = new Set(selectedPack.featuredPrizeIds);
    const selected = prizes.filter((prize) => ids.has(prize.id));
    return selected.length ? selected : topHits.slice(0, 4);
  }, [prizes, selectedPack.featuredPrizeIds, topHits]);

  const finishRip = useCallback(() => {
    if (!pendingPrizeRef.current) return;
    if (fallbackTimerRef.current) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    if (ripVideoRef.current) {
      ripVideoRef.current.pause();
      ripVideoRef.current.currentTime = 0;
    }
    setIsRevealReady(true);
    setIsSpinning(false);
  }, []);

  useEffect(() => {
    if (!isChamberOpen || !isSpinning) return;
    const video = ripVideoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.muted = isMuted;
    void video.play().catch(() => {
      finishRip();
    });
    fallbackTimerRef.current = window.setTimeout(finishRip, ripFallbackMs);

    return () => {
      if (fallbackTimerRef.current) {
        window.clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
    };
  }, [finishRip, isChamberOpen, isMuted, isSpinning]);

  useEffect(() => {
    if (!isChamberOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSpinning) {
        setIsChamberOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isChamberOpen, isSpinning]);

  function demoRip() {
    if (isSpinning || !selectedPack) return;
    pendingPrizeRef.current = demoPrizeWithMedia(selectedPack, prizes);
    setIsChamberOpen(true);
    setIsRevealReady(false);
    setIsSpinning(true);
    setPull(null);
  }

  function revealPrize() {
    if (!pendingPrizeRef.current) return;
    const prize = pendingPrizeRef.current;
    pendingPrizeRef.current = null;
    setPull({ prize, pack: selectedPack, mode: "revealed" });
    setIsRevealReady(false);
  }

  function closeChamber() {
    if (isSpinning) return;
    setIsChamberOpen(false);
  }

  function updatePack(packId: string) {
    if (isSpinning) return;
    setSelectedPackId(packId);
    setPull(null);
  }

  function toggleMute() {
    const next = !isMuted;
    setIsMuted(next);
    if (ripVideoRef.current) {
      ripVideoRef.current.muted = next;
    }
  }

  return (
    <div className="gacha-experience">
      <section className="gacha-hero">
        <div className="gacha-hero__copy">
          <span>Visual demo · Coming soon</span>
          <h1>Vault Gacha</h1>
          <p>
            A cinematic pack-rip simulator for future Vault Room drops. Pick a pack, watch the vending machine, rip the virtual pack,
            reveal a catalogue-backed prize, then preview redeem, vault, or 75% FMV buyback.
          </p>
          <div className="gacha-hero__actions">
            <button className="primary-action" onClick={demoRip} type="button">
              <PackageOpen aria-hidden size={17} />
              Rip virtual pack
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
              aria-label="Looping Vault Room gacha vending machine"
              autoPlay
              className="gacha-cinematic-video gacha-video-layer gacha-video-layer--idle"
              loop
              muted
              playsInline
              poster={idlePoster}
              preload="auto"
              src={idleVideo}
            />
            {!isSpinning && (
              <button className="gacha-video-start" onClick={demoRip} type="button">
                <Sparkles aria-hidden size={30} />
                <span>Rip virtual pack</span>
              </button>
            )}
            <button aria-label={isMuted ? "Turn reveal sound on" : "Turn reveal sound off"} className="gacha-sound-toggle" onClick={toggleMute} type="button">
              {isMuted ? <VolumeX aria-hidden size={18} /> : <Volume2 aria-hidden size={18} />}
              <span>{isMuted ? "Muted" : "Reveal sound"}</span>
            </button>
          </div>
          <div className="gacha-machine-panel__bottom">
            <span>{isSpinning ? "Pack rip video playing" : selectedPack.headline}</span>
            <strong>
              {formatZar(selectedPack.priceZar)} demo price · {formatZar(selectedExpectedValue)} calc EV
            </strong>
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
                    {formatZar(pack.priceZar)} · calc EV {formatZar(expectedPackValue(pack, prizes))}
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

      <section className="pull-panel pull-panel--compact" aria-live="polite">
        <div className="pull-panel__copy">
          <span>Prize reveal simulation</span>
          <h2>{pull ? "Last Vault pull saved" : "Ready for the next rip"}</h2>
          <p>
            The full rip, reveal, and prize actions now happen inside the fullscreen Vault chamber. Live mode still needs finalized odds,
            payment rules, reserve controls, refunds and shipping terms.
          </p>
        </div>
        <button className="gacha-empty-reveal" disabled={isSpinning} onClick={demoRip} type="button">
          <Sparkles aria-hidden size={28} />
          Open Vault chamber
        </button>
      </section>

      {isChamberOpen && (
        <div className="gacha-chamber" role="dialog" aria-modal="true" aria-label="Vault Gacha full screen reveal chamber">
          <div className="gacha-chamber__backdrop" onClick={closeChamber} />
          <div className="gacha-chamber__shell">
            <button className="gacha-chamber__close" disabled={isSpinning} onClick={closeChamber} type="button" aria-label="Close Vault Gacha chamber">
              <X aria-hidden size={20} />
            </button>
            <div className="gacha-chamber__header">
              <span>Vault chamber</span>
              <strong>{isSpinning ? "Rip sequence running" : isRevealReady ? "Winner locked" : pull ? "Prize revealed" : selectedPack.name}</strong>
            </div>
            <div className={isSpinning ? "gacha-chamber__stage is-playing" : pull ? "gacha-chamber__stage is-revealed" : "gacha-chamber__stage"}>
              <video
                aria-label="Looping Vault Room gacha vending machine in full screen chamber"
                autoPlay
                className="gacha-cinematic-video gacha-video-layer gacha-video-layer--idle"
                loop
                muted
                playsInline
                poster={idlePoster}
                preload="auto"
                src={idleVideo}
              />
              <video
                aria-label="Vault Room pack rip ramp up video in full screen chamber"
                className={isSpinning ? "gacha-cinematic-video gacha-video-layer gacha-video-layer--rip is-active" : "gacha-cinematic-video gacha-video-layer gacha-video-layer--rip"}
                muted={isMuted}
                onEnded={finishRip}
                playsInline
                poster={ripPoster}
                preload="auto"
                ref={ripVideoRef}
                src={ripVideo}
              />

              <div className="gacha-chamber__hud">
                <span>{selectedPack.name}</span>
                <strong>{formatZar(selectedPack.priceZar)} demo entry</strong>
                <em>{selectedPack.pullRate}</em>
              </div>

              {isSpinning && (
                <div className="gacha-ramp-overlay">
                  <Sparkles aria-hidden size={34} />
                  <strong>Capsule charging...</strong>
                  <span>Pack foil, slabs and sealed hits are loading into the chamber.</span>
                </div>
              )}

              {isRevealReady && !pull && (
                <div className="gacha-ready-overlay">
                  <div className="gacha-ready-orb">
                    <Sparkles aria-hidden size={46} />
                  </div>
                  <span>Winner locked</span>
                  <h2>Tap to reveal</h2>
                  <button className="primary-action" onClick={revealPrize} type="button">
                    <Eye aria-hidden size={18} />
                    Reveal prize
                  </button>
                </div>
              )}

              {pull && (
                <article className="pull-card pull-card--chamber">
                  <div className="pull-card__visual">
                    <ProductVisual product={pull.prize} />
                    <Sparkles aria-hidden className="pull-card__spark" size={28} />
                  </div>
                  <div>
                    <span style={{ color: tierColor[pull.prize.gachaTier] }}>{pull.prize.gachaTier}</span>
                    <h3>{pull.prize.name}</h3>
                    <p>{pull.prize.setName || pull.prize.category}</p>
                    <strong>{formatZar(pull.prize.priceZar)} FMV</strong>
                    <em>Buyback preview: {formatZar(pull.prize.buybackZar)} at 75% FMV</em>
                    <div className="pull-card__actions">
                      <button className={pull.mode === "redeem" ? "primary-action" : "secondary-action"} onClick={() => setPull({ ...pull, mode: "redeem" })} type="button">
                        <Truck aria-hidden size={16} />
                        Redeem
                      </button>
                      <button className={pull.mode === "vault" ? "primary-action" : "secondary-action"} onClick={() => setPull({ ...pull, mode: "vault" })} type="button">
                        <Archive aria-hidden size={16} />
                        Vault
                      </button>
                      <button className={pull.mode === "sellback" ? "primary-action" : "secondary-action"} onClick={() => setPull({ ...pull, mode: "sellback" })} type="button">
                        <RotateCw aria-hidden size={16} />
                        Accept 75% FMV buyback
                      </button>
                    </div>
                    {pull.mode !== "revealed" && (
                      <p className="gacha-resolution">
                        {pull.mode === "redeem"
                          ? "Demo status: item reserved for redemption workflow preview. Live redemption will require confirmed stock and shipping terms."
                          : pull.mode === "vault"
                            ? "Demo status: item stays in your Vault Room digital vault until you redeem, trade, list, or request a buyback."
                            : `Demo status: buyback credit would show ${formatZar(pull.prize.buybackZar)} before fees, terms and manual approval.`}
                      </p>
                    )}
                  </div>
                </article>
              )}
            </div>
            <div className="gacha-chamber__footer">
              <button className="primary-action" disabled={isSpinning} onClick={demoRip} type="button">
                <PackageOpen aria-hidden size={17} />
                Rip again
              </button>
              <button aria-label={isMuted ? "Turn reveal sound on" : "Turn reveal sound off"} className="secondary-action" onClick={toggleMute} type="button">
                {isMuted ? <VolumeX aria-hidden size={18} /> : <Volume2 aria-hidden size={18} />}
                {isMuted ? "Muted" : "Reveal sound"}
              </button>
            </div>
          </div>
        </div>
      )}

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
          <span>Every live pack needs published odds, prize pool limits, stock controls, timestamped results and admin audit logs.</span>
        </article>
        <article>
          <Truck aria-hidden size={26} />
          <strong>Redeem, vault or sell back</strong>
          <span>Future winners can choose shipping/collection, hold in their Vault, or sell back to Vault Room at 75% of displayed FMV.</span>
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
