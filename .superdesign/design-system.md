# Ghost x Zoro Grand Line TCG + The Vault Room Design System

## Project Context

Private, password-gated One Piece TCG strategy workspace for Ghost and Zoro. Current deliverables include the earlier Remotion/report package plus a Unity WebGL game portal where Ghost and Zoro can walk a 3D ship/island hub, speak to Straw Hat NPCs, inspect slab pedestals, review portfolio analytics, and maintain the card database. One Piece-themed Drive, official card-list, and platform capture assets are private-use only and must not be treated as public/commercial release assets.

New community/business layer: `The Vault Room`, formerly tracked internally as OP CPT, is a Cape Town collector community and trading-card business for cards, collectibles, grails, pricing, trades, consignment, events, and collection discovery. It must preserve the Ghost/Zoro private archive while adding a public-safe Vault Room shell and gated fan-themed member experience.

## Visual Identity

- Mood: premium trading desk meets sea-chart adventure.
- Composition: full-bleed ocean map, stylized Thousand Sunny trading post, readable HUD panels, metallic PSA/CGC slab pedestals, bounty-board analytics, and archive-room media surfaces.
- Avoid: public-release branding claims, fake official endorsement, cluttered fan-collage layouts, unreadable fantasy typography, and UI panels that block the player view.

## The Vault Room Visual Identity

- Brand: `The Vault Room`.
- Tagline: `Cards. Collectibles. Grails.`
- Secondary lines: `Unlock your grail.`, `Every card has a story.`, `More than cards. We're a community.`
- Social: Instagram `@thevaultroom.cpt`; WhatsApp community `https://chat.whatsapp.com/LgAy8Q0NgVp9NcU7oJXBDy`.
- Primary mark: circular vault-keyhole crest with gold ring, ocean waves, collector symbols, and cream parchment base.
- App concept: premium collector vault and Cape Town harbor portal with collectible islands, slab pedestals, rankings, market watch, event panels, and member-beta sign-in.
- Public shell: original nautical/card/Cape Town motifs only; no official One Piece logo, skull mark, exact character likenesses, or fake official endorsement.
- Gated member areas: fan assets from Drive may be used with private fan-project disclaimers.
- Approved references:
  - Poster example: `media/branding/vault-room-poster-example.jpg`
  - Crest: `media/branding/vault-room-crest.jpg`
  - Primary logo: `media/branding/vault-room-primary-logo.jpg`
  - Brand board: `media/branding/vault-room-brand-board.jpg`
  - Brand kit source: `/Users/mx/Desktop/the_vault_room_brandkit/`
  - Transparent crest: `/Users/mx/Desktop/the_vault_room_brandkit/assets/icon_mark_crest_transparent.png`
  - Transparent horizontal lockup: `/Users/mx/Desktop/the_vault_room_brandkit/assets/horizontal_lockup_transparent.png`
  - Transparent primary lockup: `/Users/mx/Desktop/the_vault_room_brandkit/assets/primary_logo_lockup_transparent.png`

## Tokens

- Canvas: `1920x1080`, 30fps, safe text margins `96px` horizontal and `72px` vertical.
- Unity WebGL: desktop-first `16:9` responsive canvas with mobile-ish fallback, camera-safe HUD margins `32px`, dialogue max width `720px`.
- Interaction: WASD/arrow movement, mouse camera, `E` interact, `Esc` menu, visible focus state for wrapper forms.
- PDF: A4 landscape for visual analytics pages, `12mm` page margin, print-safe dark mode with high-contrast panels and page-level source footers.
- Certificate PDF: A4 landscape, print-safe cream canvas, double border inside `10mm`, all text at least `12mm` from page edge, official-looking but explicitly independent from PSA/BGS/CGC.
- Colors:
  - `ink`: `#071014`
  - `night`: `#0b1720`
  - `deep-sea`: `#0f3140`
  - `teal`: `#12c7b8`
  - `gold`: `#f2c14e`
  - `red`: `#e54b4b`
  - `paper`: `#f3efe2`
  - `silver`: `#bcc8d1`
  - `op-cpt-navy`: `#081d2a`
  - `op-cpt-teal`: `#0fa3a6`
  - `op-cpt-gold`: `#d4af37`
  - `op-cpt-cream`: `#f2e9d6`
  - `op-cpt-red`: `#d72638`
  - `op-cpt-storm`: `#39424e`
  - `vault-navy`: `#0D4EA2`
  - `vault-blue`: `#2176D2`
  - `vault-gold`: `#D4AF37`
  - `vault-coral`: `#FF6B5B`
  - `vault-sky`: `#7EC6F0`
  - `vault-cream`: `#FFF7E6`
