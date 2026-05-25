# Ghost x Zoro Grand Line TCG

Private, password-gated One Piece TCG strategy workspace for Ghost and Zoro.

This repo combines:

- A Unity 6000.4.5f1 WebGL game portal.
- A canonical card inventory, open-bid book, valuation/projection model, source ledger, NPC dialogue, and quest database.
- The prior Ghost x Zoro report/video research archive.
- Static deployment configs for Vercel and Netlify.

## Structure

- `.superdesign/` - design system and implementation-aware visual context.
- `docs/` - research, game design, deployment/privacy notes, QA receipts, and agent roster.
- `data/` - canonical JSON used by the game and reports.
- `media/` - normalized private card media, report PDFs/HTML, stills, narration, and music.
- `unity/GhostZoroGrandLine/` - Unity WebGL project.
- `deploy/` - password-gated static wrapper and generated WebGL output target.
- `web/` - helper/static scripts for wrapper and scanner/manual-entry support.

## Private-Use Boundary

This is a private personal project. One Piece-branded assets, screenshots, and platform captures must not be publicly marketed, sold, or presented as officially endorsed. No account-sensitive data belongs in the repo.

## Local Commands

```bash
npm run validate:data
npm run pii:scan
npm run build:wrapper
```

Unity build commands are recorded in `docs/game/ARCHITECTURE.md` and `docs/qa/game-workspace-qa.md`.
