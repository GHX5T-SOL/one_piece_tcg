import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { VaultRoomShell } from "@/components/VaultRoomShell";

export default function CheckoutSuccessPage() {
  return (
    <VaultRoomShell>
      <section className="page-hero">
        <span>Checkout received</span>
        <h1>Claim locked</h1>
        <p>Thanks. We will confirm stock, handover and show pickup details through The Vault Room community channels.</p>
        <div className="hero-actions">
          <a className="primary-action" href="https://chat.whatsapp.com/LgAy8Q0NgVp9NcU7oJXBDy">
            <MessageCircle aria-hidden size={18} />
            Message us
          </a>
          <Link className="secondary-action" href="/shop">
            <CheckCircle2 aria-hidden size={18} />
            Back to shop
          </Link>
        </div>
      </section>
    </VaultRoomShell>
  );
}
