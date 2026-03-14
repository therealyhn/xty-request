# XTY Request System

Production-ready song request platform for live events.

It has two apps in one project:
- Request app (`/`) for guests
- Admin dashboard (`/admin`) for DJ/team

## Live Capabilities

### Guest Request App
- Search tracks through Deezer proxy (`debounced` + validated query)
- Select track and send optional message
- Instant feedback modal on success/fail and rate-limit feedback
- Push opt-in after request submit, so guest can get status update later
- Install helper modal for Android/iOS PWA install
- Mobile-first UI, optimized for QR code onboarding at events

### Admin Dashboard
- Basic auth login (from backend `.env`)
- Filter requests by status: `new`, `accepted`, `played`, `declined`, `all`
- One-click status actions + edit flow for already processed requests
- Event management:
  - create event
  - rename event
  - set active event
  - delete event (with safe fallback event creation)
- Event-scoped request view (only requests for selected event)
- Export requests to PDF from dashboard
- Auto-refresh every 2 minutes (only while tab is visible)

### Push Notifications (optional but implemented)
- VAPID-based web push (`minishlink/web-push`)
- Triggered only on `accepted` and `declined`
- Service worker notification rendering with icon/badge branding
- Automatic cleanup of invalid subscriptions (expired/unsubscribed endpoints)

## Tech Stack

### Frontend
- React 19
- Vite 7
- Tailwind CSS 3
- Framer Motion
- jsPDF

### Backend
- PHP 8+
- MySQL
- Composer (`minishlink/web-push`)
- Apache (XAMPP/Hostinger-compatible setup)

## Project Structure

```txt
xty-request/
  src/
    components/
      sections/
        request/
        admin/
    hooks/
    lib/
      api/
      push.js
  public/
    sw.js
    manifest.json
    icon-192.png
    icon-512.png
  server/
    api/
      requests/create.php
      deezer/search.php
      push/public-key.php
      push/subscribe.php
      admin/requests.php
      admin/update-status.php
      admin/events.php
      admin/export-requests.php
      health.php
    lib/
    sql/schema.sql
```

## API Endpoints

### Public
- `GET /server/api/health.php`
- `GET /server/api/deezer/search.php?q={query}&limit={n}`
- `POST /server/api/requests/create.php`
- `GET /server/api/push/public-key.php`
- `POST /server/api/push/subscribe.php`

### Admin (Basic Auth required)
- `GET /server/api/admin/requests.php?status={status}&event_id={id}`
- `POST /server/api/admin/update-status.php`
- `GET /server/api/admin/events.php`
- `POST /server/api/admin/events.php` (`create`, `set_active`, `rename`, `delete`)
- `GET /server/api/admin/export-requests.php?event_id={id}`

## Database Schema

Defined in `server/sql/schema.sql`.

Main tables:
- `requests`
- `events`
- `settings`
- `push_subscriptions`

## Environment Variables

Frontend (`.env.local` in project root):
- `VITE_API_BASE_URL=https://your-domain.com`

Backend (`server/.env` or `server/.env.local`):
- `APP_ENV`
- `APP_URL`
- `DB_HOST`
- `DB_NAME`
- `DB_USER`
- `DB_PASS`
- `ADMIN_USER`
- `ADMIN_PASS`
- `RATE_LIMIT_WINDOW_SECONDS`
- `RATE_LIMIT_MAX_REQUESTS`
- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`

## Local Development

1. Install frontend deps:
   - `npm install`
2. Install backend deps:
   - `cd server && composer install`
3. Prepare DB:
   - Import `server/sql/schema.sql`
4. Configure env files:
   - root `.env.local`
   - `server/.env.local` (or `server/.env`)
5. Start frontend:
   - `npm run dev`
6. Serve project with Apache/PHP (XAMPP) so `/server/api/...` is reachable

## Build and Deploy

1. Build frontend:
   - `npm run build`
2. Upload `dist/*` to `public_html/`
3. Upload `server/` folder to `public_html/server/`
4. Keep `public/.htaccess` rules in root so `/admin` resolves to SPA
5. Put production secrets only in `server/.env` on hosting
6. Run `composer install` in server directory on hosting (or upload `vendor/`)

## Security Notes

- Do not commit real `.env` files
- Use strong admin credentials in production
- Keep HTTPS enabled (required for reliable push + PWA)
- Restrict CORS in production to your domain (avoid `*` if possible)

## Current Status

Project is live-ready with:
- event-based request management
- admin auto-refresh
- request-to-status push workflow
- PWA install support
