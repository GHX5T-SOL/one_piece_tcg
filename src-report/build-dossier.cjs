const fs = require("fs");
const path = require("path");
const {pathToFileURL} = require("url");
const {chromium} = require("playwright");

const root = process.cwd();
const outDir = path.join(root, "report");
fs.mkdirSync(outDir, {recursive: true});
fs.mkdirSync(path.join(root, "docs"), {recursive: true});
fs.mkdirSync(path.join(root, "data"), {recursive: true});

const portfolio = JSON.parse(fs.readFileSync(path.join(root, "data/portfolio.collectr.json"), "utf8"));
const offersFile = JSON.parse(fs.readFileSync(path.join(root, "data/courtyard-offers.json"), "utf8"));
const inbound = JSON.parse(fs.readFileSync(path.join(root, "data/phygitals-inbound.json"), "utf8"));

const today = "2026-05-25";
const retrieved = "Retrieved 2026-05-25";
const money = (n) => `$${Number(n).toLocaleString("en-US", {minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2})}`;
const rel = (p) => path.relative(outDir, path.join(root, p)).split(path.sep).join("/");
const cardImg = (id) => rel(`assets/cards/official/${id}.png`);
const driveImg = (name) => rel(`assets/raw/drive/${name}`);
const pct = (n) => `${Math.round(n * 10) / 10}%`;

const sources = [
  {
    id: "S1",
    name: "PSA infrastructure demand",
    url: "https://www.psacard.com/articles/articleview/15715/200-million-investment-grading-experience",
    note: "PSA says it graded 2M cards in 2020 and more than 19M in 2025; Jan-Apr 2026 output was up 39% year over year."
  },
  {
    id: "S2",
    name: "PSA x Bandai promo signal",
    url: "https://www.psacard.com/articles/articleview/15211/ahoy-psa-x-bandai-partner-on-third-exclusive-one-piece-promo",
    note: "PSA says the first PSA/Bandai Straw Hat promo became the most-graded English One Piece card of all time."
  },
  {
    id: "S3",
    name: "PSA One Piece basics",
    url: "https://www.psacard.com/info/tcg/one-piece-collecting-basics-guide",
    note: "Useful for set-code, rarity, promo, franchise, and modern Bandai TCG context."
  },
  {
    id: "S4",
    name: "Bandai card business growth",
    url: "https://www.bandainamco.co.jp/en/ir/library/feature02_01_2025.html",
    note: "Bandai discusses global card-game growth, regional strategy, supply capacity, localization, TCG+ data, and fan demand."
  },
  {
    id: "S5",
    name: "OP-14 The Azure Sea's Seven",
    url: "https://en.onepiece-cardgame.com/products/boosters/op14-eb04.php",
    note: "Official page: Seven Warlords theme, January 16, 2026 English release, MSRP $4.99, 163+2 card types."
  },
  {
    id: "S6",
    name: "ST-29 Egghead",
    url: "https://en.onepiece-cardgame.com/products/decks/st29.php",
    note: "Official page: Egghead starter, January 16, 2026 release, $16.99 MSRP, Luffy leader, Rush: Character and Unblockable."
  },
  {
    id: "S7",
    name: "TCG Portal release tracker",
    url: "https://tcg-portal.jp/onepiece/releases",
    note: "Non-official release tracker: ST31-ST36 July 11, 2026; OP-17 listed for August 22, 2026 in Japan. Treat as schedule intelligence until Bandai English page appears."
  },
  {
    id: "S8",
    name: "TCGplayer sellers",
    url: "https://seller.tcgplayer.com/",
    note: "Seller channel with global reach, listing/pricing/fulfillment tools, and marketplace trust layer."
  },
  {
    id: "S9",
    name: "Cardmarket One Piece",
    url: "https://www.cardmarket.com/en/OnePiece",
    note: "European market surface for One Piece comps, trends, best sellers, singles, sealed, and cross-market arbitrage checks."
  },
  {
    id: "S10",
    name: "eBay Vault fees",
    url: "https://pages.ebay.com/vault/fees/",
    note: "Vault/fee source to check before moving higher-value graded slabs into eBay fulfillment."
  },
  {
    id: "S11",
    name: "Collect-a-Con Cape Town",
    url: "https://www.collectacon.co.za/",
    note: "Local event surface for in-person buying, selling, trade, auction, and vendor networking."
  },
  {
    id: "S12",
    name: "Card Cache Cape Town",
    url: "https://cardcache.co.za/pages/about",
    note: "Cape Town store signal for TCG singles, sealed, and local liquidity checks."
  },
  {
    id: "S13",
    name: "TCGXchange South Africa",
    url: "https://tcgxchange.co.za/",
    note: "South African online TCG store surface for stock, preorder, and local pricing comparison."
  },
  {
    id: "S14",
    name: "Wizards Books and Games",
    url: "https://www.wizardsworld.co.za/",
    note: "Local hobby-store surface to verify events, stock, and buy/sell opportunities."
  },
  {
    id: "S15",
    name: "Official One Piece Card List",
    url: "https://en.onepiece-cardgame.com/cardlist/",
    note: "Official card art and gameplay text used for private analytical slab renders."
  }
];

