import { AppFrame } from "@/components/AppFrame";
import { trades } from "@/lib/seed-data";

export default function TradesPage() {
  return (
    <AppFrame active="/trades">
      <section className="page-shell">
        <div className="section-heading">
          <p>Member-only offer board</p>
          <h1>Trades & interest offers</h1>
          <span>No payments, checkout, escrow, shipping, or wallet fields. This is coordination only.</span>
        </div>
        <div className="list-grid">
          {trades.map((trade) => (
            <article className="panel panel--large" key={trade.id}>
              <header>
                <h2>{trade.fromHandle}</h2>
                <span className={`status-chip status-chip--${trade.status}`}>{trade.status}</span>
              </header>
              <dl className="offer-dl">
                <div><dt>Seeking</dt><dd>{trade.seeking}</dd></div>
                <div><dt>Offering</dt><dd>{trade.offering}</dd></div>
                <div><dt>Expires</dt><dd>{trade.expiresIn}</dd></div>
              </dl>
              <p>{trade.notes}</p>
            </article>
          ))}
        </div>
      </section>
    </AppFrame>
  );
}