- Type:
  - Display: system serif fallback for title moments, `Georgia`, `Times New Roman`, serif.
  - Interface/data: `Inter`, `Avenir Next`, `Helvetica Neue`, Arial, sans-serif.
  - Numeric overlays: tabular figures with `font-variant-numeric: tabular-nums`.
- Motion:
  - Establishing scenes: slow parallax, 0.4-0.8 degrees per second.
  - Market overlays: crisp slide/fade, 8-14 frame entrances.
  - Cards/slabs: z-depth drift, tilt under 12 degrees, no sudden flips that obscure text.
  - Game idle loops: NPC bob/gesture cycles, ship flags/waves, slab shimmer under 8 degrees.
  - Gameplay camera: no forced cinematic camera movement during player control.
- Audio:
  - Narration must remain intelligible over all music.
  - Target mix: voice around `-16 LUFS` integrated; music bed at least `-18dB` below voice during narration.

## Components

- Slab Card: metallic frame, grade badge, character/title, set, card number, value/offer.
- PDF Slab Render: official card art or platform screenshot thumbnail inside a PSA/CGC-style slab mockup; must be labeled as an analytical render unless it is a real cert/platform image.
- Source Chip: compact bottom-corner citation with publisher + year/date.
- Strategy Pill: short labels for `Flip`, `Hold`, `Watch`, `Avoid`.
- Portfolio Table: high contrast dark panel, 4-6 rows per shot max.
- Scenario Band: conservative/base/upside bars; clear disclaimer that these are educational scenarios, not guaranteed profit.
- Subtitle Bar: bottom-safe caption strip with 72px minimum margin and two-line maximum.
- Report Page: one dominant thesis per page, 2-3 visual anchors max, no tiny spreadsheet walls.
- Lab Certificate Page: clear certificate number, reviewer, inspection date, signature/stamp, result panel, grade projection table, front/back specimen photo, and independence note.
- Decision Matrix: clear action column first, then rationale, risk, and next trigger.
- Projection Chart: conservative/base/upside bands labeled as scenario analysis only.
- Source Ledger: full URL list with retrieval dates and confidence notes.
- Password Gate: dark ocean-map backdrop, passcode field, no visible secret, clear private-use warning.
- Character Select: Luffy and Zoro as equal choices, full-height character cards, one confirm action.
- NPC Dialogue: speaker portrait, topic chip, concise current recommendation, detail tabs for evidence.
- Bid Board: keep/cancel badges, total exposure, duplicate/low-grade warnings, no account-sensitive details.
- Manual Entry: scanner/manual split, nullable cert number, required source/provenance field.
- Vault Room Harbor Hub: full-bleed React Three Fiber canvas with DOM HUD, landmark buttons, member CTA, and responsive bottom nav.
- Vault Room Member Card: avatar/crew tag, collection value, battle points, trade count, privacy chip.
- Vault Room Trade Offer: offered/requested items, status, expiration, message, no payment fields.
- Vault Room Event Card: venue, date, format, cap, RSVP state, prize/pack-rip notes.
- Vault Room Price Tile: source, latest snapshot, trend delta, confidence, retrieved date.
- Vault Room Scanner Entry: camera/upload affordance plus manual fallback; never claims recognition is final until verified.
- Vault Room Admin Queue: pending beta requests, flagged trades, event approvals, group-buy moderation.

## Unity Scene Rules

- Title screen must answer "what is this?" in one viewport: `Ghost x Zoro Grand Line TCG`.
- Hub must be legible from the spawn point: archive, bid board, card vault, media theater, and NPC cluster are visible landmarks.
- Characters can be stylized/proxy in the first tranche, but the data UI must be real and complete.
- Card images from `media/cards/` and `assets/cards/official/` are analytics/reference assets. Label generated slab renders as mockups.
- No PII, tracking, order address, wallet, payment, or full account data may be shown in any game UI, docs, screenshots, or deployment payload.

## Accessibility And QA

- Every text overlay must fit inside the 1920x1080 title-safe area.
- PDF pages must render without clipped text, overlapping cards, cut-off charts, or unreadable footnotes.
- No personal address, phone, email, wallet, or order logistics may appear in visual assets, captions, script, or docs.
- On-screen claims need source IDs matching `data/research-sources.json`.
- Private fan assets may be used locally, but final docs must keep the no-commercial/public-use warning visible.
- Web wrapper must block unauthenticated access before loading the Unity build.
- Keyboard-only passcode entry and menu close must work.
- Text panels must remain readable at desktop, tablet, and mobile-ish viewport screenshots.

## The Vault Room Web App Rebuild Contract

