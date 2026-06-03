import { AppFrame } from "@/components/AppFrame";
import { priceTrends, sources } from "@/lib/seed-data";

export default function MarketPage() {
  return (
    <AppFrame active="/market">
      <section className="page-shell">
        <div className="section-heading">
          <p>Source-backed watch desk</p>
          <h1>Market harbor</h1>
          <span>Seeded snapshots only until approved server-side API keys are configured.</span>
        </div>
        <div className="list-grid">
          {priceTrends.map((trend) => (
            <article className="market-card" key={trend.label}>
              <span>{trend.source}</span>
              <h2>{trend.label}</h2>
              <strong className={trend.delta >= 0 ? "positive" : "negative"}>{trend.delta >= 0 ? "+" : ""}{trend.delta}%</strong>
              <p>Confidence: {trend.confidence}</p>
            </article>
          ))}
        </div>
        <article className="panel panel--wide">
          <h2>Pricing integration plan</h2>
          <p>
            PriceCharting can be used when `PRICECHARTING_API_KEY` is configured. eBay, TCGplayer, Cardmarket, Limitless, and OPTCG.GG
            remain curated reference sources unless an approved API integration is available.
          </p>
          <ul className="source-list">
            {sources.filter((source) => source.category === "market" || source.category === "competitive").map((source) => (
              <li key={source.id}><a href={source.url}>{source.title}</a> · {source.notes}</li>
            ))}
          </ul>
        </article>
      </section>
    </AppFrame>
  );
}
