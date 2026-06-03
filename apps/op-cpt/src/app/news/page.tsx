import { AppFrame } from "@/components/AppFrame";
import { news, sources } from "@/lib/seed-data";

export default function NewsPage() {
  return (
    <AppFrame active="/news">
      <section className="page-shell">
        <div className="section-heading">
          <p>Release calendar and source ledger</p>
          <h1>News & lore watch</h1>
          <span>Official release signals, rules updates, competitive references, and local notes.</span>
        </div>
        <div className="list-grid">
          {news.map((item) => {
            const source = sources.find((entry) => entry.id === item.sourceId);
            return (
              <article className="panel panel--large" key={item.id}>
                <header>
                  <h2>{item.title}</h2>
                  <span>{item.date}</span>
                </header>
                <p>{item.summary}</p>
                {source && <a href={source.url}>{item.cta} · {source.title}</a>}
              </article>
            );
          })}
        </div>
        <article className="panel panel--wide">
          <h2>Source ledger</h2>
          <ul className="source-list">
            {sources.map((source) => (
              <li key={source.id}>
                <a href={source.url}>{source.title}</a> · {source.category} · retrieved {source.retrievedAt}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </AppFrame>
  );
}