- Approved web-app concept: `/Users/mx/.codex/generated_images/019e5aad-8f01-7693-af95-0b5f09d91496/ig_0aa7a08c7ea83174016a36846e3b0081919a8a2d075c98d527.png`.
- Current hero-art layer: `apps/op-cpt/public/branding/vault-room-anime-packrip-hero.jpg`, generated from the user's direction for an anime collector crew ripping packs, holding graded slabs, and trading around the Vault Room harbor table.
- Future visual build direction: assemble the homepage layer by layer instead of as a flat screenshot. Keep separate assets for parchment map background, Table Mountain harbor, collector crew, vault door glow, product renders, cart rail, auction rail, and mobile preview so the live UI remains responsive and editable.
- Owned Courtyard slab photo source: `/Users/mx/Documents/my_slabs`. Use these photos for matching existing catalogue listings and selected featured cards, but do not expose Courtyard/source wording in customer-facing UI. Do not white out, blur, mask, or cover certification labels/cert numbers in owned-card photos, hero artwork, product cards, cart thumbnails, or detail views.
- Public web brand is `The Vault Room`; old `OP CPT` language must not appear in customer-facing copy.
- Desktop layout must follow the concept: parchment sea-map canvas, dark navy top strip, left brand/CTA area, central Table Mountain/vault/card-table hero art, right cart rail, live auction rail, product grid, and bottom community strip.
- Mobile layout must follow the concept: compact top bar, poster-style hero, show RSVP card, collector strip, featured product card, and bottom navigation.
- Homepage product rail should show one curated featured row only, then route users to `/shop` for the complete inventory and sorting.
- Catalogue source of truth is the combined Loyverse file. Every public sale item must appear in `/shop` with a price, stock status, image/fallback render, and detail page.
- Catalogue imagery is driven by `apps/op-cpt/src/data/product-images.json`: use owned Courtyard slab photos first for matching slabs, official One Piece card/product images for exact card-number/product matches, and Vault Room branded fallback renders only where exact product photography has not been sourced yet.
- Image provenance must stay public-safe: do not expose local `file:///Users/...` paths or internal ownership notes in browser data.
- Public catalogue must strip all internal owner/source labels. Forbidden in customer UI: `Yaseen`, `Yaseen's Cards`, `Vault Room main collection`, `source row`, `staff note`, `cost basis`, `floor`, `walk-away`.
- Pre-grading/authentication service is a public product/service at `R150` per card, excluding shipping if not dropped off.

## Vault Gacha Demo Contract

- Route: `/gacha`.
- Status: visual demo / coming soon until payment, legal rules, odds publication, stock reservation, shipping terms, refund terms, and compliance controls are finalized.
- References: Phygitals East Blue Pack, CollectorCrypt Gacha, Gacha Game One Piece packs, Courtyard One Piece Pro Pack.
- Current video direction: use a clean Vault Room vending-machine idle loop first, then trigger a separate pack-rip/reveal clip when the user presses the CTA. The result panel appears only after the reveal clip ends.
- Core interaction: select pack tier, watch the looped glossy vault/gacha machine, rip a virtual pack, reveal a real catalogue-backed prize, then preview `Redeem`, `Vault`, or `Accept 75% FMV buyback`.
- Payment methods shown as future rails only: Crypto, Visa, Mastercard, EFT, PayPal, Apple Pay, Google Pay, Stripe, PayFast.
- Public prize pool may use only public catalogue fields and images. It must not expose internal owner/source names, staff floors, cost basis, or consignment notes.
- Design must feel AAA/premium, not low-poly: polished metallic vending cabinet, glowing shelves, glass slab display, capsule lights, pack-rip flash, prize spotlight, parchment sea-map UI, and mobile stacked controls.
- Odds must be internally consistent: every displayed tier needs at least one prize in that tier, and demo EV should be calculated from the current prize pool rather than hard-coded marketing copy.

## Vault Room Platform Expansion Contract

- Customer-facing feature pages must be honest beta surfaces, not fake live infrastructure. If profiles, marketplace, auctions, gacha, payments, messages, or scanner recognition are not fully wired, say so in-product and route users to WhatsApp/manual confirmation.
- New platform routes should support the business vision without exposing internal data:
  - `/collection`: portfolio search, scanner entry, manual card draft, public/private visibility model.
  - `/market`: pricing protocol, watchlist, source ledger, confidence labels, no blind Collectr-only valuations.
  - `/trades`: negotiation prompts and wishlists only; no escrow or payment claims.
  - `/rankings`: opt-in battle/collection leaderboard preview.
  - `/group-buys`: admin-moderated interest board only; no deposit collection until terms are approved.
  - `/profile`: member sign-in readiness, portfolio privacy, marketplace/comment/DM roadmap.
- Public copy must position The Vault Room as a trusted Cape Town collector operating desk: browse, enquire, confirm, pay/collect through approved human workflow until checkout, moderation, and legal terms are production-ready.