const ownedCards = [
  {
    id: "ST03-001",
    name: "Crocodile",
    title: "2022 ST03 The Seven Warlords of the Sea #001 Crocodile Super Pre-Release",
    platform: "Phygitals inbound",
    slab: "PSA 9 MINT",
    gradeCompany: "PSA",
    value: 15,
    action: "HOLD / WATCH",
    conviction: 74,
    liquidity: 58,
    role: "Warlords anchor",
    thesis: "Early Seven Warlords leader with Super Pre-Release framing. This matters more as a theme/era piece than as a raw power play. It becomes more relevant around OP-14 Warlords attention.",
    risk: "PSA 9 caps upside versus PSA 10; Crocodile demand is strong but below Luffy/Zoro/Nami/Roger.",
    trigger: "Sell only into a Warlords/Crocodile hype premium or if you can upgrade to PSA 10 without overpaying.",
    source: "S3/S5/S15"
  },
  {
    id: "ST10-006",
    name: "Monkey.D.Luffy",
    title: "2025 Japanese Promo 3rd Anniversary Treasure SR Luffy #ST10-006",
    platform: "Phygitals inbound",
    slab: "CGC 10 GEM",
    gradeCompany: "CGC",
    value: 0,
    action: "CORE HOLD",
    conviction: 90,
    liquidity: 78,
    role: "Luffy promo core",
    thesis: "Luffy plus anniversary/promo context is the strongest fit in the current collection. Main-character demand gives this a better floor than many cheap modern slabs.",
    risk: "Japanese modern promos can be reprinted or repriced quickly; CGC 10 does not always command PSA 10 liquidity.",
    trigger: "Hold unless a PSA 10 comp premium appears large enough to justify selling or cross-grading risk.",
    source: "S2/S3/S15"
  },
  {
    id: "ST18-004",
    name: "Zoro-Juurou",
    title: "2024 Japanese SD Purple Luffy SR Zoro-Juurou #ST18-004",
    platform: "Phygitals inbound",
    slab: "CGC 10 PRISTINE",
    gradeCompany: "CGC",
    value: 137.49,
    action: "CORE HOLD",
    conviction: 86,
    liquidity: 70,
    role: "Zoro thesis piece",
    thesis: "Personal brand fit for Zoro, strong character, Pristine label, and purple Straw Hat deck relevance. This is a collection identity card.",
    risk: "Starter deck cards are more supply-sensitive than event promos or top chase rarities.",
    trigger: "Hold through shipment; consider selling only if Courtyard/local buyers pay a strong pristine-label premium.",
    source: "S3/S15"
  },
  {
    id: "OP01-021",
    name: "Franky",
    title: "2023 Premium Collection Film Red Alt Art Franky #OP01-021",
    platform: "Phygitals inbound",
    slab: "CGC 10 GEM",
    gradeCompany: "CGC",
    value: 63.71,
    action: "WATCH / SELL INTO PREMIUM",
    conviction: 62,
    liquidity: 48,
    role: "Straw Hat support",
    thesis: "Nice Film Red tie-in and high grade. Good visual card, but Franky is not a top liquidity character.",
    risk: "Lower character liquidity; easy to hold too long if no specific buyer appears.",
    trigger: "List or trade if it can fund Luffy/Zoro/Nami/Roger/Ace/Sabo upgrades.",
    source: "S3/S15"
  },
  {
    id: "ST01-007",
    name: "Nami",
    title: "2023 Tournament Pack Vol. 3 Nami #ST01-007",
    platform: "Phygitals inbound / Collectr",
    slab: "CGC 9 MINT",
    gradeCompany: "CGC",
    value: 400,
    action: "HOLD, VERIFY COMPS",
    conviction: 84,
    liquidity: 82,
    role: "Visible value anchor",
    thesis: "Nami is one of the most liquid non-Luffy One Piece characters and this is the visible-value anchor of the book. The portfolio is currently concentrated around this position.",
    risk: "CGC 9 is not a premium grade; if Collectr value is stale or thin, do not treat the $400 as instantly realizable.",
    trigger: "Verify sold comps after arrival. Sell only if a buyer pays close to high comps, or upgrade into PSA 10/CGC 10 version.",
    source: "S3/S15"
  },
  {
    id: "P-041",
    name: "Monkey.D.Luffy",
    title: "2024 ST18 Purple Luffy #041 Monkey D. Luffy",
    platform: "Courtyard bought / not shipped",
    slab: "PSA 9 MINT",
    gradeCompany: "PSA",
    value: 20,
    action: "KEEP AS SHIPMENT FILLER",
    conviction: 68,
    liquidity: 74,
    role: "Low-cost Luffy",
    thesis: "Low-dollar main-character slab. Not a trophy, but Luffy liquidity is useful when building a bigger Courtyard shipment.",
    risk: "PSA 9 modern starter/promo cards can be common; do not average up heavily.",
    trigger: "Keep if shipping anyway; sell first if it blocks capital for PSA 10 Sabo/Roger/Ace.",
    source: "S3/S6/S15"
  },
  {
    id: "OP08-023",
    name: "Carrot",
    title: "2024 OP08 Two Legends #023 Carrot",
    platform: "Courtyard bought / not shipped",
    slab: "PSA 10 GEM MINT",
    gradeCompany: "PSA",
    value: 0,
    action: "SELL / TRADE IF NEEDED",
    conviction: 52,
    liquidity: 45,
    role: "Non-core PSA 10",
    thesis: "PSA 10 is good, and Carrot has fans, but she is not core to the Ghost x Zoro Luffy/Warlords/Roger/Ace/Sabo thesis.",
    risk: "May sit longer than main-character slabs. Good grade does not equal strong demand.",
    trigger: "Use as first quick sale/trade if you need room or funds before shipping.",
    source: "S3/S15"
  },
  {
    id: "LED6-EN001",
    name: "The Dark Magicians",
    title: "Yu-Gi-Oh! The Dark Magicians",
    platform: "Collectr visible",
    slab: "CGC 10 GEM",
    gradeCompany: "CGC",
    value: 0,
    action: "SELL / TRADE",
    conviction: 35,
    liquidity: 55,
    role: "Off-thesis asset",
    thesis: "Not a bad card, but it dilutes a One Piece-focused thesis. Use it as trade fuel.",
    risk: "Keeping mixed-IP inventory makes the strategy harder to track.",
    trigger: "Convert to One Piece sealed, Luffy/Zoro/Nami/Roger/Ace/Sabo slabs, or cash reserve.",
    source: "Portfolio capture"
  }
];

