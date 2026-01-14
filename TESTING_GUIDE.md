# 🚀 Setup Rapid pentru Testare - Zidul Barosanilor

## ✅ Ce am făcut până acum:

- ✅ **Composer dependencies** instalate (PHPMailer)
- ✅ **NPM dependencies** instalate (React + dependencies)
- ⏳ **Database migration** - trebuie rulat manual

---

## 📊 1. Setup Database (OBLIGATORIU)

Deschide **phpMyAdmin** și rulează următoarele:

### Opțiunea A: Dacă database-ul NU există încă

1. Deschide `http://localhost/phpmyadmin`
2. Click pe tab-ul **"SQL"**
3. Copiază tot conținutul din `database/zid_barosani.sql`
4. Click **"Go"** / **"Execută"**

### Opțiunea B: Dacă database-ul EXISTĂ deja

1. Deschide `http://localhost/phpmyadmin`
2. Selectează database-ul **`zid_barosani`** din stânga
3. Click pe tab-ul **"SQL"**
4. Copiază tot conținutul din `database/add_expiry_notifications.sql`
5. Click **"Go"** / **"Execută"**

**Sau din terminal XAMPP:**
```bash
cd C:\xampp\mysql\bin
mysql.exe -u root -p zid_barosani < "C:\xampp\htdocs\SiteBarosani\database\add_expiry_notifications.sql"
```

---

## ⚙️ 2. Configurare Environment (.env)

Creează fișierul `.env` în root-ul proiectului:

```bash
# Copiază template-ul
cp .env.example .env
```

**SAU** deschide `.env.example`, copiază conținutul și creează manual `.env` cu:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=zid_barosani

# Site Configuration
SITE_URL=http://localhost:5173
API_URL=http://localhost/SiteBarosani/api
ADMIN_URL=http://localhost/SiteBarosani/admin

# Email Configuration (OPȚIONAL pentru teste)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=          # Lasă gol dacă nu vrei să testezi email-uri
MAIL_PASSWORD=          # Lasă gol dacă nu vrei să testezi email-uri
MAIL_FROM_EMAIL=noreply@zidulbarosanilor.ro
MAIL_FROM_NAME=Zidul Barosanilor

# Revolut Configuration
REVOLUT_USERNAME=@username-revolut
CONTACT_EMAIL=contact@zidulbarosanilor.ro

# Security
SESSION_LIFETIME=7200
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=3600

# Environment
APP_ENV=development
APP_DEBUG=true
```

**Notă:** Email-urile vor funcționa și fără SMTP (fallback la PHP mail()), dar pentru producție e recomandat SMTP.

---

## 🎯 3. Pornire Aplicație

### Backend (PHP - XAMPP)
- Asigură-te că **Apache** și **MySQL** rulează în XAMPP Control Panel
- API-ul va fi accesibil la: `http://localhost/SiteBarosani/api`

### Frontend (React)
Deschide un terminal în `C:\xampp\htdocs\SiteBarosani` și rulează:

```bash
npm run dev
```

Site-ul se va deschide la: **http://localhost:5173**

---

## 🧪 4. Testing Checklist

### ✅ Pagina Publică (http://localhost:5173)

- [ ] **Home** - Vezi statistici și call-to-action
- [ ] **Zid** - Vezi lista barosani cu certificatele lor
  - [ ] **Search** - Caută după nume/motto/certificat
  - [ ] **Filter** - Filtrează după tier (Platinum/Gold/Basic)
  - [ ] **Certificate Download** - Click pe barosan → Descarcă PDF/PNG
- [ ] **Cum Devin Barosan** - Formularul de aplicare
  - [ ] **Image Upload** - Upload poză (drag & drop sau click)
  - [ ] Preview imagine
  - [ ] Submit formular

### ✅ Admin Panel (http://localhost/SiteBarosani/admin)

**Login credentials:**
- Username: `admin`
- Password: `Barosan2025!`

- [ ] **Dashboard**
  - [ ] Vezi statistici (Total, Platinum, Gold, Basic)
  - [ ] Badge verde "Live Updates" apare (SSE)
  - [ ] Widget "Barosani care expiră în 30 zile"
  - [ ] Button "Run Expiry Check" funcționează

- [ ] **Barosani**
  - [ ] Vezi lista barosani
  - [ ] Adaugă barosan nou
  - [ ] Editează barosan
  - [ ] Șterge barosan
  - [ ] **Real-time updates** - modificările apar instant în alte tab-uri

- [ ] **Cereri**
  - [ ] Vezi lista cereri pending
  - [ ] Aprobă cerere → verifică că se creează barosan + email
  - [ ] Respinge cerere
  - [ ] **Real-time updates** - cererile noi apar instant

- [ ] **Logs**
  - [ ] Vezi logs (color-coded: ERROR roșu, WARNING galben, etc.)
  - [ ] Filtrează după nivel (ERROR/WARNING/INFO/DEBUG)
  - [ ] Search în logs
  - [ ] Auto-refresh la 10 secunde

### ✅ Real-Time Updates (SSE)

**Test SSE:**
1. Deschide 2 ferestre: **Dashboard** + **Zid Public**
2. În Dashboard, aprobă o cerere
3. Verifică că în **Zid Public** apare instant noul barosan
4. Badge verde "Live Updates" trebuie să fie vizibil în admin

### ✅ Email Notifications (Opțional - necesită SMTP config)

**Dacă ai configurat SMTP în .env:**
- [ ] Aprobă cerere → verifică email primit (check spam folder)
- [ ] Run "Expiry Check" → verifică email-uri expiry

**Dacă NU ai configurat SMTP:**
- Email-urile nu se vor trimite, dar aplicația va funcționa normal

---

## 🐛 Troubleshooting

### 1. **"Cannot connect to database"**
- Verifică că MySQL rulează în XAMPP
- Verifică credentials în `.env`
- Rulează migration-ul database

### 2. **"404 Not Found" pe API**
- Verifică că Apache rulează
- Calea API trebuie să fie: `http://localhost/SiteBarosani/api`

### 3. **SSE nu funcționează (badge verde nu apare)**
- Verifică în browser console (F12) pentru erori
- SSE necesită Apache + PHP
- Dacă SSE eșuează, fallback polling la 30s va funcționa

### 4. **"package-lock.json conflict" în VS Code**
- Ignore - am rezolvat deja
- Sau: `git reset --hard HEAD && git clean -fd`

### 5. **Imagini nu se încarcă**
- Creează folder: `api/uploads/` și dă-i permisiuni write
- Pe Windows: right-click → Properties → Security → Full Control

---

## 📚 Documentație Suplimentară

- **Email Setup:** `EMAIL_SETUP.md` - Configurare SMTP (Gmail, SendGrid, etc.)
- **Cron Setup:** `CRON_SETUP.md` - Setup cron job pentru expiry notifications
- **Implementation Summary:** `IMPLEMENTATION_SUMMARY.md` - Toate feature-urile

---

## 🎉 Ready to Test!

După ce:
1. ✅ Ai rulat migration database (`add_expiry_notifications.sql`)
2. ✅ Ai creat `.env` din `.env.example`
3. ✅ XAMPP rulează (Apache + MySQL)
4. ✅ `npm run dev` rulează

**Aplicația e gata de testare!** 🚀

**URLs:**
- Frontend: http://localhost:5173
- Admin: http://localhost/SiteBarosani/admin
- API: http://localhost/SiteBarosani/api
