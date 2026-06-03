# OP CPT QA Receipt

Generated: 2026-06-03

## Build And Package Checks

- `npm --prefix apps/op-cpt install` completed successfully.
- `npm --prefix apps/op-cpt audit --json` returned `0` vulnerabilities.
- `npm --prefix apps/op-cpt run lint` passed with `0` warnings.
- `npm --prefix apps/op-cpt run typecheck` passed.
- `npm --prefix apps/op-cpt run build` passed on Next.js `16.2.7` with `32` generated app routes/pages.
- Root `npm run validate:data` passed with `8` card records, `13` offers, and `20` sources in the existing Ghost/Zoro archive data.

## Browser QA

Local server used: `http://localhost:3011`

- `/` loaded with no console errors after adding `public/favicon.svg`.
- `/app` loaded the React Three Fiber harbor scene, side rail, live activity, price trends, and rankings preview.
- `/collection` loaded `12` seeded collection cards and the scanner entry point.
- `/auth/sign-in` is implemented as a Supabase magic-link route; it shows a setup message until `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are configured.
- Desktop overflow checks passed at `1280x768` and `1440x900`.
- Mobile viewport check passed at `390x844`: side rail hidden, bottom nav visible, header and hero text fit without horizontal overflow.
- Temporary Playwright screenshots were inspected and removed from the repo after QA.

Known runtime note: React Three Fiber emits a development warning from Three.js about `Clock` deprecation. This is from the R3F stack, not app code, and does not block render/build.

## API Smoke Tests

- `GET /api/cards/search?q=luffy` returned seeded Luffy matches.
- `GET /api/prices/sync` returned seeded/dry-run price sync mode without requiring a secret key.
- `GET /api/rankings` returned seeded leaderboard data with `Zoro_King` as the top seeded player.

## Source Verification

- Official events page verified on 2026-06-03: OP-16 Release Event is listed for June 5-11, 2026.
- Official rules page verified on 2026-06-03: OP-16 errata/revision notice is listed with May 29, 2026 date.
- Next.js App Router docs and Supabase RLS docs were checked for current stack alignment.
- Google Drive Graphics folder was verified through the Drive connector; the asset manifest contains the expected Audio, UI, Artworks, Sprites, Ships, Portrait, Area, and Cutscenes folder IDs.

## Privacy And Safety

- Targeted scan found no personal address, phone, email, wallet, tracking number, or shipping destination values in `apps/op-cpt`, `docs/op-cpt`, or `.superdesign`.
- Trade and group-buy routes deliberately state that payments, shipping, escrow, and wallet fields are outside the MVP.
- Supabase migration enables RLS on all exposed tables and keeps moderator/admin role checks server-trusted.

## Deployment Status

- `apps/op-cpt/vercel.json` and `apps/op-cpt/netlify.toml` exist.
- Deployment was not run because live Supabase project URLs/keys and member-beta access policy are not configured in this workspace.
