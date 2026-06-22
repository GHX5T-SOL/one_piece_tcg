"use client";

import { Camera, LibraryBig, Plus, Search, ShieldCheck } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { CardGrid } from "@/components/CardGrid";
import { searchCards, summarizeCollection } from "@/lib/search";

type DraftCard = {
  name: string;
  cardNumber: string;
  setName: string;
  condition: string;
  privacy: "public" | "members" | "private";
};

const storageKey = "the-vault-room.collection-draft";

const emptyDraft: DraftCard = {
  name: "",
  cardNumber: "",
  setName: "",
  condition: "Mint candidate",
  privacy: "private"
};

export function CollectionWorkbench() {
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<DraftCard>(emptyDraft);
  const [savedDrafts, setSavedDrafts] = useState<DraftCard[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const parsed = JSON.parse(window.localStorage.getItem(storageKey) || "[]") as DraftCard[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const summary = summarizeCollection();

  const cards = useMemo(() => searchCards(query), [query]);

  function saveDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleaned = {
      ...draft,
      name: draft.name.trim(),
      cardNumber: draft.cardNumber.trim().toUpperCase(),
      setName: draft.setName.trim()
    };
    if (!cleaned.name || !cleaned.cardNumber) return;
    const next = [cleaned, ...savedDrafts].slice(0, 12);
    setSavedDrafts(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
    setDraft(emptyDraft);
  }

  return (
    <div className="beta-workbench">
      <section className="metric-strip" aria-label="Collection summary">
        <article>
          <strong>{summary.uniqueCards}</strong>
          <span>tracked identities</span>
        </article>
        <article>
          <strong>{summary.totalCards}</strong>
          <span>total quantity</span>
        </article>
        <article>
          <strong>{summary.graded}</strong>
          <span>graded slabs</span>
        </article>
        <article>
          <strong>{summary.promoOrAlt}</strong>
          <span>promo / alt / scarce</span>
        </article>
      </section>

      <section className="tool-grid" id="scanner">
        <article className="tool-panel tool-panel--wide">
          <div className="tool-panel__head">
            <span>
              <LibraryBig aria-hidden size={18} />
              Portfolio search
            </span>
            <em>Seeded snapshot + local drafts</em>
          </div>
          <label className="search-box search-box--full">
            <Search aria-hidden size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, set, card number, rarity..." />
          </label>
          <CardGrid cards={cards.slice(0, 18)} />
        </article>

        <article className="tool-panel">
          <div className="tool-panel__head">
            <span>
              <Camera aria-hidden size={18} />
              Scanner beta
            </span>
            <em>Manual-assisted</em>
          </div>
          <p>
            Camera recognition will stay human-verified. For now, use the scan lane to capture a card number, then confirm variant, language,
            grade, and price before adding it to a public portfolio.
          </p>
          <div className="workflow-list">
            <span>1. Photograph front/back</span>
            <span>2. Confirm exact variant</span>
            <span>3. Apply pricing protocol</span>
            <span>4. Choose public or private visibility</span>
          </div>
        </article>

        <article className="tool-panel">
          <div className="tool-panel__head">
            <span>
              <Plus aria-hidden size={18} />
              Manual add
            </span>
            <em>Local draft</em>
          </div>
          <form className="vault-form" onSubmit={saveDraft}>
            <label>
              Card name
              <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Monkey.D.Luffy" />
            </label>
            <label>
              Card number
              <input value={draft.cardNumber} onChange={(event) => setDraft({ ...draft, cardNumber: event.target.value })} placeholder="ST13-003" />
            </label>
            <label>
              Set / product
              <input value={draft.setName} onChange={(event) => setDraft({ ...draft, setName: event.target.value })} placeholder="One Piece Promotion Cards" />
            </label>
            <label>
              Visibility
              <select value={draft.privacy} onChange={(event) => setDraft({ ...draft, privacy: event.target.value as DraftCard["privacy"] })}>
                <option value="private">Private</option>
                <option value="members">Members only</option>
                <option value="public">Public showcase</option>
              </select>
            </label>
            <button className="primary-action" type="submit">
              <Plus aria-hidden size={17} />
              Save draft
            </button>
          </form>
        </article>
      </section>

      {savedDrafts.length > 0 && (
        <section className="vault-list-panel">
          <div className="section-title-row">
            <div>
              <h2>Local draft cards</h2>
              <p>Saved in this browser only until member accounts are connected.</p>
            </div>
          </div>
          <div className="compact-list">
            {savedDrafts.map((item, index) => (
              <div key={`${item.cardNumber}-${index}`}>
                <strong>{item.cardNumber}</strong>
                <span>{item.name}</span>
                <em>{item.privacy}</em>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="public-note-panel">
        <ShieldCheck aria-hidden size={28} />
        <div>
          <h2>Pricing protocol guardrail</h2>
          <p>
            Public portfolio values will use The Vault Room pricing protocol, live comps where needed, and confidence labels. Scanner matches
            are never treated as final until a human verifies exact card identity.
          </p>
        </div>
      </section>
    </div>
  );
}
