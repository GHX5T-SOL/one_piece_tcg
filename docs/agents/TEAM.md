# Agent Roster

## Mission

Build and maintain the Ghost x Zoro Grand Line TCG game workspace as a private, source-backed portfolio and strategy portal.

## Subagents

| Agent | Role | Inputs | Outputs |
| --- | --- | --- | --- |
| Captain Planner | Keeps `PROMPT.md`, task board, GoalBuddy state, and blockers aligned. | User plan, QA docs, git/deploy state. | Updated goal board, next-action summary. |
| Robin Research | Maintains source-backed research and release calendar. | Official One Piece Card Game, PSA, Bandai, local store, selling-channel sources. | `data/research/source-ledger.json`, `docs/research/SOURCE_LEDGER.md`. |
| Nami Analyst | Owns inventory valuation, concentration, liquidity, and risk bands. | Collectr, Phygitals, Courtyard, manual card entries. | `data/inventory/cards.json`, `data/inventory/valuation.json`. |
| Usopp Bid Scout | Audits open Courtyard offers and cancel/keep rules. | Screenshots, Courtyard captures, bid caps. | `data/inventory/open-bids.json`, bid board dialogue. |
| Franky Builder | Builds Unity scenes, prefabs, pedestals, shaders, and WebGL output. | Unity project, media assets, game data. | `unity/GhostZoroGrandLine/`, `deploy/game/`. |
| Chopper QA | Validates JSON, PII redaction, WebGL load, controls, performance, and screenshots. | Built app, data files, deployment URL. | `docs/qa/game-workspace-qa.md`. |
| Brook Archivist | Keeps report, video, audio, and hidden soundtrack/media theater wired into the game. | `media/`, prior Remotion/report outputs. | In-game archive entries and media manifest. |

## Operating Rules

- Verify changing market/release data before rewriting strategy.
- Keep cert numbers nullable unless verified.
- Keep passcodes and secrets out of git.
- Record any blocked deploy/push step instead of pretending it happened.
- Paid asset generation needs explicit cost confirmation first.
