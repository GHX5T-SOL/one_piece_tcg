# The Vault Room Web App Rebuild QA

Date: 2026-06-20
App: `apps/op-cpt`
Local QA URL: `http://localhost:3010`

## Build Checks

- `npm run typecheck`: pass
- `npm run lint`: pass
- `npm run build`: pass
- Next.js generated 356 app routes, including 325 static product pages under `/product/[slug]`.
- Dynamic product route QA: pass after updating `/product/[slug]` to await Next.js 16 route params.

## Catalogue Checks

- Source sale records: 324
- Service listings added: 1
- Public product records generated: 325
- Missing required public fields: 0
- Duplicate product slugs: 0
- Category split: 321 One Piece, 2 Pokemon, 1 Yu-Gi-Oh, 1 service.

## Privacy And Secret Checks

Scanned app source, public assets, generated data, scripts, and built app output for:

- `OP CPT`
- `Yaseen`
- `TVR-YAS`
- `TVR-OWN`
- `staff note`
- `floor price`
- `walk-away`
- `cost basis`
- `source row`
- `Vault Room main collection`
- `main collection`
- `consignment owner`
- `owner instruction`
- known exposed API key fragments

Result: pass.

## Rendered QA

Browser path: in-app browser runtime attempted first, but failed before attach due sandbox metadata. Fallback used local Playwright Chromium.

Desktop viewport: `1365x768`
Mobile viewport: `390x844`

Checks:

- Page title: `The Vault Room | Cards. Collectibles. Grails.`
- Page is not blank: pass
- Framework error overlay: pass, none found
- Desktop console issues: pass, none found
- Mobile console issues: pass, none found
- Desktop cart add: pass, first product added and cart subtotal updated
- Shop search: pass, `Luffy` query returned 27 product cards
- Product detail: pass, product page renders price and claim/WhatsApp actions with no route warnings
- Mobile cart: pass, drawer is collapsed on first load and floating cart button is visible

Screenshots:

- Desktop first viewport: `/tmp/vault-room-desktop.png`
- Wide concept-comparison viewport: `/tmp/vault-room-wide.png`
- Shop search: `/tmp/vault-room-shop-search.png`
- Product detail: `/tmp/vault-room-product.png`
- Mobile first viewport: `/tmp/vault-room-mobile.png`

## Fidelity Notes

The implementation follows the approved mockup direction: parchment/sea-map base, navy/gold/coral palette, Vault Room crest/wordmark, left brand hero, anime collector crew / vault scene, event card, right cart rail, live auction panel, visible product grid, and mobile companion layout.

Final visual fixes:

- Replaced the synthetic center hero with a cropped Vault Room collector-crew scene derived from the approved poster art.
- Kept the navy/gold vault-door overlay and product-card table to preserve the interactive catalogue feel.
- Preserved a visible product grid directly under the hero, matching the mockup's "shop-ready first viewport" intent.
- Verified the implementation screenshot against the approved concept image with `view_image`.

Known intentional limitation: product imagery currently uses branded fallback renders for complete catalogue coverage where exact card/product photos are unavailable.
