import Link from "next/link";
import { Award, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { ShopGrid } from "@/components/store/ShopGrid";
import { VaultHero } from "@/components/VaultHero";
import { VaultRoomShell } from "@/components/VaultRoomShell";

export default function HomePage() {
  return (
    <VaultRoomShell>
      <VaultHero />
      <ShopGrid limit={16} />
      <section className="trust-row">
        <article>
          <ShieldCheck aria-hidden size={28} />
          <strong>Secure checkout</strong>
          <span>Yoco hosted payments and claim mode fallback.</span>
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
          <PackageCheck aria-hidden size={28} />
          <strong>Complete catalogue</strong>
          <span>Every sellable item from our current stock list.</span>
        </article>
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
