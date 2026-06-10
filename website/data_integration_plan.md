# Data Integration Plan

1. Keep `inventory/master_inventory.csv` as offline operating source until Supabase admin workflows are ready.
2. Create a public-safe export for the website containing only approved public fields.
3. Store scans in private storage first, then publish resized/watermarked versions.
4. Sync public catalogue rows to Supabase `cards` / `inventory_items` when reviewed.
5. Keep pricing decisions and comps private unless explicitly turned into public educational content.
