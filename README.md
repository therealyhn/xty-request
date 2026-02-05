<div align="center">

# 🎵 XTY REQUEST SYSTEM

### Interactive Live Event Song Request Platform

*Premium mobile-first request system with real-time admin queue management*

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![PHP](https://img.shields.io/badge/PHP-8%2B-777BB4?style=flat&logo=php&logoColor=white)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Deployment](#-deployment) • [API Documentation](#-api-endpoints)

</div>

---

## 📖 **Overview**

XTY Request is a modern, mobile-first song request system designed for live events and DJ performances. Built with a premium dark club aesthetic, it enables seamless interaction between event attendees and performers through an intuitive request flow backed by a powerful admin queue management system.

**Key Highlights:**
- 🎯 **Mobile-First UX** — Optimized touch interface for smartphone users at live events
- 🔍 **Deezer Integration** — Lightning-fast track search with debounced queries
- 🔐 **Night Code System** — Event-specific validation with admin-controlled codes
- ⚡ **Real-Time Queue** — Instant status updates (New → Accepted → Played/Declined)
- 🔔 **Push Notifications** — Optional web push for request status updates
- 🎨 **Premium Design** — Dark club aesthetic with Framer Motion animations

---

## ✨ **Features**

### 🎤 **User Request Flow**
- **Smart Search** — Debounced Deezer API integration with instant results
- **Track Preview** — View album art, artist, and preview links before requesting
- **Night Code Validation** — Event-specific access control with DB-stored codes
- **Personalization** — Optional nickname and message for each request
- **Instant Feedback** — Beautiful success/error modals with animations
- **Push Subscription** — Opt-in notifications for request status updates

### 🎛️ **Admin Queue Management**
- **Centralized Dashboard** — Manage all requests from a single interface
- **Multi-Status Workflow** — New, Accepted, Played, Declined states
- **Quick Actions** — Bulk operations and one-click status updates
- **Advanced Filtering** — Sort by status, time, and search criteria
- **Night Code Control** — Generate and update night codes on the fly
- **Real-Time Updates** — Live queue refresh with status indicators

### 🔒 **Security & Performance**
- **Basic Auth Protection** — Secured admin endpoints with HTTP authentication
- **Rate Limiting** — Configurable request throttling for Deezer API
- **Input Validation** — Server-side sanitization and validation
- **IP Tracking** — Request logging for abuse prevention
- **Environment Isolation** — Separate configs for development/production
- **No Committed Secrets** — All credentials in gitignored `.env` files

### 🔔 **Web Push Notifications** *(Optional)*
- **VAPID Integration** — Standards-compliant web push implementation
- **Service Worker** — Background notification handling
- **Selective Subscriptions** — Per-request opt-in model
- **Status Triggers** — Automatic push on Accepted/Declined status changes

---

## 🛠️ **Tech Stack**

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.2 | UI framework with hooks and modern patterns |
| **Vite** | 7.2 | Lightning-fast dev server and build tool |
| **Tailwind CSS** | 3.4 | Utility-first styling with custom design system |
| **Framer Motion** | 12.30 | Smooth animations and transitions |
| **Swiper** | 11.2 | Touch-optimized carousels and sliders |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **PHP** | 8+ | Server-side logic (Hostinger compatible) |
| **MySQL** | 5.7+ | Relational database for requests and settings |
| **Deezer API** | v1 | Music search and track metadata |
| **Minishlink WebPush** | Latest | VAPID-based push notification delivery |

### DevOps & Tools
- **XAMPP/Apache** — Local development server
- **Composer** — PHP dependency management
- **npm** — Node package management
- **Git** — Version control with protected secrets

---

## 📁 **Project Structure**

```
xty-request/
├── src/                          # React frontend source
│   ├── components/              
│   │   ├── sections/
│   │   │   ├── request/         # User request flow components
│   │   │   └── admin/           # Admin queue management components
│   │   └── ui/                  # Reusable UI components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/
│   │   └── api/                 # API client functions
│   ├── pages/                   # Main page components
│   │   ├── RequestPage.jsx     # User-facing request interface
│   │   └── AdminPage.jsx       # Admin queue dashboard
│   ├── App.jsx                  # Root application component
│   └── main.jsx                 # React entry point
│
├── server/                       # PHP backend
│   ├── api/                     # API endpoints
│   │   ├── requests.php         # Request CRUD operations
│   │   ├── admin.php            # Admin queue management
│   │   ├── search.php           # Deezer search proxy
│   │   ├── night-code.php       # Night code management
│   │   └── push.php             # Web push notifications
│   ├── lib/                     # Shared PHP utilities
│   │   ├── Database.php         # MySQL connection handler
│   │   ├── Auth.php             # Basic auth validation
│   │   └── RateLimit.php        # Request rate limiting
│   ├── sql/
│   │   └── schema.sql           # Database schema definition
│   ├── bootstrap.php            # Backend initialization
│   └── .env.local               # Local environment config (gitignored)
│
├── public/                       # Static assets
│   └── sw.js                    # Service worker for push notifications
│
├── dist/                         # Production build (generated)
├── .env.example                 # Environment template
├── package.json                 # Frontend dependencies
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── README.md                    # This file
```

---

## 🔌 **API Endpoints**

### Public Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/server/api/search.php` | GET | Search Deezer for tracks (rate-limited) |
| `/server/api/requests.php` | POST | Submit a new song request |
| `/server/api/push.php` | POST | Subscribe to push notifications |

### Admin Endpoints (Basic Auth Required)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/server/api/admin.php` | GET | Fetch all requests with filters |
| `/server/api/admin.php` | PATCH | Update request status |
| `/server/api/night-code.php` | GET | Get current night code |
| `/server/api/night-code.php` | POST | Generate/update night code |

### Example Request Flow

**1. Search for a track:**
```javascript
GET /server/api/search.php?q=never+gonna+give+you+up
```

**2. Submit request:**
```javascript
POST /server/api/requests.php
Content-Type: application/json

{
  "track_id": "123456",
  "track_title": "Never Gonna Give You Up",
  "track_artist": "Rick Astley",
  "track_album": "Whenever You Need Somebody",
  "track_cover": "https://...jpg",
  "track_preview": "https://...mp3",
  "track_link": "https://deezer.com/...",
  "nickname": "JohnDoe",
  "message": "Classic!",
  "night_code": "1234"
}
```

**3. Admin updates status:**
```javascript
PATCH /server/api/admin.php
Authorization: Basic YWRtaW46YWRtaW4=
Content-Type: application/json

{
  "id": 42,
  "status": "accepted"
}
```

---

## 🔐 **Security Best Practices**

### Environment Configuration
- ✅ **Never commit** `.env` or `.env.local` files
- ✅ Use strong admin passwords in production
- ✅ Rotate night codes regularly via admin panel
- ✅ Generate unique VAPID keys for production

### Production Checklist
- [ ] Change default admin credentials
- [ ] Enable HTTPS (required for web push)
- [ ] Set restrictive rate limits
- [ ] Review database user permissions
- [ ] Enable PHP error logging (not display)
- [ ] Backup database regularly
- [ ] Monitor request logs for abuse patterns

---

## 📝 **Database Schema**

### `requests` Table
Stores all song requests with track metadata and status.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK) | Auto-incrementing request ID |
| `track_id` | VARCHAR(64) | Deezer track identifier |
| `track_title` | VARCHAR(255) | Song title |
| `track_artist` | VARCHAR(255) | Artist name |
| `track_album` | VARCHAR(255) | Album name |
| `track_cover` | VARCHAR(512) | Album artwork URL |
| `track_preview` | VARCHAR(512) | 30s preview MP3 URL |
| `track_link` | VARCHAR(512) | Deezer track page URL |
| `nickname` | VARCHAR(64) | Optional requester nickname |
| `message` | VARCHAR(255) | Optional request message |
| `status` | ENUM | `new`, `accepted`, `played`, `declined` |
| `request_ip` | VARCHAR(64) | Requester IP address |
| `created_at` | TIMESTAMP | Request submission time |

