# Supabase Schema Plan

Existing app migration already includes profiles, cards, collections, collection_items, card_assets, price_sources, price_snapshots, watchlist_items, trades, events, rankings, group_buys, news_posts, asset_manifest, audit_logs, and moderation_reports.

Future commercial inventory tables:

- cards
- inventory_items
- inventory_scans
- price_comps
- pricing_decisions
- sales
- purchases
- consignments
- consignment_owners
- grading_submissions
- events
- trade_day_listings
- content_posts
- watchlist_items

Public fields: card name, card number, set, rarity, language, condition, price, status, public notes, front image.

Private fields: cost basis, seller/source, consignment owner, minimum price, cert number if private, profit margin, private notes, negotiation history.
