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
        <span>Live claims & auctions</span>
        <h1>Timed grail drops</h1>
        <p>Bid, claim or message us. High-value items are confirmed manually before final handover.</p>
      </section>
      <section className="auction-grid">
        {auctions.map((product, index) => (
          <article className="auction-card" key={product.id}>
            <span>0{index + 1}d : 06h : 32m</span>
            <ProductVisual product={product} />
            <h2>{product.name}</h2>
            <p>Current bid {formatZar(Math.max(product.priceZar - 500, 150))}</p>
            <Link href={`/product/${product.slug}`}>
              <Gavel aria-hidden size={17} />
              Bid now
            </Link>
          </article>
        ))}
      </section>
    </VaultRoomShell>
  );
}
