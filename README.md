# AIBot Crypto Analytics

Institutional-grade BTC and ETH analytics dashboard built with Next.js, TypeScript, Zustand, Tailwind CSS, realtime market streaming, support/resistance detection, and AI-driven market scoring.

## Stack
- Next.js 15
- React + TypeScript
- Tailwind CSS
- Zustand
- Binance REST + WebSocket
- Vercel deployment

## Local Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Environment

Create `.env.local`

```env
NEXT_PUBLIC_APP_NAME=AIBOT
```

## Deploy to Vercel

1. Push repo to GitHub
2. Go to Vercel
3. Import repository `s44910470-ctrl/aibot`
4. Framework preset: Next.js
5. Deploy

The app uses Next.js API routes and realtime streaming, so GitHub Pages is not supported.
