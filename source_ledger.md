# Source Ledger

Source hierarchy:

- Tier 1: official identity and rules.
- Tier 2: strong market data after filtering.
- Tier 3: useful but noisy.
- Tier 4: weak, unverified, or requires heavy filtering.

| date_accessed | source_name | url | source_type | what_it_is_good_for | limitations | trust_score_1_to_5 | notes |
|---|---|---|---|---|---|---:|---|
| 2026-06-10 | Official One Piece Card Game | https://en.onepiece-cardgame.com/ | official | Identity, rules, products, card text | May not expose marketplace values | 5 | |
| 2026-06-10 | Official products | https://en.onepiece-cardgame.com/products/ | official | English product cadence and sealed product identity | Dynamic pages require recheck | 5 | |
| 2026-06-10 | Official card list | https://en.onepiece-cardgame.com/cardlist/ | official | Exact card identity, set code, rarity, text | Search filters must match language/version | 5 | |
| 2026-06-10 | Official restrictions | https://en.onepiece-cardgame.com/rules/restriction/ | official | Ban/restriction status | Meta implications need separate tournament data | 5 | |
| 2026-06-10 | Limitless One Piece | https://onepiece.limitlesstcg.com/ | competitive | Tournament results, decklists, leader prevalence | Competitive data does not equal collector demand | 4 | |
| 2026-06-10 | OnePiece.gg | https://onepiece.gg/ | competitive/content | Meta summaries, deck guides, news | Editorial and may lag official updates | 3 | |
| 2026-06-10 | Egman Events | https://egmanevents.com/ | competitive | Event archives and tournament signal | Coverage varies by region/event | 3 | |
| 2026-06-10 | TCGplayer | https://www.tcgplayer.com/ | market | US retail market, listing depth, sales velocity | Access and sales history can be limited; verify variants | 4 | |
| 2026-06-10 | CardTrader | https://www.cardtrader.com/ | market | International availability and cross-border listing floors | Fees/shipping change true landed cost | 4 | |
| 2026-06-10 | Cardmarket | https://www.cardmarket.com/en/OnePiece | market | EU floor and availability | Access may be blocked; EU market not equal Cape Town | 4 | |
| 2026-06-10 | PriceCharting | https://www.pricecharting.com/ | market | Historical raw/graded sale snapshots | SKU matching can be wrong | 3 | |
| 2026-06-10 | eBay | https://www.ebay.com/ | market | Active and sold listings, rare-card scarcity | Scams, title stuffing, best-offer opacity | 4 | |
| 2026-06-10 | PSA | https://www.psacard.com/ | grading | PSA population and APR checks | Cloudflare/access limits; pop changes over time | 4 | |
| 2026-06-10 | BGS | https://www.beckett.com/grading | grading | BGS grading and population context | Black Label pop checks need exact card | 4 | |
| 2026-06-10 | CGC Cards | https://www.cgccards.com/ | grading | CGC grading and cert context | Market acceptance varies by buyer | 4 | |
| 2026-06-10 | Alt | https://www.alt.xyz/ | market/grading | Graded portfolio and premium collectible sentiment | Not complete for all One Piece cards | 3 | |
| 2026-06-10 | Collectr | https://app.getcollectr.com/ | portfolio/noisy market | Quick portfolio baseline and SKU discovery | Often misleading; never final sell price | 2 | |
| 2026-06-10 | OP CPT live site | https://op-cpt.vercel.app/ | owned website | Current public/member-beta website | Production behavior must be tested before changes | 5 | |
| 2026-06-10 | OP CPT GitHub repo | https://github.com/GHX5T-SOL/one_piece_tcg | owned repo | Source of truth and backup | Public repo: do not commit private data | 5 | |
| 2026-06-10 | Consignment Drive folder | private-url-kept-outside-git | private source | Consignment scan/photo intake | Private HEIC files; do not commit folder URLs, images, owner data, or metadata in this public repo | 3 | |
| 2026-06-10 | Collectr showcase/profile | private-url-kept-outside-git | portfolio/noisy market | Portfolio baseline and SKU discovery when user provides access | Use as baseline only; verify against raw data and comps | 2 | |
