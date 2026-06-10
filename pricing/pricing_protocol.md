# OP CPT Pricing Protocol

Use this every time a card photo, scan, card name, card number, slab, listing, bid opportunity, consignment item, or sell-price request is provided.

## 1. Exact Identification

Do not price from name alone. Identify card name, card number, set code, set name, product source, promo source, language, rarity, variant, finish, stamp, foil type, alternate-art status, event/prize status, winner/participant/finalist status, serial status, raw/slab status, condition, grade company, grade, and cert number where applicable.

Flag identity traps: wrong language, wrong variant, base versus alt art, participant versus winner, reprint versus original, promo versus set card, Japanese versus English, stock image versus real scan, Collectr SKU mismatch, PriceCharting SKU mismatch, title stuffing, and fake listings.

## 2. Market Research

Research relevant sources: TCGplayer, CardTrader, Cardmarket, PriceCharting, Alt.xyz, eBay active, eBay sold, PSA, BGS, CGC, MySlabs/auction houses where relevant, Limitless, official One Piece Card Game, Bandai product pages, OnePiece.gg, Nakama Decks, Egman Events, social/local signals, and Collectr as a weak baseline only.

Save source URLs, access date, platform, condition, language, price, and notes in `source_ledger.md` and `inventory/pricing_research_log.csv`.

## 3. Filter Bad Data

Exclude or discount fake/scam listings, wrong-language comps, wrong variants, damaged cards, weak sellers, title manipulation, stock photos, stale sales before major shifts, best-offer ambiguity, mislabelled slabs, raw cards represented as graded value, and wrong SKU mappings.

## 4. Build Clean Comp Stack

Capture TCGplayer market/low/recent sale/trend, PriceCharting raw and graded trend, eBay sold low/median/high, active supply, CardTrader floor, Cardmarket floor/trend, Alt analysis, PSA/BGS/CGC populations, credible copies available now, social hype, meta relevance, collector relevance, character demand, and future market potential.

## 5. Scarcity and Market-Making

If active supply is low or zero, do not blindly price at the last sale. Consider last clean sold, highest credible recent sold, active supply, number of credible sellers, population, character popularity, condition quality, local availability, grading upside, future growth, and urgency. No credible availability can justify a premium ask if evidence is defensible.

## 6. Grading Upside

For mint raw cards, estimate raw patient value, PSA 9, PSA 10, BGS 9.5, BGS 10, BGS Black Label, CGC 10, grading cost, shipping/insurance, turnaround, grade risk, opportunity cost, and expected value.

Formula: `grading_ev = (prob_10 * net_psa10_value) + (prob_9 * net_psa9_value) + (prob_lower * net_lower_value) - grading_costs - shipping_insurance - time_risk_discount`.

Never call a raw card PSA 10. Use "raw near mint / mint, strong grading candidate."

## 7. Cape Town Premium

Local in-hand buyers avoid international shipping, customs, fake risk, condition uncertainty, waiting time, and inspection risk. Trusted local sale, cash/EFT convenience, and trade-day excitement can justify pricing above weak global floors.

## 8. Price Outputs

Always produce: quick_sale_floor, fair_market_sellable_price, patient_local_ask, event_show_ask, online_gross_ask, stretch_market_maker_ask, walkaway_minimum, expected_net_by_channel, grade_or_sell_verdict, and confidence_rating in USD and ZAR.

## 9. Default Posture

Start high, negotiate down, and avoid desperate pricing unless quick-sale strategy is explicit.
