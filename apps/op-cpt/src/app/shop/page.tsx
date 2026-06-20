import { ShopGrid } from "@/components/store/ShopGrid";
import { VaultRoomShell } from "@/components/VaultRoomShell";
import { catalogueManifest, productStats } from "@/lib/products";

export default function ShopPage() {
  const stats = productStats();

  return (
    <VaultRoomShell>
      <section className="page-hero page-hero--shop">
        <span>Full live catalogue</span>
        <h1>Everything available for sale</h1>
        <p>
          Browse every current Vault Room item in one place: sealed, raw, graded, Pokemon, One Piece, premium singles and grade-lab
          services.
        </p>
        <div className="stat-capsules">
          <b>{catalogueManifest.sourceRows} catalogue records covered</b>
          <b>{stats.products} public listings</b>
          <b>{stats.inStock} in-stock catalogue lines</b>
        </div>
      </section>
      <ShopGrid />
    </VaultRoomShell>
  );
}
