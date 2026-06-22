import Link from "next/link";
import { MessageCircle, Repeat2, ShieldCheck } from "lucide-react";
import { VaultRoomShell } from "@/components/VaultRoomShell";
import { brand, trades } from "@/lib/seed-data";

export const metadata = {
  title: "Trade Board | The Vault Room",
  description: "The Vault Room member trade-board beta for Cape Town collectors."
};

export default function TradesPage() {
  return (
    <VaultRoomShell>
      <section className="page-hero">
        <span>Member trade board</span>
        <h1>Trades, bundles & wishlists</h1>
        <p>
          Coordinate trades, grail upgrades, and bundle offers with moderator review. No escrow, payment, or shipping is handled by the app in
          this beta.
        </p>
        <div className="hero-actions">
          <a className="primary-action" href={brand.whatsappUrl}>
            <MessageCircle aria-hidden size={18} />
            Message the community
          </a>
          <Link className="secondary-action" href="/collection">
            <Repeat2 aria-hidden size={18} />
            Build wishlist
          </Link>
        </div>
      </section>

      <section className="trade-board">
        {trades.map((trade) => (
          <article className="tool-panel" key={trade.id}>
            <div className="tool-panel__head">
              <span>
                <Repeat2 aria-hidden size={18} />
                {trade.fromHandle}
              </span>
              <em>{trade.status}</em>
            </div>
            <dl className="mini-dl">
              <div>
                <dt>Seeking</dt>
                <dd>{trade.seeking}</dd>
              </div>
              <div>
                <dt>Offering</dt>
                <dd>{trade.offering}</dd>
              </div>
              <div>
                <dt>Expiry</dt>
                <dd>{trade.expiresIn}</dd>
              </div>
            </dl>
            <p>{trade.notes}</p>
          </article>
        ))}
      </section>

      <section className="public-note-panel">
        <ShieldCheck aria-hidden size={28} />
        <div>
          <h2>Trust layer first</h2>
          <p>
            Trade listings are negotiation prompts only. Live member messaging, reputation, dispute logs, and admin moderation are planned
            before this becomes a full user marketplace.
          </p>
        </div>
      </section>
    </VaultRoomShell>
  );
}
