# The Vault Room Web App Rebuild

Updated: 2026-06-20

## Approved Concept

The website rebuild must track the approved generated concept:

- `/Users/mx/.codex/generated_images/019e5aad-8f01-7693-af95-0b5f09d91496/ig_0aa7a08c7ea83174016a36846e3b0081919a8a2d075c98d527.png`
- App copy in public UI: The Vault Room, Cards. Collectibles. Grails., Cape Town Collector Community.
- Public channels: Instagram `@thevaultroom.cpt`, WhatsApp community `https://chat.whatsapp.com/LgAy8Q0NgVp9NcU7oJXBDy`.

## Visual Contract

- Desktop first viewport: parchment sea-map canvas, dark navy top strip, Vault Room crest, large serif wordmark, Table Mountain harbor art, vault door, card table, product/cart rail, live auction rail, and mobile preview.
- Mobile: compact top bar, hero poster/card, show RSVP, collector strip, product card, bottom nav.
- Colors: vault navy `#0D4EA2`, blue `#2176D2`, gold `#D4AF37`, coral `#FF6B5B`, sky `#7EC6F0`, cream `#FFF7E6`.
- Type: bold serif display for Vault Room moments; clean sans for product, checkout, admin, and controls.
- Public imagery can use the full fan/anime aesthetic per user direction, but must not claim official affiliation.

## Catalogue Contract

- Customer shop source of truth: `sales/loyverse/2026-06-19/the-vault-room-loyverse-import-2026-06-19.csv`.
- Generated public catalogue: `apps/op-cpt/src/data/products.json`.
- Every source row must be represented in `/shop` or recorded as an explicit exclusion.
- Customer UI must not say `Yaseen`, `Vault Room main collection`, `staff note`, `source row`, `cost basis`, `floor`, or `walk-away`.
- Internal source metadata can exist only in private admin/server records.

## Functional Contract

- Public routes: home, shop, product detail, auctions, events, grade lab, consign, community, profile, cart, checkout success/cancel.
- Admin routes: stock review, visibility/sold/reserved flags, price/quantity edits, product feature controls, source import/export checks.
- Checkout: Yoco hosted checkout when `YOCO_SECRET_KEY` is configured; dry-run claim flow otherwise.
- Pre-grade service: `R150` per card, shipping excluded if not dropped off.

## QA Contract

- Data completeness: 324 Loyverse source rows plus 1 pre-grade service product.
- Visual QA compares implementation against approved concept at desktop and mobile viewports.
- Privacy scan covers rendered/public app output and generated product data.
- Build checks: lint, typecheck, Next build.
