export type GradeCompany = "PSA" | "CGC" | "BGS" | "RAW" | "SEALED";

export type CardRecord = {
  id: string;
  title: string;
  character: string;
  setName: string;
  cardNumber: string;
  year: number | null;
  language: "English" | "Japanese" | "Mixed" | "Unknown";
  rarity: string;
  variant: string;
  gradeCompany: GradeCompany;
  grade: string | null;
  certNumber: string | null;
  ownerHandle: string;
  status: "owned" | "inbound" | "watchlist" | "offer";
  quantity: number;
  privacy: "public" | "members" | "private";
  marketValueZar: number | null;
  source: string;
  notes: string;
  tags: string[];
};

export type MemberProfile = {
  id: string;
  handle: string;
  crewRole: string;
  location: string;
  avatarTone: string;
  collectionValueZar: number;
  battlePoints: number;
  tradeCount: number;
  privacy: "public" | "members";
};

export type EventRecord = {
  id: string;
  title: string;
  date: string;
  venue: string;
  format: string;
  capacity: number;
  attending: number;
  status: "open" | "waitlist" | "full";
  notes: string;
};

export type TradeOffer = {
  id: string;
  fromHandle: string;
  seeking: string;
  offering: string;
  status: "open" | "review" | "accepted" | "expired";
  expiresIn: string;
  notes: string;
};

export type RankingRow = {
  handle: string;
  rank: number;
  battlePoints: number;
  collectionValueZar: number;
  specialty: string;
};

export type SourceRecord = {
  id: string;
  title: string;
  url: string;
  category: "official" | "market" | "competitive" | "local" | "technical";
  retrievedAt: string;
  notes: string;
};

export type NewsItem = {
  id: string;
  title: string;
  date: string;
  sourceId: string;
  summary: string;
  cta: string;
};

export type GroupBuy = {
  id: string;
  title: string;
  target: string;
  interestCount: number;
  status: "interest" | "quote-needed" | "admin-review" | "closed";
  notes: string;
};

export type Landmark = {
  id: string;
  label: string;
  route: string;
  x: number;
  z: number;
  color: string;
  summary: string;
};
