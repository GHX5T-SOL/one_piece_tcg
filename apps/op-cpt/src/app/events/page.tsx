import Link from "next/link";
import { CalendarDays, MapPin, Trophy } from "lucide-react";
import { VaultRoomShell } from "@/components/VaultRoomShell";

const events = [
  {
    title: "Cape Town Collect-a-Con",
    venue: "Protea Fire & Ice! Cape Town",
    date: "Saturday, 4 July 2026",
    time: "10:00 AM",
    detail: "Free entrance show with The Vault Room table, pack rips, trades, slabs, sealed stock, buy-ins, community prizes and signups."
  },
  {
    title: "Reload Trade & Play recap",
    venue: "Lagoon Beach Hotel",
    date: "27 June 2026",
    time: "Completed",
    detail: "Our first smaller show table was a successful community introduction and a useful dry run for bigger events."
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
