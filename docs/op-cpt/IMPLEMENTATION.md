# OP CPT Implementation Notes

## Purpose

OP CPT is a member-beta Cape Town One Piece TCG community portal. It adds a new
Next.js + React Three Fiber app under `apps/op-cpt/` while preserving the
existing Ghost/Zoro private archive, Remotion video, report, and Unity work.

## Visual References

- Brand board: `apps/op-cpt/public/design/op-cpt-brand-board.png`
- App concept: `apps/op-cpt/public/design/op-cpt-app-concept.png`

## Source Anchors

- Official events: https://en.onepiece-cardgame.com/events/
- Official rules: https://en.onepiece-cardgame.com/rules/
- Limitless One Piece: https://onepiece.limitlesstcg.com/
- OPTCG.GG: https://optcg.gg/
- PriceCharting API: https://www.pricecharting.com/api-documentation
- Next.js App Router: https://nextjs.org/docs/app
- Supabase Auth: https://supabase.com/docs/guides/auth
- Supabase RLS: https://supabase.com/docs/guides/auth/row-level-security

## Privacy

No address, phone, email, wallet, tracking, payment, or shipping logistics are
seeded into the app. Trade and group-buy features are coordination tools only.

## Current Status

- App location: `apps/op-cpt/`
- QA receipt: `docs/op-cpt/QA.md`
- Local QA URL used: `http://localhost:3011`
- Deployment configs are present, but Vercel/Netlify deployment is intentionally
  pending until member-beta env vars and Supabase project credentials are set.
