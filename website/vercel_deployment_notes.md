# Vercel Deployment Notes

Current live site is reachable at https://op-cpt.vercel.app.

Before website changes:

```powershell
npm --prefix apps/op-cpt run typecheck
npm --prefix apps/op-cpt run build
```

Do not expose service-role Supabase keys to the browser. Keep private env vars in Vercel or local `.env`, not Git.
