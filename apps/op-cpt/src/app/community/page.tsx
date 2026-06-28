import Link from "next/link";
import { Camera, MessageCircle, Trophy, UsersRound } from "lucide-react";
import { VaultRoomShell } from "@/components/VaultRoomShell";

export default function CommunityPage() {
  return (
    <VaultRoomShell>
      <section className="page-hero">
        <span>The Vault Room crew</span>
        <h1>More than cards</h1>
        <p>Join the rooms for trades, price checks, game nights, auctions, preorders and show-day announcements.</p>
      </section>
      <section className="community-grid">
        <article>
          <MessageCircle aria-hidden size={34} />
          <h2>WhatsApp community</h2>
          <p>Fastest route for claims, meetups, price checks and table updates.</p>
          <Link href="https://chat.whatsapp.com/LgAy8Q0NgVp9NcU7oJXBDy">Join WhatsApp</Link>
        </article>
        <article>
          <Camera aria-hidden size={34} />
          <h2>Instagram</h2>
          <p>Follow grail drops, show content, reels and collector spotlights.</p>
          <Link href="https://instagram.com/thevaultroom.cpt">@thevaultroom.cpt</Link>
        </article>
        <article>
          <Trophy aria-hidden size={34} />
          <h2>Rankings</h2>
          <p>Player points, trade wins and collector achievements are coming online.</p>
          <Link href="/profile">View profiles</Link>
        </article>
        <article>
          <UsersRound aria-hidden size={34} />
          <h2>Trade days</h2>
          <p>Meet, connect, build your collection and trade safely.</p>
          <Link href="/events">See events</Link>
        </article>
      </section>
    </VaultRoomShell>
  );
}
