import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { VaultRoomShell } from "@/components/VaultRoomShell";

export default function CartPage() {
  return (
    <VaultRoomShell>
      <section className="page-hero">
        <span>Invoice checkout</span>
        <h1>Your cart is always available</h1>
        <p>Online payments are coming soon: Yoco, PayFast, PayPal, Direct EFT, Ozow, Apple Pay, Google Pay, crypto, Visa and Mastercard. For now, build a cart, generate an invoice with shipping excluded, then WhatsApp admin so we can confirm availability and send the payment link.</p>
        <Link className="primary-action" href="/shop">
          <ShoppingBag aria-hidden size={18} />
          Continue shopping
        </Link>
      </section>
    </VaultRoomShell>
  );
}
