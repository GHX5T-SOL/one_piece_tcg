import { AppFrame } from "@/components/AppFrame";
import { CardGrid } from "@/components/CardGrid";
import { StatPanel } from "@/components/StatPanel";
import { cards } from "@/lib/seed-data";
import { summarizeCollection } from "@/lib/search";

export default function CollectionPage() {
  const summary = summarizeCollection();

  return (
    <AppFrame active="/collection">
      <section className="page-shell">
        <div className="section-heading">
          <p>Ghost seed collection</p>
          <h1>Collection vault</h1>
          <span>Cards, sealed items, cert fields, and strategy notes. Unknown values stay blank until verified.</span>
        </div>
        <div className="dashboard-strip">
          <StatPanel detail="Seeded cards + sealed qty" label="Total items" value={String(summary.totalCards)} />
          <StatPanel detail="PSA/CGC/BGS only" label="Graded" value={String(summary.graded)} />
          <StatPanel detail="Packs and deck sets" label="Sealed" value={String(summary.sealed)} />
          <StatPanel detail="Promo / alt / parallel" label="Rare lane" value={String(summary.promoOrAlt)} />
        </div>
        <div className="scanner-panel" id="scanner">
          <div>
            <h2>Scan & add</h2>
            <p>Camera recognition is marked for v1.1. The MVP supports manual card search and import endpoints.</p>
          </div>
          <form className="scanner-form" action="/api/cards/search">
            <input name="q" placeholder="Search Luffy, ST10-006, Nami, OP13..." />
            <button type="submit">Search cards</button>
          </form>
        </div>
        <CardGrid cards={cards} />
      </section>
    </AppFrame>
  );
}
