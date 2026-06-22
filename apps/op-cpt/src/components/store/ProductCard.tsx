"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { formatZar, type Product } from "@/lib/products";
import { useCart } from "@/lib/store/cart";
import { ProductVisual } from "./ProductVisual";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

export function ProductCard({ product }: ProductCardProps) {
  const cart = useCart();

  return (
    <article className="product-card">
      <div className="product-card__media">
        {product.featured && <span className="product-card__flag">Hot</span>}
        <button className="icon-button" aria-label={`Save ${product.name}`}>
          <Heart aria-hidden size={17} />
        </button>
        <Link href={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
          <ProductVisual product={product} />
        </Link>
      </div>
      <div className="product-card__body">
        <Link href={`/product/${product.slug}`}>
          <h3>{product.name}</h3>
        </Link>
        <p>{product.setName || product.category}</p>
        <div className="product-card__meta">
          <strong>{formatZar(product.priceZar)}</strong>
          <span className={product.stock > 0 ? "stock stock--in" : "stock stock--ask"}>
            {product.stock > 0 ? `${product.stock} left` : "Ask"}
          </span>
        </div>
      </div>
      <button className="cart-button" onClick={() => cart.add(product)} disabled={product.stock <= 0}>
        <ShoppingCart aria-hidden size={17} />
        Add
      </button>
    </article>
  );
}
