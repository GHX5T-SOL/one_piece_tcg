import Link from "next/link";
import { ClipboardCheck, HandCoins, ShieldCheck, type LucideIcon } from "lucide-react";
import { VaultRoomShell } from "@/components/VaultRoomShell";

const steps: { title: string; body: string; icon: LucideIcon }[] = [
  { title: "Intake", body: "Submit photos, card identity, condition notes and target price.", icon: ClipboardCheck },
  { title: "Price", body: "We compare market data, scarcity and local show demand before listing.", icon: ShieldCheck },
  { title: "Sell", body: "We list through The Vault Room catalogue, shows and community channels.", icon: HandCoins }
];

export default function ConsignPage() {
  return (
    <VaultRoomShell>
      <section className="page-hero">
        <span>Sell, trade or consign with us</span>
        <h1>Put your grails in the vault</h1>
        <p>
          We buy cards, trade toward stronger pieces, and help photograph, price, list, show, negotiate and sell collector cards through our
          Cape Town community channels.
        </p>
        <div className="stat-capsules">
          <b>Buy-in guide: 75-95% of market</b>
          <b>Higher range for liquid grails, slabs, promos and sealed demand</b>
          <b>Final offer depends on condition, proof, supply and speed</b>
        </div>
      </section>
      <section className="process-grid">
        {steps.map(({ title, body, icon: Icon }) => (
          <article key={title}>
            <Icon aria-hidden size={30} />
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </section>
      <section className="public-note-panel">
        <h2>Start a consignment request</h2>
        <p>Send clear front/back photos, expected price, condition notes and whether the card is raw, sealed or graded.</p>
        <Link className="primary-action" href="https://chat.whatsapp.com/LgAy8Q0NgVp9NcU7oJXBDy">
          Message on WhatsApp
        </Link>
      </section>
    </VaultRoomShell>
  );
}