const offerDecisions = [
  {
    id: "OP13-120",
    name: "Sabo",
    slab: "PSA 10 GEM MINT",
    offer: 19,
    action: "KEEP - TOP BID",
    priority: 1,
    score: 93,
    rationale: "Best risk/reward in the visible offer book. OP-13 anniversary context, popular character, PSA 10, tiny bid size.",
    cap: "Keep up to roughly the low $30s unless live comps say otherwise.",
    img: "OP13-120"
  },
  {
    id: "ST29-001",
    name: "Monkey.D.Luffy B&W Alt",
    slab: "PSA 9 MINT",
    offer: 25,
    action: "KEEP",
    priority: 2,
    score: 88,
    rationale: "Egghead Luffy and ST-29 are current-cycle demand. PSA 9 is acceptable at the current bid if you keep discipline.",
    cap: "Do not chase far above $30-$35 without verified comps.",
    img: "ST29-001"
  },
  {
    id: "OP09-118",
    name: "Gol.D.Roger",
    slab: "PSA 9 MINT",
    offer: 23,
    action: "KEEP",
    priority: 3,
    score: 86,
    rationale: "Roger is a franchise apex character, and the card text/identity is iconic. PSA 9 is fine at low cost.",
    cap: "Keep PSA 9; cancel lower-grade duplicate.",
    img: "OP09-118"
  },
  {
    id: "OP07-119",
    name: "Portgas D. Ace",
    slab: "PSA 9 MINT",
    offer: 18,
    action: "KEEP",
    priority: 4,
    score: 83,
    rationale: "Ace has emotional collector demand, pairs with Luffy/Sabo thesis, and the bid is small.",
    cap: "Hold if won; sell only into fast premium.",
    img: "OP07-119"
  },
  {
    id: "ST01-001",
    name: "Monkey D. Luffy",
    slab: "PSA 9 MINT",
    offer: 19,
    action: "KEEP IF BATCHING",
    priority: 5,
    score: 75,
    rationale: "Early starter Luffy is on-thesis, but not rare enough to become a big position.",
    cap: "Keep if shipment quality stays high; do not duplicate.",
    img: "ST01-001"
  },
  {
    id: "OP13-042",
    name: "Edward Newgate",
    slab: "CGC 10 PRISTINE",
    offer: 18.5,
    action: "KEEP IF UNDER CAP",
    priority: 6,
    score: 73,
    rationale: "Whitebeard is iconic and pristine label helps. CGC liquidity is lower than PSA.",
    cap: "Keep at current bid; do not overextend.",
    img: "OP13-042"
  },
  {
    id: "OP05-119",
    name: "Monkey D. Luffy PRB01",
    slab: "PSA 9 MINT",
    offer: 17,
    action: "KEEP LOW CAP",
    priority: 7,
    score: 70,
    rationale: "Luffy is liquid, but PRB reprint context reduces scarcity. Fine only because the bid is low.",
    cap: "Flip candidate if won and comps are thin.",
    img: "OP05-119"
  },
  {
    id: "OP09-093",
    name: "Marshall D. Teach",
    slab: "CGC 10 GEM",
    offer: 8,
    action: "OPTIONAL KEEP",
    priority: 8,
    score: 64,
    rationale: "Blackbeard is a real villain thesis, and $8 is low. But it is still a CGC 10 non-trophy.",
    cap: "Keep only if you want a villain slot.",
    img: "OP09-093"
  },
  {
    id: "OP06-069",
    name: "Vinsmoke Reiju",
    slab: "CGC 10 GEM",
    offer: 8,
    action: "OPTIONAL CANCEL",
    priority: 9,
    score: 58,
    rationale: "Popular character and low bid, but not aligned with the current crew thesis.",
    cap: "Cancel if you want a cleaner shipment.",
    img: "OP06-069"
  },
  {
    id: "OP02-018",
    name: "Marco",
    slab: "CGC 10 PRISTINE",
    offer: 12,
    action: "OPTIONAL CANCEL",
    priority: 10,
    score: 57,
    rationale: "Pristine label helps, but Marco is not a first-wave capital target for this portfolio.",
    cap: "Keep only as a cheap flip.",
    img: "OP02-018"
  },
  {
    id: "OP13-120-9",
    name: "Sabo",
    slab: "PSA 9 MINT",
    offer: 18,
    action: "CANCEL IF PSA 10 REMAINS LIVE",
    priority: 11,
    score: 54,
    rationale: "Duplicate exposure. The PSA 10 bid is only $1 higher, so the PSA 9 is inefficient unless both are deliberate ladder bids.",
    cap: "Cancel before capital locks if you can.",
    img: "OP13-120"
  },
  {
    id: "OP09-118-CGC",
    name: "Gol.D.Roger",
    slab: "CGC 8.5",
    offer: 6,
    action: "CANCEL",
    priority: 12,
    score: 32,
    rationale: "Low grade and duplicate subject. Cheap does not mean investable.",
    cap: "Avoid low-grade modern slabs unless they are iconic scarce promos.",
    img: "OP09-118"
  },
  {
    id: "SW-003",
    name: "Shiki",
    slab: "CGC 8",
    offer: 6,
    action: "CANCEL",
    priority: 13,
    score: 28,
    rationale: "Old pre-Bandai curiosity, low grade, weak fit with the modern One Piece TCG thesis.",
    cap: "Cancel and keep the slot for Luffy/Roger/Ace/Sabo/Nami/Zoro.",
    img: null
  }
];

const currentVisibleValue = portfolio.summary.visibleMarketValueUsd;
const namiValue = 400;
const zoroValue = 137.49;
const offerExposure = offersFile.summary.totalOfferExposureUsd;
const capitalAtRisk = currentVisibleValue + offerExposure;

function sourceChip(ids) {
  return String(ids).split("/").map((id) => `<span class="source-chip">${id}</span>`).join("");
}

function slab(card, size = "normal") {
  const img = card.id && fs.existsSync(path.join(root, `assets/cards/official/${card.id}.png`))
    ? cardImg(card.id)
    : driveImg("motion_13818_luffy_0001.png");
  const company = card.gradeCompany || (card.slab || "").split(" ")[0] || "PSA";
  const grade = (card.slab || "").replace(company, "").trim();
  return `
    <div class="slab slab-${size}">
      <div class="slab-head ${company.toLowerCase()}">
        <b>${company}</b>
        <span>${grade || "ANALYTIC"}</span>
      </div>
      <div class="slab-art"><img src="${img}" alt="${card.name || card.title}"></div>
      <div class="slab-meta">
        <b>${card.name || card.title}</b>
        <span>${card.id || "Private card"}</span>
      </div>
    </div>
  `;
}

function metric(label, value, note) {
  return `<div class="metric"><span>${label}</span><b>${value}</b><em>${note}</em></div>`;
}

function scoreBar(label, value, color = "teal") {
  return `<div class="score-row"><span>${label}</span><div class="score-track"><i class="${color}" style="width:${value}%"></i></div><b>${value}</b></div>`;
}

function thesisCard(title, body, foot = "") {
  return `<div class="thesis-card"><h3>${title}</h3><p>${body}</p>${foot ? `<small>${foot}</small>` : ""}</div>`;
}

function page(title, kicker, body, footer = "Private investment dossier - educational scenario analysis only - not financial advice") {
  return `<section class="page">
    <img class="watermark-map" src="${driveImg("areamap_bg_0000_t.png")}" alt="">
    <div class="page-kicker">${kicker}</div>
    <h1>${title}</h1>
    <div class="page-body">${body}</div>
    <footer>${footer}</footer>
  </section>`;
}

function decisionRows(rows) {
  return rows.map((r) => `
    <tr>
      <td><span class="rank">${r.priority}</span></td>
      <td><b>${r.name}</b><br><small>${r.slab}</small></td>
      <td>${money(r.offer)}</td>
      <td><span class="pill ${r.action.includes("CANCEL") ? "red" : r.action.includes("OPTIONAL") ? "yellow" : "green"}">${r.action}</span></td>
      <td>${r.rationale}<br><small>${r.cap}</small></td>
      <td>${scoreBar("", r.score, r.score > 80 ? "teal" : r.score > 60 ? "gold" : "red")}</td>
    </tr>
  `).join("");
}

function cardGrid(cards) {
  return cards.map((c) => `
    <article class="card-analysis">
      ${slab(c, "small")}
      <div>
        <h3>${c.name}</h3>
        <p class="muted">${c.title}</p>
        <div class="inline-tags"><span>${c.platform}</span><span>${c.slab}</span><span>${c.action}</span></div>
        <p>${c.thesis}</p>
        <p><b>Risk:</b> ${c.risk}</p>
        <p><b>Trigger:</b> ${c.trigger}</p>
      </div>
      <div class="score-block">
        ${scoreBar("Conviction", c.conviction, c.conviction >= 80 ? "teal" : "gold")}
        ${scoreBar("Liquidity", c.liquidity, c.liquidity >= 75 ? "teal" : c.liquidity >= 55 ? "gold" : "red")}
      </div>
    </article>
  `).join("");
}

