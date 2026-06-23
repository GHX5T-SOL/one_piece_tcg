import Image from "next/image";
import { Award, Box, FlaskConical, PackageOpen, ShieldCheck, Sparkles } from "lucide-react";
import { getProductImage } from "@/lib/products";
import type { Product } from "@/lib/products";

type ProductVisualProps = {
  product: Product;
  compact?: boolean;
  priority?: boolean;
};

export function ProductVisual({ product, compact = false, priority = false }: ProductVisualProps) {
  const image = getProductImage(product.id);
  const Icon =
    product.visualKind === "slab"
      ? Award
      : product.visualKind === "sealed"
        ? Box
        : product.visualKind === "pokemon-pack"
          ? PackageOpen
          : product.visualKind === "service"
            ? FlaskConical
            : ShieldCheck;

  return (
    <div className={`product-visual product-visual--${product.visualKind}${compact ? " product-visual--compact" : ""}`}>
      {image ? (
        <Image
          alt={`${product.name} slab`}
          className="product-visual__photo"
          height={image.height}
          priority={priority}
          sizes={compact ? "70px" : "140px"}
          src={image.src}
          width={image.width}
        />
      ) : (
        <>
          <div className="product-visual__shine" />
          <div className="product-visual__badge">
            <Icon aria-hidden size={compact ? 16 : 22} />
          </div>
          <div className="product-visual__card">
            <span>{product.universe}</span>
            <strong>{product.name.replace(/^([A-Z0-9-]+)\s/, "").slice(0, 54)}</strong>
            <em>{product.grade || product.rarity || product.productType}</em>
          </div>
          <div className="product-visual__footer">
            <Sparkles aria-hidden size={14} />
            <span>{product.productType}</span>
          </div>
        </>
      )}
    </div>
  );
}
