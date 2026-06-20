import { Download, Eye, PackageCheck, ShieldAlert } from "lucide-react";
import { VaultRoomShell } from "@/components/VaultRoomShell";
import { allProducts, catalogueManifest, formatZar, productStats } from "@/lib/products";

export default function AdminPage() {
  const stats = productStats();
  const reviewRows = allProducts.filter((product) => product.askOnly).slice(0, 24);

  return (
    <VaultRoomShell showCart={false}>
      <section className="page-hero">
        <span>Private operator panel</span>
        <h1>Catalogue control room</h1>
        <p>Operational view for source coverage, public listing status, high-value stock and checkout readiness.</p>
      </section>
      <section className="admin-stats">
        <article>
          <PackageCheck aria-hidden size={24} />
          <span>Public products</span>
          <strong>{stats.products}</strong>
        </article>
        <article>
          <Eye aria-hidden size={24} />
          <span>Catalogue records</span>
          <strong>{catalogueManifest.sourceRows}</strong>
        </article>
        <article>
          <ShieldAlert aria-hidden size={24} />
          <span>Admin verify items</span>
          <strong>{allProducts.filter((product) => product.askOnly).length}</strong>
        </article>
        <article>
          <Download aria-hidden size={24} />
          <span>Listed value</span>
          <strong>{formatZar(stats.totalValue)}</strong>
        </article>
      </section>
      <section className="admin-table-card">
        <div className="section-title-row">
          <div>
            <h2>Admin verify queue</h2>
            <p>These are public listings but should be rechecked before accepting unusual offers or shipping commitments.</p>
          </div>
          <a className="secondary-action" href="/shop">
            View public shop
          </a>
        </div>
        <div className="admin-table">
          {reviewRows.map((product) => (
            <div className="admin-row" key={product.id}>
              <span>{product.sku}</span>
              <strong>{product.name}</strong>
              <em>{product.category}</em>
              <b>{formatZar(product.priceZar)}</b>
              <small>{product.stock} left</small>
            </div>
          ))}
        </div>
      </section>
    </VaultRoomShell>
  );
}
