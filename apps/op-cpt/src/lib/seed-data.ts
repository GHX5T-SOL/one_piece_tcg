import type {
  CardRecord,
  EventRecord,
  GroupBuy,
  Landmark,
  MemberProfile,
  NewsItem,
  RankingRow,
  SourceRecord,
  TradeOffer
} from "./types";

export const brand = {
  name: "OP CPT",
  tagline: "Cape Town's Grand Line for cards, battles, and trades.",
  disclaimer:
    "Unofficial member-beta fan community. Not affiliated with Bandai, Toei, Shueisha, or official One Piece rights holders.",
  telegramUrl: process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/opcpt-placeholder",
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/opcpt-placeholder"
};

export const profiles: MemberProfile[] = [
  {
    id: "ghost23",
    handle: "Ghost23",
    crewRole: "Founder / Collector",
    location: "Cape Town",
    avatarTone: "gold compass",
    collectionValueZar: 28450,
    battlePoints: 2085,
    tradeCount: 7,
    privacy: "members"
  },
  {
    id: "zoro_king",
    handle: "Zoro_King",
    crewRole: "Sword Deck Captain",
    location: "Cape Town",
    avatarTone: "teal blade",
    collectionValueZar: 22100,
    battlePoints: 2460,
    tradeCount: 4,
    privacy: "members"
  },
  {
    id: "nakamaace",
    handle: "NakamaAce",
    crewRole: "Event Grinder",
    location: "Cape Town",
    avatarTone: "signal red",
    collectionValueZar: 17600,
    battlePoints: 2210,
    tradeCount: 9,
    privacy: "members"
  }
];

