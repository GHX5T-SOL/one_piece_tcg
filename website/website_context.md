# Website Context

Live site: https://op-cpt.vercel.app

Repo inspection shows an existing OP CPT member-beta Next app at `apps/op-cpt`.

Observed structure:

- Next 16 app router
- React 19
- Supabase client/server helpers
- routes for collection, cards, market, trades, rankings, events, news, group buys, admin, auth
- API routes for card search/recognition, Collectr import, price sync, events, trades, rankings
- Supabase migration at `apps/op-cpt/supabase/migrations/0001_op_cpt_initial_schema.sql`

Live site check on bootstrap returned HTTP 200 and title `OP CPT | Cape Town One Piece TCG Community`.

No destructive website changes were made during workspace bootstrap.
