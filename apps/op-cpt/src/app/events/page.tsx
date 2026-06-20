import Link from "next/link";
import { CalendarDays, MapPin, Trophy } from "lucide-react";
import { VaultRoomShell } from "@/components/VaultRoomShell";

const events = [
  {
    title: "Reload Trade & Play",
    venue: "Lagoon Beach Hotel",
    date: "27 June 2026",
    time: "10AM - 5PM",
    detail: "TCG show table, live catalogue, trades, grail hunting, pack talk and community signups."
  },
  {
    title: "Vault Room Trade Night",
    venue: "Cape Town venue TBC",
    date: "July 2026",
    time: "Evening",
    detail: "Casual battles, binder checks, price checks, grading intake and safe-trade meetups."
  }
];

export default function EventsPage() {
  return (
    <VaultRoomShell>
      <section className="page-hero">
        <span>Events & meetups</span>
        <h1>Where grails leave the binder</h1>
        <p>Show days, trade nights, tournaments, pack rips and community meetups around Cape Town.</p>
      </section>
      <section className="event-list">
        {events.map((event) => (
          <article className="event-list-card" key={event.title}>
            <CalendarDays aria-hidden size={26} />
            <div>
              <span>{event.date}</span>
              <h2>{event.title}</h2>
              <p>
                <MapPin aria-hidden size={16} />
                {event.venue} · {event.time}
              </p>
              <em>{event.detail}</em>
            </div>
            <Link href="https://chat.whatsapp.com/LgAy8Q0NgVp9NcU7oJXBDy">
              <Trophy aria-hidden size={17} />
              RSVP
            </Link>
          </article>
        ))}
      </section>
    </VaultRoomShell>
  );
}
