"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Camera,
  Crown,
  Eye,
  LockKeyhole,
  MessageCircle,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
  UsersRound,
  Zap
} from "lucide-react";
import { AuthPanel } from "@/components/AuthPanel";
import { formatZar, productStats } from "@/lib/products";
import { profiles } from "@/lib/seed-data";

type DraftCard = {
  name: string;
  set: string;
  value: number;
  visibility: "Private" | "Members" | "Public";
};

const starterCards: DraftCard[] = [
  { name: "OP01-016 Nami Alt Art PSA 10", set: "Romance Dawn", value: 18950, visibility: "Members" },
  { name: "OP01-001 Roronoa Zoro CGC 10 Pristine", set: "25th Anniversary", value: 3750, visibility: "Public" },
  { name: "Legacy of the Master sealed stock", set: "OP12 / OP16", value: 12400, visibility: "Private" }
];

const feed = [
  {
    author: "NamiCollects",
    tag: "Trade signal",
    body: "Looking for clean OP-12 parallels and event promos. Can trade sealed or top-grade slabs."
  },
  {
    author: "PirateKing94",
    tag: "Show prep",
    body: "Collect-a-Con binder is ready. Bring One Piece grails, Pokemon packs and clean sleeves."
  },
  {
    author: "CapeTCG",
    tag: "Market watch",
    body: "Low-supply graded One Piece still needs manual comps. Do not price from one stale data point."
  }
];

const quests = [
  "Attend Collect-a-Con",
  "Add 10 cards to your profile",
  "Complete a safe trade",
  "Submit a pre-grade intake",
  "Post a grail story"
];

