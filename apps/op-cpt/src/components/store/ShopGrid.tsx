"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { filterProducts, productTabs, type ProductTab } from "@/lib/products";
import { ProductCard } from "./ProductCard";

type ShopGridProps = {
  initialTab?: ProductTab;
  limit?: number;
};

export function ShopGrid({ initialTab = "All", limit }: ShopGridProps) {
  const [tab, setTab] = useState<ProductTab>(initialTab);
  const [query, setQuery] = useState("");
  const products = useMemo(() => filterProducts(tab, query), [tab, query]);
  const visible = typeof limit === "number" && !query ? products.slice(0, limit) : products;

  return (
    <section className="shop-section" id="shop">
      <div className="section-title-row">
        <div>
          <h2>Featured products</h2>
          <p>{products.length} catalogue items ready to browse, claim or checkout.</p>
        </div>
        <label className="search-box">
          <Search aria-hidden size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search card, set, SKU..." />
        </label>
      </div>
      <div className="filter-row" role="tablist" aria-label="Product filters">
        {productTabs.map((candidate) => (
          <button
            aria-selected={candidate === tab}
            className={candidate === tab ? "filter-pill is-active" : "filter-pill"}
            key={candidate}
            onClick={() => setTab(candidate)}
            role="tab"
            type="button"
          >
            {candidate}
          </button>
        ))}
      </div>
      <div className="product-grid">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
