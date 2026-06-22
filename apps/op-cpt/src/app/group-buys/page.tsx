import Link from "next/link";
import { Boxes, MessageCircle, ShieldCheck } from "lucide-react";
import { VaultRoomShell } from "@/components/VaultRoomShell";
import { brand, groupBuys } from "@/lib/seed-data";

export const metadata = {
  title: "Group Buys | The Vault Room",
  description: "The Vault Room group-buy and bulk-grading interest board for Cape Town collectors."
};

export default function GroupBuysPage() {
  return (
    <VaultRoomShell>
      <section className="page-hero">
        <span>Case interest board</span>
        <h1>Group buys & bulk grading</h1>
        <p>
          Gather interest for sealed cases, pack splits, and grading submissions. Quotes, allocations, payments, and shipping are confirmed by
          admins outside the public site.
        </p>
      </section>

      <section className="trade-board">
        {groupBuys.map((buy) => (
          <article className="tool-panel" key={buy.id}>
            <div className="tool-panel__head">
              <span>
                <Boxes aria-hidden size={18} />
                {buy.title}
              </span>
              <em>{buy.status}</em>
            </div>
            <strong className="big-number">{buy.interestCount}</strong>
            <p>{buy.target}</p>
            <p>{buy.notes}</p>
            <a className="secondary-action" href={brand.whatsappUrl}>
              <MessageCircle aria-hidden size={16} />
              Join interest list
            </a>
          </article>
        ))}
      </section>

      <section className="public-note-panel">
        <ShieldCheck aria-hidden size={28} />
        <div>
          <h2>Admin moderated</h2>
          <p>
            Group-buy collection, deposits, refunds, and allocation rules need explicit terms before any payment collection happens through
            the website.
          </p>
        </div>
      </section>
      <div className="hero-actions standalone-actions">
        <Link className="primary-action" href="/shop?tab=Sealed">
          View sealed stock
        </Link>
      </div>
    </VaultRoomShell>
  );
}
