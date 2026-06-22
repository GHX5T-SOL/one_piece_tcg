# The Vault Room Platform Expansion Review

Date: 2026-06-22

## Current Intent

The Vault Room is evolving from a polished show catalogue into a broader Cape Town collector platform: shop, auctions, gacha demo, profile/portfolio, collection scanner/manual entry, community discovery, user marketplace, messages, leaderboards, events, grading/authentication, and consignment.

## Visual Contract

- Preserve the approved parchment sea-map, Table Mountain harbor, navy/gold Vault Room identity, and anime collector energy.
- Do not disturb the currently approved homepage composition unless a change is independently verified visually.
- New pages should feel like premium collector tools inside the same harbor/vault system, not plain SaaS dashboards.
- Gacha remains its own `/gacha` route and must not leak into the homepage beyond navigation.
- All public catalogue copy must stay customer-safe and source-neutral.

## Feature Expansion Principles

- Build useful demo/product surfaces now, but avoid claiming payments, escrow, live market-price sync, messaging, or scanner recognition are fully operational until the backend and legal/compliance rules are wired.
- Prefer "coming soon", "beta", "manual verification", and "request access" wording over fake completion.
- Every feature should route to a real next action: WhatsApp, profile setup form, manual card entry, marketplace listing draft, RSVP, or shop/gacha CTA.
- Keep payment mechanics in invoice/WhatsApp-confirmation mode.

## Immediate Implementation Slice

1. Correct `TVR-CAT-0001` with the user-supplied transparent BVB `ST13-003` image.
2. Improve public member/community pages with profile, portfolio privacy, scanner/manual entry, leaderboard, marketplace, and messaging preview modules.
3. Add stronger gacha information architecture: pack tiers, odds transparency, redemption/sellback explanation, prize pool, payments-coming-soon, and compliance notes.
4. Add a platform review document capturing council findings, competitor-inspired patterns, risks, and next implementation phases.
5. Run desktop/mobile visual QA on `/`, `/shop`, `/product/...ST13-003...`, `/community`, `/profile`, `/market`, and `/gacha`.

## Risks To Avoid

- Do not expose private owner/source names in public UI.
- Do not imply official affiliation with anime/card publishers.
- Do not imply live payment processing, escrow, card-recognition accuracy, or guaranteed market prices.
- Do not break the one-row featured-products home pattern.
- Do not replace real slab/card imagery with wrong variants where exact photos exist.
