import Link from "next/link";
import { ArrowRight, BadgeCheck, Banknote, Gem, LockKeyhole, Scale, ShieldCheck, Sparkles, Vault } from "lucide-react";
import { VaultRoomShell } from "@/components/VaultRoomShell";

const process = [
  {
    title: "Submit the grail",
    body: "Send slab photos, cert numbers, ownership proof, market context and your requested funding range.",
    icon: Gem
  },
  {
    title: "Protocol valuation",
    body: "We review grade, population, liquidity, recent sales, active supply, Cape Town scarcity and authenticity risk.",
    icon: Scale
  },
  {
    title: "Secure custody",
    body: "Approved cards would be held in documented custody until the funding term is settled or the card is released.",
    icon: ShieldCheck
  },
  {
    title: "Release or renew",
    body: "The owner can settle and reclaim, renew terms if approved, or discuss an outright buy-in or consignment exit.",
    icon: LockKeyhole
  }
];

const eligible = [
  "PSA, CGC or BGS graded slabs with visible certs",
  "Manga rares, SPs, anniversary promos and trophy-style cards",
  "High-end raw cards only after in-person inspection",
  "Sealed cases, premium boxes and scarce event stock by review"
];

export const metadata = {
  title: "Vault Credit | The Vault Room",
  description: "Coming soon: card-backed collector funding and collateral review for The Vault Room Cape Town community."
};

export default function VaultCreditPage() {
  return (
    <VaultRoomShell>
      <section className="vault-credit-hero">
        <div>
          <span>Coming soon</span>
          <h1>Vault Credit</h1>
          <p>
            A future collector funding desk where serious grails can be assessed as collateral. Think graded slabs, scarce promos,
            sealed grails and high-liquidity cards reviewed through The Vault Room pricing protocol.
          </p>
          <div className="hero-actions">
            <Link className="primary-action" href="https://chat.whatsapp.com/LgAy8Q0NgVp9NcU7oJXBDy">
              <Banknote aria-hidden size={18} />
              Join waitlist
            </Link>
            <Link className="secondary-action" href="/consign">
              <ArrowRight aria-hidden size={18} />
              Sell or consign instead
            </Link>
          </div>
        </div>
        <aside className="credit-vault-card" aria-label="Vault Credit status">
          <Vault aria-hidden size={46} />
          <strong>Not live yet</strong>
          <p>
            Terms, custody, legal agreements, insurance, borrower checks and payment rails must be finalized before this service can
            accept real cards.
          </p>
          <em>Human review only · no automatic approvals</em>
        </aside>
      </section>

      <section className="credit-signal-grid">
        <article>
          <Sparkles aria-hidden size={26} />
          <strong>Use case</strong>
          <span>Short-term liquidity without immediately selling a grail you believe still has upside.</span>
        </article>
        <article>
          <BadgeCheck aria-hidden size={26} />
          <strong>Priority stock</strong>
          <span>Graded One Piece, Pokemon and Yu-Gi-Oh slabs with trusted certs, clean photos and clear ownership.</span>
        </article>
        <article>
          <ShieldCheck aria-hidden size={26} />
          <strong>Guardrail</strong>
          <span>This is a future service. Current offers are buy-ins, trades, consignment and show-day manual deals.</span>
        </article>
      </section>

      <section className="credit-process">
        <div className="section-title-row">
          <div>
            <h2>How it will work</h2>
            <p>Designed for serious collectors, not quick automated pawn-style decisions.</p>
          </div>
        </div>
        <div className="process-grid">
          {process.map(({ title, body, icon: Icon }) => (
            <article key={title}>
              <Icon aria-hidden size={30} />
              <h2>{title}</h2>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="credit-eligibility">
        <div>
          <span>Likely eligible</span>
          <h2>Cards with proof, demand and liquidity</h2>
          <p>
            Final eligibility will depend on legal setup, lender appetite, authenticity checks, price evidence, volatility and custody
            requirements.
          </p>
        </div>
        <ul>
          {eligible.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="public-note-panel">
        <ShieldCheck aria-hidden size={28} />
        <div>
          <h2>Important beta note</h2>
          <p>
            Vault Credit is not an active lending product yet. The current live services are community sales, buy-ins at roughly 75-95%
            of market depending on the card, consignment, pre-grading, trade coordination and event stock.
          </p>
        </div>
      </section>
    </VaultRoomShell>
  );
}
