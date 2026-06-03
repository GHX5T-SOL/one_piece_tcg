import { priceTrends, sources } from "./seed-data";

export type PriceSyncResult = {
  mode: "seeded" | "pricecharting-ready";
  retrievedAt: string;
  trends: typeof priceTrends;
  notes: string[];
};

export function getPriceSyncPlan(): PriceSyncResult {
  const hasPriceCharting = Boolean(process.env.PRICECHARTING_API_KEY);

  return {
    mode: hasPriceCharting ? "pricecharting-ready" : "seeded",
    retrievedAt: new Date().toISOString(),
    trends: priceTrends,
    notes: [
      hasPriceCharting
        ? "PRICECHARTING_API_KEY is configured; production sync can call PriceCharting server-side."
        : "PRICECHARTING_API_KEY is not configured; returning seeded manual snapshots.",
      "eBay, Cardmarket, TCGplayer, Limitless, and OPTCG.GG are treated as source-backed references unless approved API access is configured.",
      `Source ledger includes ${sources.length} research anchors.`
    ]
  };
}
