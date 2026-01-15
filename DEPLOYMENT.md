# 🚀 Deployment Guide - Zidul Barosanilor

## 📋 Pre-Deployment Checklist

### 1. Code Quality
- [x] Toate feature-urile testate local
- [x] Mobile responsiveness verificat
- [x] Toast notifications funcționale
- [x] Error handling robust implementat
- [x] Loading states optimizate
- [x] Image lazy loading implementat
- [x] Search & filter optimization

### 2. Security
- [x] SQL injection prevention (Prepared statements)
- [x] XSS protection (Input sanitization)
- [x] Rate limiting implementat
- [x] CORS configurat
- [x] Input validation (frontend + backend)
- [ ] HTTPS setup (production)
- [ ] CSRF tokens (recomandat)
- [ ] Security headers (recomandat)

### 3. Configuration Files
- [x] `.env.example` creat
- [ ] `.env` configurat pentru production
- [x] `.gitignore` cu fișiere sensibile
- [ ] Database credentials pentru production

## 🏗️ Infrastructure Requirements

### Server Requirements
```
PHP: >= 7.4
MySQL: >= 5.7 sau MariaDB >= 10.2
Node.js: >= 18.x (pentru build React)
npm: >= 9.x
Apache/Nginx cu mod_rewrite
SSL Certificate (Let's Encrypt recomandat)
```

### Recommended Server Specs
```
RAM: 2GB minimum (4GB recomandat)
Storage: 20GB minimum (SSD recomandat)
CPU: 2 cores minimum
Bandwidth: Unlimited sau 1TB/month
```

## 📦 Production Setup

### Step 1: Server Preparation

#### 1.1 Install Dependencies (Ubuntu/Debian)
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Apache + PHP
sudo apt install apache2 php php-mysql php-mbstring php-xml php-curl -y

# Install MySQL
sudo apt install mysql-server -y

# Install Node.js & npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Enable Apache modules
sudo a2enmod rewrite
sudo a2enmod headers
sudo systemctl restart apache2
```

#### 1.2 Configure MySQL
```bash
# Secure installation
sudo mysql_secure_installation

# Create database și user
sudo mysql -u root -p

# În MySQL console:
CREATE DATABASE zid_barosani CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'barosani_user'@'localhost' IDENTIFIED BY 'PAROLA_COMPLEXA_AICI';
GRANT SELECT, INSERT, UPDATE, DELETE ON zid_barosani.* TO 'barosani_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 1.3 Configure SSL (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-apache -y

# Get certificate (replace domain)
sudo certbot --apache -d zidulbarosanilor.ro -d www.zidulbarosanilor.ro

# Auto-renewal check
sudo certbot renew --dry-run
```

### Step 2: Deploy Application

#### 2.1 Clone Repository
```bash
cd /var/www/
sudo git clone https://github.com/AlexPlamadiala/SiteBarosani.git
sudo chown -R www-data:www-data SiteBarosani
cd SiteBarosani
```

#### 2.2 Configure Environment
```bash
# Copy și editează .env
cp .env.example .env
nano .env

# Setează valorile pentru production:
DB_HOST=localhost
DB_USER=barosani_user
DB_PASS=PAROLA_COMPLEXA_AICI
DB_NAME=zid_barosani

SITE_URL=https://zidulbarosanilor.ro
API_URL=https://zidulbarosanilor.ro/api
ADMIN_URL=https://zidulbarosanilor.ro/admin

RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=3600

# Email configuration (dacă folosești SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@zidulbarosanilor.ro
SMTP_FROM_NAME="Zidul Barosanilor"
```

#### 2.3 Setup Database
```bash
# Import schema
mysql -u barosani_user -p zid_barosani < database/schema.sql

# Import migrations (dacă există)
mysql -u barosani_user -p zid_barosani < database/add_expiry_notifications.sql
```

#### 2.4 Install Backend Dependencies
```bash
cd /var/www/SiteBarosani
composer install --no-dev --optimize-autoloader
```

#### 2.5 Build Frontend
```bash
cd /var/www/SiteBarosani

# Install dependencies
npm ci --production

# Build pentru production
npm run build

# Build output va fi în dist/
```

#### 2.6 Create Required Directories
```bash
# Create upload și logs directories
sudo mkdir -p api/uploads api/logs
sudo chown -R www-data:www-data api/uploads api/logs
sudo chmod 755 api/uploads api/logs
```

### Step 3: Configure Apache

#### 3.1 Create Virtual Host
```bash
sudo nano /etc/apache2/sites-available/zidulbarosanilor.conf
```

```apache
<VirtualHost *:80>
    ServerName zidulbarosanilor.ro
    ServerAlias www.zidulbarosanilor.ro

    # Redirect to HTTPS
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]
</VirtualHost>