### `settings` Table
Stores system configuration (e.g., night codes).

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK) | Setting ID |
| `name` | VARCHAR(64) | Setting key (unique) |
| `value` | VARCHAR(255) | Setting value |
| `updated_at` | TIMESTAMP | Last modification time |

### `push_subscriptions` Table
Stores web push notification subscriptions per request.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (PK) | Subscription ID |
| `request_id` | INT (FK) | Associated request ID |
| `endpoint` | TEXT | Push service endpoint URL |
| `p256dh` | VARCHAR(255) | Encryption key |
| `auth` | VARCHAR(255) | Auth secret |
| `created_at` | TIMESTAMP | Subscription creation time |

---

## 🎨 **Design Philosophy**

The XTY Request System embraces a **premium dark club aesthetic** with these design principles:

- **Mobile-First:** Touch-optimized interfaces for smartphone users at events
- **High Contrast:** Dark backgrounds with vibrant accent colors for readability in dim venues
- **Smooth Animations:** Framer Motion transitions for polished interactions
- **Minimal Friction:** 3-step request flow (search → select → submit)
- **Clear Hierarchy:** Visual status indicators and color-coded queue items
- **Responsive Layout:** Seamless experience from mobile to desktop admin panels

---

## 📄 **License**

This project is proprietary software developed for XTY live events.

---

## 📞 **Support**

For questions or issues:
1. Review this README thoroughly
2. Check `server/api/` endpoint implementations
3. Verify environment configuration matches `.env.example`
4. Test with browser DevTools Network tab for API debugging

---

<div align="center">

**Built with ❤️ for the XTY experience**

*Enhancing live events through seamless music interaction*

</div>
