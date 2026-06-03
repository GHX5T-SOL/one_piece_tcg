import { AppFrame } from "@/components/AppFrame";
import { events } from "@/lib/seed-data";

export default function EventsPage() {
  return (
    <AppFrame active="/events">
      <section className="page-shell">
        <div className="section-heading">
          <p>Game nights and release watch</p>
          <h1>Events</h1>
          <span>Battle, trade, rip packs, and coordinate local release windows.</span>
        </div>
        <div className="list-grid">
          {events.map((event) => (
            <article className="event-card" key={event.id}>
              <div className="calendar-tile">
                <span>{new Date(event.date).toLocaleString("en-ZA", { month: "short" })}</span>
                <strong>{new Date(event.date).getDate()}</strong>
              </div>
              <div>
                <span className={`status-chip status-chip--${event.status}`}>{event.status}</span>
                <h2>{event.title}</h2>
                <p>{event.venue}</p>
                <p>{event.format}</p>
                <footer>{event.attending}/{event.capacity} going · {event.notes}</footer>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppFrame>
  );
}
