import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const productsPath = path.join(appRoot, "src/data/products.json");
const manifestPath = path.join(appRoot, "src/data/product-images.json");
const publicRoot = path.join(appRoot, "public");
const imageRoot = path.join(publicRoot, "products/catalogue");
const featuredRoot = path.join(publicRoot, "products/featured");

const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
fs.rmSync(imageRoot, { recursive: true, force: true });
fs.mkdirSync(imageRoot, { recursive: true });

const manualImages = {
  "TVR-CAT-0010": {
    src: "/products/featured/roronoa-zoro-25th-cgc10.jpg",
    width: 952,
    height: 1620,
    source: "local-owned-slab",
    sourceUrl: "/products/featured/roronoa-zoro-25th-cgc10.jpg",
    confidence: "exact-owned-slab"
  },
  "TVR-CAT-0011": {
    src: "/products/featured/koby-prb02-cgc10.jpg",
    width: 1000,
    height: 1717,
    source: "local-owned-slab",
    sourceUrl: "/products/featured/koby-prb02-cgc10.jpg",
    confidence: "exact-owned-slab"
  },
  "TVR-CAT-0007": {
    src: "/products/featured/borsalino-op06-psa10.jpg",
    width: 1000,
    height: 1664,
    source: "local-owned-slab",
    sourceUrl: "/products/featured/borsalino-op06-psa10.jpg",
    confidence: "exact-owned-slab"
  },
  "TVR-CAT-0017": {
    src: "/products/featured/doflamingo-prb02-psa10.jpg",
    width: 1000,
    height: 1677,
    source: "local-owned-slab",
    sourceUrl: "/products/featured/doflamingo-prb02-psa10.jpg",
    confidence: "exact-owned-slab"
  },
  "TVR-CAT-0022": {
    src: "/products/featured/cavendish-op10-psa10.jpg",
    width: 1000,
    height: 1667,
    source: "local-owned-slab",
    sourceUrl: "/products/featured/cavendish-op10-psa10.jpg",
    confidence: "exact-owned-slab"
  },
  "TVR-CAT-0026": {
    src: "/products/featured/i-know-youre-strong-3rd-anniversary-psa10.jpg",
    width: 1000,
    height: 1676,
    source: "local-owned-slab",
    sourceUrl: "/products/featured/i-know-youre-strong-3rd-anniversary-psa10.jpg",
    confidence: "exact-owned-slab"
  },
  "TVR-CAT-0030": {
    src: "/products/featured/koala-op12-psa10.jpg",
    width: 1000,
    height: 1672,
    source: "local-owned-slab",
    sourceUrl: "/products/featured/koala-op12-psa10.jpg",
    confidence: "exact-owned-slab"
  }
};

const localCardMediaRoot = path.join(appRoot, "..", "..", "media", "cards");

const manualLocalImages = {
  "TVR-CAT-0005": {
    path: path.join(localCardMediaRoot, "2024_One_Piece_Japanese_SD_Purple_Monkey_D._Luffy_SR_Zoro-Juurou__ST18-004_CGC_10_PRISTINE.jpg"),
    source: "local-owned-slab",
    confidence: "exact-owned-slab"
  },
  "TVR-CAT-0012": {
    path: path.join(localCardMediaRoot, "2022_ONE_PIECE_STARTER_DECK_ST03-THE_SEVEN_WARLORDS_OF_THE_SEA_001_CROCODILE_SUPER_PRE-RELEASE_PSA_9.jpg"),
    source: "local-owned-slab",
    confidence: "exact-owned-slab"
  },
  "TVR-CAT-0016": {
    path: path.join(localCardMediaRoot, "2023_One_Piece_Promo_Premium_Collection_Film_Red_Alt_Art_Franky__OP01-021_CGC_10_GEM_MINT.jpg"),
    source: "local-owned-slab",
    confidence: "exact-owned-slab"
  },
  "TVR-CAT-0025": {
    path: path.join(localCardMediaRoot, "2023_One_Piece_Promo_Tournament_Pack_Volume_3_Nami__ST01-007_CGC_9_MINT.jpg"),
    source: "local-owned-slab",
    confidence: "exact-owned-slab"
  },
  "TVR-CAT-0029": {
    path: path.join(localCardMediaRoot, "2025_One_Piece_Japanese_Promo_3rd_Anniversary_Treasure_SR_Monkey_D._Luffy__ST10-006_CGC_10.jpg"),
    source: "local-owned-slab",
    confidence: "exact-owned-slab"
  }
};

