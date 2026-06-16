# Vercel Deployment Notes

Primary deployment: Vercel.

Live URL: https://op-cpt.vercel.app

Before deploying:

```bash
cd apps/op-cpt
npm run lint
npm run typecheck
npm run build
```

Do not expose service-role keys, private scans, owner data, customer details, payment details, or private cost basis in browser bundles.
