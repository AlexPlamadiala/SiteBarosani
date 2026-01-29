# CLAUDE.md — Zidul Barosanilor

## Project Overview

**Zidul Barosanilor** ("The Wall of Barosani") is a full-stack satirical/entertainment web application where users pay to appear on a public "wall" as verified "barosani." It features a three-tier pricing system (Basic 20 RON, Gold 50 RON, Platinum 100 RON), downloadable digital certificates, a leaderboard, badge system, and an admin panel. Payment is manual via Revolut.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router 7, Vite 7 |
| Styling | Tailwind CSS 4, PostCSS, Autoprefixer |
| Backend | PHP >= 7.4 with PDO (MySQL/MariaDB) |
| Email | PHPMailer 6.8 |
| Certificates | Canvas API, jsPDF, qrcode.react |
| Real-time | Server-Sent Events (SSE) |
| Linting | ESLint 9 (flat config) |

## Repository Structure

```
SiteBarosani/
├── src/                    # React frontend source
│   ├── components/         # Reusable React components (~15)
│   ├── pages/              # Route-level page components (5)
│   ├── contexts/           # React Context providers (ToastContext)
│   ├── hooks/              # Custom hooks (useCountUp, useDebounce)
│   ├── utils/              # Utility functions (fetchWithRetry, etc.)
│   ├── data/               # Static data (barosani.json)
│   ├── assets/             # Static assets
│   ├── App.jsx             # Root component with router
│   ├── main.jsx            # Entry point
│   ├── index.css           # Global styles + Tailwind imports
│   └── App.css             # App-level styles
├── api/                    # PHP backend
│   ├── admin/              # Admin-only endpoints
│   ├── helpers/            # PHP utility classes
│   ├── sse/                # Server-Sent Events endpoints
│   ├── cron/               # Cron job handlers
│   ├── uploads/            # User-uploaded images
│   ├── config.php          # DB connection, CORS, rate limiting
│   ├── barosani.php        # Barosani CRUD endpoints
│   ├── applications.php    # Application submission endpoints
│   └── auth.php            # Authentication endpoints
├── admin/                  # Admin panel (static HTML pages)
├── database/               # DB initialization scripts
├── backups/                # Database backup files
├── public/                 # Static images (Crown.png, etc.)
├── vite.config.js          # Vite build config
├── eslint.config.js        # ESLint flat config
├── postcss.config.js       # PostCSS + Tailwind config
├── package.json            # Node dependencies & scripts
├── composer.json           # PHP dependencies
└── .env.example            # Environment variable template
```

## Development Commands

```bash
npm install          # Install frontend dependencies
npm run dev          # Start Vite dev server (localhost:5173)
npm run build        # Production build → dist/
npm run preview      # Preview production build
npm run lint         # Run ESLint
composer install     # Install PHP dependencies (PHPMailer)
```

## Key Conventions

### Frontend (React/JSX)

- **Functional components only** with React Hooks (`useState`, `useEffect`, `useRef`, `useContext`, `useMemo`)
- **Tailwind CSS utility classes** inline — no separate CSS modules per component
- **React Context** for cross-cutting concerns (e.g., `ToastContext` for notifications)
- **Custom hooks** in `src/hooks/` for reusable stateful logic
- **`fetchWithRetry()`** and **`fetchJSONWithRetry()`** in `src/utils/` for API calls with exponential backoff
- **Romanian language** for all user-facing text; code identifiers and comments may mix Romanian and English
- **Responsive design** with mobile-first Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
- **Accessibility**: semantic HTML, ARIA labels, keyboard navigation, skip-to-content links

### Backend (PHP)

- **PDO with prepared statements** for all database queries — never concatenate user input into SQL
- **`sanitizeInput()`** applied to all user input (`htmlspecialchars` + `strip_tags`)
- **Standard JSON API response format**: `{ "success": bool, "data": ..., "error": "..." }`
- **Session-based auth** with `checkAdminAuth()` guard on protected endpoints
- **CORS** configured in `api/config.php` — allowed origin set via `SITE_URL` env var
- **Rate limiting** via `RateLimiter` helper class
- **OOP helper classes** in `api/helpers/`: `EnvLoader`, `RateLimiter`, `ChangeTracker`, `EmailSender`, `ImageUploader`, `Logger`

