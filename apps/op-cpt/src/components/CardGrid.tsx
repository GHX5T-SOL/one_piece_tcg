import Link from "next/link";
import type { CardRecord } from "@/lib/types";

export function CardGrid({ cards }: { cards: CardRecord[] }) {
  return (
    <div className="card-grid">
      {cards.map((card) => (
        <Link className="collection-card" href={`/cards/${card.id}`} key={card.id}>
          <div className="slab-mini" aria-hidden>
            <span>{card.gradeCompany}</span>
            <strong>{card.grade || "RAW"}</strong>
          </div>
          <div>
            <p>{card.character}</p>
            <h3>{card.title}</h3>
            <span>
              {card.setName} · {card.cardNumber}
            </span>
          </div>
          <footer>
            <b>{card.variant}</b>
            <em>{card.quantity}x</em>
          </footer>
        </Link>
      ))}
    </div>
  );
}
