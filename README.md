# XTY REQUESTS

Interactive song request system for live events by XTY. Mobile-first UI with a premium dark club aesthetic, fast Deezer search, and an admin queue for managing requests in real time.

## Highlights
- Mobile-first request flow: search, select, night code, optional message, submit.
- Admin panel: status management (New, Accepted, Played, Declined), quick actions, filters.
- Night code system with admin control (stored in DB settings).
- Secure backend: basic auth for admin APIs, rate limiting for search.
- Optional web push notifications on Accepted/Declined (via VAPID + service worker).
- Clear separation of frontend and PHP backend; modular React components.

## Tech Stack
- Frontend: React + Vite + Tailwind CSS + Framer Motion
- Backend: PHP 8+ (Hostinger compatible)
- Data: MySQL
- Search: Deezer API (proxy endpoint)
- Web Push: Minishlink WebPush (optional, production only)

## Architecture Overview
- `src/` React app (request and admin pages).
- `server/` PHP API (requests, admin, search, night-code, push).
- `server/sql/schema.sql` database schema.
- `public/sw.js` service worker for push notifications.

## Pages
- `/` Request page (users submit song requests).
- `/admin` Admin panel (manage queue and night code).

## Core Features
### Request Flow
- Deezer search with debounce.
- Track selection and preview data.
- Night code validation (DB settings or env fallback).
- Success and error modals for feedback.

### Admin Flow
- Basic auth protected endpoints.
- Filterable queue and status updates.
- Night code management (view/generate/save).

### Security
- No secrets committed.
- `.env` and `.env.local` are gitignored.
- API validates input and enforces basic auth on admin routes.

## Getting Started (Local)
### 1) Install frontend deps
```
npm install
```

### 2) Configure backend env
Create `server/.env.local`:
```
APP_ENV=development
APP_URL=http://localhost/Projects/xty-request

DB_HOST=127.0.0.1
DB_NAME=xty_requests_local
DB_USER=root
DB_PASS=

ADMIN_USER=admin
ADMIN_PASS=admin

REQUEST_NIGHT_CODE=1234
RATE_LIMIT_WINDOW_SECONDS=60
RATE_LIMIT_MAX_REQUESTS=15

VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

### 3) Create DB schema
Import `server/sql/schema.sql` into your MySQL database.

### 4) Start frontend
```
npm run dev
```

### 5) Start backend
Use XAMPP/Apache to serve `server/` under:
```
http://localhost/Projects/xty-request/server/
```

## Production Notes
- Upload `dist/` to domain root.
- Upload `server/` to `public_html/server/`.
- Set `server/.env` with production credentials (never commit).
- Ensure DB schema is imported before first run.

## Web Push (Optional)
Push notifications are sent when a request is Accepted or Declined.
Requires:
- Valid VAPID keys in `server/.env`.
- HTTPS domain (push does not work on insecure origins).

## Important Files
- `src/components/sections/request/*` request UI
- `src/components/sections/admin/*` admin UI
- `src/lib/api/*` API clients
- `server/api/*` PHP endpoints
- `server/sql/schema.sql` DB schema

## Repo Hygiene
### SAFE TO COMMIT
- `src/`
- `server/api/`, `server/lib/`, `server/sql/`
- `public/`
- `README.md`, `package.json`, `vite.config.*`

### NOT SAFE TO COMMIT
- `server/.env`
- `server/.env.local`
- `.env.local` (frontend)
- `node_modules/`
- `vendor/`

---

If you are reviewing this project, focus on:
- UX flow clarity for real event usage.
- PHP backend simplicity and Hostinger compatibility.
- End-to-end data flow from request to admin actions.
