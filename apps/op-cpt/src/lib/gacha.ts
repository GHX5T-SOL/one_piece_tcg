import { allProducts, type Product } from "@/lib/products";

export type GachaTier = "grail" | "slab" | "sealed" | "single" | "booster";

export type GachaPrize = Product & {
  gachaTier: GachaTier;
  buybackZar: number;
};

export type GachaPack = {
  id: string;
  name: string;
  tagline: string;
  priceZar: number;
  estimatedValueZar: number;
  pullRate: string;
  headline: string;
  odds: Array<{
    tier: GachaTier;
    label: string;
    chance: number;
    description: string;
  }>;
  featuredPrizeIds: string[];
};

const prizePoolIds = [
  "TVR-CAT-0001",
  "TVR-CAT-0002",
  "TVR-CAT-0274",
  "TVR-CAT-0005",
  "TVR-CAT-0007",
  "TVR-CAT-0010",
  "TVR-CAT-0011",
  "TVR-CAT-0278",
  "TVR-CAT-0017",
  "TVR-CAT-0022",
  "TVR-CAT-0026",
  "TVR-CAT-0324",
  "TVR-CAT-0018",
  "TVR-CAT-0286",
  "TVR-CAT-0322",
  "TVR-CAT-0323",
  "TVR-CAT-0325",
  "TVR-CAT-0326"
];

const prizePoolIdSet = new Set(prizePoolIds);

function tierForProduct(product: Product): GachaTier {
  if (product.priceZar >= 7500) return "grail";
  if (product.productType === "Graded") return "slab";
  if (product.productType === "Sealed") return product.priceZar <= 250 ? "booster" : "sealed";
  if (product.visualKind === "pokemon-pack") return "booster";
  return "single";
}

export const gachaPrizes: GachaPrize[] = allProducts
  .filter((product) => prizePoolIdSet.has(product.id) && product.stock > 0 && product.productType !== "Service")
  .map((product) => ({
    ...product,
    gachaTier: tierForProduct(product),
    buybackZar: Math.round(product.priceZar * 0.7)
  }))
  .sort((a, b) => b.priceZar - a.priceZar);

export const gachaPacks: GachaPack[] = [
  {
    id: "east-blue",
    name: "East Blue Demo Pack",
    tagline: "Entry rip with boosters, singles and a small slab chase.",
    priceZar: 150,
    estimatedValueZar: 188,
    pullRate: "100% visual demo pull",
    headline: "Start small, still chase real Vault Room stock.",
    odds: [
      { tier: "booster", label: "Booster / pack line", chance: 52, description: "Lower-cost sealed pack or event-table item." },
      { tier: "single", label: "Raw single", chance: 31, description: "Mint candidate singles from the catalogue pool." },
      { tier: "sealed", label: "Sealed product", chance: 12, description: "Decks, double packs or compact sealed stock." },
      { tier: "slab", label: "Graded slab", chance: 4.5, description: "PSA, CGC or BGS graded display hit." },
      { tier: "grail", label: "Grail", chance: 0.5, description: "High-ticket chase item shown in the top-hit board." }
    ],
    featuredPrizeIds: ["TVR-CAT-0322", "TVR-CAT-0323", "TVR-CAT-0286", "TVR-CAT-0022"]
  },
  {
    id: "grand-line",
    name: "Grand Line Slab Pack",
    tagline: "Higher-volatility pack for slabs, sealed boxes and alt-art singles.",
    priceZar: 450,
    estimatedValueZar: 612,
    pullRate: "100% visual demo pull",
    headline: "Built for collectors who want real hits, not filler.",
    odds: [
      { tier: "booster", label: "Booster / pack line", chance: 30, description: "Pack-stock baseline with redeem or 70% sell-back." },
      { tier: "single", label: "Raw single", chance: 33, description: "Alt arts, promos and mint candidate singles." },
      { tier: "sealed", label: "Sealed product", chance: 22, description: "Decks, Japanese booster boxes and sealed specials." },
      { tier: "slab", label: "Graded slab", chance: 13, description: "Featured Courtyard-owned slabs and PSA/CGC/BGS stock." },
      { tier: "grail", label: "Grail", chance: 2, description: "Top shelf Vault Room chase prize." }
    ],
    featuredPrizeIds: ["TVR-CAT-0010", "TVR-CAT-0011", "TVR-CAT-0278", "TVR-CAT-0324"]
  },
  {
    id: "vault-grail",
    name: "Vault Grail Pack",
    tagline: "Showpiece demo for grail slabs, serious sealed and premium singles.",
    priceZar: 1200,
    estimatedValueZar: 1680,
    pullRate: "100% visual demo pull",
    headline: "The dramatic top-hit experience we will wire after rules/payment approval.",
    odds: [
      { tier: "booster", label: "Booster / pack line", chance: 12, description: "Visible baseline prize, never a blank reveal." },
      { tier: "single", label: "Raw premium single", chance: 28, description: "Higher-ticket raw cards and promos." },
      { tier: "sealed", label: "Sealed product", chance: 26, description: "Booster boxes, decks and sealed display stock." },
      { tier: "slab", label: "Graded slab", chance: 26, description: "PSA 10, CGC 10, BGS 10 style hits." },
      { tier: "grail", label: "Grail", chance: 8, description: "Highest-value prize band in the demo pool." }
    ],
    featuredPrizeIds: ["TVR-CAT-0001", "TVR-CAT-0002", "TVR-CAT-0274", "TVR-CAT-0007"]
  }
];

export function getGachaPrizeById(productId: string) {
  return gachaPrizes.find((product) => product.id === productId);
}

export function prizesForPack(pack: GachaPack) {
  const featured = pack.featuredPrizeIds.map(getGachaPrizeById).filter((product): product is GachaPrize => Boolean(product));
  return featured.length ? featured : gachaPrizes.slice(0, 4);
}
