# The Vault Room Reference Fidelity Rebuild

## Date
2026-06-28

## Trigger
The user approved the current crossover harbor hero image, but said the rest of the live website still feels lower quality than the generated references. This pass raises the implementation toward the reference boards without changing the catalogue source of truth or removing the current hero.

## North Star
The site should feel like a premium anime collector operating desk: parchment sea-map base, dark navy/gold command chrome, Cape Town harbor energy, card-table commerce, gacha spectacle, collection/profile social layer, and TCG market-terminal seriousness.

## Keep
- Current hero image: `/branding/vault-room-crossover-harbor-hero.jpg`.
- One-row featured products on homepage with `/shop` as the full inventory.
- Manual invoice checkout and honest beta copy.
- Existing routes, catalogue, cart, gacha, market, profile and Vault Credit pages.

## Upgrade
- Header becomes a premium dark navy/gold captain bar instead of a light app header.
- Add global atmosphere layers: parchment map, sea glow, floating card ghosts, devil-fruit rings, electric aura strokes, and subtle motion.
- Add a homepage `Vault quest map` for Shop, Gacha, Collection, Market, Vault Credit, Events, Grade Lab, Community and Consign.
- Add stronger product cards: universe accents, slab/pack shine, hover lift, rarity glow, darker CTA rail.
- Add stronger panels across pages: gold-corner chrome, dark title rails, trading-terminal cards and cleaner hierarchy.
- Add motion only where it helps: card drift, glint, aura pulse, reveal energy. Respect reduced-motion users.

## Public Safety
- No fake official affiliation claims.
- Keep beta/payment/stock wording factual.
- Do not expose internal owner/source labels, floor prices, cost basis or staff notes.

## QA
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- Local desktop and mobile screenshots for `/`, `/shop`, `/gacha`, `/profile`, `/market`, `/vault-credit`
- Push only after checks pass.
