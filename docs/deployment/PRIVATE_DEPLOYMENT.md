# Private Deployment Notes

## Boundary

This project is private and personal-use only. It contains One Piece-themed assets and card/platform media that should remain behind a password gate.

## Secrets

Never commit:

- passcodes or passcode hashes for production
- API keys
- personal address, phone, email, wallet, payment, tracking, or order logistics

Use `.env.example` as the public contract and `.env.local` for local secrets.

## GitHub

Before pushing:

```bash
gh repo view GHX5T-SOL/one_piece_tcg --json nameWithOwner,isPrivate,url
```

Stop if `isPrivate` is not true or if auth fails.

## Vercel

Primary deploy target. Static output should point at `deploy/`.

## Netlify

Fallback target using `netlify.toml`. Keep the same password-gate boundary.
