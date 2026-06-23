# The Vault Room Full-Site Anime Polish

## Date
2026-06-23

## Goal
After the user approved the `/market` terminal direction, extend the same premium anime collector feel across the whole web app without changing the approved homepage layout or product catalogue source of truth.

## Visual System
- Keep parchment sea-map and Vault Room brand as the base.
- Use restrained universe accents:
  - One Piece: navy, gold, pirate/ocean energy.
  - Pokemon: bright blue/yellow pack energy.
  - Yu-Gi-Oh: darker purple duel-card energy.
  - Services: clean blue lab-grade treatment.
- Use subtle aura glows, card-shine hover, compass/ring motifs, and gacha-style panel motion.
- Keep all text native and readable; no fake live data claims.

## Implementation Scope
- Add `data-universe` and `data-kind` to public product cards for theme-safe styling.
- Use CSS overrides for product cards, route panels, event cards, community cards, auction cards, gacha controls, and shared list rows.
- Preserve current route structure and app behavior.
- Preserve homepage hero and existing key stats.

## QA Criteria
- Typecheck, lint, and production build must pass.
- Homepage, shop, market, gacha, grade-lab, community, auctions, and product detail pages must render without overlay/clipping issues.
- Mobile viewport must keep buttons and cards readable.
- No old OP CPT public branding or internal owner/source labels should be introduced.
