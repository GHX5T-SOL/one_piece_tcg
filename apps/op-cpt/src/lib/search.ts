import { cards } from "./seed-data";

export function searchCards(query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return cards.slice(0, 12);
  }

  return cards.filter((card) => {
    const haystack = [
      card.title,
      card.character,
      card.setName,
      card.cardNumber,
      card.rarity,
      card.variant,
      card.tags.join(" ")
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

export function summarizeCollection() {
  const graded = cards.filter((card) => card.gradeCompany !== "RAW" && card.gradeCompany !== "SEALED").length;
  const sealed = cards.filter((card) => card.gradeCompany === "SEALED").reduce((sum, card) => sum + card.quantity, 0);
  const promoOrAlt = cards.filter((card) => /promo|alt|parallel|anniversary|pre-release/i.test(`${card.rarity} ${card.variant}`)).length;
  const coreCharacters = new Set(cards.map((card) => card.character)).size;

  return {
    totalCards: cards.reduce((sum, card) => sum + card.quantity, 0),
    uniqueCards: cards.length,
    graded,
    sealed,
    promoOrAlt,
    coreCharacters
  };
}
