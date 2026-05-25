# Ghost x Zoro Dossier QA

Generated: 2026-05-25, Africa/Johannesburg.

## Deliverables

- `report/ghost-zoro-one-piece-investment-dossier.pdf`
- `report/ghost-zoro-one-piece-investment-dossier.html`
- `docs/ghost-zoro-one-piece-investment-dossier.md`
- `data/ghost-zoro-card-decisions.json`

## Verification

- Google Drive connector listed the shared Graphics folder and relevant subfolders.
- Official One Piece Card Game card-list images downloaded for 18 card IDs and decoded locally with `sips`.
- PDF rendered from print-first HTML with Playwright/Chrome.
- PDF metadata check via `pdf-lib`: 18 pages.
- Rendered PDF file size: approximately 9.7 MB.
- Visual QA screenshots rendered:
  - `report/qa-cover.png`
  - `report/qa-offer-matrix.png`
  - `report/qa-drop-calendar.png`
- PII sweep found only intentional redaction notes, not raw address, phone, email, wallet, tracking, or logistics data.

## Source Notes

- PSA, Bandai, official One Piece Card Game, TCGplayer, Cardmarket, eBay Vault, Collect-a-Con Cape Town, Card Cache, TCGXchange, and Wizards sources are listed in the PDF source ledger.
- OP-17 August 2026 is treated as schedule intelligence from non-official/retailer sources until an official Bandai English product page is verified.
- The report does not claim One Piece grading volume exceeds Pokemon; that claim was not verified.

## Visual Notes

- Slab visuals are analytical renders using official card-list art plus private-use project assets.
- They are not represented as actual cert scans or platform-certified images unless explicitly labeled.
- The artifact remains private and local; no upload, deploy, push, or external sync was performed.
