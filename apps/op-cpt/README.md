# OP CPT

OP CPT is the member-beta platform for the Cape Town One Piece TCG community.

It is an unofficial fan/community project. Public screens use original nautical,
card, and Cape Town motifs. Fan assets are intended only for gated member-beta
areas and must be labeled with private-use provenance.

## Local Development

```bash
cd apps/op-cpt
npm install
npm run dev
```

The app works with seeded local data without Supabase credentials. Supabase env
vars unlock real auth/storage/database behavior when configured.

## QA

```bash
cd apps/op-cpt
npm run typecheck
npm run build
```
