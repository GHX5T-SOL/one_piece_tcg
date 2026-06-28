import Link from "next/link";
import { Banknote, CalendarDays, FlaskConical, Gem, PackageOpen, Radar, ShieldCheck, ShoppingBag, Trophy, UsersRound } from "lucide-react";

const quests = [
  {
    href: "/shop",
    label: "Shop the vault",
    body: "Sealed, slabs, singles and show stock.",
    icon: ShoppingBag,
    tone: "gold"
  },
  {
    href: "/gacha",
    label: "Vault Gacha",
    body: "Cinematic pack-rip demo and prize flow.",
    icon: PackageOpen,
    tone: "sky"
  },
  {
    href: "/collection",
    label: "Collection tracker",
    body: "Manual add, future scanner and showcase.",
    icon: Gem,
    tone: "coral"
  },
  {
    href: "/market",
    label: "Market terminal",
    body: "Signals, source ledger and pricing protocol.",
    icon: Radar,
    tone: "gold"
  },
  {
    href: "/vault-credit",
    label: "Vault Credit",
    body: "Future card-backed collector funding.",
    icon: Banknote,
    tone: "navy"
  },
  {
    href: "/events",
    label: "Events",
    body: "Shows, trade days, battles and meetups.",
    icon: CalendarDays,
    tone: "coral"
  },
  {
    href: "/grade-lab",
    label: "Grade Lab",
    body: "Pre-grade and authentication intake.",
    icon: FlaskConical,
    tone: "sky"
  },
  {
    href: "/community",
    label: "Community",
    body: "WhatsApp, Instagram, rankings and crews.",
    icon: UsersRound,
    tone: "gold"
  },
  {
    href: "/consign",
    label: "Sell / trade",
    body: "Buy-ins, trade-ins and consignment desk.",
    icon: ShieldCheck,
    tone: "navy"
  }
];

export function VaultQuestMap() {
  return (
    <section className="vault-quest-map" aria-labelledby="vault-quest-title">
      <div className="vault-quest-map__intro">
        <span>Choose your route</span>
        <h2 id="vault-quest-title">The Vault Room command map</h2>
        <p>
          A collector platform in beta: buy, trade, rip, price, grade, show off your collection and build the Cape Town crew from one
          shared vault.
        </p>
      </div>
      <div className="quest-grid">
        {quests.map(({ href, label, body, icon: Icon, tone }) => (
          <Link className="quest-card" data-tone={tone} href={href} key={href}>
            <span>
              <Icon aria-hidden size={18} />
            </span>
            <strong>{label}</strong>
            <em>{body}</em>
          </Link>
        ))}
      </div>
      <div className="quest-boss-card">
        <Trophy aria-hidden size={30} />
        <strong>Community endgame</strong>
        <span>Physical store, official tournament nights, Japan grail hunting, local price desk and collector-safe trade rails.</span>
      </div>
    </section>
  );
}