<VirtualHost *:443>
    ServerName zidulbarosanilor.ro
    ServerAlias www.zidulbarosanilor.ro

    DocumentRoot /var/www/SiteBarosani

    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/zidulbarosanilor.ro/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/zidulbarosanilor.ro/privkey.pem

    # Security Headers
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "DENY"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"

    # React App (dist folder)
    <Directory /var/www/SiteBarosani/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted

        # SPA routing
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    # API
    Alias /api /var/www/SiteBarosani/api
    <Directory /var/www/SiteBarosani/api>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # Admin Panel
    Alias /admin /var/www/SiteBarosani/admin
    <Directory /var/www/SiteBarosani/admin>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # Uploads
    Alias /uploads /var/www/SiteBarosani/api/uploads
    <Directory /var/www/SiteBarosani/api/uploads>
        Options -Indexes
        Require all granted
    </Directory>

    # Error Logs
    ErrorLog ${APACHE_LOG_DIR}/zidulbarosanilor_error.log
    CustomLog ${APACHE_LOG_DIR}/zidulbarosanilor_access.log combined
</VirtualHost>
```

#### 3.2 Enable Site
```bash
sudo a2ensite zidulbarosanilor.conf
sudo systemctl reload apache2
```

### Step 4: Setup Cron Jobs

#### 4.1 Configure Cron
```bash
sudo crontab -e -u www-data
```

Add:
```cron
# Check expiring barosani daily at 9 AM
0 9 * * * php /var/www/SiteBarosani/api/cron/check_expiry.php >> /var/www/SiteBarosani/api/logs/cron.log 2>&1

# Backup database daily at 2 AM
0 2 * * * mysqldump -u barosani_user -p'PASSWORD' zid_barosani | gzip > /var/backups/zid_barosani_$(date +\%Y\%m\%d).sql.gz

# Clean old backups (keep 30 days)
0 3 * * * find /var/backups/zid_barosani_*.sql.gz -mtime +30 -delete
```

### Step 5: Monitoring și Maintenance

#### 5.1 Setup Log Rotation
```bash
sudo nano /etc/logrotate.d/zidulbarosanilor
```

```
/var/www/SiteBarosani/api/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0640 www-data www-data
}
```

#### 5.2 Monitor Script
```bash
# Create monitoring script
sudo nano /usr/local/bin/monitor-zid.sh
```

```bash
#!/bin/bash
# Check if site is responding
SITE="https://zidulbarosanilor.ro"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $SITE)

if [ $STATUS -ne 200 ]; then
    echo "Site down! Status: $STATUS" | mail -s "ZID ALERT" admin@zidulbarosanilor.ro
fi
```

```bash
sudo chmod +x /usr/local/bin/monitor-zid.sh

# Add to cron (check every 5 minutes)
*/5 * * * * /usr/local/bin/monitor-zid.sh
```

## 🔄 Update Procedure

### Backend Update
```bash
cd /var/www/SiteBarosani
sudo -u www-data git pull origin main
composer install --no-dev --optimize-autoloader
sudo systemctl reload apache2
```

### Frontend Update
```bash
cd /var/www/SiteBarosani
sudo -u www-data git pull origin main
npm ci --production
npm run build
# Dist folder is automatically updated
```

### Database Migration
```bash
# Apply new migrations
mysql -u barosani_user -p zid_barosani < database/migration_file.sql
```

## 🐛 Troubleshooting

### Issue: 500 Internal Server Error
```bash
# Check Apache logs
sudo tail -f /var/log/apache2/zidulbarosanilor_error.log

# Check PHP errors
sudo tail -f /var/log/apache2/error.log

# Check permissions
sudo chown -R www-data:www-data /var/www/SiteBarosani
```

### Issue: Database Connection Failed
```bash
# Test MySQL connection
mysql -u barosani_user -p zid_barosani

# Check if MySQL is running
sudo systemctl status mysql

# Restart MySQL
sudo systemctl restart mysql
```

### Issue: SSL Certificate Problems
```bash
# Renew certificate manually
sudo certbot renew --force-renewal

# Check certificate status
sudo certbot certificates
```

### Issue: Rate Limiting Not Working
```bash
# Check if rate limiter files are writable
ls -la /var/www/SiteBarosani/api/rate_limit/

# Create directory if missing
sudo mkdir -p /var/www/SiteBarosani/api/rate_limit
sudo chown www-data:www-data /var/www/SiteBarosani/api/rate_limit
```

## 📊 Performance Optimization

### 1. Enable PHP OpCache
```bash
sudo nano /etc/php/7.4/apache2/php.ini
```

Add/uncomment:
```ini
opcache.enable=1
opcache.memory_consumption=128
opcache.interned_strings_buffer=8
opcache.max_accelerated_files=4000
opcache.revalidate_freq=60
```

### 2. Enable Apache Compression
```bash
sudo a2enmod deflate
sudo systemctl restart apache2
```

### 3. Enable Browser Caching
Add to `.htaccess` in dist/:
```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

## 🎯 Post-Deployment Verification

### Checklist
- [ ] Site accesibil pe HTTPS
- [ ] HTTP redirect la HTTPS funcționează
- [ ] API endpoints răspund corect
- [ ] Admin panel funcționează
- [ ] SSL certificate valid (nu expirat)
- [ ] Database conexiune funcționează
- [ ] File upload funcționează
- [ ] Email notifications funcționează
- [ ] Cron jobs configurate
- [ ] Logs se scriu corect
- [ ] Rate limiting funcționează
- [ ] Mobile responsive verificat
- [ ] Toast notifications funcționează
- [ ] Search și filter funcționează
- [ ] Certificate generation funcționează

---
**Ultima actualizare**: 2026-01-15
**Pregătit de**: Claude Code (Anthropic)
