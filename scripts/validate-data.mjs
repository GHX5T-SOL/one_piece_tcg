import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredJson = [
  "data/inventory/cards.json",
  "data/inventory/open-bids.json",
  "data/inventory/valuation.json",
  "data/research/source-ledger.json",
  "data/game/dialogue.json",
  "data/game/quests.json",
  "data/game/manual-entry-schema.json",
  "media/manifest.json"
];

const readJson = (file) => {
  const abs = path.join(root, file);
  return JSON.parse(fs.readFileSync(abs, "utf8"));
};

const fail = (message) => {
  throw new Error(message);
};

const data = Object.fromEntries(requiredJson.map((file) => [file, readJson(file)]));
const cards = data["data/inventory/cards.json"].cards ?? [];
const offers = data["data/inventory/open-bids.json"].offers ?? [];
const valuation = data["data/inventory/valuation.json"];
const sources = data["data/research/source-ledger.json"].sources ?? [];
const dialogue = data["data/game/dialogue.json"].npcs ?? [];
const sourceIds = new Set(sources.map((source) => source.id));

if (cards.length < 8) fail(`Expected at least 8 cards, found ${cards.length}`);
if (offers.length !== 13) fail(`Expected 13 open offers, found ${offers.length}`);
if (valuation.summary.openBidExposureUsd !== 197.5) fail("Open bid exposure must remain 197.50 until the Courtyard snapshot is refreshed.");

const totalOffers = Number(offers.reduce((sum, offer) => sum + Number(offer.offerUsd), 0).toFixed(2));
if (totalOffers !== data["data/inventory/open-bids.json"].summary.totalExposureUsd) {
  fail(`Offer exposure mismatch: rows=${totalOffers}, summary=${data["data/inventory/open-bids.json"].summary.totalExposureUsd}`);
}

for (const card of cards) {
  if (!card.id || !card.title || !card.gradeCompany || !card.grade || !card.status) {
    fail(`Card missing required display fields: ${card.id ?? card.title ?? "unknown"}`);
  }
  if (card.certNumber !== null) {
    fail(`Cert number must remain null unless verified: ${card.id}`);
  }
  for (const sourceId of card.sourceIds ?? []) {
    if (!sourceIds.has(sourceId)) fail(`Unknown source ID on card ${card.id}: ${sourceId}`);
  }
  for (const mediaPath of Object.values(card.media ?? {})) {
    if (typeof mediaPath === "string" && mediaPath.startsWith("media/") && !fs.existsSync(path.join(root, mediaPath))) {
      fail(`Missing media file for ${card.id}: ${mediaPath}`);
    }
    if (typeof mediaPath === "string" && mediaPath.startsWith("assets/") && !fs.existsSync(path.join(root, mediaPath))) {
      fail(`Missing asset file for ${card.id}: ${mediaPath}`);
    }
  }
}

for (const npc of dialogue) {
  for (const sourceId of npc.sourceIds ?? []) {
    if (!sourceIds.has(sourceId)) fail(`Unknown source ID on NPC ${npc.id}: ${sourceId}`);
  }
}

const receipt = {
  generatedAt: new Date().toISOString(),
  status: "pass",
  filesChecked: requiredJson.length,
  cards: cards.length,
  offers: offers.length,
  offerExposureUsd: totalOffers,
  sourceCount: sources.length,
  npcCount: dialogue.length
};

fs.mkdirSync(path.join(root, "docs/qa"), { recursive: true });
fs.writeFileSync(path.join(root, "docs/qa/data-validation.json"), `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));