const pages = [];

pages.push(page(
  "Ghost x Zoro: One Piece TCG Investment Dossier",
  "Private brief / May 25, 2026",
  `<div class="cover-grid">
    <div class="cover-copy">
      <h2>Build the crew. Protect the treasure. Sell into hype. Hold the legends.</h2>
      <p>This dossier turns your Phygitals inbound cards, Courtyard bought cards, and current highest-bidder offers into an operating plan for one clean shipment, disciplined bid management, and a next-target watchlist.</p>
      <div class="metric-row">
        ${metric("Visible Collectr book", money(currentVisibleValue), "8 visible holdings")}
        ${metric("Open Courtyard exposure", money(offerExposure), "13 highest-bidder offers")}
        ${metric("Concentration", pct(namiValue / currentVisibleValue * 100), "Nami share of visible value")}
      </div>
    </div>
    <div class="hero-slabs">
      ${slab(ownedCards[4])}
      ${slab(ownedCards[2])}
      ${slab(offerDecisions[0])}
    </div>
  </div>
  <div class="cover-note">Private/non-commercial fan and investment-education artifact. Card visuals are analytical renders using official card-list art and private-use Drive assets, not cert images unless explicitly labeled.</div>`
));

pages.push(page(
  "Executive Decision",
  "What to do now",
  `<div class="exec-grid">
    ${thesisCard("Keep the shipment focused", "Build one Courtyard shipment only if it contains mostly high-conviction slabs: PSA 10 Sabo, ST29 Luffy, Roger PSA 9, Ace PSA 9, ST01/P-041 Luffy, and maybe Newgate CGC 10 Pristine. Do not let cheap low-grade slabs bloat the package.")}
    ${thesisCard("Cancel weak duplicates", "Cancel the CGC 8.5 Roger and CGC 8 Shiki. Cancel the PSA 9 Sabo if the PSA 10 bid remains live, because the PSA 10 is only $1 higher. Reiju and Marco are optional cheap flips, not core holdings.")}
    ${thesisCard("Hold the real core", "The strongest current core is Luffy anniversary/promo, Zoro-Juurou Pristine, Nami promo, and the Warlords/Crocodile anchor. Franky and Carrot are useful but are the first candidates to sell or trade into stronger names.")}
    ${thesisCard("Buy fewer, better names", "Next capital should target Luffy, Zoro, Nami, Roger, Ace, Sabo, Shanks, Mihawk, Boa, Crocodile, and sealed drops at MSRP/near-MSRP. Avoid weak low-grade modern slabs even when they look cheap.")}
  </div>
  <div class="decision-banner">
    <b>Operating rule:</b> If a slab is not iconic, scarce, grade-premium, or an obvious flip after fees, it does not belong in the next shipment.
  </div>`
));

pages.push(page(
  "Market Map",
  "Why One Piece is interesting, but volatile",
  `<div class="two-col">
    <div>
      <h2>Demand signals</h2>
      <p>PSA says broad grading demand is still booming: 2 million cards graded in 2020, more than 19 million in 2025, and January-April 2026 output up 39% year over year. That is not One Piece-specific proof, but it confirms the grading infrastructure tailwind. ${sourceChip("S1")}</p>
      <p>PSA and Bandai continue to create exclusive One Piece promo moments. PSA says the first PSA/Bandai Straw Hat promo became the most-graded English-language One Piece card of all time, which is a strong signal that collectors treat official promos as slab-worthy. ${sourceChip("S2")}</p>
      <p>Bandai's card-game business is explicitly pursuing global card-game growth, regional strategy, production capacity, localization speed, and data-driven product decisions through its TCG+ ecosystem. ${sourceChip("S4")}</p>
    </div>
    <div class="chart-panel">
      <h3>Investment interpretation</h3>
      ${scoreBar("IP strength", 95)}
      ${scoreBar("Collector growth", 86)}
      ${scoreBar("Liquidity maturity vs Pokemon", 48, "gold")}
      ${scoreBar("Reprint / supply risk", 72, "red")}
      ${scoreBar("Volatility", 88, "red")}
      <p class="fine">Important correction: this dossier does not claim One Piece grading volume is higher than Pokemon. I could verify rapid One Piece demand signals, but not a source-backed head-to-head volume win.</p>
    </div>
  </div>`
));

pages.push(page(
  "Portfolio Analytics",
  "Current book and exposure",
  `<div class="metric-row wide">
    ${metric("Visible Collectr value", money(currentVisibleValue), "Before all live comp verification")}
    ${metric("Open bid exposure", money(offerExposure), "From 2026-05-25 screenshots")}
    ${metric("Illustrative at-risk stack", money(capitalAtRisk), "Visible value + open bid exposure")}
    ${metric("Inbound Phygitals", inbound.summary.itemsVisible, "6 items across 2 shipments")}
  </div>
  <div class="analytics-grid">
    <div class="chart-panel">
      <h3>Visible value concentration</h3>
      ${scoreBar("Nami", 63)}
      ${scoreBar("Zoro-Juurou", 22, "gold")}
      ${scoreBar("Franky", 10, "gold")}
      ${scoreBar("Other visible", 5, "red")}
      <p>The visible book is concentrated, not diversified. That is acceptable early, but it means comp verification on Nami and Zoro matters more than adding random cheap slabs.</p>
    </div>
    <div class="chart-panel">
      <h3>Open offer mix</h3>
      ${scoreBar("PSA exposure", Math.round(139 / offerExposure * 100))}
      ${scoreBar("CGC exposure", Math.round(58.5 / offerExposure * 100), "gold")}
      ${scoreBar("Keep / likely keep", 72)}
      ${scoreBar("Cancel / optional", 28, "red")}
      <p>7 PSA bids and 6 CGC bids. The mix is fine only if the CGC pieces are pristine, iconic, or extremely cheap flips.</p>
    </div>
    <div class="chart-panel">
      <h3>Character thesis</h3>
      <div class="tag-cloud">
        <span>Luffy</span><span>Zoro</span><span>Nami</span><span>Roger</span><span>Ace</span><span>Sabo</span><span>Crocodile</span><span>Mihawk</span><span>Boa</span><span>Shanks</span>
      </div>
      <p>The best version of this portfolio is not "many cheap One Piece slabs." It is a named-character thesis built around franchise gravity and scarce/event/promo variants.</p>
    </div>
  </div>`
));

pages.push(page(
  "Owned Cards: Keep, Sell, Upgrade",
  "Phygitals inbound and Courtyard bought",
  `<div class="card-grid">${cardGrid(ownedCards.slice(0, 4))}</div>`
));

pages.push(page(
  "Owned Cards: Concentration Notes",
  "Nami, Courtyard purchases, and off-thesis cards",
  `<div class="card-grid">${cardGrid(ownedCards.slice(4))}</div>`
));