### Styling & Design Tokens

- **Primary background**: Gradient gold/beige (`#F5E6D3` → `#E8D5B7`)
- **Accent gold**: `#D4AF37`
- **Official blue**: `#1a365d`
- **Stamp red**: `#8B0000`
- **Platinum silver**: `#E5E4E2`, `#BCC6CC`
- **Fonts** (Google Fonts): Roboto Condensed (headings), Roboto (general), Open Sans (body)
- **Tier icons**: 💎 Platinum, 🏆 Gold, ⭐ Basic

### Database

- Tier ordering convention: `ORDER BY FIELD(tier, 'platinum', 'gold', 'basic')`
- Active records filter: `WHERE status = 'active' AND data_expirare >= CURDATE()`
- Certificate IDs follow pattern: `BRS-YYYY-NNNN`

## Pages & Routes

| Route | Page Component | Description |
|-------|---------------|-------------|
| `/` | `Home.jsx` | Homepage with stats, leaderboard, recent activity |
| `/zid` | `Zid.jsx` | The Wall — searchable/filterable grid of barosani |
| `/cum-devin-barosan` | `CumDevinBarosan.jsx` | Pricing tiers + application form |
| `/termeni` | `Termeni.jsx` | Terms and conditions |
| `/confidentialitate` | `Confidentialitate.jsx` | Privacy policy |

## Key Features to Understand

- **Certificate Generation**: Canvas-based rendering (1200×800px) with QR codes, tier-specific styling, exported as PNG/PDF via jsPDF. See `CertificateGenerator.jsx`.
- **Real-time Updates**: SSE in `api/sse/` pushes changes to connected clients; frontend falls back to 30s polling.
- **Badge System**: 8 achievement badges rendered by `BadgeDisplay.jsx`.
- **Leaderboard**: Score-based ranking in `Leaderboard.jsx` with podium display.
- **Admin Panel**: Standalone HTML pages in `admin/` consuming the PHP API for managing barosani, applications, and viewing logs/dashboard.

## Environment Variables

Copy `.env.example` to `.env` and configure. Key sections:
- **Database**: `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`
- **URLs**: `SITE_URL`, `API_URL`, `ADMIN_URL`
- **SMTP**: Mail host, port, username, password, from address
- **Payment**: Revolut username, contact email
- **Security**: Session lifetime, rate limit settings
- **App**: `APP_ENV` (development/production), `APP_DEBUG`

## Git Conventions

- **Commit messages**: Mix of Romanian and English; often include emoji prefixes and bullet-point details
- **Commit style examples**:
  - `Fix certificate PDF layout issues: adjust spacing and positioning`
  - `Add Leaderboard & Badge System`
  - `Înlocuit html2canvas cu Canvas API pentru generare certificat`

## Security Notes

- All SQL uses PDO prepared statements — never use string interpolation for queries
- User input sanitized via `sanitizeInput()` and PHP `filter_var()` functions
- CORS restricted to configured `SITE_URL`
- Rate limiting on API endpoints
- Session-based admin auth with IP logging
- File uploads validated by `ImageUploader` helper
- See `SECURITY.md` for full details

## Common Tasks for AI Assistants

1. **Adding a new component**: Create in `src/components/`, use functional component with hooks, style with Tailwind classes, import where needed
2. **Adding a new API endpoint**: Create/edit PHP file in `api/`, include `config.php`, use PDO prepared statements, return JSON with `success`/`data`/`error` keys
3. **Modifying certificates**: Edit `CertificateGenerator.jsx` — canvas drawing coordinates are pixel-based at 1200×800
4. **Adding a new page**: Create in `src/pages/`, add route in `App.jsx`, add nav link in `Header.jsx`
5. **Modifying admin panel**: Edit HTML files in `admin/` — these are standalone pages, not part of the React app
