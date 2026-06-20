import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { VaultRoomShell } from "@/components/VaultRoomShell";

export default function CheckoutCancelPage() {
  return (
    <VaultRoomShell>
      <section className="page-hero">
        <span>Checkout cancelled</span>
        <h1>No payment captured</h1>
        <p>Your cart stays local in this browser. You can return to the catalogue or message us to reserve manually.</p>
        <Link className="primary-action" href="/shop">
          <ShoppingBag aria-hidden size={18} />
          Return to shop
        </Link>
      </section>
    </VaultRoomShell>
  );
}