pages.push(page(
  "Offer Book Decision Matrix",
  "Highest-bidder screenshot state",
  `<table class="decision-table">
    <thead><tr><th>#</th><th>Card</th><th>Bid</th><th>Action</th><th>Reason</th><th>Score</th></tr></thead>
    <tbody>${decisionRows(offerDecisions)}</tbody>
  </table>`
));

pages.push(page(
  "Top Offer Targets",
  "What to keep if the bids hit",
  `<div class="offer-hero-grid">
    ${offerDecisions.slice(0, 7).map((o) => `
      <article class="offer-card">
        ${slab({id: o.img, name: o.name, slab: o.slab, gradeCompany: o.slab.startsWith("CGC") ? "CGC" : "PSA"}, "small")}
        <h3>${o.name}</h3>
        <b>${money(o.offer)} - ${o.action}</b>
        <p>${o.rationale}</p>
      </article>`).join("")}
  </div>`
));

pages.push(page(
  "Cancel / Optional Bids",
  "Where Grok was too generous",
  `<div class="two-col">
    <div class="chart-panel">
      <h2>Immediate cancels</h2>
      <p><b>CGC 8.5 Roger:</b> cancel. You already have the PSA 9 Roger bid. Low grade modern slabs are hard to move unless the card is truly scarce.</p>
      <p><b>CGC 8 Shiki:</b> cancel. Interesting older curiosity, but not part of the modern Bandai One Piece TCG lane and not high grade.</p>
      <p><b>PSA 9 Sabo:</b> cancel if PSA 10 remains live. A $1 gap between 9 and 10 makes the 9 inefficient.</p>
    </div>
    <div class="chart-panel">
      <h2>Optional cheap flips</h2>
      <p><b>Reiju CGC 10:</b> fine at $8 if you want a very cheap female-character flip, but not core.</p>
      <p><b>Marco CGC 10 Pristine:</b> okay at $12, but only if you can keep the shipment focused.</p>
      <p><b>Marshall D. Teach CGC 10:</b> optional keep because Blackbeard has villain gravity and the bid is only $8.</p>
    </div>
  </div>
  <div class="decision-banner"><b>Grok correction:</b> Crocodile ST03-001 is a blue Seven Warlords leader on the official card list, not a black-deck thesis. The investment thesis is early Warlords/pre-release/theme, not black deck playability.</div>`
));

pages.push(page(
  "Buy Next: Target Ladder",
  "Capital should climb this ladder",
  `<div class="ladder">
    ${[
      ["Tier 1", "Luffy, Zoro, Nami, Roger, Ace, Sabo PSA 10 / BGS 10 / CGC Pristine with event, promo, manga, super alt, serial, or early-set scarcity."],
      ["Tier 2", "Warlords thesis around OP-14: Mihawk, Crocodile, Boa Hancock, Doflamingo, Kuma, Jinbe where art/rarity is strong and supply is not obvious."],
      ["Tier 3", "Sealed at MSRP or near MSRP: OP-14, OP-15, OP-16, OP-17, starter waves, and premium collections. Sell early hype, hold sealed only when entry is disciplined."],
      ["Tier 4", "Cheap slabs only when they are PSA 10/CGC Pristine, iconic character, or a very obvious local flip. Otherwise pass."],
      ["Avoid", "Low-grade modern slabs, duplicate lower-grade versions, off-theme curiosities, stale Japanese reprints with no scarcity edge, and any slab where fees/shipping erase upside."]
    ].map(([k, v]) => `<div class="ladder-row"><b>${k}</b><p>${v}</p></div>`).join("")}
  </div>`
));

pages.push(page(
  "2026 Drop Calendar",
  "What to watch through August",
  `<div class="timeline">
    <div><b>Jan 16, 2026</b><h3>OP-14 / EB-04 The Azure Sea's Seven</h3><p>Official English product: Seven Warlords theme, Mihawk/Crocodile, 163+2 card types, $4.99 MSRP. This directly supports your Crocodile/Warlords lane. ${sourceChip("S5")}</p></div>
    <div><b>Jan 16, 2026</b><h3>ST-29 Egghead</h3><p>Official English starter: Egghead Luffy leader, $16.99 MSRP. This supports your ST29 Luffy bid. ${sourceChip("S6")}</p></div>
    <div><b>Jul 11, 2026</b><h3>ST31-ST36 starter wave</h3><p>TCG Portal lists Luffy, Zoro, Kuzan, Katakuri, Sabo, and Kid starter decks for July 11 in Japan. Use as preorder intelligence, not final English proof. ${sourceChip("S7")}</p></div>
    <div><b>Jul 31, 2026</b><h3>Live Action Edition vol.2 premium collections</h3><p>TCG Portal lists Straw Hat Crew and Baroque Works premium collections. Watch for exclusive art and low-print promo behavior. ${sourceChip("S7")}</p></div>
    <div><b>Aug 22, 2026</b><h3>OP-17 The World's Strongest Warriors</h3><p>TCG Portal lists OP-17 for August 22 in Japan; retailers/distributors are also surfacing August 2026 preorder pages. Treat as high-priority watchlist, but verify official Bandai English details before heavy capital.</p></div>
  </div>
  <div class="decision-banner"><b>OP-17 plan:</b> preorder sealed only near MSRP. For singles, wait 2-4 weeks after release unless a truly scarce chase appears at a mispriced level.</div>`
));

pages.push(page(
  "Where to Buy and Sell",
  "Cape Town plus online channels",
  `<div class="channel-grid">
    ${[
      ["Courtyard", "Best for slab discovery, offers, buyback/testing liquidity, and one combined shipment. Use it for PSA/CGC inventory, but prune weak bids before shipping."],
      ["Phygitals", "Good for inbound sealed/slab opportunities and marketplace browsing. Keep logistics redacted; verify each cert and comps after arrival."],
      ["TCGplayer", "Best US singles/sealed marketplace and seller tool ecosystem. Strong comp source, less ideal for SA fulfillment without logistics planning. S8"],
      ["Cardmarket", "Best EU comp check and cross-market reference, especially for One Piece best sellers and lower-priced singles. S9"],
      ["eBay / PSA Vault", "Best broad slab liquidity. Use sold listings and vault fees before moving expensive PSA slabs. S10"],
      ["Collect-a-Con Cape Town", "Bring a small graded showcase, comp sheets, QR watchlist, and cash discipline. Best for networking and local buyer discovery. S11"],
      ["Card Cache / TCGXchange / Wizards", "Local stock and event checks. Confirm One Piece inventory, preorder windows, and whether they buy/trade graded slabs. S12/S13/S14"]
    ].map(([name, text]) => `<article><h3>${name}</h3><p>${text}</p></article>`).join("")}
  </div>`
));

