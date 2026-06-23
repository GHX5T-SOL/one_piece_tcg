# The Vault Room Anime Terminal Polish

## Date
2026-06-23

## Goal
Lift the existing Vault Room app from a static catalogue feel into a richer anime collector terminal without changing the approved homepage structure. The user wants the entire site to keep the premium Cape Town anime crossover energy: One Piece-style pirate adventure, devil fruit/straw-hat cues, Thousand Sunny ocean energy, Dragon Ball lightning, Yu-Gi-Oh card-duel motifs, Pokemon/Pikachu collector warmth, and Naruto action accents.

## Design Direction
- Preserve the current homepage composition and hero image.
- Add global atmosphere through subtle parchment maps, aura glows, radial fruit-like rings, gold/blue/coral energy, and card-shine motion.
- Keep controls practical: clear buttons, readable filters, stable product cards, no cluttered decorative text.
- Make `/market` feel like a TCG trading terminal: index cards, sparkline charts, source radar, movers, pullbacks, and confidence meters.
- Public copy must remain honest: beta/manual-review state, no fake live market-data claims, and no guaranteed prices.

## Implementation Notes
- Use brand tokens from `.superdesign/design-system.md`.
- New generated background asset for `/market`: `apps/op-cpt/public/branding/vault-room-market-terminal-bg.png`.
- CSS polish should live in `apps/op-cpt/src/app/globals.css` and remain responsive.
- Keep the visual layer lightweight; no full-page WebGL change for this pass.

## QA Focus
- Homepage must still show the approved hero and catalogue stats.
- Product cards cannot shift or clip on hover.
- `/market` must be readable on desktop and mobile.
- Text and buttons must not overlap with the sticky header, cart, or mobile nav.
- Run typecheck, lint, build, and browser screenshots before asking for approval.
