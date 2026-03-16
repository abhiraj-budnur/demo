# Peculiar — Waitlist Portal

> UI-first performance marketing for 12+ platforms.
> Waitlist system for 100 founding members at ₹500 each.

---

## Architecture Overview

```
Frontend (Vite + React)          Backend (NestJS)           Data
──────────────────────           ────────────────           ────
WaitlistPage                     POST /waitlist/register    Supabase
  4 switchable themes        →   POST /waitlist/verify  →   waitlist table
  Live spot counter              GET  /waitlist/count        users table
  Razorpay payment flow          GET  /waitlist/status/:e    (your main app)
ThankYouPage                     PATCH /waitlist/admin/grant-access
  Confetti + position            POST  /admin/notify-launch
  Share buttons
```

---

## Quick Start

### Frontend
```bash
cd peculiar-waitlist
cp .env.example .env.local
npm install
npm run dev
# → http://localhost:5173
```

### Backend
```bash
cd peculiar-waitlist/backend
cp .env.example .env
npm install
npm run start:dev
# → http://localhost:3000
```

---

## Environment Variables

### Frontend (.env.local)
```
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
VITE_API_BASE_URL=https://api.try-peculiar.com
```

### Backend (.env)
```
PORT=3000
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
SMTP_HOST=smtp.zoho.in
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=hello@try-peculiar.com
SMTP_PASS=your_app_password
WAITLIST_TOTAL_SPOTS=100
WAITLIST_PRICE_PAISE=50000
```

---

## Supabase Setup

Run this SQL in your Supabase SQL editor:
(Full schema is in `backend/src/config/supabase.config.ts`)

Key tables:
- `waitlist` — all waitlist entries, positions, payment status
- `users` — your main app users table (must exist or adjust `grant-access` logic)

---

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/waitlist/register` | Register email + name, get Razorpay order ID |
| POST | `/waitlist/verify-payment` | Confirm payment, assign spot |
| GET | `/waitlist/count` | Live spot counter for frontend |
| GET | `/waitlist/status/:email` | Check position & status |
| POST | `/waitlist/webhook/razorpay` | Razorpay webhook (set in dashboard) |

### Admin (protect these!)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/waitlist/admin/list` | All entries + stats |
| PATCH | `/waitlist/admin/grant-access` | 🚀 Launch button |
| POST | `/waitlist/admin/notify-launch` | Send launch emails |

---

## The 4 Themes

Click the theme button (top-right) to cycle through:

| # | Name | Font | Vibe |
|---|------|------|------|
| 1 | **Cyber** 🌌 | Syne + Space Grotesk | Dark, indigo glow, grid lines |
| 2 | **Electric** ⚡ | Cabinet Grotesk | Light, bold orange, startup energy |
| 3 | **Minimal** ◻ | DM Serif Display | White, serif italic, Framer-like |
| 4 | **Luxe** ✦ | DM Serif Display | Dark gold, premium, editorial |

All 4 themes are driven by CSS custom properties — no conditional rendering, instant transitions.

---

## 🚀 Launch Sequence

When your app is ready to go live:

### Step 1 — Send 48h warning email
```bash
curl -X POST https://api.try-peculiar.com/waitlist/admin/notify-launch
```
This sends "Peculiar launches in 48 hours" to all 100 paid members.

### Step 2 — Grant access (the big moment)
```bash
curl -X PATCH https://api.try-peculiar.com/waitlist/admin/grant-access
```
This:
1. Gets all 100 paid waitlist members
2. Inserts them into your main `users` table with `priority_access: true`
3. Marks them `access_granted: true` in waitlist table
4. Sends each a personal "you're in" email with their login link

### Step 3 — Open public signup
After Step 2 completes, enable public signups on your main app.
Waitlist members already exist in `users` with `priority_access: true` — 
they show up as founding members in your DB automatically.

---

## Embedding in Your Landing Page

The waitlist UI is a standalone React app, but you can embed just the
form card into your existing landing page:

```jsx
// In your main landing page:
import WaitlistPage from 'peculiar-waitlist/src/components/WaitlistPage'

// Or as an iframe:
<iframe
  src="https://waitlist.try-peculiar.com"
  style={{ width: '100%', minHeight: '900px', border: 'none' }}
  title="Join Peculiar Waitlist"
/>
```

---

## Deployment

### Frontend → Vercel / Netlify
```bash
npm run build
# dist/ folder → deploy to Vercel
```
Set env vars in Vercel dashboard.

### Backend → Railway / Render / Fly.io
```bash
# Dockerfile included at backend/Dockerfile
docker build -t peculiar-api ./backend
```
Or deploy directly to Railway:
```bash
railway up
```

### Razorpay Webhook
In Razorpay Dashboard → Settings → Webhooks → Add:
```
URL: https://api.try-peculiar.com/waitlist/webhook/razorpay
Events: payment.captured, payment.failed
```

---

## File Structure
```
peculiar-waitlist/
├── src/
│   ├── themes/themes.js          # 4 theme configs
│   ├── App.jsx                   # Root + routing
│   └── components/
│       ├── WaitlistPage.jsx      # Main hero + form
│       ├── WaitlistPage.module.css
│       ├── ThankYouPage.jsx      # Post-payment page
│       └── ThankYouPage.module.css
├── backend/
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       ├── config/supabase.config.ts   # DB client + SQL schema
│       ├── waitlist/
│       │   ├── waitlist.module.ts
│       │   ├── waitlist.controller.ts  # All REST endpoints
│       │   ├── waitlist.service.ts     # Business logic
│       │   └── waitlist.dto.ts
│       ├── payment/
│       │   └── payment.service.ts      # Razorpay
│       └── mail/
│           └── mail.service.ts         # All 3 email templates
├── DOMAIN_EMAIL_SETUP.md         # hello@try-peculiar.com setup
├── .env.example                  # Frontend env vars
└── backend/.env.example          # Backend env vars
```
