---
description: How to run the development server and test locally
---

# Development Workflow

## Prerequisites
- Node.js 18+
- npm

## Setup
// turbo
1. Install dependencies
```bash
npm install
```

// turbo
2. Create `.env.local` with Google Sheets credentials
```
GOOGLE_SHEETS_ID=...
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
```

// turbo
3. Start development server
```bash
npm run dev
```

4. Open http://localhost:3000

## Testing
// turbo
```bash
npm run test
```

## Build for Production
// turbo
```bash
npm run build
```
