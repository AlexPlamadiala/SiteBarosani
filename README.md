# Zidul Barosanilor

Site MVP unde utilizatorii platesc pentru a aparea pe un "zid" public si primesc un certificat digital care atesta ca sunt "barosani verificati".

## Tech Stack

- **Frontend:** React 19 + Vite 7
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Routing:** React Router DOM 7
- **Certificate Generation:** Canvas API + jsPDF
- **QR Codes:** qrcode.react
- **Testing:** Vitest + React Testing Library
- **Backend:** PHP APIs (separate)

## Features

### Core Features
- Public "Wall" displaying all verified barosani
- 4 pricing tiers (Basic, Gold, Platinum, Suprem)
- Downloadable digital certificates (PNG/PDF)
- Individual barosan profile pages
- QR code verification on certificates
- Responsive luxury dark theme

### Visual Features
- Animated cosmic background with stars, galaxies, nebulae
- Realistic Earth and Moon rendering
- Meteorite animations with "Barosanul Suprem" banner
- 3D card tilt effects
- Confetti celebrations
- Floating particles

### User Features
- Search, filter, and sort functionality
- Tier upgrade system with email verification
- Real-time activity feed (SSE)
- Leaderboard
- Pagination (24 items per page)

### Admin Features
- Full admin dashboard
- Application management
- Barosani management
- Statistics overview
- Payment proof tracking

## Development

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Run tests

```bash
npm run test
```

### Build for production

```bash
npm run build
```

## Project Structure

```
/src
  /components
    /animations         # Framer Motion animations
    /certificate        # Certificate generation system
    Header.jsx          # Navigation header
    Footer.jsx          # Site footer
    BarosanCard.jsx     # Individual barosan card with 3D effect
    BarosanGrid.jsx     # Grid of all barosani
    CertificateGenerator.jsx # Certificate modal
    PricingTiers.jsx    # Pricing cards
    StarryBackground.jsx # Cosmic background
    ...
  /pages
    Home.jsx            # Homepage with hero, stats, activity
    Zid.jsx             # Main wall with all barosani
    CumDevinBarosan.jsx # Registration page
    BarosanProfile.jsx  # Individual profile page
    BarosanulSuprem.jsx # Supreme barosan page
    Upgrade.jsx         # Tier upgrade page
    Admin.jsx           # Admin dashboard
    ...
  /hooks                # Custom React hooks
  /utils                # Utility functions
  /contexts             # React contexts
  /config               # API configuration
```

## Tier System

| Tier | Price | Features |
|------|-------|----------|
| Basic | Free | Standard certificate, listed in registry |
| Gold | 50 RON | Gold certificate, special badge |
| Platinum | 149 RON | Premium certificate, priority display, social link |
| Suprem | 50 RON/hour | Featured position, meteorite banner, countdown timer |

## Payment Process

1. User selects tier on registration page
2. Payment via Revolut
3. User uploads photo and details
4. Admin approves application
5. User appears on wall and can download certificate

## Deployment

Optimized for static hosting (Netlify, Vercel) with PHP backend.

```bash
# Build command
npm run build

# Publish directory
dist
```

## TODO for Production

- [ ] Update Revolut username in PricingTiers.jsx
- [ ] Update contact email in PricingTiers.jsx
- [ ] Add real social media links in Footer.jsx
- [ ] Create and add og-image.png to /public
- [ ] Set up custom domain
- [ ] Add analytics

## License

This project is for entertainment purposes only.

---

**Made in Romania**
