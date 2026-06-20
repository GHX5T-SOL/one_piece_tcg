import csv from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(process.cwd(), "../..");
const appRoot = process.cwd();
const loyversePath = path.join(root, "sales/loyverse/2026-06-19/the-vault-room-loyverse-import-2026-06-19.csv");
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
    .slice(0, 88);
}

function money(value) {
  const parsed = Number(String(value || "0").replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? Math.round(parsed) : 0;
}

function extract(description, label) {
  const match = description.match(new RegExp(`${label}:\\s*([^|]+)`, "i"));
  return match ? match[1].trim() : "";
}

function classify(category, name) {
  const lower = `${category} ${name}`.toLowerCase();
  if (lower.includes("pre-grade") || lower.includes("authentication report") || lower.includes("grade lab service")) {
    return "Services";
  }
  if (lower.includes("pokemon")) return "Pokemon";
  if (lower.includes("yu-gi-oh")) return "Yu-Gi-Oh";
  return "One Piece";
}

function productType(category, name) {
  const lower = `${category} ${name}`.toLowerCase();
  if (lower.includes("graded") || lower.includes("psa") || lower.includes("cgc") || lower.includes("bgs")) return "Graded";
  if (lower.includes("sealed") || lower.includes("booster") || lower.includes("starter deck") || lower.includes("ultra deck") || lower.includes("double pack")) return "Sealed";
  if (lower.includes("service") || lower.includes("pre-grade")) return "Service";
  if (lower.includes("premium")) return "Premium Single";
  return "Single";
}

function visualKind(type, category) {
  if (type === "Graded") return "slab";
  if (type === "Sealed" && category === "Pokemon") return "pokemon-pack";
  if (type === "Sealed") return "sealed";
  if (type === "Service") return "service";
  return "card";
}

function cleanName(name) {
  return name
    .replace(/\s*-\s*Japanese\b/gi, " JP")
    .replace(/\s+/g, " ")
    .trim();
}

function publicCategory(category, universe) {
  const cleaned = category
    .replace(/^One Piece\s+/i, "")
    .replace(/\bConsignment\b/gi, "Premium")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return universe === "Pokemon" ? "Sealed Products" : "Premium Singles";
  return cleaned;
}

function publicDescription(row, type, universe) {
  const description = row.Description || "";
  const set = extract(description, "Set");
  const rarity = extract(description, "Rarity");
  const variant = extract(description, "Variant");
  const condition = extract(description, "Condition") || "Near Mint";
  const parts = [];

  if (set) parts.push(set);
  if (rarity) parts.push(`${rarity} rarity`);
  if (variant && variant !== "Normal") parts.push(variant);
  if (type !== "Sealed" && type !== "Service") parts.push(condition);
  if (type === "Graded") parts.push("graded display piece");
  if (type === "Sealed") parts.push("factory sealed product");
  if (universe === "Pokemon") parts.push("Pokemon sealed stock");

  return parts.length
    ? parts.join(" • ")
    : "The Vault Room catalogue item. Availability and final condition confirmed before handover.";
}

function makeProduct(row, index) {
  const sku = `TVR-CAT-${String(index + 1).padStart(4, "0")}`;
  const name = cleanName(row.Name || sku);
  const category = row.Category || "Trading Cards";
  const universe = classify(category, name);
  const type = productType(category, name);
  const displayCategory = publicCategory(category, universe);
  const priceZar = money(row["Price [the vault room ]"]);
  const stock = Math.max(0, Number.parseInt(row["In stock [the vault room ]"] || "0", 10) || 0);
  const description = row.Description || "";
  const setName = extract(description, "Set") || "";
  const rarity = extract(description, "Rarity") || "";
  const condition = extract(description, "Condition") || (type === "Sealed" ? "Sealed" : "Near Mint");
  const gradeMatch = name.match(/\b(PSA|CGC|BGS)\s+([0-9.]+|10\.0)?\s*([A-Z][A-Z\s-]+)?/i);
  const grade = gradeMatch ? gradeMatch[0].replace(/\s+/g, " ").trim() : "";
  const baseSlug = slugify(`${sku}-${name}`);

  return {
    id: sku,
    sku,
    slug: baseSlug || `product-${index + 1}`,
    name,
    universe,
    category: displayCategory,
    productType: type,
    setName,
    rarity,
    condition,
    grade,
    priceZar,
    stock,
    status: stock > 0 ? "In stock" : "Ask availability",
    featured: index < 18 || priceZar >= 2500,
    askOnly: /ASK ONLY|live-check|Verify/i.test(description),
    visualKind: visualKind(type, universe),
    publicDescription: publicDescription(row, type, universe),
    searchText: `${name} ${sku} ${displayCategory} ${setName} ${rarity} ${condition} ${grade}`.toLowerCase()
  };
}

const source = csv.readFileSync(loyversePath, "utf8");
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
  rarity: "Service",
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
      source: "sales/loyverse/2026-06-19/the-vault-room-loyverse-import-2026-06-19.csv",
      sourceRows: sourceRows.length,
      publicProducts: products.length,
      serviceProductsAdded: 1,
      categoryCounts,
      publicSafetyPolicy: "Customer-facing product data is sanitized for public display."
    },
    null,
    2
  )}\n`
);

console.log(`Generated ${products.length} public products from ${sourceRows.length} catalogue records.`);
