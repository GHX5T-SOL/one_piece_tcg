"use client";

import { Loader2, ShoppingBag, Trash2, X } from "lucide-react";
import { useState } from "react";
import { formatZar } from "@/lib/products";
import { useCart } from "@/lib/store/cart";
import { ProductVisual } from "./ProductVisual";

export function CartDrawer() {
  const cart = useCart();
  const [open, setOpen] = useState(true);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function checkout() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/checkout/yoco", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: cart.items.map((item) => ({ productId: item.product.id, quantity: item.quantity })) })
      });
      const payload = await response.json();
      if (payload.redirectUrl) {
        window.location.href = payload.redirectUrl;
      } else {
        setMessage(payload.message || "Checkout is in claim mode. We saved your cart locally.");
      }
    } catch {
      setMessage("Checkout could not start. Message us on WhatsApp and we will lock the items manually.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        className="floating-cart"
        onClick={() => {
          setOpen(true);
          setMobileExpanded(true);
        }}
        type="button"
      >
        <ShoppingBag aria-hidden size={20} />
        <span>{cart.count}</span>
      </button>
    );
  }

  return (
    <>
      <button className="floating-cart floating-cart--mobile" onClick={() => setMobileExpanded(true)} type="button">
        <ShoppingBag aria-hidden size={20} />
        <span>{cart.count}</span>
      </button>
      <aside className={mobileExpanded ? "cart-drawer mobile-expanded" : "cart-drawer"} aria-label="Shopping cart">
      <div className="cart-drawer__head">
        <strong>Your cart ({cart.count})</strong>
        <button
          aria-label="Close cart"
          onClick={() => {
            setOpen(false);
            setMobileExpanded(false);
          }}
          type="button"
        >
          <X aria-hidden size={18} />
        </button>
      </div>
      <div className="cart-lines">
        {cart.items.length === 0 ? (
          <p className="empty-cart">Add a grail from the catalogue to start a checkout or claim.</p>
        ) : (
          cart.items.map((item) => (
            <div className="cart-line" key={item.product.id}>
              <ProductVisual compact product={item.product} />
              <div>
                <strong>{item.product.name}</strong>
                <span>{formatZar(item.product.priceZar)}</span>
                <select
                  aria-label={`Quantity for ${item.product.name}`}
                  value={item.quantity}
                  onChange={(event) => cart.setQuantity(item.product, Number(event.target.value))}
                >
                  {Array.from({ length: Math.max(item.product.stock, 1) }, (_, index) => index + 1).map((quantity) => (
                    <option key={quantity} value={quantity}>
                      Qty {quantity}
                    </option>
                  ))}
                </select>
              </div>
              <button aria-label={`Remove ${item.product.name}`} onClick={() => cart.remove(item.product)} type="button">
                <Trash2 aria-hidden size={16} />
              </button>
            </div>
          ))
        )}
      </div>
      <div className="cart-drawer__summary">
        <div>
          <span>Subtotal</span>
          <strong>{formatZar(cart.subtotal)}</strong>
        </div>
        <div>
          <span>Shipping</span>
          <em>Calculated at checkout</em>
        </div>
        <button className="checkout-button" disabled={cart.items.length === 0 || loading} onClick={checkout} type="button">
          {loading ? <Loader2 className="spin" aria-hidden size={18} /> : null}
          Checkout · {formatZar(cart.subtotal)}
        </button>
        {message && <p className="checkout-message">{message}</p>}
        <p className="secure-note">Secure hosted checkout. Show pickup and Cape Town handover available.</p>
      </div>
      </aside>
    </>
  );
}