const manualRemoteImages = {
  "TVR-CAT-0003": {
    url: "https://en.onepiece-cardgame.com/images/products/other/cardcollection_bestselection_vol4/mv_01.jpg",
    sourcePage: "https://en.onepiece-cardgame.com/products/other/cardcollection_bestselection_vol4.php",
    source: "official-one-piece-product-page",
    confidence: "official-sealed-product-match"
  },
  "TVR-CAT-0008": {
    url: "https://en.onepiece-cardgame.com/images/products/other/cardcollection_liveaction/mv_01.jpg",
    sourcePage: "https://en.onepiece-cardgame.com/products/other/cardcollection_liveaction.php",
    source: "official-one-piece-product-page",
    confidence: "official-sealed-product-match"
  },
  "TVR-CAT-0009": {
    url: "https://en.onepiece-cardgame.com/images/products/other/cardcollection_bcgfest23-24/mv_01.jpg",
    sourcePage: "https://en.onepiece-cardgame.com/products/other/cardcollection_bcgfest23-24.php",
    source: "official-one-piece-product-page",
    confidence: "official-sealed-product-match"
  },
  "TVR-CAT-0018": {
    url: "https://en.onepiece-cardgame.com/images/products/boosters/op12/mv_01.jpg?v2",
    sourcePage: "https://en.onepiece-cardgame.com/products/boosters/op12.php",
    source: "official-one-piece-product-page",
    confidence: "official-sealed-product-match"
  },
  "TVR-CAT-0023": {
    url: "https://en.onepiece-cardgame.com/images/products/decks/ld01/mv_01.jpg",
    sourcePage: "https://en.onepiece-cardgame.com/products/decks/ld01.php",
    source: "official-one-piece-product-page",
    confidence: "official-sealed-product-match"
  },
  "TVR-CAT-0275": {
    url: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/42647c19-8b65-49d3-a64b-3e07f36336ca.png%3BmaxHeight%3D422%3BmaxWidth%3D264?format=webp",
    sourcePage: "https://www.bestbuy.com/product/pokemon-trading-card-game-mega-evolution-perfect-order-sleeved-booster-1-sleeved-booster-per-order-styles-may-vary/JJG2TLXKC4",
    source: "retailer-product-page",
    confidence: "retailer-sealed-product-match"
  },
  "TVR-CAT-0276": {
    url: "https://en.onepiece-cardgame.com/images/products/other/dp08/mv_01.jpg?1",
    sourcePage: "https://en.onepiece-cardgame.com/products/other/dp08.php",
    source: "official-one-piece-product-page",
    confidence: "official-sealed-product-match"
  },
  "TVR-CAT-0277": {
    url: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/a551f306-30fd-4435-9cb7-1f18dba165c2.png%3BmaxHeight%3D422%3BmaxWidth%3D264?format=webp",
    sourcePage: "https://www.bestbuy.com/product/pokemon-trading-card-game-mega-evolution-chaos-rising-sleeved-booster-one-per-order-styles-may-vary/JJG2TLXVHV",
    source: "retailer-product-page",
    confidence: "retailer-sealed-product-match"
  },
  "TVR-CAT-0286": {
    url: "https://en.onepiece-cardgame.com/images/products/decks/st10/mv_01.jpg?3",
    sourcePage: "https://en.onepiece-cardgame.com/products/decks/st10.php",
    source: "official-one-piece-product-page",
    confidence: "official-sealed-product-match"
  },
  "TVR-CAT-0293": {
    url: "https://en.onepiece-cardgame.com/images/products/decks/st01-04/mv_01.jpg?v3",
    sourcePage: "https://en.onepiece-cardgame.com/products/decks/st01-04.php",
    source: "official-one-piece-product-page",
    confidence: "official-starter-deck-group-match"
  },
  "TVR-CAT-0322": {
    url: "https://asia-en.onepiece-cardgame.com/renewal/images/products/boosters/eb04/img_item01.webp",
    sourcePage: "https://asia-en.onepiece-cardgame.com/products/boosters/eb04.php",
    source: "official-one-piece-product-page",
    confidence: "official-sealed-product-match"
  },
  "TVR-CAT-0323": {
    url: "https://asia-en.onepiece-cardgame.com/onepiececg/bccard/jp/products/2026/03/19/QRbilYFyY46pR9VQ/img_item01.webp",
    sourcePage: "https://asia-en.onepiece-cardgame.com/products/op16.html",
    source: "official-one-piece-product-page",
    confidence: "official-sealed-product-match"
  },
  "TVR-CAT-0324": {
    url: "https://en.onepiece-cardgame.com/images/products/boosters/op12/mv_01.jpg?v2",
    sourcePage: "https://en.onepiece-cardgame.com/products/boosters/op12.php",
    source: "official-one-piece-product-page",
    confidence: "official-sealed-product-match"
  }
};

