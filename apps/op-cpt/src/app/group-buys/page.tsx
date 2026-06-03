import { AppFrame } from "@/components/AppFrame";
import { groupBuys } from "@/lib/seed-data";

export default function GroupBuysPage() {
  return (
    <AppFrame active="/group-buys">
      <section className="page-shell">
        <div className="section-heading">
          <p>Admin-reviewed coordination</p>
          <h1>Group buys & grading</h1>
          <span>Interest tracking only. Payment, ordering, and shipping decisions stay outside the app.</span>
        </div>
        <div className="list-grid">
          {groupBuys.map((buy) => (
            <article className="panel panel--large" key={buy.id}>
              <header>
                <h2>{buy.title}</h2>
                <span className={`status-chip status-chip--${buy.status}`}>{buy.status}</span>
              </header>
              <p>{buy.target}</p>
              <strong>{buy.interestCount} interested</strong>
              <p>{buy.notes}</p>
            </article>
          ))}
        </div>
      </section>
    </AppFrame>
  );
}
