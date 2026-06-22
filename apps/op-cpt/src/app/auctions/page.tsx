import Link from "next/link";
import { Gavel } from "lucide-react";
import { ProductVisual } from "@/components/store/ProductVisual";
import { VaultRoomShell } from "@/components/VaultRoomShell";
import { formatZar, grailProducts } from "@/lib/products";

export default function AuctionsPage() {
  const auctions = grailProducts.slice(0, 8);

  return (
    <VaultRoomShell>
      <section className="page-hero">
        <span>Claim drops beta</span>
        <h1>Grail interest board</h1>
        <p>
          Register interest or message us on WhatsApp. High-value cards are confirmed manually before payment, handover, shipping, or trade.
        </p>
      </section>
      <section className="auction-grid">
        {auctions.map((product, index) => (
          <article className="auction-card" key={product.id}>
            <span>0{index + 1}d : 06h : 32m</span>
            <ProductVisual product={product} />
            <h2>{product.name}</h2>
            <p>Interest guide {formatZar(Math.max(product.priceZar - 500, 150))}</p>
            <Link href={`/product/${product.slug}`}>
              <Gavel aria-hidden size={17} />
              Register interest
            </Link>
          </article>
        ))}
      </section>
      <section className="public-note-panel">
        <h2>No live auction engine yet</h2>
        <p>
          This board is a discovery and interest layer only. Real auction rules, anti-sniping, payment handling, deposits, reserve prices, and
          moderation will be added only after terms are approved.
        </p>
      </section>
    </VaultRoomShell>
  );
}
