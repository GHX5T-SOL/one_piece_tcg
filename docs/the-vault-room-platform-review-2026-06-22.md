# The Vault Room Platform Review - 2026-06-22

## Scope

Review the website and broader business direction after the ST13-003 BVB image correction. The goal is to keep the current homepage visual direction intact while moving the platform toward a collector operating system: shop, portfolio, scanner, trades, rankings, group buys, grade lab, and gacha demo.

## External Benchmarks Checked

- Collectr positions itself around collection management, card scanning, tracking, and live market/portfolio values: https://getcollectr.com/
- TCGplayer seller tooling emphasizes inventory/listing workflows, pricing tools, mass price updates, and photo listings:
  - https://help.tcgplayer.com/hc/en-us/articles/115002353707-Using-Our-Pricing-Tools
  - https://help.tcgplayer.com/hc/en-us/articles/201574827-How-do-I-list-individual-products
  - https://help.tcgplayer.com/hc/en-us/articles/360000121068-How-to-Add-Listings-with-Photos
- Courtyard positions around digital packs, vaulted/insured physical cards, buying, selling, trading, and redemption:
  - https://courtyard.io/
  - https://courtyard.io/about
  - https://docs.courtyard.io/courtyard/about-courtyard.io/vault-your-cards
- Phygitals positions around digital collectible cards backed by vaulted physical cards, with buy/sell/trade/collect/redeem flows:
  - https://phygitals.gitbook.io/docs
  - https://x.com/phygitals/status/2019182217184829765

## Council Findings

### Product

- The strongest wedge is not a generic marketplace. It is a trusted Cape Town collector desk with local inventory, instant show/event availability, pre-grading, consignment, trade coordination, and community trust.
- User marketplace, private messages, comments, live auctions, and gacha payments should be built only after moderation, terms, payment rails, refunds, and support workflows are defined.
- The website should still show these as beta directions so collectors understand where The Vault Room is going.

### Website

- Keep the approved homepage. It already communicates the brand, visual world, and catalogue.
- Add utility pages that were previously redirects: collection/scanner, market watch, trades, rankings, and group buys.
- Public pages must remain customer-safe and must not expose internal owner/source labels or staff pricing data.
- Search and profile entry points should route to useful pages instead of inert buttons.

### Gacha

- Gacha must remain a visual demo / coming-soon page until rules and payment/legal controls are ready.
- Displayed odds must match the real prize pool. Every odds tier needs at least one prize in that tier.
- EV should be calculated from the current prize pool instead of hard-coded as marketing copy.
- Redeem/sell-back can be previewed, but live stock reservation and payment must not be implied.

### Business Operations

- Add a clear buy-in offer: The Vault Room buys or trades cards, usually around 75-95% of market depending on demand, condition, liquidity, rarity, and speed.
- Position consignment and buy-in as separate options: outright cash/trade, consignment, or grail-upgrade bundle.
- Keep the checkout flow invoice/manual-confirmation based until Yoco/PayFast/PayPal/crypto/card rails are wired.

## Implemented Slice

- Corrected ST13-003 BVB product image using the user-supplied card photo with transparent background.
- Added product-image manifest support for exact user-supplied card photos.
- Added `/collection` with portfolio search, scanner beta, manual card draft, and privacy model.
- Added `/market` with grail watchlist, trend signals, pricing protocol reminders, and source ledger.
- Added `/trades` with a negotiation-only trade board.
- Added `/rankings` with an opt-in leaderboard preview.
- Added `/group-buys` with admin-moderated interest board.
- Expanded `/profile` with member profile direction, portfolio tools, marketplace roadmap, and Supabase auth panel.
- Reworded fake-live auction copy into claim-drop / register-interest copy.
- Improved gacha odds consistency, calculated demo EV, and coming-soon safeguards.
- Added homepage and consignment copy for The Vault Room buying cards at 75-95% of market when appropriate.

## Next Build Priorities

1. Real account/profile persistence with Supabase and RLS.
2. Admin moderation queue for public portfolios, trade listings, and group-buy interest.
3. Camera upload flow that creates a pending human-verification card record.
4. Product image audit for the remaining fallback products.
5. Gacha legal/payment/odds terms before any real-money pack opening.
6. Public user marketplace only after moderation, trust signals, disputes, and payment boundaries are written.
