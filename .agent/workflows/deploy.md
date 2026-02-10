---
description: How to deploy QR OPS to Vercel
---

# Deploy to Vercel

## First Time Setup

1. Go to https://vercel.com/new
2. Import `kamkikorich/qr_ops` from GitHub
3. Configure environment variables:
   - `GOOGLE_SHEETS_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
4. Click Deploy

## Subsequent Deploys

Vercel auto-deploys on every push to `main` branch.

// turbo
```bash
git add -A
git commit -m "your message"
git push
```

## Manual Redeploy

Go to Vercel dashboard → Deployments → Click "Redeploy" on latest deployment
