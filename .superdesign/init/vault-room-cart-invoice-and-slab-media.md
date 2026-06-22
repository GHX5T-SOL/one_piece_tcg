# Vault Room Cart Invoice + Slab Media Refresh

## Context

The live shop currently mixes `Add` and `Claim` labels based on `askOnly`, while checkout still attempts hosted payment setup. The desired public flow is simpler: every public product card and product page should use `Add`, shoppers build a cart, then generate an invoice that excludes shipping and message the Vault Room admin on WhatsApp for availability confirmation, shipping quote, and payment link.

## UI Contract

- Product card CTA: `Add`.
- Product detail CTA: `Add to cart`.
- Empty cart copy: start a cart, not a claim.
- Cart summary:
  - Subtotal stays ZAR.
  - Shipping line says `Excluded from invoice`.
  - Checkout action generates a local invoice request.
  - Online payment copy says payments are coming soon and no online payment is captured.
  - Generated invoice must include invoice ID, product names, SKUs, quantities, line totals, subtotal, and shipping-excluded note.
  - WhatsApp target: `+27796643002`.
- Public app must not expose internal owner/source wording.

## Media Contract

- Owned graded slabs should use real slab photos where available.
- Existing exact Courtyard slab photos in `/Users/mx/Documents/my_slabs` remain preferred.
- Existing Phygitals/local card photos in `Some card assets/` and `media/cards/` should be wired for matching products.
- If a graded product lacks a real slab photo, do not silently use raw card art as the main image. Use a Vault Room branded graded-slab placeholder until an exact PSA/CGC/BGS photo is sourced.
- Cert labels must stay visible on owned slab photos.

## QA

- Search rendered/static public code for `Claim` in shop CTAs.
- Verify invoice button and WhatsApp link include the cart lines.
- Verify graded products either use `local-owned-slab` or a `vault-room-generated-fallback` with graded-slab reason.
- Run lint, typecheck, build, and browser QA for `/`, `/shop`, and a product page.