export const cards: CardRecord[] = [
  {
    id: "nami-st01-007-cgc9",
    title: "Nami (CS 2023 Celebration Pack)",
    character: "Nami",
    setName: "One Piece Promotion Cards",
    cardNumber: "ST01-007",
    year: 2023,
    language: "English",
    rarity: "Promo",
    variant: "Celebration / Tournament style promo",
    gradeCompany: "CGC",
    grade: "9 MINT",
    certNumber: "CGC-REDACTED-001",
    ownerHandle: "Ghost23",
    status: "owned",
    quantity: 1,
    privacy: "members",
    marketValueZar: null,
    source: "Collectr profile and user-supplied inventory",
    notes: "High-priority Nami card. Verify sold comps before pricing publicly.",
    tags: ["promo", "nami", "graded", "hold"]
  },
  {
    id: "luffy-eb02-061",
    title: "Monkey.D.Luffy (061)",
    character: "Monkey D. Luffy",
    setName: "Extra Booster: Anime 25th Collection",
    cardNumber: "EB02-061",
    year: null,
    language: "Unknown",
    rarity: "Unknown",
    variant: "Anime 25th Collection",
    gradeCompany: "RAW",
    grade: null,
    certNumber: null,
    ownerHandle: "Ghost23",
    status: "owned",
    quantity: 1,
    privacy: "members",
    marketValueZar: null,
    source: "Collectr profile and user-supplied inventory",
    notes: "Keep as Luffy theme depth unless upgraded into a stronger promo/alt art.",
    tags: ["luffy", "raw", "theme"]
  },
  {
    id: "zoro-juurou-st18-004-cgc10",
    title: "Zoro-Juurou",
    character: "Zoro-Juurou",
    setName: "Starter Deck 18: PURPLE Monkey.D.Luffy",
    cardNumber: "ST18-004",
    year: 2024,
    language: "Japanese",
    rarity: "SR",
    variant: "Starter Deck SR",
    gradeCompany: "CGC",
    grade: "10 PRISTINE",
    certNumber: "CGC-REDACTED-002",
    ownerHandle: "Ghost23",
    status: "owned",
    quantity: 1,
    privacy: "members",
    marketValueZar: null,
    source: "Collectr profile and user-supplied inventory",
    notes: "Core OP CPT identity piece because it fits the Zoro/crew theme and pristine label.",
    tags: ["zoro", "graded", "pristine", "hold"]
  },
  {
    id: "op13-040-anniversary-event",
    title: "I Know You're Strong... So I'll Go All Out from the Very Start!!!",
    character: "Event",
    setName: "3rd Anniversary Treasure Campaign Pack",
    cardNumber: "OP13-040",
    year: 2025,
    language: "Japanese",
    rarity: "Event",
    variant: "3rd Anniversary Treasure Campaign",
    gradeCompany: "RAW",
    grade: null,
    certNumber: null,
    ownerHandle: "Ghost23",
    status: "owned",
    quantity: 1,
    privacy: "members",
    marketValueZar: null,
    source: "Collectr profile and user-supplied inventory",
    notes: "Anniversary campaign context makes it useful for the community archive.",
    tags: ["anniversary", "campaign", "raw"]
  },
  {
    id: "franky-op01-021-cgc10",
    title: "Franky",
    character: "Franky",
    setName: "Premium Card Collection - ONE PIECE FILM RED Edition",
    cardNumber: "OP01-021",
    year: 2023,
    language: "English",
    rarity: "Promo",
    variant: "Alt Art",
    gradeCompany: "CGC",
    grade: "10 GEM MINT",
    certNumber: "CGC-REDACTED-003",
    ownerHandle: "Ghost23",
    status: "owned",
    quantity: 1,
    privacy: "members",
    marketValueZar: null,
    source: "Collectr profile and user-supplied inventory",
    notes: "Good Straw Hat support card; trade-up candidate if it funds bigger manga/alt art targets.",
    tags: ["franky", "promo", "alt-art", "graded"]
  },
  {
    id: "learn-together-deck-set",
    title: "Learn Together Deck Set",
    character: "Sealed",
    setName: "Learn Together Deck Set",
    cardNumber: "sealed",
    year: null,
    language: "Mixed",
    rarity: "Sealed Product",
    variant: "Deck set",
    gradeCompany: "SEALED",
    grade: null,
    certNumber: null,
    ownerHandle: "Ghost23",
    status: "owned",
    quantity: 1,
    privacy: "members",
    marketValueZar: null,
    source: "Collectr profile and user-supplied inventory",
    notes: "Useful for teaching nights and entry-level community onboarding.",
    tags: ["sealed", "learn", "community"]
  },
  {
    id: "koala-op12-086-parallel",
    title: "Koala (parallel) (JP)",
    character: "Koala",
    setName: "Legacy of the Master",
    cardNumber: "OP12-086",
    year: 2025,
    language: "Japanese",
    rarity: "Parallel",
    variant: "Parallel",
    gradeCompany: "RAW",
    grade: null,
    certNumber: null,
    ownerHandle: "Ghost23",
    status: "owned",
    quantity: 1,
    privacy: "members",
    marketValueZar: null,
    source: "Collectr profile and user-supplied inventory",
    notes: "Nice character parallel; not a core grail target.",
    tags: ["parallel", "japanese", "raw"]
  },
  {
    id: "luffy-st21-001",
    title: "Monkey.D.Luffy - ST21-001 (Luffy Deck)",
    character: "Monkey D. Luffy",
    setName: "Learn Together Deck Set",
    cardNumber: "ST21-001",
    year: null,
    language: "Unknown",
    rarity: "Starter",
    variant: "Luffy Deck",
    gradeCompany: "RAW",
    grade: null,
    certNumber: null,
    ownerHandle: "Ghost23",
    status: "owned",
    quantity: 1,
    privacy: "members",
    marketValueZar: null,
    source: "Collectr profile and user-supplied inventory",
    notes: "Teaching/deck utility; not a trade-up anchor.",
    tags: ["luffy", "deck", "raw"]
  },
  {
    id: "crocodile-st03-001-psa9",
    title: "Crocodile (001)",
    character: "Crocodile",
    setName: "Super Pre-Release Starter Deck 3: The Seven Warlords of the Sea",
    cardNumber: "ST03-001",
    year: 2022,
    language: "English",
    rarity: "Super Pre-Release",
    variant: "Super Pre-Release",
    gradeCompany: "PSA",
    grade: "9 MINT",
    certNumber: "141882776",
    ownerHandle: "Ghost23",
    status: "owned",
    quantity: 1,
    privacy: "members",
    marketValueZar: null,
    source: "Collectr profile and user-supplied inventory",
    notes: "Early Warlords anchor. Hold unless upgrading into PSA 10 or a stronger trophy piece.",
    tags: ["crocodile", "super-pre-release", "psa", "hold"]
  },
  {
    id: "eb03-heroines-sleeved-pack",
    title: "Extra Booster: One Piece Heroines Edition Sleeved Booster Pack",
    character: "Sealed",
    setName: "Extra Booster: One Piece Heroines Edition",
    cardNumber: "EB03",
    year: 2026,
    language: "English",
    rarity: "Sealed Product",
    variant: "Sleeved booster pack",
    gradeCompany: "SEALED",
    grade: null,
    certNumber: null,
    ownerHandle: "Ghost23",
    status: "owned",
    quantity: 5,
    privacy: "members",
    marketValueZar: null,
    source: "Collectr profile and user-supplied inventory",
    notes: "Pack-rip/game-night material or sealed hold depending on supply.",
    tags: ["sealed", "heroines", "packs"]
  },
  {
    id: "zoro-op06-118",
    title: "Roronoa Zoro",
    character: "Roronoa Zoro",
    setName: "Wings of the Captain",
    cardNumber: "OP06-118",
    year: 2024,
    language: "Unknown",
    rarity: "Unknown",
    variant: "Standard",
    gradeCompany: "RAW",
    grade: null,
    certNumber: null,
    ownerHandle: "Ghost23",
    status: "owned",
    quantity: 1,
    privacy: "members",
    marketValueZar: null,
    source: "Collectr profile and user-supplied inventory",
    notes: "Zoro theme depth; upgrade path is higher-rarity Zoro alt art/trophy.",
    tags: ["zoro", "raw", "theme"]
  },
  {
    id: "luffy-st10-006-cgc10",
    title: "Monkey.D.Luffy - ST10-006",
    character: "Monkey D. Luffy",
    setName: "3rd Anniversary Treasure Campaign Pack",
    cardNumber: "ST10-006",
    year: 2025,
    language: "Japanese",
    rarity: "SR",
    variant: "3rd Anniversary Treasure Campaign",
    gradeCompany: "CGC",
    grade: "10 PRISTINE",
    certNumber: "CGC-REDACTED-004",
    ownerHandle: "Ghost23",
    status: "owned",
    quantity: 1,
    privacy: "members",
    marketValueZar: null,
    source: "Collectr profile and user-supplied inventory",
    notes: "Core Luffy promo hold. Strong fit for long-term collection identity.",
    tags: ["luffy", "anniversary", "graded", "pristine", "hold"]
  }
];

