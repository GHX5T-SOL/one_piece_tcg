# Vault Gacha Two-Video Flow

## Objective

Upgrade `/gacha` from a single low-context cinematic clip into a clearer vending-machine demo:

- Idle state: a looped premium Vault Room gacha vending machine video.
- Rip state: a separate pack-rip/reveal video triggered by the user.
- Result state: one real catalogue-backed prize with actions for redeem, vault, or 75% FMV buyback.

## Visual Direction

- Reference: user screenshot of a glossy blue One Piece gacha vending machine with shelves, card packs, slabs, keypad, ship/beach background, and glowing frame.
- Generated source plate: `/Users/mx/.codex/generated_images/019e5aad-8f01-7693-af95-0b5f09d91496/ig_0e9427588ca9b9c2016a39427b33e48191897c18aaf4fa7ed2.png`.
- Style: Vault Room navy, cream, gold, and electric cyan; premium vending cabinet; Cape Town harbor; treasure-map lighting; no fake official affiliation.
- Motion: idle shimmer and machine glow should loop calmly; reveal clip can use a stronger flash, pack tear, card burst, and final prize spotlight.

## UX Contract

1. The idle vending-machine video loops by default and never blocks the page.
2. Pressing `Rip virtual pack` starts the pack-rip video and disables repeated spin actions.
3. When the reveal video ends, show the prize card immediately.
4. Result actions:
   - `Redeem`
   - `Vault`
   - `Accept 75% FMV buyback`
5. Copy remains honest: payments, shipping, odds, reserves, and compliance are coming soon; this is a visual demo.

## QA Checks

- Desktop and mobile `/gacha` screenshots must show the idle machine clearly.
- Clicking the rip button must play the reveal clip and end in a visible prize state.
- No internal owner/source labels, floor prices, or staff-only notes appear publicly.
- Gacha copy must use 75% buyback, not 70%.
