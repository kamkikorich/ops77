---
description: How to deploy QR OPS to Vercel
---

# Deploy to Vercel

## First Time Setup

1. Go to https://vercel.com/new
2. Import `kamkikorich/qr_ops` from GitHub
3. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Supabase anon key
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
