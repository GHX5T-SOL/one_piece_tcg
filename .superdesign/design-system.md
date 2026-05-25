# Ghost x Zoro Grand Line TCG Design System

## Project Context

Private, password-gated One Piece TCG strategy workspace for Ghost and Zoro. Current deliverables include the earlier Remotion/report package plus a Unity WebGL game portal where Ghost and Zoro can walk a 3D ship/island hub, speak to Straw Hat NPCs, inspect slab pedestals, review portfolio analytics, and maintain the card database. One Piece-themed Drive, official card-list, and platform capture assets are private-use only and must not be treated as public/commercial release assets.

## Visual Identity

- Mood: premium trading desk meets sea-chart adventure.
- Composition: full-bleed ocean map, stylized Thousand Sunny trading post, readable HUD panels, metallic PSA/CGC slab pedestals, bounty-board analytics, and archive-room media surfaces.
- Avoid: public-release branding claims, fake official endorsement, cluttered fan-collage layouts, unreadable fantasy typography, and UI panels that block the player view.

## Tokens

- Canvas: `1920x1080`, 30fps, safe text margins `96px` horizontal and `72px` vertical.
- Unity WebGL: desktop-first `16:9` responsive canvas with mobile-ish fallback, camera-safe HUD margins `32px`, dialogue max width `720px`.
- Interaction: WASD/arrow movement, mouse camera, `E` interact, `Esc` menu, visible focus state for wrapper forms.
- PDF: A4 landscape for visual analytics pages, `12mm` page margin, print-safe dark mode with high-contrast panels and page-level source footers.
- Colors:
  - `ink`: `#071014`
  - `night`: `#0b1720`
  - `deep-sea`: `#0f3140`
  - `teal`: `#12c7b8`
  - `gold`: `#f2c14e`
  - `red`: `#e54b4b`
  - `paper`: `#f3efe2`
  - `silver`: `#bcc8d1`
- Type:
  - Display: system serif fallback for title moments, `Georgia`, `Times New Roman`, serif.
  - Interface/data: `Inter`, `Avenir Next`, `Helvetica Neue`, Arial, sans-serif.
  - Numeric overlays: tabular figures with `font-variant-numeric: tabular-nums`.
- Motion:
  - Establishing scenes: slow parallax, 0.4-0.8 degrees per second.
  - Market overlays: crisp slide/fade, 8-14 frame entrances.
  - Cards/slabs: z-depth drift, tilt under 12 degrees, no sudden flips that obscure text.
  - Game idle loops: NPC bob/gesture cycles, ship flags/waves, slab shimmer under 8 degrees.
  - Gameplay camera: no forced cinematic camera movement during player control.
- Audio:
  - Narration must remain intelligible over all music.
  - Target mix: voice around `-16 LUFS` integrated; music bed at least `-18dB` below voice during narration.

## Components

- Slab Card: metallic frame, grade badge, character/title, set, card number, value/offer.
- PDF Slab Render: official card art or platform screenshot thumbnail inside a PSA/CGC-style slab mockup; must be labeled as an analytical render unless it is a real cert/platform image.
- Source Chip: compact bottom-corner citation with publisher + year/date.
- Strategy Pill: short labels for `Flip`, `Hold`, `Watch`, `Avoid`.
- Portfolio Table: high contrast dark panel, 4-6 rows per shot max.
- Scenario Band: conservative/base/upside bars; clear disclaimer that these are educational scenarios, not guaranteed profit.
- Subtitle Bar: bottom-safe caption strip with 72px minimum margin and two-line maximum.
- Report Page: one dominant thesis per page, 2-3 visual anchors max, no tiny spreadsheet walls.
- Decision Matrix: clear action column first, then rationale, risk, and next trigger.
- Projection Chart: conservative/base/upside bands labeled as scenario analysis only.
- Source Ledger: full URL list with retrieval dates and confidence notes.
- Password Gate: dark ocean-map backdrop, passcode field, no visible secret, clear private-use warning.
- Character Select: Luffy and Zoro as equal choices, full-height character cards, one confirm action.
- NPC Dialogue: speaker portrait, topic chip, concise current recommendation, detail tabs for evidence.
- Bid Board: keep/cancel badges, total exposure, duplicate/low-grade warnings, no account-sensitive details.
- Manual Entry: scanner/manual split, nullable cert number, required source/provenance field.

## Unity Scene Rules

- Title screen must answer "what is this?" in one viewport: `Ghost x Zoro Grand Line TCG`.
- Hub must be legible from the spawn point: archive, bid board, card vault, media theater, and NPC cluster are visible landmarks.
- Characters can be stylized/proxy in the first tranche, but the data UI must be real and complete.
- Card images from `media/cards/` and `assets/cards/official/` are analytics/reference assets. Label generated slab renders as mockups.
- No PII, tracking, order address, wallet, payment, or full account data may be shown in any game UI, docs, screenshots, or deployment payload.

## Accessibility And QA

- Every text overlay must fit inside the 1920x1080 title-safe area.
- PDF pages must render without clipped text, overlapping cards, cut-off charts, or unreadable footnotes.
- No personal address, phone, email, wallet, or order logistics may appear in visual assets, captions, script, or docs.
- On-screen claims need source IDs matching `data/research-sources.json`.
- Private fan assets may be used locally, but final docs must keep the no-commercial/public-use warning visible.
- Web wrapper must block unauthenticated access before loading the Unity build.
- Keyboard-only passcode entry and menu close must work.
- Text panels must remain readable at desktop, tablet, and mobile-ish viewport screenshots.
