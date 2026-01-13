# 👑 Zidul Barosanilor

Site MVP satiric/amuzant unde utilizatorii plătesc pentru a apărea pe un "zid" public și primesc un certificat digital care atestă că sunt "barosani verificați".

## 🚀 Tech Stack

- **Frontend:** React 19 + Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router DOM
- **Certificate Generation:** html2canvas
- **QR Codes:** qrcode.react
- **Data Storage:** Static JSON (MVP - no backend)

## 📋 Features

- ✅ Public "Wall" displaying all verified barosani
- ✅ 3 pricing tiers (Basic, Gold, Platinum)
- ✅ Downloadable digital certificates (PNG)
- ✅ Responsive design (mobile-first)
- ✅ SEO optimized
- ✅ Sorting by tier (Platinum → Gold → Basic)

## 🛠️ Development

### Install dependencies

\`\`\`bash
npm install
\`\`\`

### Run development server

\`\`\`bash
npm run dev
\`\`\`

### Build for production

\`\`\`bash
npm run build
\`\`\`

### Preview production build

\`\`\`bash
npm run preview
\`\`\`

## 📁 Project Structure

\`\`\`
/src
  /components
    Header.jsx              # Navigation header
    Footer.jsx              # Site footer
    BarosanCard.jsx         # Individual barosan card
    BarosanGrid.jsx         # Grid of all barosani
    CertificateGenerator.jsx # Certificate generation & download
    PricingTiers.jsx        # Pricing cards with modals
    HowItWorks.jsx          # Process explanation
  /pages
    Home.jsx                # Homepage with the wall
    CumDevinBarosan.jsx     # Pricing & instructions page
  /data
    barosani.json           # Static data file
  /assets
    /images                 # Static images
\`\`\`

## 💾 Data Management

To add a new barosan, edit \`src/data/barosani.json\`:

\`\`\`json
{
  "id": "7",
  "nume": "Numele Barosanului",
  "motto": "Motto personal (max 50 caractere)",
  "tier": "basic|gold|platinum",
  "poza": "URL sau /path/to/image.jpg",
  "link": "https://instagram.com/username (platinum only)",
  "dataInregistrare": "2025-01-13",
  "certificatId": "BRS-2025-0007"
}
\`\`\`

## 🎨 Design

### Color Palette
- **Primary Background:** Gradient gold/beige (#F5E6D3 → #E8D5B7)
- **Accent Gold:** #D4AF37
- **Official Blue:** #1a365d
- **Stamp Red:** #8B0000

### Typography
- **Headings:** Playfair Display (serif)
- **Body:** Open Sans (sans-serif)

## 💳 Payment Process

1. User selects tier (Basic 20 RON, Gold 50 RON, Platinum 100 RON)
2. Payment via Revolut to @username-revolut
3. User sends photo + details via email
4. Manual addition to barosani.json
5. User appears on wall + receives certificate

## 🚢 Deployment

Optimized for:
- **Netlify** (recommended)
- **Vercel**
- Any static hosting service

### Deploy to Netlify

\`\`\`bash
# Build command
npm run build

# Publish directory
dist
\`\`\`

## 📝 TODO for Production

- [ ] Update Revolut username in PricingTiers.jsx
- [ ] Update contact email in PricingTiers.jsx
- [ ] Add real social media links in Footer.jsx
- [ ] Create and add og-image.png to /public
- [ ] Set up custom domain
- [ ] Add analytics (Google Analytics, Plausible, etc.)

## 🎯 Future Enhancements

- Search/filter functionality
- Automatic payment processing
- Backend + database
- Individual barosan pages
- Dark mode
- Admin panel
- Email notifications
- Monthly renewal reminders

## 📄 License

This project is for entertainment purposes only.

## 🤝 Contributing

This is a private MVP project. Contact the owner for contribution guidelines.

---

**Made with 💎 and 🤣 in Romania**
