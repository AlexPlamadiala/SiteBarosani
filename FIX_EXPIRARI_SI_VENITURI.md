# 🔧 Fix pentru Expirări și Venituri

## Probleme Rezolvate:

1. ✅ **Barosanii expirați apar pe zid** → Acum verifică și data_expirare
2. ✅ **Calculul veniturilor e greșit** → Calculează din barosani activi, nu applications

---

## 📝 Cum să Aplici Fix-urile:

### **Pasul 1: Actualizează View-ul Statistics în phpMyAdmin**

1. Deschide **phpMyAdmin** → Baza `zid_barosani`
2. Click pe tab **SQL**
3. Deschide fișierul: `database/update_statistics_view.sql`
4. Copiază **tot conținutul** și lipește în phpMyAdmin
5. Click **Go**

✅ Acum statistics verifică data_expirare și calculează veniturile corect!

---

### **Pasul 2: Marchează Barosanii Expirați (Acum)**

Accesează în browser:

**http://localhost/SiteBarosani/api/cron_check_expired.php**

Acest script va:
- Verifica toți barosanii
- Marca cei expirați cu `status = 'expired'`
- Afișa câți au fost marcați

✅ Rulează acest script ori de câte ori vrei să verifici expirările!

---

### **Pasul 3: Automatizare (Opțional)**

#### **Windows - Task Scheduler:**

1. Deschide **Task Scheduler**
2. Create Task → Trigger: Daily 02:00 AM
3. Action: Start Program
   - Program: `C:\xampp\php\php.exe`
   - Arguments: `C:\xampp\htdocs\SiteBarosani\api\cron_check_expired.php`

#### **Linux - Cron:**

```bash
crontab -e
```

Adaugă:
```
0 2 * * * php /path/to/api/cron_check_expired.php
```

---

## 🔍 Verificare că Funcționează:

### **1. Verifică Zidul:**

Deschide: http://localhost:5173/zid

✅ NU ar trebui să apară barosani cu data_expirare în trecut!

### **2. Verifică Dashboard:**

Deschide: http://localhost/SiteBarosani/admin/

✅ Veniturile ar trebui calculate corect:
- **Basic:** 20 RON/lună × număr basic activi
- **Gold:** 50 RON/lună × număr gold activi
- **Platinum:** 100 RON/lună × număr platinum activi

**Venit lunar** = suma tuturor barosanilor activi înregistrați luna curentă

---

## 📊 Ce S-a Schimbat:

### **API `/api/barosani.php`:**
```sql
-- ÎNAINTE:
WHERE status = 'active'

-- ACUM:
WHERE status = 'active' AND data_expirare >= CURDATE()
```

### **View `statistics`:**
```sql
-- ÎNAINTE:
total_barosani: COUNT(*) WHERE status = 'active'
monthly_revenue: SUM(suma) FROM applications

-- ACUM:
total_barosani: COUNT(*) WHERE status = 'active' AND data_expirare >= CURDATE()
monthly_revenue: Calculat din tier-urile barosanilor activi din luna curentă
```

---

## 🎯 Testare:

1. **Test Expirare:**
   - În Admin → Barosani
   - Schimbă data_expirare a unui barosan la o dată din trecut (ex: 10.01.2025)
   - Rulează: http://localhost/SiteBarosani/api/cron_check_expired.php
   - Verifică că statusul devine 'expired'
   - Refresh zidul → barosanul NU mai apare

2. **Test Venituri:**
   - Dashboard ar trebui să afișeze:
   - **Platinum activi:** 3 × 100 RON = 300 RON (doar cei din luna curentă)
   - **Gold activi:** 2 × 50 RON = 100 RON
   - **Basic activi:** 1 × 20 RON = 20 RON
   - **Total lunar:** suma de mai sus

---

## ⚠️ IMPORTANT:

După ce aplici fix-urile, **copiază fișierele actualizate în htdocs:**

```cmd
xcopy /Y /S C:\path\to\github\SiteBarosani C:\xampp\htdocs\SiteBarosani
```

Sau **lucrează direct în htdocs** pentru a evita acest pas!

---

**✅ Gata! Acum sistemul verifică corect expirările și calculează veniturile real!** 🎉
