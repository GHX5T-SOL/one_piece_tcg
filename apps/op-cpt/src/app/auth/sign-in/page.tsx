import Link from "next/link";
import { LockKeyhole, MessageCircle } from "lucide-react";
import { VaultRoomShell } from "@/components/VaultRoomShell";

export default function SignInPage() {
  return (
    <VaultRoomShell>
      <section className="page-hero">
        <span>Member access</span>
        <h1>Captain profiles are opening soon</h1>
        <p>For now, claims, RSVPs, grading intake and trade coordination are handled through the WhatsApp community.</p>
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
    </VaultRoomShell>
  );
}
