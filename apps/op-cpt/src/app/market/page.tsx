import Link from "next/link";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  ExternalLink,
  Gauge,
  Newspaper,
  Radar,
  ShieldCheck,
  TrendingDown,
  TrendingUp
} from "lucide-react";
import { VaultRoomShell } from "@/components/VaultRoomShell";
import { allProducts, formatZar, grailProducts, productStats } from "@/lib/products";
import { news, priceTrends, sources } from "@/lib/seed-data";

export const metadata = {
  title: "Market Watch | The Vault Room",
  description: "Watchlists, price signals, and source-backed market notes for The Vault Room."
};

export default function MarketPage() {
  const stats = productStats();
  const sourceLinks = sources.filter((source) => ["market", "official", "competitive"].includes(source.category)).slice(0, 8);
  const sealedValue = allProducts
    .filter((product) => product.productType === "Sealed")
    .reduce((sum, product) => sum + product.priceZar * Math.max(product.stock, 0), 0);
  const gradedValue = allProducts
    .filter((product) => product.productType === "Graded")
    .reduce((sum, product) => sum + product.priceZar * Math.max(product.stock, 0), 0);
  const highestAsk = allProducts.reduce((max, product) => Math.max(max, product.priceZar), 0);
  const movers = [
    ...priceTrends.map((trend) => ({
      label: trend.label,
      delta: trend.delta,
      source: trend.source,
      confidence: trend.confidence,
      values: trend.delta >= 0 ? [34, 38, 37, 42, 48, 52, 58] : [48, 46, 44, 43, 39, 41, 36]
    })),
    { label: "OP-16 sealed release watch", delta: 18.2, source: "official release/event signal", confidence: "watch", values: [22, 24, 31, 37, 45, 52, 64] },
    { label: "Bulk raw binder liquidity", delta: -4.8, source: "show-table demand estimate", confidence: "low", values: [41, 42, 39, 37, 35, 34, 33] }
  ];
  const gainers = movers.filter((trend) => trend.delta >= 0).slice(0, 5);
  const losers = movers.filter((trend) => trend.delta < 0).slice(0, 4);
  const terminalSeries = [22, 28, 25, 34, 40, 38, 52, 48, 61, 58, 72, 78];

  return (
    <VaultRoomShell>
      <section className="page-hero market-terminal-hero">
        <div>
          <span>Grand Line market terminal · beta</span>
          <h1>Market watch</h1>
          <p>
            Anime trading-desk view for grails, sealed product, movers, release signals, and manual valuation work. The terminal is designed
            for show-floor decisions, but serious prices still need source-backed review before quoting.
          </p>
        </div>
        <div className="market-terminal-status" aria-label="Market terminal status">
          <b>Vault Index</b>
          <strong>{formatZar(stats.totalValue)}</strong>
          <span>Catalogue exposure · manual review mode</span>
        </div>
      </section>

      <section className="market-terminal-grid">
        <article className="market-index-card market-index-card--primary">
          <div>
            <span>Catalogue value</span>
            <strong>{formatZar(stats.totalValue)}</strong>
            <em>{stats.products} items tracked</em>
          </div>
          <Sparkline values={terminalSeries} tone="gold" />
        </article>
        <article className="market-index-card">
          <div>
            <span>Graded slabs</span>
            <strong>{formatZar(gradedValue)}</strong>
            <em>PSA · CGC · BGS anchors</em>
          </div>
          <Sparkline values={[28, 34, 36, 41, 46, 54, 59]} tone="sky" />
        </article>
        <article className="market-index-card">
          <div>
            <span>Sealed stock</span>
            <strong>{formatZar(sealedValue)}</strong>
            <em>Boxes · packs · decks</em>
          </div>
          <Sparkline values={[25, 29, 33, 32, 40, 51, 63]} tone="coral" />
        </article>
        <article className="market-index-card">
          <div>
            <span>Highest ask</span>
            <strong>{formatZar(highestAsk)}</strong>
            <em>Show anchor ceiling</em>
          </div>
          <Sparkline values={[18, 23, 31, 35, 50, 57, 70]} tone="gold" />
        </article>
      </section>

      <section className="market-command-center">
        <article className="terminal-chart-panel">
          <div className="tool-panel__head">
            <span>
              <Activity aria-hidden size={18} />
              Vault momentum chart
            </span>
            <em>Scenario signal, not live feed</em>
          </div>
          <div className="terminal-chart">
            <Sparkline values={terminalSeries} tone="gold" large />
            <div className="terminal-chart__grid" aria-hidden />
            <div className="terminal-chart__callout">
              <ArrowUpRight aria-hidden size={16} />
              Show premium active
            </div>
          </div>
          <div className="terminal-meter-row">
            <SignalMeter label="Grail demand" value={86} />
            <SignalMeter label="Local scarcity" value={78} />
            <SignalMeter label="Comp confidence" value={54} />
          </div>
        </article>

        <article className="terminal-feed-panel">
          <div className="tool-panel__head">
            <span>
              <Newspaper aria-hidden size={18} />
              Release radar
            </span>
            <em>Official-source watch</em>
          </div>
          <div className="market-news-feed">
            {news.map((item) => (
              <div key={item.id}>
                <time dateTime={item.date}>{item.date}</time>
                <strong>{item.title}</strong>
                <span>{item.summary}</span>
                <em>{item.cta}</em>
              </div>
            ))}
          </div>
        </article>
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
              Top gainers
            </span>
            <em>Manual snapshot</em>
          </div>
          <div className="signal-list">
            {gainers.map((trend) => (
              <div key={trend.label}>
                <span>{trend.label}</span>
                <strong className="trend-up">
                  <ArrowUpRight aria-hidden size={14} />
                  +{trend.delta}%
                </strong>
                <em>{trend.confidence} confidence</em>
              </div>
            ))}
          </div>
        </article>

        <article className="tool-panel">
          <div className="tool-panel__head">
            <span>
              <TrendingDown aria-hidden size={18} />
              Watch / pullbacks
            </span>
            <em>Do not panic sell</em>
          </div>
          <div className="signal-list">
            {losers.map((trend) => (
              <div key={trend.label}>
                <span>{trend.label}</span>
                <strong className="trend-down">
                  <ArrowDownRight aria-hidden size={14} />
                  {trend.delta}%
                </strong>
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

        <article className="tool-panel">
          <div className="tool-panel__head">
            <span>
              <Gauge aria-hidden size={18} />
              Pricing cockpit
            </span>
            <em>Human-reviewed</em>
          </div>
          <div className="workflow-list">
            <span>Floor protects the table. Mid is patient local. High ask is the show anchor.</span>
            <span>Promos, manga-style hits, low-pop slabs and sealed scarcity get manual premiums.</span>
            <span>Every quote needs exact card number, language, condition, active supply and comp notes.</span>
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

function Sparkline({ values, tone, large = false }: { values: number[]; tone: "gold" | "sky" | "coral"; large?: boolean }) {
  const width = large ? 680 : 260;
  const height = large ? 260 : 92;
  const gradientId = `spark-${tone}-${large ? "large" : "mini"}-${values.length}-${values[0]}-${values[values.length - 1]}`;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - min) / range) * (height * 0.72) - height * 0.14;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg className={`sparkline sparkline--${tone}${large ? " sparkline--large" : ""}`} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="44%" stopColor="currentColor" stopOpacity="0.82" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
        </linearGradient>
      </defs>
      <polyline fill="none" points={points} stroke={`url(#${gradientId})`} strokeLinecap="round" strokeLinejoin="round" strokeWidth={large ? 5 : 3} />
      {values.map((value, index) => {
        const x = (index / Math.max(values.length - 1, 1)) * width;
        const y = height - ((value - min) / range) * (height * 0.72) - height * 0.14;
        return <circle cx={x} cy={y} fill="currentColor" key={`${value}-${index}`} r={large ? 4 : 2.4} />;
      })}
    </svg>
  );
}

function SignalMeter({ label, value }: { label: string; value: number }) {
  return (
    <div className="signal-meter">
      <span>{label}</span>
      <strong>{value}%</strong>
      <b style={{ width: `${value}%` }} />
    </div>
  );
}