const codePattern = /\b((?:OP|ST|EB|PRB)\d{2}-\d{3}|P-\d{3})\b/i;

function normalizeCode(code) {
  return code.toUpperCase();
}

function extractCode(product) {
  const haystack = `${product.name} ${product.setName} ${product.searchText || ""}`;
  const match = haystack.match(codePattern);
  if (!match) return null;
  return normalizeCode(match[1]);
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

function prefersParallel(product) {
  return /alt|alternate|parallel|sp\b|manga|25th|best collection|starlight|participant|anniversary/i.test(
    `${product.name} ${product.rarity} ${product.publicDescription} ${product.searchText}`
  );
}

function candidateUrls(code, product) {
  const bases = prefersParallel(product)
    ? [`${code}_p1`, `${code}_p2`, `${code}_p3`, `${code}_p4`, code]
    : [code, `${code}_p1`, `${code}_p2`];
  return bases.map((candidate) => ({
    url: `https://en.onepiece-cardgame.com/images/cardlist/card/${candidate}.png`,
    variant: candidate
  }));
}

async function fetchImage(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 TheVaultRoomCatalogue/1.0"
      },
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) return null;
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) return null;
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch {
    return null;
  }
}

async function getDimensions(buffer) {
  const sharp = await import("sharp");
  const meta = await sharp.default(buffer).metadata();
  return { width: meta.width || 0, height: meta.height || 0 };
}

async function optimizeProductImage(buffer) {
  const sharp = await import("sharp");
  return sharp
    .default(buffer)
    .rotate()
    .resize({ width: 900, height: 1260, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 84, effort: 5 })
    .toBuffer();
}

async function writeOfficialImage(product, code) {
  for (const candidate of candidateUrls(code, product)) {
    const buffer = await fetchImage(candidate.url);
    if (!buffer) continue;
    const optimized = await optimizeProductImage(buffer);
    const fileName = `${product.id}-${slugify(candidate.variant)}.webp`;
    const absolutePath = path.join(imageRoot, fileName);
    fs.writeFileSync(absolutePath, optimized);
    const dimensions = await getDimensions(optimized);
    return {
      src: `/products/catalogue/${fileName}`,
      ...dimensions,
      source: "official-one-piece-card-list",
      sourceUrl: candidate.url,
      confidence: candidate.variant === code ? "official-code-match" : "official-code-variant-match",
      cardCode: code,
      variant: candidate.variant
    };
  }
  return null;
}

