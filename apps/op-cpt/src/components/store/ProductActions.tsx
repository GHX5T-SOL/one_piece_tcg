"use client";

import { MessageCircle, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/store/cart";

const adminWhatsappNumber = "27796643002";

export function ProductActions({ product }: { product: Product }) {
  const cart = useCart();
  const whatsappText = encodeURIComponent(`Hi The Vault Room, I want to ask about ${product.name} (${product.sku}).`);

  return (
    <div className="product-actions">
      <button className="primary-action" disabled={product.stock <= 0} onClick={() => cart.add(product)} type="button">
        <ShoppingCart aria-hidden size={18} />
        Add to cart
      </button>
      <a className="secondary-action" href={`https://wa.me/${adminWhatsappNumber}?text=${whatsappText}`}>
        <MessageCircle aria-hidden size={18} />
        Ask on WhatsApp
      </a>
    </div>
  );
}
