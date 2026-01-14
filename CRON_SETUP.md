# Cron Job Setup - Expiry Notifications

## Overview

The Expiry Notifications System automatically checks for barosani that are about to expire and sends warning emails at specific intervals:
- **30 days before** expiry
- **7 days before** expiry
- **1 day before** expiry

## Setting Up Cron Job

### Linux/Unix Server

Add the following to your crontab (run `crontab -e`):

```bash
# Run expiry check daily at 9:00 AM
0 9 * * * cd /path/to/SiteBarosani && php api/cron/check_expiry.php >> /var/log/barosani_expiry.log 2>&1
```

Replace `/path/to/SiteBarosani` with your actual project path.

### Alternative: Run Every 6 Hours

```bash
# Run expiry check every 6 hours
0 */6 * * * cd /path/to/SiteBarosani && php api/cron/check_expiry.php >> /var/log/barosani_expiry.log 2>&1
```

### Windows Server (Task Scheduler)

1. Open Task Scheduler
2. Create Basic Task
3. Set trigger: Daily at 9:00 AM
4. Action: Start a program
5. Program: `php.exe`
6. Arguments: `C:\path\to\SiteBarosani\api\cron\check_expiry.php`
7. Start in: `C:\path\to\SiteBarosani\api\cron`

## Manual Testing

### Via Command Line

```bash
cd /path/to/SiteBarosani
php api/cron/check_expiry.php
```

### Via Browser (Development Only)

```
http://localhost/SiteBarosani/api/cron/check_expiry.php?allow_web_access=1
```

**⚠️ Important**: Remove `allow_web_access` parameter check in production for security!

### Via Admin Panel

1. Login to Admin Panel
2. Go to Dashboard
3. Click "🔄 Run Expiry Check" button

## Database Requirements

Before running the cron job, ensure the database table exists:

```bash
mysql -u your_user -p zid_barosani < database/add_expiry_notifications.sql
```

Or run the SQL manually in phpMyAdmin.

## Email Configuration

The email sending is currently disabled pending SMTP configuration. To enable emails:

1. Configure SMTP settings in `.env`:

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM_EMAIL=noreply@zidulbarosanilor.ro
MAIL_FROM_NAME=Zidul Barosanilor
```

2. Uncomment email sending code in `api/cron/check_expiry.php` (lines ~86-96)

## Monitoring

### Check Logs

The cron job logs all activities. View logs in:
- Admin Panel → Logs page
- File: `api/logs/app_YYYY-MM-DD.log`

### Verify Notifications Sent

Check the `expiry_notifications` table:

```sql
SELECT * FROM expiry_notifications ORDER BY sent_at DESC LIMIT 10;
```

### Admin Dashboard

The Dashboard shows:
- Count of barosani expiring in the next 7 days
- Detailed list of all expirations in the next 30 days
- Number of notifications already sent for each barosan

## Troubleshooting

### Cron Not Running

```bash
# Check crontab is active
crontab -l

# Check cron service is running
systemctl status cron
```

### PHP CLI Not Found

```bash
# Find PHP path
which php

# Use full path in crontab
0 9 * * * /usr/bin/php /path/to/api/cron/check_expiry.php
```

### Permission Errors

```bash
# Ensure PHP can write to logs directory
chmod -R 775 api/logs
chown -R www-data:www-data api/logs
```

### Email Not Sending

- Verify SMTP credentials in `.env`
- Check `email_error` column in `expiry_notifications` table
- Review logs for email errors

## Customization

### Change Notification Intervals

Edit `api/cron/check_expiry.php` line ~32:

```php
$notificationIntervals = [
    '60days' => 60,  // Add 60-day warning
    '30days' => 30,
    '7days' => 7,
    '1day' => 1
];
```

Don't forget to update the database enum for `notification_type` if adding new intervals!

### Disable Specific Intervals

Comment out intervals you don't want:

```php
$notificationIntervals = [
    '30days' => 30,
    '7days' => 7,
    // '1day' => 1,  // Disabled
];
```

## Production Checklist

- [ ] Database table `expiry_notifications` created
- [ ] Cron job configured and tested
- [ ] SMTP settings configured in `.env`
- [ ] Email sending code uncommented
- [ ] Web access to cron script disabled (remove `allow_web_access` check)
- [ ] Log rotation configured
- [ ] Monitoring alerts set up