async function writeManualRemoteImage(product, manual) {
  const buffer = await fetchImage(manual.url);
  if (!buffer) return null;
  const optimized = await optimizeProductImage(buffer);
  const fileName = `${product.id}-${slugify(product.name)}.webp`;
  const absolutePath = path.join(imageRoot, fileName);
  fs.writeFileSync(absolutePath, optimized);
  const dimensions = await getDimensions(optimized);
  return {
    src: `/products/catalogue/${fileName}`,
    ...dimensions,
    source: manual.source,
    sourceUrl: manual.url,
    sourcePage: manual.sourcePage,
    confidence: manual.confidence,
    cardCode: extractCode(product)
  };
}

async function writeManualLocalImage(product, manual) {
  const buffer = fs.readFileSync(manual.path);
  const optimized = await optimizeProductImage(buffer);
  const fileName = `${product.id}-${slugify(product.name)}-owned-slab.webp`;
  fs.writeFileSync(path.join(imageRoot, fileName), optimized);
  const dimensions = await getDimensions(optimized);
  return {
    src: `/products/catalogue/${fileName}`,
    ...dimensions,
    source: manual.source,
    sourceUrl: null,
    confidence: manual.confidence,
    cardCode: extractCode(product)
  };
}

function wrapText(value, limit = 24, maxLines = 8) {
  const words = value.replace(/\s+/g, " ").trim().split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > limit && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, maxLines);
}

