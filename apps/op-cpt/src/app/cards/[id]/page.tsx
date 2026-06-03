import Link from "next/link";
import { notFound } from "next/navigation";
import { AppFrame } from "@/components/AppFrame";
import { cards, findCard } from "@/lib/seed-data";

export function generateStaticParams() {
  return cards.map((card) => ({ id: card.id }));
}

export default function CardDetailPage({ params }: { params: { id: string } }) {
  const card = findCard(params.id);

  if (!card) {
    notFound();
  }

  return (
    <AppFrame active="/collection">
      <section className="detail-layout">
        <div className="detail-slab">
          <div className="detail-slab__label">
            <span>{card.gradeCompany}</span>
            <strong>{card.grade || "RAW / SEALED"}</strong>
          </div>
          <div className="detail-slab__art">
            <b>{card.character}</b>
            <em>{card.cardNumber}</em>
          </div>
        </div>
        <article className="detail-panel">
          <Link href="/collection">Back to collection</Link>
          <p>{card.setName}</p>
          <h1>{card.title}</h1>
          <dl>
            <div><dt>Character</dt><dd>{card.character}</dd></div>
            <div><dt>Card number</dt><dd>{card.cardNumber}</dd></div>
            <div><dt>Variant</dt><dd>{card.variant}</dd></div>
            <div><dt>Language</dt><dd>{card.language}</dd></div>
            <div><dt>Grade</dt><dd>{card.gradeCompany} {card.grade || ""}</dd></div>
            <div><dt>Cert</dt><dd>{card.certNumber || "Not verified / not applicable"}</dd></div>
            <div><dt>Status</dt><dd>{card.status}</dd></div>
            <div><dt>Privacy</dt><dd>{card.privacy}</dd></div>
          </dl>
          <h2>Strategy note</h2>
          <p>{card.notes}</p>
          <h2>Source</h2>
          <p>{card.source}</p>
        </article>
      </section>
    </AppFrame>
  );
}
