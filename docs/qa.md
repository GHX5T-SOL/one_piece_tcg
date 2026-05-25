# QA Receipt

## Planned Checks

- SuperDesign context exists and design tokens are current.
- Drive assets decode locally and are listed in `assets/manifest.json`.
- Research sources are current enough for a 2026-05-24 private video.
- Structured data files redact account-sensitive details.
- HyperFrames lint/inspect runs on the kinetic title-card proof.
- Remotion still frames render for key scenes.
- Draft/final MP4 duration is between 5 and 7 minutes.
- Captions fit inside the 1920x1080 safe area.
- Audio exists, voice is intelligible, and no PII appears.
- Final MP4 and companion docs remain local/private.

## Current Status

- SuperDesign CLI installed and `.superdesign/` context created.
- `ffmpeg` installed and verified.
- Drive assets downloaded, decoded locally, and listed in `assets/manifest.json`.
- HeyGen: optional and currently not used because prior connector check returned an account/auth error.
- Public upload/deploy/push: intentionally not performed because the project plan says no public upload, deploy, or push without explicit approval.

## Final Verification Log

- Date: 2026-05-24, Africa/Johannesburg.
- Tool versions: Node `v22.16.0`; npm `10.9.2`; ffmpeg `8.1.1`; HyperFrames `0.6.40`; SuperDesign `0.3.3`.
- SuperDesign: `.superdesign/design-system.md` and `.superdesign/init/` context files are present.
- Drive assets: 9 manifest entries; all downloaded PNG assets opened with `sips`; bundled TTF identified as valid TrueType font data.
- TypeScript: `npx tsc --noEmit` exited cleanly.
- HyperFrames: `npm run hyperframes:lint` returned `0 errors, 0 warnings`; `npm run hyperframes:inspect` returned `ok: true` with no issues.
- Remotion stills: `out/stills/hook.png`, `out/stills/market.png`, `out/stills/portfolio-fixed.png`, and `out/stills/action.png` rendered at 1920x1080 and were visually inspected.
- Final MP4: `dist/ghost-zoro-one-piece-tcg-investment.mp4`, 129,233,646 bytes.
- Final MP4 metadata: H.264 video, 1920x1080, 24 fps; AAC stereo audio, 48 kHz; duration `400.042667` seconds, which is 6:40 and within the 5-7 minute target.
- Final MP4 frame audit: extracted frames at 00:00:05, 00:02:35, and 00:05:45 to `out/final-check/`; all are 1920x1080 and readable.
- PII audit: source sweep found only intentional redaction notes and no raw address, phone, email, wallet, tracking, or full logistics details.
- Source audit: research and strategy docs cite PSA, Bandai, official One Piece Card Game product pages, Collect-a-Con Cape Town, South African local stores, and major seller channels.
- Privacy boundary: no public upload, deployment, push, or external sync was performed.
- Cache cleanup: local package/render caches under `node_modules/.cache` and `node_modules/.remotion` were cleared after render.
