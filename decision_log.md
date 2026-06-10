# Decision Log

| Date | Decision | Reason | Follow-up |
|---|---|---|---|
| 2026-06-10 | Cloned `GHX5T-SOL/one_piece_tcg` into `OP_CPT` and created branch `op-cpt-workspace-bootstrap`. | User requested repo-backed OP CPT workspace and Git branch. | Commit and push bootstrap files if verification passes. |
| 2026-06-10 | Treat repo as public for data-safety decisions. | `gh repo view` returned `visibility=PUBLIC`. | Do not commit private scans, owner details, cost-basis evidence, or sensitive cert/private data. |
| 2026-06-10 | Did not import Drive consignment image contents. | Consignment photos are private-sensitive and the repo is public. | Log folder metadata/source only; use private storage later. |
| 2026-06-10 | No `export.csv` imported. | No local `export.csv` found in repo or parent workspace. | User to add export later; templates created meanwhile. |
| 2026-06-10 | Website work remains documentation-only. | Existing `apps/op-cpt` app is already present; prompt did not ask for destructive website changes. | Future changes should inspect app and run typecheck/build first. |
