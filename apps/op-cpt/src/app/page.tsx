import Link from "next/link";
import { ArrowRight, LockKeyhole, Sparkles } from "lucide-react";
import { AppFrame } from "@/components/AppFrame";
import { HarborScene } from "@/components/HarborScene";
import { StatPanel } from "@/components/StatPanel";
import { brand, events, profiles, rankings } from "@/lib/seed-data";
import { summarizeCollection } from "@/lib/search";

export default function HomePage() {
  const summary = summarizeCollection();

  return (
    <AppFrame active="/" gateLabel="Public-safe shell">
      <section className="hero">
        <div className="hero__copy">
          <p className="kicker">Unofficial Cape Town member beta</p>
          <h1>{brand.name}</h1>
          <p className="hero__tagline">{brand.tagline}</p>
          <p className="hero__body">
            A playable community portal for One Piece TCG collectors and players: game nights, verified collections, trades, rankings,
            group buys, pack rips, and market watchlists.
          </p>
          <div className="hero__actions">
            <Link className="primary-cta" href="/app">
              Enter the harbor
              <ArrowRight aria-hidden size={18} />
            </Link>
            <Link className="secondary-cta" href="/collection">
              View seed collection
            </Link>
          </div>
          <p className="privacy-note">
            <LockKeyhole aria-hidden size={16} />
            Public pages avoid official branding claims. Fan assets are reserved for gated member-beta use.
          </p>
        </div>
        <HarborScene compact />
      </section>

      <section className="dashboard-strip">
        <StatPanel detail="Ghost seed data" label="Unique cards" value={String(summary.uniqueCards)} />
        <StatPanel detail="Members online seed" label="Nakama" value="127" />
        <StatPanel detail={events[0].date} label="Next event" value={events[0].title} />
        <StatPanel detail={rankings[0].specialty} label="Top player" value={profiles[1].handle} />
      </section>

      <section className="feature-band">
        {[
          ["Collection scanner", "Manual import now; camera recognition is prepared for v1.1."],
          ["Trade board", "Offers and auctions are coordination only. No checkout, escrow, or payment fields."],
          ["Release watch", "Official OP-16 event and rules anchors feed the news calendar."],
          ["Cape Town focus", "Game nights, local rankings, bulk grading, and group-buy interest boards."]
        ].map(([title, body]) => (
          <article className="feature-card" key={title}>
            <Sparkles aria-hidden size={18} />
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </section>
    </AppFrame>
  );
}
