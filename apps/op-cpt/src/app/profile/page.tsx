import Link from "next/link";
import { Award, Camera, CalendarDays, MessageSquare, Search, ShoppingBag, Star, UsersRound } from "lucide-react";
import { AuthPanel } from "@/components/AuthPanel";
import { VaultRoomShell } from "@/components/VaultRoomShell";
import { formatZar, productStats } from "@/lib/products";
import { profiles } from "@/lib/seed-data";

export default function ProfilePage() {
  const stats = productStats();

  return (
    <VaultRoomShell>
      <section className="profile-hero">
        <div>
          <span>Captain profile</span>
          <h1>Your collector passport</h1>
          <p>Create a Vault Room profile to track claims, RSVPs, auctions, grade-lab reports and community rankings.</p>
          <div className="hero-actions">
            <Link className="primary-action" href="/community">
              <UsersRound aria-hidden size={18} />
              Join community
            </Link>
            <Link className="secondary-action" href="/shop">
              <ShoppingBag aria-hidden size={18} />
              Browse catalogue
            </Link>
          </div>
        </div>
        <aside className="passport-card">
          <strong>Captain</strong>
          <em>Level 28</em>
          <div>
            <span>
              <Award aria-hidden size={18} />
              {stats.products} items tracked
            </span>
            <span>
              <Star aria-hidden size={18} />
              {formatZar(stats.totalValue)} listed value
            </span>
            <span>
              <CalendarDays aria-hidden size={18} />
              Show crew active
            </span>
          </div>
        </aside>
      </section>
      <section className="tool-grid">
        <article className="tool-panel tool-panel--wide">
          <div className="tool-panel__head">
            <span>
              <UsersRound aria-hidden size={18} />
              Member profiles
            </span>
            <em>Beta model</em>
          </div>
          <div className="compact-list">
            {profiles.map((profile) => (
              <div key={profile.id}>
                <strong>{profile.handle}</strong>
                <span>{profile.crewRole}</span>
                <em>{profile.privacy}</em>
              </div>
            ))}
          </div>
        </article>
        <article className="tool-panel">
          <div className="tool-panel__head">
            <span>
              <Camera aria-hidden size={18} />
              Portfolio tools
            </span>
            <em>Public / private</em>
          </div>
          <div className="workflow-list">
            <span>Scanner-assisted card add</span>
            <span>Manual card entry</span>
            <span>Private, members-only, or public cards</span>
            <span>Protocol-backed price labels</span>
          </div>
        </article>
        <article className="tool-panel">
          <div className="tool-panel__head">
            <span>
              <MessageSquare aria-hidden size={18} />
              Social marketplace
            </span>
            <em>Planned</em>
          </div>
          <div className="workflow-list">
            <span>User search and DMs</span>
            <span>Trade offers and wishlists</span>
            <span>Auction comments</span>
            <span>Moderator review queue</span>
          </div>
        </article>
      </section>
      <section className="beta-roadmap">
        <article>
          <Search aria-hidden size={22} />
          <strong>Next platform slice</strong>
          <span>Member accounts, portfolio privacy, watchlists, listing requests, comments, and profile search.</span>
        </article>
        <article>
          <Star aria-hidden size={22} />
          <strong>Business guardrail</strong>
          <span>No live user marketplace, payment, or private messaging until moderation, terms, and support workflows are approved.</span>
        </article>
      </section>
      <AuthPanel />
    </VaultRoomShell>
  );
}
