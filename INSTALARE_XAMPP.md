# 📦 Instalare Zidul Barosanilor cu XAMPP + MySQL

## 🎯 Pași de Instalare

### 1. Pregătire XAMPP

1. **Pornește XAMPP Control Panel**
2. **Start Apache** (buton Start pentru Apache)
3. **Start MySQL** (buton Start pentru MySQL)

### 2. Creează Baza de Date

1. **Deschide phpMyAdmin**:
   - Click pe butonul **Admin** de lângă MySQL în XAMPP
   - SAU mergi la: `http://localhost/phpmyadmin`

2. **Importă fișierul SQL**:
   - Click pe tab-ul **Import** din phpMyAdmin
   - Click **Choose File**
   - Selectează fișierul: `database/zid_barosani.sql`
   - Click **Go** (jos de tot)
   - ✅ Baza de date `zid_barosani` a fost creată cu toate tabelele!

### 3. Copiază Fișierele API în XAMPP

**Copiază folder-ul `SiteBarosani`** în folder-ul **htdocs** al XAMPP:

```
Windows: C:\xampp\htdocs\SiteBarosani
Linux:   /opt/lampp/htdocs/SiteBarosani
Mac:     /Applications/XAMPP/htdocs/SiteBarosani
```

**Structură finală în htdocs:**
```
htdocs/
└── SiteBarosani/
    ├── api/
    │   ├── config.php
    │   ├── auth.php
    │   ├── barosani.php
    │   ├── applications.php
    │   └── admin/
    │       ├── barosani.php
    │       ├── applications.php
    │       └── statistics.php
    ├── admin/
    │   ├── index.html
    │   ├── dashboard.html
    │   ├── barosani.html
    │   └── applications.html
    └── database/
        └── zid_barosani.sql
```

### 4. Testează API-ul

Deschide în browser:
- `http://localhost/SiteBarosani/api/barosani.php`

Trebuie să vezi un răspuns JSON cu barosani:
```json
{
  "success": true,
  "barosani": [...]
}
```

### 5. Accesează Admin Panel

1. Deschide: `http://localhost/SiteBarosani/admin/`
2. **Autentifică-te cu:**
   - **Username:** `admin`
   - **Parolă:** `Barosan2025!`
3. ✅ Acum poți gestiona barosanii și cererile!

### 6. Pornește Frontend-ul React

În terminal, în folder-ul `SiteBarosani`:

```bash
npm install
npm run dev
```

Deschide: `http://localhost:5173`

---

## 🔑 Date Admin Default

| Campo | Valoare |
|-------|---------|
| Username | `admin` |
| Parolă | `Barosan2025!` |
| Email | `admin@zidulbarosanilor.ro` |

---

## 📊 Ce Conține Baza de Date

### Tabele Create:

1. **`users`** - Administratori ai site-ului
2. **`barosani`** - Toți barosanii afișați pe zid
3. **`applications`** - Cereri de înscriere pending
4. **`settings`** - Setări site (prețuri, contact)
5. **`admin_logs`** - Log-uri acțiuni admin
6. **`statistics`** - View pentru statistici

### Date Demo Incluse:

- ✅ **1 admin user** (admin/Barosan2025!)
- ✅ **5 barosani demo** (1 de fiecare tier)
- ✅ **Setări default** (prețuri, email contact)

---

## 🚀 Funcționalități Admin Panel

### Dashboard:
- Statistici live (total barosani, cereri pending, venituri)
- Breakdown pe tier-uri (Platinum, Gold, Basic)
- Alerte pentru expirări

### Gestionare Barosani:
- ✅ Adaugă barosan manual
- ✏️ Editează barosan existent
- 🗑️ Șterge barosan
- 📅 Vizualizare date expirare
- ⚠️ Alertă pentru expirări în 7 zile

### Gestionare Cereri:
- 📋 Vezi toate cererile de înscriere
- ✅ Aprobă cereri (le mută automat pe zid)
- ❌ Respinge cereri
- 🗑️ Șterge cereri

---

## 🔧 Configurare API (dacă e nevoie)

Editează `api/config.php` dacă ai setări diferite:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');  // Schimbă dacă ai parolă la MySQL
define('DB_NAME', 'zid_barosani');
```

---

## ⚠️ Troubleshooting

### Eroare: "Access-Control-Allow-Origin"
✅ Soluție: Verifică că în `api/config.php` CORS header-ul are URL-ul corect:
```php
header('Access-Control-Allow-Origin: http://localhost:5173');
```

### Eroare: "Eroare conexiune bază de date"
✅ Soluție:
1. Verifică că MySQL rulează în XAMPP
2. Verifică că baza de date `zid_barosani` există în phpMyAdmin
3. Verifică credențialele în `api/config.php`

### Admin Panel nu se autentifică
✅ Soluție:
1. Verifică că ai importat SQL-ul corect
2. Încearcă username: `admin`, parolă: `Barosan2025!`
3. Verifică în phpMyAdmin tabelul `users`

### API returnează 404
✅ Soluție:
1. Verifică că folder-ul e copiat în `htdocs/SiteBarosani`
2. Accesează: `http://localhost/SiteBarosani/api/barosani.php`
3. Verifică că Apache rulează

---

## 📱 Flow de Utilizare

### Pentru Utilizatori (Frontend):
1. Completează formular pe `/cum-devin-barosan`
2. Primește cod unic (ex: CP-2025-0001)
3. Face plata prin Revolut
4. Trimite email cu codul

### Pentru Admin:
1. Login în Admin Panel
2. Vezi cerere nouă în tab "Cereri"
3. Verifică plata în Revolut
4. Click "Aprobă" → Barosanul apare automat pe zid!
5. System generează certificat ID automat

---

## 🎨 Personalizare

### Schimbă Prețurile:
În phpMyAdmin → `settings` table:
- `price_basic` → 20
- `price_gold` → 50
- `price_platinum` → 100

### Schimbă Email Contact:
În phpMyAdmin → `settings` table:
- `contact_email` → emailul tău
- `revolut_username` → @username-revolut-tau

---

## 🔐 Securitate

### Pentru Producție:
1. **Schimbă parola admin** în phpMyAdmin
2. **Restricționează accesul** la folder-ul `admin/`
3. **Folosește HTTPS**
4. **Backup regulat** al bazei de date

---

## 📞 Suport

Dacă întâmpini probleme:
1. Verifică că XAMPP Apache și MySQL rulează
2. Verifică că ai importat SQL-ul
3. Verifică console-ul browserului pentru erori
4. Verifică că URL-urile API sunt corecte

---

**✅ Gata! Site-ul e funcțional cu bază de date completă! 🎉**