export const landmarks: Landmark[] = [
  { id: "collect", label: "Collect", route: "/collection", x: -3.6, z: 0.8, color: "#0fa3a6", summary: "Add cards, browse slabs, and inspect collection value." },
  { id: "battle", label: "Battle", route: "/events", x: 3.2, z: 1.1, color: "#d72638", summary: "Game nights, tournament check-ins, and player points." },
  { id: "trade", label: "Trade", route: "/trades", x: -2.6, z: -2.2, color: "#d4af37", summary: "Member-only offer board with no payments or escrow." },
  { id: "market", label: "Market", route: "/market", x: 0.3, z: -2.8, color: "#f2e9d6", summary: "Watchlists, price trends, and source-backed snapshots." },
  { id: "events", label: "Events", route: "/events", x: 2.7, z: -1.9, color: "#0fa3a6", summary: "Cape Town meetups, release nights, and pack rips." },
  { id: "rankings", label: "Rankings", route: "/rankings", x: 4.0, z: -0.3, color: "#d4af37", summary: "Best players, strongest collections, and crew achievements." },
  { id: "group-buys", label: "Group Buys", route: "/group-buys", x: -4.0, z: -1.0, color: "#d72638", summary: "Case interest, bulk grading, and admin-reviewed coordination." },
  { id: "news", label: "News", route: "/news", x: 0.0, z: 1.8, color: "#9ae6e8", summary: "OP releases, official events, lore hooks, and local updates." }
];

export const events: EventRecord[] = [
  {
    id: "game-night-june-6",
    title: "OP CPT Game Night",
    date: "2026-06-06",
    venue: "Fanaticus Clubhouse, Cape Town",
    format: "Casual battles, teaching table, trade window, pack-rip corner",
    capacity: 32,
    attending: 24,
    status: "open",
    notes: "Member-beta dry run. Bring trade binders, deck boxes, and verified want lists."
  },
  {
    id: "op16-release-watch",
    title: "OP-16 Release Watch",
    date: "2026-06-05",
    venue: "Online + local store calls",
    format: "Allocation tracking and group-buy interest",
    capacity: 40,
    attending: 18,
    status: "open",
    notes: "Official events page lists OP-16 Release Event for June 5-11, 2026."
  }
];