function escapeXml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function writeFallbackImage(product, reason = "no-exact-image-found") {
  const sharp = await import("sharp");
  const titleLines = wrapText(product.name, 24, 7);
  const isGraded = product.productType === "Graded" || product.visualKind === "slab";
  const subtitle = product.universe === "Services" ? "GRADE LAB" : isGraded ? "GRADED SLAB" : product.productType.toUpperCase();
  const motif = isGraded
    ? product.grade || "SLAB"
    : /don!!/i.test(product.name)
      ? "DON!!"
      : product.universe === "Pokemon"
        ? "PACK"
        : product.productType === "Sealed"
          ? "SEALED"
          : "CARD";
  const titleSvg = titleLines
    .map((line, index) => `<text x="450" y="${(isGraded ? 590 : 470) + index * (isGraded ? 44 : 52)}" text-anchor="middle" class="title">${escapeXml(line)}</text>`)
    .join("");
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="900" height="1260" viewBox="0 0 900 1260" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff7e6"/>
      <stop offset="0.52" stop-color="#f6ead1"/>
      <stop offset="1" stop-color="#e9d0a1"/>
    </linearGradient>
    <linearGradient id="navy" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#061d38"/>
      <stop offset="1" stop-color="#0d4ea2"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#061d38" flood-opacity="0.24"/>
    </filter>
    <style>
      .small{font:800 28px Arial, sans-serif;letter-spacing:4px;fill:#d4af37}
      .title{font:900 42px Georgia, serif;fill:#061d38}
      .meta{font:900 24px Arial, sans-serif;letter-spacing:3px;fill:#fff7e6}
      .motif{font:900 86px Georgia, serif;letter-spacing:2px;fill:#fff7e6}
    </style>
  </defs>
  <rect width="900" height="1260" fill="url(#paper)"/>
  <path d="M0 1000 C210 930 330 1080 520 1005 C680 940 760 910 900 955 L900 1260 L0 1260 Z" fill="#7ec6f0" opacity="0.72"/>
  <path d="M0 1060 C200 995 330 1160 545 1070 C700 1005 780 1010 900 1055 L900 1260 L0 1260 Z" fill="#2176d2" opacity="0.86"/>
  <g transform="translate(450 180)" filter="url(#shadow)">
    <circle r="118" fill="#fff7e6" stroke="#d4af37" stroke-width="14"/>
    <circle r="86" fill="none" stroke="#0d4ea2" stroke-width="16"/>
    <path d="M0 -42 C32 -42 52 -16 52 16 C52 52 26 68 0 68 C-26 68 -52 52 -52 16 C-52 -16 -32 -42 0 -42Z" fill="#0d4ea2"/>
    <rect x="-18" y="28" width="36" height="58" rx="6" fill="#0d4ea2"/>
  </g>
  <text x="450" y="350" text-anchor="middle" class="small">THE VAULT ROOM</text>
  <g filter="url(#shadow)">
    <rect x="145" y="385" width="610" height="545" rx="${isGraded ? 22 : 38}" fill="rgba(255,250,240,0.88)" stroke="#d4af37" stroke-width="7"/>
    ${
      isGraded
        ? `<rect x="190" y="420" width="520" height="104" rx="16" fill="#eef4fb" stroke="#061d38" stroke-opacity="0.28"/>
    <text x="450" y="485" text-anchor="middle" class="small">SLAB PHOTO PENDING</text>
    <rect x="244" y="560" width="412" height="320" rx="24" fill="#061d38" opacity="0.08" stroke="#061d38" stroke-opacity="0.24"/>`
        : ""
    }
    ${titleSvg}
    <rect x="230" y="790" width="440" height="110" rx="20" fill="url(#navy)"/>
    <text x="450" y="860" text-anchor="middle" class="motif">${escapeXml(motif)}</text>
  </g>
  <rect x="146" y="968" width="608" height="72" rx="12" fill="#061d38"/>
  <text x="450" y="1014" text-anchor="middle" class="meta">${escapeXml(subtitle)}</text>
  <text x="450" y="1128" text-anchor="middle" class="small">CARDS. COLLECTIBLES. GRAILS.</text>
</svg>`;
  const buffer = await sharp.default(Buffer.from(svg)).webp({ quality: 88, effort: 5 }).toBuffer();
  const fileName = `${product.id}-${slugify(product.name)}-fallback.webp`;
  fs.writeFileSync(path.join(imageRoot, fileName), buffer);
  const dimensions = await getDimensions(buffer);
  return {
    src: `/products/catalogue/${fileName}`,
    ...dimensions,
    source: "vault-room-generated-fallback",
    sourceUrl: null,
    confidence: reason,
    cardCode: extractCode(product)
  };
}

async function fallbackFor(product, reason = "no-exact-image-found") {
  return writeFallbackImage(product, reason);
}

const manifest = {};
const stats = {
  total: products.length,
  manualOwnedSlab: 0,
  officialDownloaded: 0,
  fallback: 0
};

for (const product of products) {
  if (manualImages[product.id]) {
    manifest[product.id] = manualImages[product.id];
    stats.manualOwnedSlab += 1;
    continue;
  }

  if (manualLocalImages[product.id]) {
    manifest[product.id] = await writeManualLocalImage(product, manualLocalImages[product.id]);
    stats.manualOwnedSlab += 1;
    continue;
  }

  if (manualRemoteImages[product.id]) {
    const image = await writeManualRemoteImage(product, manualRemoteImages[product.id]);
    if (image) {
      manifest[product.id] = image;
      stats.officialDownloaded += 1;
      continue;
    }
  }

  const code = extractCode(product);
  if (product.productType === "Graded" || product.visualKind === "slab") {
    manifest[product.id] = await fallbackFor(product, "graded-slab-photo-needed");
    stats.fallback += 1;
    continue;
  }

  if (product.universe === "One Piece" && code && product.productType !== "Sealed") {
    const image = await writeOfficialImage(product, code);
    if (image) {
      manifest[product.id] = image;
      stats.officialDownloaded += 1;
      continue;
    }
  }

  manifest[product.id] = await fallbackFor(product, "branded-generated-fallback-needs-exact-source");
  stats.fallback += 1;
}

const payload = {
  generatedAt: new Date().toISOString(),
  policy: "Local owned slab photos keep visible certification labels. Graded products without exact slab photos use branded slab placeholders rather than raw card art. Official card-list art is used for exact non-graded One Piece card-number matches. Missing exact product photos use branded UI fallbacks until manually sourced.",
  stats,
  images: manifest
};

fs.writeFileSync(manifestPath, `${JSON.stringify(payload, null, 2)}\n`);
console.log(JSON.stringify(stats, null, 2));
