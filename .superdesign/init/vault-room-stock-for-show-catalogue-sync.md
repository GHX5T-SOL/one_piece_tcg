# Vault Room Stock-For-Show Catalogue Sync

Date: 2026-06-24

## Intent

Refresh the customer-facing storefront catalogue from the latest internal show-pricing package without changing the approved Vault Room visual direction.

## Source Of Truth

- Public catalogue pricing comes from `show_pricing/2026-06-24-stock-for-show/data/stock_for_show_pricing_master.csv`.
- Public price = `list_price_zar`.
- Internal `mid_price_zar`, `walk_away_zar`, evidence notes, and staff strategy remain out of public app data.

## UI Rules

- Product names, card numbers, language, set, grade, condition, and stock must match the latest guide.
- Product detail pages should expose exact card number and language where available.
- Exact user-supplied or owned-slab imagery overrides generic official card art.
- If no exact image exists, use the branded fallback rather than a wrong same-name card image.

## QA Focus

- Reconcile 317 sale rows plus the public Grade Lab service tile.
- Featured products should use confirmed high-quality slab photos where possible.
- Homepage listed value should reflect sellable stock only, not the service booking row.
