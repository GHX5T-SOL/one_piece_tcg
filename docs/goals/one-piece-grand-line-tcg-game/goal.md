# Goal: Ghost x Zoro Grand Line TCG Game

Build a private, password-gated Unity WebGL One Piece TCG game and research workspace for Ghost and Zoro.

## Done Means

- Workspace structure exists and is documented.
- Canonical JSON data exists for cards, open bids, valuation/projections, sources, NPC dialogue, quests, and manual-entry schema.
- Prior report/video research artifacts are archived and reachable from the game.
- Unity project opens in Unity 6000.4.5f1.
- WebGL build succeeds or a precise blocker is recorded.
- Password-gated wrapper blocks unauthenticated access before game load.
- Player can choose Luffy or Zoro, move in a 3D hub, speak to at least six NPCs, inspect owned cards, review bids, view next buys, add a test card locally, export/import JSON, and open the report archive.
- JSON validation, PII scan, browser screenshots, and deployment status are recorded in `docs/qa/game-workspace-qa.md`.
- GitHub push happens only after `GHX5T-SOL/one_piece_tcg` is verified private.

## Workstreams

1. Data and research.
2. Unity scene/gameplay.
3. Wrapper/auth/persistence.
4. Asset pipeline/provenance.
5. QA and deployment.

## Starter Command

```text
/goal Follow docs/goals/one-piece-grand-line-tcg-game/goal.md.
```
