import { notFound } from "next/navigation";
import { ProductActions } from "@/components/store/ProductActions";
import { ProductVisual } from "@/components/store/ProductVisual";
import { VaultRoomShell } from "@/components/VaultRoomShell";
import { allProducts, findProductBySlug, formatZar } from "@/lib/products";

export function generateStaticParams() {
  return allProducts.map((product) => ({ slug: product.slug }));
}

type ProductRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductRouteProps) {
  const { slug } = await params;
  const product = findProductBySlug(slug);
  return {
    title: product ? `${product.name} | The Vault Room` : "Product | The Vault Room"
  };
}

export default async function ProductPage({ params }: ProductRouteProps) {
  const { slug } = await params;
  const product = findProductBySlug(slug);
  if (!product) notFound();

  return (
    <VaultRoomShell>
      <section className="product-detail">
        <div className="product-detail__visual">
          <ProductVisual product={product} />
        </div>
        <div className="product-detail__copy">
          <span>{product.universe} · {product.productType}</span>
          <h1>{product.name}</h1>
          <p>{product.publicDescription}</p>
          <div className="detail-price">{formatZar(product.priceZar)}</div>
          <dl className="detail-list">
            <div>
              <dt>Stock</dt>
              <dd>{product.stock > 0 ? `${product.stock} available` : "Ask availability"}</dd>
            </div>
            <div>
              <dt>Set / product</dt>
              <dd>{product.setName || product.category}</dd>
            </div>
            <div>
              <dt>Condition</dt>
              <dd>{product.condition}</dd>
            </div>
            {product.grade ? (
              <div>
                <dt>Grade</dt>
                <dd>{product.grade}</dd>
              </div>
            ) : null}
            {product.rarity ? (
              <div>
                <dt>Rarity</dt>
                <dd>{product.rarity}</dd>
              </div>
            ) : null}
            <div>
              <dt>Catalogue ID</dt>
              <dd>{product.sku}</dd>
            </div>
          </dl>
          <ProductActions product={product} />
          <p className="public-note">
            Availability is confirmed before payment or handover. Show pickup, Cape Town handover and shipping quotes can be arranged.
          </p>
        </div>
      </section>
    </VaultRoomShell>
  );
}
