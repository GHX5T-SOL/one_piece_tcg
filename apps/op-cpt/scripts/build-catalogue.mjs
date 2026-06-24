import fsSync from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(process.cwd(), "../..");
const appRoot = process.cwd();
const sourceRelativePath = "show_pricing/2026-06-24-stock-for-show/data/stock_for_show_pricing_master.csv";
const sourcePath = path.join(root, sourceRelativePath);
const outPath = path.join(appRoot, "src/data/products.json");
const manifestPath = path.join(appRoot, "src/data/catalogue-manifest.json");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && quoted && next === '"') {
      field += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(field);
      field = "";
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }

  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  const [header, ...body] = rows;
  return body.map((cells) => Object.fromEntries(header.map((key, index) => [key, cells[index] ?? ""])));
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 100);
}

function asInt(value, fallback = 0) {
  const parsed = Number.parseInt(String(value || "").replace(/[^0-9-]/g, ""), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function money(value) {
  const parsed = Number(String(value || "0").replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? Math.round(parsed) : 0;
}

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function normalizeUniverse(category) {
  if (/yu.?gi.?oh/i.test(category)) return "Yu-Gi-Oh";
  if (/pokemon/i.test(category)) return "Pokemon";
  return "One Piece";
}

function normalizeLanguage(language) {
  const value = clean(language);
  if (/japanese/i.test(value)) return "Japanese";
  if (/english/i.test(value)) return "English";
  if (/mixed/i.test(value)) return "Mixed";
  return value || "Unknown";
}

function productType(row) {
  const type = clean(row.product_type);
  const nameSet = `${row.product_name} ${row.set_name} ${row.rarity} ${row.flags}`.toLowerCase();
  if (/graded/i.test(type) || /\b(psa|cgc|bgs)\b/i.test(row.grade)) return "Graded";
  if (/sealed|product/i.test(type) || /booster box|booster pack|starter deck|ultra deck|deck set|card collection|double pack/i.test(nameSet)) {
    return "Sealed";
  }
  if (/sp|alternate|alt art|parallel|manga|promo|event|anniversary|starlight|leader/i.test(nameSet)) return "Premium Single";
  return "Single";
}

function visualKind(type, universe) {
  if (type === "Graded") return "slab";
  if (type === "Sealed" && universe === "Pokemon") return "pokemon-pack";
  if (type === "Sealed") return "sealed";
  if (type === "Service") return "service";
  return "card";
}

function displayCategory(row, type) {
  if (type === "Graded") return "Graded Slabs";
  if (type === "Sealed") return "Sealed Products";
  if (type === "Premium Single") return "Premium Singles";
  return clean(row.category) === "Pokemon" ? "Pokemon Singles" : clean(row.category) === "YuGiOh" ? "Yu-Gi-Oh Singles" : "Binder Singles";
}

function publicDescription(row, type, universe, language) {
  const parts = [];
  const setName = clean(row.set_name);
  const cardNumber = clean(row.card_number);
  const rarity = clean(row.rarity);
  const variant = clean(row.variance);
  const grade = clean(row.grade);
  const condition = clean(row.condition) || (type === "Sealed" ? "Sealed" : "Near Mint");

  if (setName) parts.push(setName);
  if (cardNumber) parts.push(cardNumber);
  if (rarity) parts.push(`${rarity} rarity`);
  if (variant && !/^normal$/i.test(variant)) parts.push(variant);
  if (language && language !== "Unknown") parts.push(language);
  if (type === "Graded" && grade) parts.push(grade);
  if (type === "Sealed") parts.push("sealed product");
  if (type !== "Sealed") parts.push(condition);
  if (universe === "Pokemon") parts.push("Pokemon stock");
  return `${parts.join(" • ")}. Availability and final condition are confirmed before invoice or handover.`;
}

function makeProduct(row) {
  const rank = asInt(row.rank, 0);
  const sku = `TVR-CAT-${String(rank || asInt(row.row_id, 0)).padStart(4, "0")}`;
  const name = clean(row.product_name) || sku;
  const universe = normalizeUniverse(row.category);
  const type = productType(row);
  const category = displayCategory(row, type);
  const setName = clean(row.set_name);
  const cardNumber = clean(row.card_number);
  const rarity = clean(row.rarity);
  const variant = clean(row.variance);
  const language = normalizeLanguage(row.language);
  const condition = clean(row.condition) || (type === "Sealed" ? "Sealed" : "Near Mint");
  const grade = clean(row.grade).replace(/^Ungraded$/i, "");
  const priceZar = money(row.list_price_zar);
  const stock = Math.max(0, asInt(row.quantity, 0));
  const confidence = clean(row.confidence);
  const researchStatus = clean(row.research_status);
  const baseSlug = slugify(`${sku}-${cardNumber}-${name}-${grade || condition}`);
  const searchFields = [
    sku,
    name,
    universe,
    category,
    type,
    setName,
    cardNumber,
    rarity,
    variant,
    language,
    condition,
    grade
  ];

  return {
    id: sku,
    sku,
    slug: baseSlug || `product-${rank}`,
    name,
    universe,
    category,
    productType: type,
    setName,
    cardNumber,
    rarity,
    variant,
    language,
    condition,
    grade,
    priceZar,
    stock,
    status: stock > 0 ? "In stock" : "Ask availability",
    featured: rank <= 24 || priceZar >= 2500,
    askOnly: priceZar <= 0 || /needs_owner_confirmation|needs_research/i.test(`${confidence} ${researchStatus}`),
    visualKind: visualKind(type, universe),
    publicDescription: publicDescription(row, type, universe, language),
    searchText: searchFields.join(" ").toLowerCase()
  };
}

const source = fsSync.readFileSync(sourcePath, "utf8");
const sourceRows = parseCsv(source);
const products = sourceRows.map(makeProduct);

products.push({
  id: "TVR-SERVICE-PREGRADE",
  sku: "TVR-SERVICE-PREGRADE",
  slug: "pre-grading-authentication-report",
  name: "Pre-Grading & Authentication Report",
  universe: "Services",
  category: "Grade Lab",
  productType: "Service",
  setName: "The Vault Room Grade Lab",
  cardNumber: "",
  rarity: "Service",
  variant: "Inspection",
  language: "Mixed",
  condition: "Per card",
  grade: "",
  priceZar: 150,
  stock: 999,
  status: "Bookings open",
  featured: true,
  askOnly: false,
  visualKind: "service",
  publicDescription:
    "Per-card pre-grade opinion and authenticity assessment covering centering, corners, edges, surface and report-ready notes. Shipping excluded if not dropped off.",
  searchText:
    "pre-grading authentication report grade lab psa cgc bgs centering corners edges surface service"
});

const categoryCounts = products.reduce((acc, product) => {
  acc[product.universe] = (acc[product.universe] || 0) + 1;
  return acc;
}, {});

await fs.writeFile(outPath, `${JSON.stringify(products, null, 2)}\n`);
await fs.writeFile(
  manifestPath,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      source: sourceRelativePath,
      sourceRows: sourceRows.length,
      publicProducts: products.length,
      serviceProductsAdded: 1,
      categoryCounts,
      publicSafetyPolicy:
        "Customer-facing product data is generated from the latest public list prices only. Private pricing fields and research notes are not exported."
    },
    null,
    2
  )}\n`
);

console.log(`Generated ${products.length} public products from ${sourceRows.length} show-pricing records.`);