export function ProfileCommandCenter() {
  const stats = productStats();
  const [cards, setCards] = useState<DraftCard[]>(starterCards);
  const [formState, setFormState] = useState({ name: "", set: "", value: "", visibility: "Private" as DraftCard["visibility"] });

  const collectionValue = useMemo(() => cards.reduce((sum, card) => sum + card.value, 0), [cards]);

  function addCard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedValue = Number.parseInt(formState.value.replace(/[^0-9]/g, ""), 10);
    setCards((current) => [
      {
        name: formState.name.trim() || "Untitled card",
        set: formState.set.trim() || "Manual entry",
        value: Number.isFinite(parsedValue) ? parsedValue : 0,
        visibility: formState.visibility
      },
      ...current
    ]);
    setFormState({ name: "", set: "", value: "", visibility: "Private" });
  }

  return (
    <>
      <section className="profile-command-hero">
        <div className="profile-id-card">
          <div className="profile-avatar">TVR</div>
          <div>
            <span>Member beta profile</span>
            <h1>My Vault Room</h1>
            <p>Build your collector identity, track grails, list cards, earn points and join the Cape Town crew.</p>
          </div>
          <div className="profile-level-bar">
            <strong>Level 28</strong>
            <span>3,240 / 5,000 XP</span>
            <b />
          </div>
        </div>
        <div className="profile-command-actions">
          <Link className="primary-action" href="/auth/sign-in">
            <LockKeyhole aria-hidden size={18} />
            Create account
          </Link>
          <Link className="secondary-action" href="/community">
            <UsersRound aria-hidden size={18} />
            Join crew
          </Link>
        </div>
      </section>

      <section className="profile-stat-grid">
        <article>
          <TrendingUp aria-hidden size={22} />
          <span>Demo collection value</span>
          <strong>{formatZar(collectionValue)}</strong>
          <em>Protocol pricing ready</em>
        </article>
        <article>
          <ShoppingBag aria-hidden size={22} />
          <span>Vault catalogue</span>
          <strong>{stats.products}</strong>
          <em>{formatZar(stats.totalValue)} listed value</em>
        </article>
        <article>
          <Zap aria-hidden size={22} />
          <span>Vault points</span>
          <strong>2,085</strong>
          <em>Show and trade quests</em>
        </article>
        <article>
          <Crown aria-hidden size={22} />
          <span>Rank preview</span>
          <strong>#4</strong>
          <em>Opt-in leaderboard</em>
        </article>
      </section>

      <section className="profile-dashboard-grid">
        <article className="tool-panel profile-collection-panel">
          <div className="tool-panel__head">
            <span>
              <Camera aria-hidden size={18} />
              Add to collection
            </span>
            <em>Local beta demo</em>
          </div>
          <form className="profile-form" onSubmit={addCard}>
            <label>
              Card or product name
              <input
                onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
                placeholder="e.g. OP13 Shanks Alt Art PSA 10"
                value={formState.name}
              />
            </label>
            <label>
              Set / note
              <input
                onChange={(event) => setFormState((current) => ({ ...current, set: event.target.value }))}
                placeholder="OP13 Carrying on His Will"
                value={formState.set}
              />
            </label>
            <div className="profile-form-row">
              <label>
                Value estimate
                <input
                  inputMode="numeric"
                  onChange={(event) => setFormState((current) => ({ ...current, value: event.target.value }))}
                  placeholder="R value"
                  value={formState.value}
                />
              </label>
              <label>
                Visibility
                <select
                  onChange={(event) => setFormState((current) => ({ ...current, visibility: event.target.value as DraftCard["visibility"] }))}
                  value={formState.visibility}
                >
                  <option>Private</option>
                  <option>Members</option>
                  <option>Public</option>
                </select>
              </label>
            </div>
            <button className="primary-action" type="submit">
              <Plus aria-hidden size={17} />
              Add card
            </button>
          </form>
          <div className="profile-card-list">
            {cards.map((card) => (
              <div key={`${card.name}-${card.set}`}>
                <strong>{card.name}</strong>
                <span>{card.set}</span>
                <em>{formatZar(card.value)}</em>
                <b>{card.visibility}</b>
              </div>
            ))}
          </div>
        </article>

        <article className="tool-panel profile-market-panel">
          <div className="tool-panel__head">
            <span>
              <ShoppingBag aria-hidden size={18} />
              List a card
            </span>
            <em>Moderator flow</em>
          </div>
          <div className="listing-flow">
            <div>
              <Pencil aria-hidden size={18} />
              <strong>Draft listing</strong>
              <span>Card identity, condition, asking range, trade options and proof photos.</span>
            </div>
            <div>
              <ShieldCheck aria-hidden size={18} />
              <strong>Admin review</strong>
              <span>We check scams, variant mismatches, price evidence and safe handover terms.</span>
            </div>
            <div>
              <Eye aria-hidden size={18} />
              <strong>Public or members only</strong>
              <span>Choose if the listing is visible to everyone, members, or only sent to the admin desk.</span>
            </div>
          </div>
          <Link className="secondary-action" href="/consign">
            Start sell or trade intake
          </Link>
        </article>

        <article className="tool-panel profile-feed-panel">
          <div className="tool-panel__head">
            <span>
              <MessageCircle aria-hidden size={18} />
              Community feed
            </span>
            <em>Preview</em>
          </div>
          <div className="social-feed-list">
            {feed.map((item) => (
              <div key={`${item.author}-${item.tag}`}>
                <strong>{item.author}</strong>
                <em>{item.tag}</em>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="tool-panel profile-dm-panel">
          <div className="tool-panel__head">
            <span>
              <Search aria-hidden size={18} />
              Messages & search
            </span>
            <em>Coming online</em>
          </div>
          <div className="message-preview-list">
            <div>
              <strong>ZoroHunter</strong>
              <span>Is the OP01 Zoro still available?</span>
            </div>
            <div>
              <strong>GradedGoat</strong>
              <span>Can I trade into the Nami slab?</span>
            </div>
            <div>
              <strong>New member search</strong>
              <span>Find collectors by handle, crew role, card wishlists and trusted trade count.</span>
            </div>
          </div>
        </article>

        <article className="tool-panel profile-points-panel">
          <div className="tool-panel__head">
            <span>
              <Star aria-hidden size={18} />
              Points quests
            </span>
            <em>Season 01</em>
          </div>
          <div className="quest-list">
            {quests.map((quest, index) => (
              <div key={quest}>
                <b>{index + 1}</b>
                <span>{quest}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="tool-panel profile-members-panel">
          <div className="tool-panel__head">
            <span>
              <BadgeCheck aria-hidden size={18} />
              Crew leaderboard
            </span>
            <em>Opt-in</em>
          </div>
          <div className="compact-list">
            {profiles.map((profile) => (
              <div key={profile.id}>
                <strong>{profile.handle}</strong>
                <span>{profile.crewRole}</span>
                <em>{profile.battlePoints.toLocaleString("en-ZA")} pts</em>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="profile-platform-roadmap">
        <article>
          <ShieldCheck aria-hidden size={24} />
          <strong>What needs keys or setup</strong>
          <span>Supabase URL/anon key, OAuth providers, storage buckets, moderation roles, email templates and production terms.</span>
        </article>
        <article>
          <Sparkles aria-hidden size={24} />
          <strong>What works now</strong>
          <span>Catalogue browsing, cart invoice flow, gacha demo, market terminal, event pages, profile demo and WhatsApp handoff.</span>
        </article>
      </section>

      <AuthPanel />
    </>
  );
}