export const trades: TradeOffer[] = [
  {
    id: "trade-manga-upgrade",
    fromHandle: "Ghost23",
    seeking: "Manga / major alt art Luffy, Zoro, Shanks, Roger, Ace, or Sabo",
    offering: "Bundle of non-core modern slabs and sealed Heroines packs",
    status: "open",
    expiresIn: "14 days",
    notes: "Coordination only. Final deal happens in person or off-platform."
  },
  {
    id: "trade-deck-night",
    fromHandle: "Zoro_King",
    seeking: "Purple support cards and clean Zoro parallels",
    offering: "Starter staples, local cash-equivalent trade value, or sealed packs",
    status: "review",
    expiresIn: "7 days",
    notes: "Needs moderator review before public listing."
  }
];

export const rankings: RankingRow[] = [
  { rank: 1, handle: "Zoro_King", battlePoints: 2460, collectionValueZar: 22100, specialty: "Sword decks" },
  { rank: 2, handle: "NakamaAce", battlePoints: 2210, collectionValueZar: 17600, specialty: "Aggro events" },
  { rank: 3, handle: "Ghost23", battlePoints: 2085, collectionValueZar: 28450, specialty: "Promo slabs" },
  { rank: 4, handle: "Trafalgar_CPT", battlePoints: 1920, collectionValueZar: 18400, specialty: "Control" },
  { rank: 5, handle: "MarineHunter", battlePoints: 1840, collectionValueZar: 14950, specialty: "Sealed hunts" }
];

export const groupBuys: GroupBuy[] = [
  {
    id: "op16-box-interest",
    title: "OP-16 Booster Box Interest",
    target: "1-2 sealed boxes for Cape Town member split",
    interestCount: 9,
    status: "quote-needed",
    notes: "Admin must confirm allocation, language, price, and no payment collection through the app."
  },
  {
    id: "bulk-grading-july",
    title: "July Bulk Grading Submission",
    target: "PSA/CGC-ready cards with scanned condition notes",
    interestCount: 12,
    status: "interest",
    notes: "Use this to gather intent only; shipping/payment logistics stay human-managed."
  }
];

export const sources: SourceRecord[] = [
  {
    id: "official-events-op16",
    title: "Official One Piece events page",
    url: "https://en.onepiece-cardgame.com/events/",
    category: "official",
    retrievedAt: "2026-06-03",
    notes: "Shows OP-16 Release Event period June 5-11, 2026 at time of research."
  },
  {
    id: "official-rules-op16",
    title: "Official One Piece rules page",
    url: "https://en.onepiece-cardgame.com/rules/",
    category: "official",
    retrievedAt: "2026-06-03",
    notes: "Contains OP-16 errata/revision signal at time of research."
  },
  {
    id: "limitless-one-piece",
    title: "Limitless One Piece",
    url: "https://onepiece.limitlesstcg.com/",
    category: "competitive",
    retrievedAt: "2026-06-03",
    notes: "Tournament results, decklists, and card database reference."
  },
  {
    id: "optcg-gg",
    title: "OPTCG.GG",
    url: "https://optcg.gg/",
    category: "competitive",
    retrievedAt: "2026-06-03",
    notes: "Card search and deckbuilding reference."
  },
  {
    id: "pricecharting-api",
    title: "PriceCharting API documentation",
    url: "https://www.pricecharting.com/api-documentation",
    category: "market",
    retrievedAt: "2026-06-03",
    notes: "API documentation includes One Piece Cards category; requires key for production pricing."
  }
];

export const news: NewsItem[] = [
  {
    id: "op16-release-event",
    title: "OP-16 Release Event window",
    date: "2026-06-05",
    sourceId: "official-events-op16",
    summary: "Official event listings show the OP-16 Release Event running June 5-11, 2026.",
    cta: "Track local allocations"
  },
  {
    id: "op16-rules-watch",
    title: "OP-16 rules and errata watch",
    date: "2026-06-03",
    sourceId: "official-rules-op16",
    summary: "Rules page includes OP-16 errata/revision context, so competitive players should check final card text.",
    cta: "Read official rules"
  }
];

export const priceTrends = [
  { label: "Shanks OP13-065 Alt Art", delta: 12.4, source: "manual snapshot", confidence: "medium" },
  { label: "Portgas D. Ace Promo 053", delta: 8.7, source: "manual snapshot", confidence: "medium" },
  { label: "Marco OP02-018 Alt Art", delta: -3.1, source: "manual snapshot", confidence: "low" },
  { label: "Silvers Rayleigh OP12-001", delta: 5.6, source: "manual snapshot", confidence: "medium" }
];

export function findCard(id: string) {
  return cards.find((card) => card.id === id);
}

export function getCollectionValueZar() {
  return cards.reduce((sum, card) => sum + (card.marketValueZar || 0) * card.quantity, 0);
}
