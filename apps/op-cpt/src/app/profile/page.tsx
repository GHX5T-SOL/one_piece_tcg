import Link from "next/link";
import { Award, CalendarDays, ShoppingBag, Star, UsersRound } from "lucide-react";
import { VaultRoomShell } from "@/components/VaultRoomShell";
import { formatZar, productStats } from "@/lib/products";

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
    </VaultRoomShell>
  );
}
