import Link from "next/link";
import { LockKeyhole, MessageCircle, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { AuthPanel } from "@/components/AuthPanel";
import { VaultRoomShell } from "@/components/VaultRoomShell";

export default function SignInPage() {
  return (
    <VaultRoomShell>
      <section className="page-hero account-hero">
        <span>Member access</span>
        <h1>Your Vault Room profile</h1>
        <p>
          The account layer is being prepared for collection tracking, listings, watchlists, points, messages and opt-in public showcases.
          WhatsApp remains the fastest live route while OAuth keys and moderation workflows are finalized.
        </p>
        <div className="hero-actions">
          <a className="primary-action" href="https://chat.whatsapp.com/LgAy8Q0NgVp9NcU7oJXBDy">
            <MessageCircle aria-hidden size={18} />
            Join WhatsApp
          </a>
          <Link className="secondary-action" href="/shop">
            <LockKeyhole aria-hidden size={18} />
            Browse stock
          </Link>
        </div>
      </section>
      <section className="account-preview-grid">
        <article>
          <UsersRound aria-hidden size={24} />
          <strong>Create a collector identity</strong>
          <span>Handle, avatar, crew role, privacy mode and public or members-only showcase.</span>
        </article>
        <article>
          <Sparkles aria-hidden size={24} />
          <strong>Earn Vault points</strong>
          <span>Shows attended, trades completed, pack-rip participation, tournament results and community quests.</span>
        </article>
        <article>
          <ShieldCheck aria-hidden size={24} />
          <strong>Safe by default</strong>
          <span>Private collections stay private. Marketplace, DMs and rankings are opt-in and moderator-ready.</span>
        </article>
      </section>
      <AuthPanel />
    </VaultRoomShell>
  );
}