pages.push(page(
  "Shipment Strategy",
  "One big Courtyard shipment without junk",
  `<div class="two-col">
    <div class="chart-panel">
      <h2>Ship only if the batch clears this filter</h2>
      <ol>
        <li>At least 5 high-conviction slabs.</li>
        <li>At least 70% of shipment value in PSA 9/10 or CGC Pristine/Gem core characters.</li>
        <li>No low-grade duplicate slabs unless they are true scarce promos.</li>
        <li>Every optional cheap slab has an exit route: local flip, eBay comp, or trade target.</li>
      </ol>
    </div>
    <div class="chart-panel">
      <h2>Proposed ship list if won</h2>
      <p>PSA 10 Sabo, ST29 Luffy PSA 9, Roger PSA 9, Ace PSA 9, ST01 Luffy PSA 9, P-041 Luffy PSA 9, Newgate CGC 10 Pristine, optional Teach CGC 10.</p>
      <p><b>Leave out:</b> Shiki CGC 8, Roger CGC 8.5, duplicate Sabo PSA 9 unless it is part of a deliberate pair trade.</p>
    </div>
  </div>`
));

pages.push(page(
  "Projection Bands",
  "Scenario analysis, not guarantees",
  `<div class="projection-grid">
    <div class="chart-panel">
      <h3>Visible book only: ${money(currentVisibleValue)}</h3>
      ${scoreBar("Conservative 0-10%", 35, "gold")}
      <p>${money(currentVisibleValue)} to ${money(currentVisibleValue * 1.10)}</p>
      ${scoreBar("Base 10-25%", 58)}
      <p>${money(currentVisibleValue * 1.10)} to ${money(currentVisibleValue * 1.25)}</p>
      ${scoreBar("Upside 25-45%", 86)}
      <p>${money(currentVisibleValue * 1.25)} to ${money(currentVisibleValue * 1.45)}</p>
    </div>
    <div class="chart-panel">
      <h3>Visible + open bid exposure: ${money(capitalAtRisk)}</h3>
      ${scoreBar("Drawdown -15% to +5%", 28, "red")}
      <p>${money(capitalAtRisk * 0.85)} to ${money(capitalAtRisk * 1.05)}</p>
      ${scoreBar("Base +8% to +20%", 60)}
      <p>${money(capitalAtRisk * 1.08)} to ${money(capitalAtRisk * 1.20)}</p>
      ${scoreBar("Upside +25% to +45%", 86)}
      <p>${money(capitalAtRisk * 1.25)} to ${money(capitalAtRisk * 1.45)}</p>
    </div>
  </div>
  <p class="fine">These are educational operating scenarios based on visible Collectr value and open offer exposure. They are not purchase-cost ROI, liquidation value, or guaranteed returns. Actual profit depends on buy price, fees, shipping, FX, platform liquidity, grading-company premiums, and timing.</p>`
));

pages.push(page(
  "Risk Controls",
  "Rules that protect the treasure",
  `<div class="rules-grid">
    ${[
      ["Comp before shipping", "After arrival, photograph each slab, verify cert, check at least 3 sold comps or active low asks, then decide hold/sell/trade."],
      ["PSA premium discipline", "Prefer PSA 10 for maximum liquidity; buy CGC only when the label is Pristine/Gem, the price is clearly discounted, or the character is core."],
      ["No low-grade traps", "CGC 8/8.5 and PSA 8/9 modern slabs are not bargains by default. The lower the grade, the more iconic/scarce the card must be."],
      ["Reprint risk", "Modern Bandai supply can expand quickly. Promos, exclusives, and event cards can still be reissued or outshined."],
      ["Cash reserve", "Keep 15%-20% cash for OP-17, local event buys, distress deals, and shipping/fee surprises."],
      ["Exit plan", "Every card should have an exit: Courtyard buyback, eBay/PSA Vault, Cardmarket comp, local Cape Town buyer, or trade-up target."]
    ].map(([h, p]) => `<article><h3>${h}</h3><p>${p}</p></article>`).join("")}
  </div>`
));

pages.push(page(
  "Grok Audit",
  "What was right and what changes",
  `<div class="two-col">
    <div class="chart-panel">
      <h2>Grok was right on</h2>
      <p>Strong start around Luffy/Zoro/Nami/Crocodile, hold the best promos, keep the best Sabo/Luffy/Roger/Ace bids, and avoid spreading too thin.</p>
      <p>It was also right that Carrot is less synergistic and that low-grade/duplicate Roger exposure should be trimmed.</p>
    </div>
    <div class="chart-panel">
      <h2>Where I tighten it</h2>
      <p>Do not keep both Sabo bids by default. The PSA 10 is only $1 more, so PSA 9 is inefficient unless intentionally laddering.</p>
      <p>Crocodile ST03 is blue Warlords leader, not black-deck support. Treat it as Warlords/pre-release collector thesis.</p>
      <p>OP-14 is already January 2026 in English; the August 2026 watch item appears to be OP-17, but official English details need another confirmation pass.</p>
    </div>
  </div>`
));

pages.push(page(
  "30 / 60 / 90 Day Plan",
  "Operating map",
  `<div class="plan-grid">
    <article><b>30</b><h3>Receive and verify</h3><p>Photograph every Phygitals slab, verify certs, update Collectr with grade/company, record purchase basis, and check sold comps before listing anything.</p></article>
    <article><b>60</b><h3>Prune and batch</h3><p>Cancel weak bids, win only top offers, decide one Courtyard shipment, and test one local/eBay/Courtyard sale for liquidity data.</p></article>
    <article><b>90</b><h3>Rebalance</h3><p>Move off-thesis cards into core names or sealed. Build OP-17 preorder watchlist and attend/local-check Cape Town seller channels.</p></article>
  </div>
  <div class="allocation">
    <div><b>60%</b><span>Core holds: Luffy, Zoro, Nami, Roger, Ace, Sabo, Shanks, Warlords trophy cards</span></div>
    <div><b>25%</b><span>Flips: duplicate slabs, cheap CGC 10s, hype-cycle pieces, off-thesis inventory</span></div>
    <div><b>15%</b><span>Cash: OP-17, local events, shipping/fees, distress buys</span></div>
  </div>`
));

pages.push(page(
  "Source Ledger",
  "Evidence and confidence",
  `<table class="source-table">
    <thead><tr><th>ID</th><th>Source</th><th>Use in dossier</th></tr></thead>
    <tbody>${sources.map((s) => `<tr><td>${s.id}</td><td><b>${s.name}</b><br><small>${s.url}</small></td><td>${s.note}<br><small>${retrieved}</small></td></tr>`).join("")}</tbody>
  </table>
  <p class="fine">Platform data comes from your supplied screenshots and the local read-only captures in this project. Address, phone, email, wallet, tracking, order logistics, and full account details are deliberately omitted.</p>`
));

