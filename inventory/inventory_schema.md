# Inventory Schema

`inventory/master_inventory.csv` is the canonical business spreadsheet generated from Collectr exports and later research.

Important status fields:

- `ownership_status`: `in_hand`, `inbound`, `consignment`, `sold`, `watch`.
- `inventory_status`: `available_for_pricing`, `listed`, `reserved`, `sold`, `hold`, `grading_candidate`, `submitted_for_grading`.
- `cost_status`: `recorded`, `unknown_or_box_pull`.
- `confidence_rating`: `pending_research`, `low`, `medium`, `high`.

Pricing fields stay blank until researched through `pricing/pricing_protocol.md`.
