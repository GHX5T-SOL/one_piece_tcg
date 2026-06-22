import Link from "next/link";
import { BarChart3, ExternalLink, Radar, ShieldCheck, TrendingUp } from "lucide-react";
import { VaultRoomShell } from "@/components/VaultRoomShell";
import { formatZar, grailProducts } from "@/lib/products";
import { priceTrends, sources } from "@/lib/seed-data";

export const metadata = {
  title: "Market Watch | The Vault Room",
  description: "Watchlists, price signals, and source-backed market notes for The Vault Room."
};

export default function MarketPage() {
  const sourceLinks = sources.filter((source) => ["market", "official", "competitive"].includes(source.category)).slice(0, 6);

  return (
    <VaultRoomShell>
      <section className="page-hero">
        <span>Pricing protocol desk</span>
        <h1>Market watch</h1>
        <p>
          A beta dashboard for grail targets, price signals, and source-backed valuation work. The public site shows confidence bands and
          manual review status instead of pretending live market data is final.
        </p>
      </section>

      <section className="market-grid">
        <article className="tool-panel tool-panel--wide">
          <div className="tool-panel__head">
            <span>
              <Radar aria-hidden size={18} />
              Grail watchlist
            </span>
            <em>High-list show anchors</em>
          </div>
          <div className="compact-list">
            {grailProducts.slice(0, 8).map((product) => (
              <Link href={`/product/${product.slug}`} key={product.id}>
                <strong>{formatZar(product.priceZar)}</strong>
                <span>{product.name}</span>
                <em>{product.stock > 0 ? "in stock" : "ask"}</em>
              </Link>
            ))}
          </div>
        </article>

        <article className="tool-panel">
          <div className="tool-panel__head">
            <span>
              <TrendingUp aria-hidden size={18} />
              Trend signals
            </span>
            <em>Manual snapshot</em>
          </div>
          <div className="signal-list">
            {priceTrends.map((trend) => (
              <div key={trend.label}>
                <span>{trend.label}</span>
                <strong className={trend.delta >= 0 ? "trend-up" : "trend-down"}>{trend.delta >= 0 ? "+" : ""}{trend.delta}%</strong>
                <em>{trend.confidence} confidence</em>
              </div>
            ))}
          </div>
        </article>

        <article className="tool-panel">
          <div className="tool-panel__head">
            <span>
              <BarChart3 aria-hidden size={18} />
              Pricing rules
            </span>
            <em>Protocol required</em>
          </div>
          <div className="workflow-list">
            <span>1. Exact variant and language</span>
            <span>2. Live comps and active supply</span>
            <span>3. Population and grade scarcity</span>
            <span>4. Cape Town instant-availability premium</span>
          </div>
        </article>
      </section>

      <section className="vault-list-panel">
        <div className="section-title-row">
          <div>
            <h2>Source ledger</h2>
            <p>References used by the market desk. Values still require card-specific evidence before quoting.</p>
          </div>
        </div>
        <div className="compact-list">
          {sourceLinks.map((source) => (
            <a href={source.url} key={source.id} rel="noreferrer" target="_blank">
              <strong>{source.category}</strong>
              <span>{source.title}</span>
              <em>
                open <ExternalLink aria-hidden size={13} />
              </em>
            </a>
          ))}
        </div>
      </section>

      <section className="public-note-panel">
        <ShieldCheck aria-hidden size={28} />
        <div>
          <h2>No blind auto-pricing</h2>
          <p>
            Scanner and portfolio values will be labelled by confidence. Serious slabs, promos, alt arts, and sealed products need fresh
            evidence before public values are treated as sale-ready.
          </p>
        </div>
      </section>
    </VaultRoomShell>
  );
}