const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Ghost x Zoro One Piece TCG Investment Dossier</title>
  <style>
    @font-face { font-family: Pirate; src: url("${rel("assets/raw/drive/fob_20140130.ttf")}"); }
    @page { size: A4 landscape; margin: 0; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #071014; color: #f3efe2; font-family: Inter, Avenir Next, Helvetica Neue, Arial, sans-serif; }
    .page { width: 297mm; height: 210mm; padding: 11mm 12mm; page-break-after: always; position: relative; overflow: hidden; background:
      radial-gradient(circle at 90% 10%, rgba(242,193,78,.22), transparent 28%),
      radial-gradient(circle at 10% 90%, rgba(18,199,184,.20), transparent 30%),
      linear-gradient(135deg, rgba(7,16,20,.95), rgba(15,49,64,.92) 55%, rgba(71,20,30,.88)); }
    .page::before { content: ""; position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px); background-size: 24px 24px; pointer-events: none; }
    .watermark-map { position: absolute; right: -20mm; top: -24mm; width: 175mm; opacity: .16; filter: saturate(1.2); transform: rotate(-6deg); }
    .page-kicker { position: relative; z-index: 2; color: #12c7b8; font-size: 10px; font-weight: 900; letter-spacing: 1.8px; text-transform: uppercase; }
    h1 { position: relative; z-index: 2; margin: 2mm 0 6mm; font-size: 26px; line-height: 1.02; letter-spacing: 0; max-width: 255mm; }
    h2 { margin: 0 0 4mm; font-size: 19px; line-height: 1.12; }
    h3 { margin: 0 0 2mm; font-size: 12px; }
    p { margin: 0 0 3mm; font-size: 10.5px; line-height: 1.42; color: rgba(243,239,226,.9); }
    small, .fine { font-size: 8.5px; line-height: 1.35; color: rgba(243,239,226,.66); }
    footer { position: absolute; left: 12mm; right: 12mm; bottom: 6mm; font-size: 7.5px; color: rgba(243,239,226,.52); border-top: 1px solid rgba(243,239,226,.14); padding-top: 2mm; }
    .page-body { position: relative; z-index: 2; }
    .cover-grid, .two-col { display: grid; grid-template-columns: 1.05fr .95fr; gap: 9mm; align-items: stretch; }
    .cover-copy h2 { font-size: 28px; line-height: 1.03; max-width: 130mm; }
    .cover-copy p { font-size: 12px; max-width: 130mm; }
    .hero-slabs { display: flex; gap: 5mm; align-items: center; justify-content: center; min-height: 115mm; }
    .cover-note, .decision-banner { margin-top: 5mm; padding: 4mm 5mm; background: rgba(7,16,20,.62); border: 1px solid rgba(18,199,184,.28); border-radius: 5px; font-size: 10px; }
    .metric-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; margin-top: 5mm; }
    .metric-row.wide { grid-template-columns: repeat(4, 1fr); margin-bottom: 5mm; }
    .metric, .thesis-card, .chart-panel, .offer-card, .rules-grid article, .channel-grid article, .plan-grid article, .ladder-row, .card-analysis { background: rgba(7,16,20,.62); border: 1px solid rgba(188,200,209,.18); border-radius: 6px; box-shadow: 0 14px 36px rgba(0,0,0,.18); }
    .metric { padding: 4mm; min-height: 25mm; }
    .metric span { display:block; color: rgba(243,239,226,.62); font-size: 8.5px; text-transform: uppercase; letter-spacing: .8px; }
    .metric b { display:block; font-size: 22px; margin-top: 2mm; color: #fffaf0; font-variant-numeric: tabular-nums; }
    .metric em { display:block; font-style: normal; color: rgba(243,239,226,.7); font-size: 8.5px; margin-top: 1mm; }
    .exec-grid, .analytics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 5mm; }
    .analytics-grid { grid-template-columns: 1fr 1fr 1fr; }
    .thesis-card, .chart-panel, .rules-grid article, .channel-grid article { padding: 5mm; }
    .thesis-card h3 { color: #f2c14e; font-size: 16px; }
    .slab { position: relative; width: 42mm; height: 70mm; padding: 3mm; border-radius: 4mm; background: linear-gradient(145deg, #dce4e8, #7f8c96 52%, #e7eef1); color: #071014; box-shadow: 0 20px 40px rgba(0,0,0,.35); transform: perspective(900px) rotateY(-9deg) rotateX(3deg); break-inside: avoid; }
    .slab-small { width: 28mm; height: 48mm; padding: 2mm; border-radius: 3mm; transform: perspective(800px) rotateY(-7deg) rotateX(2deg); }
    .slab-head { height: 11mm; display: flex; align-items: center; justify-content: space-between; background: #f7f4ed; border: 1px solid rgba(7,16,20,.18); padding: 0 2mm; font-size: 7px; font-weight: 900; }
    .slab-head span { font-size: 10px; }
    .slab-head.cgc { border-color: #12c7b8; }
    .slab-head.psa { border-color: #e54b4b; }
    .slab-art { height: 43mm; margin: 2mm 0; display: grid; place-items: center; background: linear-gradient(135deg, rgba(18,199,184,.25), rgba(242,193,78,.25)); border: 1px solid rgba(7,16,20,.16); overflow: hidden; }
    .slab-small .slab-art { height: 28mm; }
    .slab-art img { max-width: 98%; max-height: 100%; object-fit: contain; }
    .slab-meta b { display:block; font-size: 7.4px; line-height: 1.05; }
    .slab-meta span { font-size: 6.8px; color: rgba(7,16,20,.68); }
    .card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; }
    .card-analysis { display: grid; grid-template-columns: 31mm 1fr 43mm; gap: 4mm; padding: 3mm; min-height: 53mm; break-inside: avoid; }
    .muted { color: rgba(243,239,226,.64); font-size: 8.8px; }
    .inline-tags { display: flex; flex-wrap: wrap; gap: 1.5mm; margin: 1mm 0 2mm; }
    .inline-tags span, .pill, .source-chip { display: inline-flex; align-items: center; border-radius: 999px; padding: 1mm 2mm; font-size: 7.5px; font-weight: 800; background: rgba(18,199,184,.14); color: #dffdfa; border: 1px solid rgba(18,199,184,.26); }
    .pill.green { background: rgba(18,199,184,.18); color: #bffff8; }
    .pill.yellow { background: rgba(242,193,78,.18); color: #ffe69d; border-color: rgba(242,193,78,.3); }
    .pill.red { background: rgba(229,75,75,.18); color: #ffb0a9; border-color: rgba(229,75,75,.3); }
    .score-row { display: grid; grid-template-columns: 22mm 1fr 8mm; gap: 2mm; align-items: center; margin: 1.4mm 0; font-size: 8px; }
    .score-row:has(span:empty) { grid-template-columns: 1fr 8mm; }
    .score-row span:empty { display:none; }
    .score-track { height: 2.2mm; background: rgba(243,239,226,.14); border-radius: 999px; overflow: hidden; }
    .score-track i { display:block; height: 100%; background: linear-gradient(90deg, #12c7b8, #8de0b0); border-radius: inherit; }
    .score-track i.gold { background: linear-gradient(90deg, #12c7b8, #f2c14e); }
    .score-track i.red { background: linear-gradient(90deg, #f2c14e, #e54b4b); }
    .decision-table, .source-table { width: 100%; border-collapse: collapse; background: rgba(7,16,20,.54); border-radius: 5px; overflow: hidden; }
    th, td { border-bottom: 1px solid rgba(243,239,226,.12); padding: 2.2mm; text-align: left; vertical-align: middle; font-size: 8.2px; line-height: 1.28; }
    th { color: #12c7b8; text-transform: uppercase; letter-spacing: .8px; font-size: 7px; }
    .rank { display:inline-grid; place-items:center; width: 6mm; height: 6mm; border-radius: 50%; background:#f2c14e; color:#071014; font-weight:900; }
    .offer-hero-grid, .channel-grid, .rules-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4mm; }
    .channel-grid, .rules-grid { grid-template-columns: repeat(3, 1fr); }
    .offer-card { padding: 3mm; display: grid; justify-items: start; min-height: 66mm; }
    .offer-card h3 { margin-top: 2mm; color: #f2c14e; }
    .tag-cloud { display:flex; flex-wrap:wrap; gap:2mm; margin:4mm 0; }
    .tag-cloud span { padding:2mm 3mm; background:rgba(242,193,78,.16); border:1px solid rgba(242,193,78,.28); border-radius:999px; font-weight:900; color:#fff4c2; }
    .ladder { display:grid; gap:3mm; }
    .ladder-row { display:grid; grid-template-columns: 26mm 1fr; align-items:center; padding:4mm; }
    .ladder-row b { color:#f2c14e; font-size:16px; }
    .timeline { display:grid; grid-template-columns: repeat(5, 1fr); gap:3mm; }
    .timeline > div { background: rgba(7,16,20,.62); border: 1px solid rgba(188,200,209,.18); border-top: 3px solid #12c7b8; padding: 4mm; border-radius: 5px; min-height: 88mm; }
    .timeline b { color:#f2c14e; font-size: 11px; }
    .projection-grid, .plan-grid { display:grid; grid-template-columns: repeat(2, 1fr); gap: 6mm; }
    .plan-grid { grid-template-columns: repeat(3, 1fr); }
    .plan-grid article { padding: 5mm; min-height: 62mm; }
    .plan-grid article > b { color:#12c7b8; font-size: 42px; line-height: 1; }
    .allocation { margin-top: 5mm; display:grid; grid-template-columns: repeat(3, 1fr); gap:4mm; }
    .allocation div { padding:4mm; border-radius:5px; background:rgba(7,16,20,.62); border:1px solid rgba(242,193,78,.22); }
    .allocation b { display:block; color:#f2c14e; font-size:28px; }
    .source-table td { font-size: 8px; }
    ol { margin: 0; padding-left: 5mm; }
    li { margin-bottom: 2mm; font-size: 10px; line-height: 1.35; }
  </style>
</head>
<body>${pages.join("\n")}</body>
</html>`;

const htmlPath = path.join(outDir, "ghost-zoro-one-piece-investment-dossier.html");
const pdfPath = path.join(outDir, "ghost-zoro-one-piece-investment-dossier.pdf");
fs.writeFileSync(htmlPath, html);

const markdown = `# Ghost x Zoro One Piece TCG Investment Dossier

Generated: ${today}

## Core Decisions

- Keep the highest-conviction bids: PSA 10 Sabo, ST29 Luffy PSA 9, Roger PSA 9, Ace PSA 9, ST01 Luffy PSA 9, and Newgate CGC 10 Pristine if the price stays disciplined.
- Cancel the weak bids: Shiki CGC 8, Roger CGC 8.5, and the Sabo PSA 9 if the PSA 10 bid remains live.
- Treat Carrot PSA 10, Franky CGC 10, Reiju CGC 10, Marco CGC 10, and Teach CGC 10 as optional flip/trade inventory, not core holds.
- Hold the strongest current core: Luffy promo/anniversary, Zoro-Juurou Pristine, Nami promo, and Crocodile Warlords/pre-release.
- Watch the July starter wave and August OP-17 schedule intelligence, but verify official Bandai English product details before committing heavy capital.

## Files

- PDF: report/ghost-zoro-one-piece-investment-dossier.pdf
- HTML: report/ghost-zoro-one-piece-investment-dossier.html
- Decision ledger: data/ghost-zoro-card-decisions.json

## Privacy

No address, phone, email, wallet, tracking, or order-logistics details are included.
`;
fs.writeFileSync(path.join(root, "docs/ghost-zoro-one-piece-investment-dossier.md"), markdown);

fs.writeFileSync(path.join(root, "data/ghost-zoro-card-decisions.json"), JSON.stringify({
  generatedAt: `${today}T10:45:00+02:00`,
  visibleCollectrValueUsd: currentVisibleValue,
  openCourtyardBidExposureUsd: offerExposure,
  illustrativeAtRiskStackUsd: capitalAtRisk,
  ownedCards,
  offerDecisions,
  sources,
  caveats: [
    "Educational scenario analysis only, not financial advice.",
    "No raw account-sensitive details are included.",
    "Slab visuals are analytical renders using official card art unless a platform image is explicitly labeled.",
    "OP-17 August 2026 is treated as schedule intelligence from non-official/retailer sources until official Bandai English publication is verified."
  ]
}, null, 2));

(async () => {
  const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const launchOptions = fs.existsSync(chromePath)
    ? {headless: true, executablePath: chromePath, args: ["--no-sandbox", "--disable-dev-shm-usage"]}
    : {headless: true};
  const browser = await chromium.launch(launchOptions);
  const pageObj = await browser.newPage({viewport: {width: 1600, height: 1131}, deviceScaleFactor: 1});
  await pageObj.goto(pathToFileURL(htmlPath).href, {waitUntil: "networkidle"});
  await pageObj.emulateMedia({media: "print"});
  await pageObj.pdf({
    path: pdfPath,
    printBackground: true,
    preferCSSPageSize: true,
    tagged: true
  });
  const pagesLoc = pageObj.locator(".page");
  await pagesLoc.nth(0).screenshot({path: path.join(outDir, "qa-cover.png")});
  await pagesLoc.nth(6).screenshot({path: path.join(outDir, "qa-offer-matrix.png")});
  await pagesLoc.nth(10).screenshot({path: path.join(outDir, "qa-drop-calendar.png")});
  await browser.close();
  console.log(JSON.stringify({
    htmlPath,
    pdfPath,
    pageCount: pages.length,
    sources: sources.length,
    ownedCards: ownedCards.length,
    offerDecisions: offerDecisions.length
  }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
