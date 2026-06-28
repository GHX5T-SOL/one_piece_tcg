# Vault Room Platform Social + Vault Credit Upgrade

Created: 2026-06-28 11:30 SAST

## Goal

Upgrade the live `apps/op-cpt` storefront from a catalogue preview into a fuller Vault Room company platform while preserving the working shop, cart, gacha, and market surfaces.

## Required Product Changes

- Update the next public event from the past Reload show to Cape Town Collect-a-Con at Protea Fire & Ice! Cape Town on Saturday 4 July 2026.
- Replace the header profile CTA label `Captain` with `My Profile`.
- Add a new coming-soon service inspired by trading-card collateral lending. Working name: `Vault Credit`.
- Improve sign-in/account creation as a friendly beta onboarding surface with OAuth-ready provider buttons, email capture, and WhatsApp fallback.
- Expand `/profile` into a social collector command center: dashboard stats, add-card flow, sale listing starter, feed, DMs, leaderboard, points, account/privacy status, and platform roadmap.
- Add backend/schema groundwork for profiles, collections, listings, feed posts, messages, points, and Vault Credit enquiries without requiring live Supabase keys for the static build.
- Add stronger site-wide anime trading-card energy using the existing parchment/navy/gold system: devil-fruit rings, electric sparks, card-shine motion, duel-board panels, aura borders, and pirate-harbor motifs.

## Visual Direction

- Keep the approved Vault Room homepage architecture and current hero image.
- Apply polish through reusable surfaces rather than rebuilding the homepage from scratch.
- Use high-quality anime/gamified accents in CSS: gold sparkles, blue lightning, red/orange aura, sea-map borders, collector-card rails.
- Public copy must remain honest: profile/social/checkout/payment/collateral features are beta or coming soon unless actually wired.

## Implementation Constraints

- Do not expose internal owner/source labels in public UI.
- Do not imply active loan issuance, live payments, escrow, automated pricing, or guaranteed card-backed credit.
- Do not break the current product catalogue, cart drawer, invoice checkout, or gacha route.
- Keep Vercel deploy working from `apps/op-cpt`.

## QA

- Run `npm run typecheck`, `npm run lint`, and `npm run build` in `apps/op-cpt`.
- Run rendered QA at `http://127.0.0.1:3025/` and inspect `/events`, `/profile`, `/auth/sign-in`, and `/vault-credit`.
- Push only after build and smoke checks pass.
