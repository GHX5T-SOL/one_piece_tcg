# Scripts

Workspace bootstrap:

```powershell
python scripts/bootstrap_op_cpt_workspace.py
```

Existing repo QA:

```powershell
npm run validate:data
npm run pii:scan
npm run build:wrapper
npm --prefix apps/op-cpt run typecheck
npm --prefix apps/op-cpt run build
```
