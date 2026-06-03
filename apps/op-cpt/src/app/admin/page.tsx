import { AppFrame } from "@/components/AppFrame";
import { events, groupBuys, trades } from "@/lib/seed-data";

export default function AdminPage() {
  const queues = [
    { label: "Pending beta requests", count: 6, detail: "Approve only known Cape Town members first." },
    { label: "Trade moderation", count: trades.filter((trade) => trade.status === "review").length, detail: "No payment or shipping fields allowed." },
    { label: "Event approvals", count: events.filter((event) => event.status === "open").length, detail: "Confirm venue and capacity before publishing." },
    { label: "Group-buy review", count: groupBuys.filter((buy) => buy.status !== "closed").length, detail: "Interest only until admins confirm rules." }
  ];

  return (
    <AppFrame active="/admin">
      <section className="page-shell">
        <div className="section-heading">
          <p>Moderator shell</p>
          <h1>Admin bridge</h1>
          <span>Seeded queue view for beta access, trade moderation, events, and group-buy controls.</span>
        </div>
        <div className="list-grid">
          {queues.map((queue) => (
            <article className="panel" key={queue.label}>
              <span className="admin-count">{queue.count}</span>
              <h2>{queue.label}</h2>
              <p>{queue.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </AppFrame>
  );
}
