---
description: Complete analysis of QR OPS system - PERKESO inspection tracking application
---

# QR OPS System Analysis

## Overview
QR OPS adalah sistem pengurusan lawatan pemeriksa PERKESO. Sistem ini menggunakan QR code untuk mengenal pasti premis dan merekod lawatan pemeriksaan.

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.1.4 |
| Runtime | React 19.2.3 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Styling | Tailwind CSS 4 |
| Validation | Zod 4.3.6 |
| Testing | Vitest 4.0.18 |
| QR Code | react-qr-code, @yudiel/react-qr-scanner |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin-only pages
│   │   ├── create-user/    # Create new user
│   │   ├── print-batch/    # Print QR stickers (6/A4)
│   │   └── report/         # Visit reports with filters
│   ├── login/              # Authentication
│   ├── premis/[id]/        # Premise dashboard
│   ├── register/           # Register new premise
│   ├── scan/[id]/          # QR scan handler
│   ├── sticker/[uuid]/     # Individual sticker view
│   └── visit/              # Record visit
├── components/ui/          # Reusable components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── QRCodeWithLogo.tsx  # QR with PERKESO logo
│   └── Scanner.tsx
├── lib/                    # Utilities & types
│   ├── actions.ts          # Server actions
│   ├── db.ts               # Database client
│   ├── schemas.ts          # Zod validation
│   ├── schemas.test.ts     # Schema tests
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # Utility functions
├── utils/supabase/         # Supabase clients
│   ├── client.ts           # Browser client
│   └── server.ts           # Server client
└── middleware.ts           # Auth middleware
```

## Database Schema

### Table: premises
| Column | Type | Description |
|--------|------|-------------|
| uuid | UUID (PK) | Unique identifier |
| nama_kedai | TEXT | Business name |
| no_lot | TEXT | Lot number |
| status_perkeso | TEXT | Registration status |
| gps | TEXT | GPS coordinates |
| created_at | TIMESTAMP | Creation date |

### Table: visits
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT (PK) | Auto-increment ID |
| premis_id | UUID (FK) | References premises |
| inspector_id | UUID (FK) | References auth.users |
| status | TEXT | "Patuh", "Kompoun", "Lawat Semula" |
| catatan | TEXT | Notes |
| created_at | TIMESTAMP | Visit date |

## User Flow

1. **Admin prints stickers** → `/admin/print-batch`
2. **Sticker placed at premise** → Physical QR code
3. **Inspector scans QR** → Redirects to `/scan/[uuid]`
4. **If unregistered** → `/register?uuid=xxx`
5. **If registered** → `/premis/[uuid]`
6. **Record visit** → `/visit?id=xxx`
7. **View reports** → `/admin/report`

## Key Features

- ✅ QR code with PERKESO logo (25% overlay)
- ✅ 6 stickers per A4 with cutting guides
- ✅ Remember Me login (persistent session)
- ✅ Report with date range / year filter
- ✅ Statistics dashboard (Patuh/Kompoun/Lawat Semula)
- ✅ GPS auto-capture on registration
- ✅ Zod validation on all forms

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run test     # Run Vitest tests
npm run lint     # Run ESLint
```

## Deployment

- **Platform**: Vercel
- **Repository**: github.com/kamkikorich/qr_ops
- **Auto-deploy**: On push to main branch
