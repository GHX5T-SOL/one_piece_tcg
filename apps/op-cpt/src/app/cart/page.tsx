import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { VaultRoomShell } from "@/components/VaultRoomShell";

export default function CartPage() {
  return (
    <VaultRoomShell>
      <section className="page-hero">
        <span>Checkout</span>
        <h1>Your cart is always available</h1>
        <p>The cart panel opens on the right on desktop and as a floating action on smaller screens.</p>
        <Link className="primary-action" href="/shop">
          <ShoppingBag aria-hidden size={18} />
          Continue shopping
        </Link>
      </section>
    </VaultRoomShell>
  );
}
