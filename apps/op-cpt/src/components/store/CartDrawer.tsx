"use client";

import { FileText, MessageCircle, ShoppingBag, Trash2, X } from "lucide-react";
import { useState } from "react";
import { formatZar } from "@/lib/products";
import { useCart } from "@/lib/store/cart";
import { ProductVisual } from "./ProductVisual";

const adminWhatsappNumber = "27796643002";

type GeneratedInvoice = {
  id: string;
  href: string;
};

const futurePaymentOptions = ["Yoco", "PayFast", "PayPal", "Direct EFT", "Ozow", "Apple Pay", "Google Pay", "Crypto", "Visa", "Mastercard"];

export function CartDrawer() {
  const cart = useCart();
  const [open, setOpen] = useState(true);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [invoice, setInvoice] = useState<GeneratedInvoice | null>(null);

  function generateInvoice() {
    if (cart.items.length === 0) return;

    const invoiceId = `TVR-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${Date.now().toString().slice(-5)}`;
    const lineItems = cart.items
      .map((item, index) => {
        const lineTotal = item.product.priceZar * item.quantity;
        return `${index + 1}. ${item.product.name} (${item.product.sku}) x${item.quantity} - ${formatZar(lineTotal)}`;
      })
      .join("\n");
    const invoiceText = [
      "Hi The Vault Room, I would like to confirm this invoice:",
      "",
      `Invoice: ${invoiceId}`,
      lineItems,
      "",
      `Subtotal: ${formatZar(cart.subtotal)}`,
      "Shipping: excluded, please quote separately",
      "",
      "Please confirm availability and send the payment link / handover details."
    ].join("\n");

    setInvoice({
      id: invoiceId,
      href: `https://wa.me/${adminWhatsappNumber}?text=${encodeURIComponent(invoiceText)}`
    });
    setMessage("Invoice generated. Online payments are coming soon; no payment has been captured. Send the invoice to admin on WhatsApp so we can confirm availability, shipping and the payment link.");
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
          <p className="empty-cart">Add a grail from the catalogue to start your cart.</p>
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
          <em>Excluded from invoice</em>
        </div>
        <button className="checkout-button" disabled={cart.items.length === 0} onClick={generateInvoice} type="button">
          <FileText aria-hidden size={18} />
          Generate invoice · {formatZar(cart.subtotal)}
        </button>
        {invoice && (
          <a className="invoice-whatsapp-link" href={invoice.href} target="_blank" rel="noreferrer">
            <MessageCircle aria-hidden size={17} />
            Message admin with {invoice.id}
          </a>
        )}
        {message && <p className="checkout-message">{message}</p>}
        <div className="payment-coming-soon" aria-label="Payment options coming soon">
          <strong>Online payments coming soon</strong>
          <div>
            {futurePaymentOptions.map((option) => (
              <span key={option}>{option}</span>
            ))}
          </div>
        </div>
        <p className="secure-note">For now we confirm stock manually, quote shipping separately, then send a payment link.</p>
      </div>
      </aside>
    </>
  );
}
