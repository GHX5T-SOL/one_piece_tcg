import Link from "next/link";
import { AppFrame } from "@/components/AppFrame";
import { HarborScene } from "@/components/HarborScene";
import { StatPanel } from "@/components/StatPanel";
import { brand, events, groupBuys, priceTrends, rankings, trades } from "@/lib/seed-data";
import { summarizeCollection } from "@/lib/search";

export default function HarborPage() {
  const summary = summarizeCollection();

  return (
    <AppFrame active="/app">
      <section className="portal-layout">
        <div className="portal-layout__main">
          <div className="section-heading">
            <p>Member-beta harbor</p>
            <h1>{brand.name}</h1>
            <span>{brand.tagline}</span>
          </div>
          <HarborScene />
        </div>

        <aside className="live-stack">
          <article className="panel">
            <header>
              <h2>Live activity</h2>
              <Link href="/news">View all</Link>
            </header>
            <ul className="activity-list">
              <li>Ghost23 added {summary.totalCards} seeded collection items.</li>
              <li>{trades[0].fromHandle} opened a manga/alt-art upgrade offer.</li>
              <li>{events[0].title} has {events[0].attending} members going.</li>
              <li>{groupBuys[0].title} has {groupBuys[0].interestCount} interested.</li>
            </ul>
          </article>

          <article className="panel">
            <header>
              <h2>Price trends</h2>
              <Link href="/market">Market</Link>
            </header>
            <div className="trend-list">
              {priceTrends.map((trend) => (
                <div className="trend-row" key={trend.label}>
                  <span>{trend.label}</span>
                  <strong className={trend.delta >= 0 ? "positive" : "negative"}>{trend.delta >= 0 ? "+" : ""}{trend.delta}%</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <header>
              <h2>Rankings preview</h2>
              <Link href="/rankings">Leaderboard</Link>
            </header>
            <ol className="ranking-list">
              {rankings.slice(0, 5).map((row) => (
                <li key={row.handle}>
                  <span>{row.rank}</span>
                  <b>{row.handle}</b>
                  <em>{row.battlePoints} pts</em>
                </li>
              ))}
            </ol>
          </article>
        </aside>
      </section>

      <section className="dashboard-strip">
        <StatPanel detail="Manual/import MVP" label="Scanner" value="Ready" />
        <StatPanel detail="No payment fields" label="Trades" value={String(trades.length)} />
        <StatPanel detail="Official source-backed" label="News" value="OP-16" />
        <StatPanel detail="Admin reviewed" label="Group buys" value={String(groupBuys.length)} />
      </section>
    </AppFrame>
  );
}
