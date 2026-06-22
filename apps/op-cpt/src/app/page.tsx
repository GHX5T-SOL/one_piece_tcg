import Link from "next/link";
import { Award, HandCoins, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { ShopGrid } from "@/components/store/ShopGrid";
import { VaultHero } from "@/components/VaultHero";
import { VaultRoomShell } from "@/components/VaultRoomShell";

export default function HomePage() {
  return (
    <VaultRoomShell>
      <VaultHero />
      <ShopGrid limit={7} />
      <section className="trust-row">
        <article>
          <ShieldCheck aria-hidden size={28} />
          <strong>Invoice checkout</strong>
          <span>Build a cart, send an invoice, then confirm payment manually.</span>
        </article>
        <article>
          <Truck aria-hidden size={28} />
          <strong>Show pickup</strong>
          <span>Cape Town handover, event collection and shipping quotes.</span>
        </article>
        <article>
          <Award aria-hidden size={28} />
          <strong>Authenticity first</strong>
          <span>Toploaders, slabs and grade-lab review options.</span>
        </article>
        <article>
          <HandCoins aria-hidden size={28} />
          <strong>We buy cards</strong>
          <span>Sell or trade to us. We usually buy at 75-95% of market depending on demand, condition and liquidity.</span>
        </article>
      </section>
      <section className="sell-to-us-band">
        <div>
          <span>Sell or trade your cards</span>
          <h2>Need cash, a grail upgrade, or a cleaner collection?</h2>
          <p>
            Bring raw mint candidates, sealed product, promos, alt arts, slabs and grails. We can buy outright, trade, consign, or build a
            bundle toward a stronger piece.
          </p>
        </div>
        <Link className="primary-action" href="/consign">
          <PackageCheck aria-hidden size={18} />
          Start intake
        </Link>
      </section>
      <section className="community-band">
        <div>
          <h2>More than cards. We are a community.</h2>
          <p>Trade days, tournaments, pack rips, auctions, grail hunting and Cape Town collector nights.</p>
        </div>
        <div>
          <a className="whatsapp-link" href="https://chat.whatsapp.com/LgAy8Q0NgVp9NcU7oJXBDy">
            WhatsApp
          </a>
          <a className="instagram-link" href="https://instagram.com/thevaultroom.cpt">
            Instagram
          </a>
          <Link className="secondary-action" href="/events">
            View events
          </Link>
        </div>
      </section>
    </VaultRoomShell>
  );
}
