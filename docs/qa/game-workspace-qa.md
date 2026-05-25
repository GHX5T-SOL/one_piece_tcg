# Game Workspace QA Receipt

Generated: 2026-05-25

## Current Status

- SuperDesign context refreshed for the Unity/WebGL game layer.
- Canonical JSON database files created under `data/`.
- Prior report artifacts copied into `media/reports/`.
- Local card images/videos copied into `media/cards/`.
- Unity 6000.4.5f1 and Blender 5.1.0 are installed.
- `npm run validate:data` passed: 8 cards, 13 offers, $197.50 bid exposure, 20 sources, 7 NPCs.
- `npm run pii:scan` passed with zero findings.
- Unity project creation passed.
- Unity scene generation passed.
- Unity WebGL build passed and generated `deploy/game/Build/game.loader.js`, `.data`, `.framework.js`, and `.wasm`.
- Static wrapper build passed with Unity build present.
- Playwright local QA passed after fixes: password gate unlocks with a local test hash, Unity reports `Unity loaded.`, inventory renders 8 cards, bid board renders 13 rows, and manual test-card entry persists to browser local storage.
- Current browser console: 0 errors, 7 WebGL/password-field warnings.
- Private GitHub push succeeded to `GHX5T-SOL/one_piece_tcg` on branch `master`.
- Vercel production deployment succeeded: `https://one-piece-tcg-lac.vercel.app`.
- Final Vercel Playwright QA passed: gate hides after passcode, Unity reports `Unity loaded.`, inventory renders 8 cards, bid board renders 13 rows, and browser console has 0 errors.

## Screenshot Evidence

- `docs/qa/screenshots/ghost-zoro-gate-desktop.png`
- `docs/qa/screenshots/ghost-zoro-portal-desktop-fixed.png`
- `docs/qa/screenshots/ghost-zoro-portal-tablet-fixed.png`
- `docs/qa/screenshots/ghost-zoro-portal-mobile-fixed.png`
- `docs/qa/screenshots/ghost-zoro-inventory-desktop.png`
- `docs/qa/screenshots/ghost-zoro-bids-desktop.png`
- `docs/qa/screenshots/ghost-zoro-entry-desktop.png`
- `docs/qa/screenshots/ghost-zoro-vercel-final.png`

## Fixes From QA

- Fixed invalid Unity WebGL template path by using `APPLICATION:Default`.
- Fixed WebGL material crash by replacing a `Standard`-only shader assumption with a Unity 6 WebGL shader fallback chain.
- Fixed WebGL collider-class console errors by avoiding capsule/quad primitives and disabling engine-code stripping.
- Fixed wrapper CSS specificity so the password gate is actually hidden after authentication.

## Pending Checks

- Netlify deployment remains fallback because `netlify` CLI is not installed.

## Blockers

No local or Vercel blocker. GitHub repo privacy verified true on 2026-05-25. Vercel account is authenticated and production is live. Netlify CLI is not installed.
