"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { featuredProducts, filterProducts, productTabs, type Product, type ProductTab } from "@/lib/products";
import { ProductCard } from "./ProductCard";

type ShopGridProps = {
  initialTab?: ProductTab;
  limit?: number;
};

type SortMode = "featured" | "price-desc" | "price-asc" | "name-asc" | "stock-desc";

function sortProducts(products: Product[], sort: SortMode) {
  const next = [...products];

  switch (sort) {
    case "price-desc":
      return next.sort((a, b) => b.priceZar - a.priceZar);
    case "price-asc":
      return next.sort((a, b) => a.priceZar - b.priceZar);
    case "name-asc":
      return next.sort((a, b) => a.name.localeCompare(b.name));
    case "stock-desc":
      return next.sort((a, b) => b.stock - a.stock);
    case "featured":
    default:
      return next.sort((a, b) => Number(b.featured) - Number(a.featured) || b.priceZar - a.priceZar);
  }
}

export function ShopGrid({ initialTab = "All", limit }: ShopGridProps) {
  const isFeaturedRail = typeof limit === "number";
  const [tab, setTab] = useState<ProductTab>(initialTab);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("featured");
  const products = useMemo(() => {
    const baseProducts = isFeaturedRail ? featuredProducts : filterProducts(tab, query);
    return isFeaturedRail ? baseProducts : sortProducts(baseProducts, sort);
  }, [isFeaturedRail, query, sort, tab]);
  const visible = isFeaturedRail ? products.slice(0, limit) : products;

  return (
    <section className={isFeaturedRail ? "shop-section shop-section--featured" : "shop-section"} id="shop">
      <div className="section-title-row">
        <div>
          <h2>{isFeaturedRail ? "Featured products" : "Full catalogue"}</h2>
          <p>
            {isFeaturedRail
              ? "A quick look at current grails and show-table highlights."
              : `${products.length} catalogue items ready to browse, claim or checkout.`}
          </p>
        </div>
        {isFeaturedRail ? (
          <Link className="view-all-link" href="/shop">
            View all products
          </Link>
        ) : (
          <div className="catalogue-controls">
            <label className="search-box">
              <Search aria-hidden size={18} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search card, set, SKU..." />
            </label>
            <label className="sort-box">
              <span>Sort</span>
              <select aria-label="Sort products" value={sort} onChange={(event) => setSort(event.target.value as SortMode)}>
                <option value="featured">Featured first</option>
                <option value="price-desc">Price: high to low</option>
                <option value="price-asc">Price: low to high</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="stock-desc">Stock: most first</option>
              </select>
            </label>
          </div>
        )}
      </div>
      {!isFeaturedRail && (
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
      )}
      <div className="product-grid">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
