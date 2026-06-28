import Image from "next/image";
import Link from "next/link";
import { CalendarDays, LockKeyhole, ShieldCheck, Trophy, UsersRound } from "lucide-react";
import { featuredProducts, formatZar, grailProducts, productStats } from "@/lib/products";
import { ProductVisual } from "@/components/store/ProductVisual";

export function VaultHero() {
  const stats = productStats();
  const auction = featuredProducts.find((product) => product.id === "TVR-CAT-0010") || grailProducts[1] || grailProducts[0] || featuredProducts[0];

  return (
    <section className="vault-hero">
      <div className="hero-copy-panel">
        <h1>The Vault Room</h1>
        <div className="hero-banner">Cards. Collectibles. Grails.</div>
        <p>Cape Town collector community</p>
        <div className="hero-keywords">
          <span>Buy</span>
          <span>Sell</span>
          <span>Trade</span>
          <span>Consign</span>
        </div>
        <div className="hero-actions">
          <Link className="primary-action" href="/shop">
            <LockKeyhole aria-hidden size={18} />
            Shop now
          </Link>
          <a className="secondary-action" href="https://chat.whatsapp.com/LgAy8Q0NgVp9NcU7oJXBDy">
            <UsersRound aria-hidden size={18} />
            Join community
          </a>
        </div>
        <article className="event-card">
          <span>Upcoming show</span>
          <strong>Cape Town Collect-a-Con</strong>
          <em>4 July 2026</em>
          <p>
            <CalendarDays aria-hidden size={15} />
            Protea Fire & Ice! Cape Town · 10AM
          </p>
          <Link href="/events">RSVP now</Link>
        </article>
      </div>

      <div className="hero-art-panel">
        <Image
          className="crew-hero-art"
          src="/branding/vault-room-crossover-harbor-hero.jpg"
          alt="Anime trading card fans ripping packs at the Cape Town harbor with Table Mountain and a pirate ship in the background"
          width={1672}
          height={941}
          priority
        />
        <div className="hero-value-strip">
          <span>
            <ShieldCheck aria-hidden size={18} /> Trusted community
          </span>
          <span>
            <Trophy aria-hidden size={18} /> {stats.products} catalogue items
          </span>
          <span>{formatZar(stats.totalValue)} listed value</span>
        </div>
      </div>

      <aside className="live-auction-card">
        <span>Claim drop</span>
        <strong>01d : 06h : 32m : 18s</strong>
        {auction && <ProductVisual product={auction} />}
        <p>{auction?.name || "Featured grail"}</p>
        <em>Interest guide {formatZar(auction ? Math.max(auction.priceZar - 500, 150) : 150)}</em>
        <Link href="/auctions">Register interest</Link>
      </aside>

      <aside className="mobile-preview">
        <div className="phone-frame">
          <div className="phone-status">10:30</div>
          <Image src="/branding/vault-room-crest.png" alt="" width={50} height={50} />
          <strong>The Vault Room</strong>
          <Image className="phone-hero" src="/branding/vault-room-poster.jpg" alt="Vault Room mobile hero" width={230} height={300} />
          <article>
            <span>Upcoming show</span>
            <b>Collect-a-Con</b>
            <em>4 July 2026</em>
          </article>
          {featuredProducts[0] && (
            <div className="phone-product">
              <ProductVisual compact product={featuredProducts[0]} />
              <p>{featuredProducts[0].name}</p>
              <strong>{formatZar(featuredProducts[0].priceZar)}</strong>
            </div>
          )}
        </div>
      </aside>
    </section>
  );
}
