# Email SMTP Configuration Guide

## Overview

The application uses **PHPMailer** to send emails via SMTP. Email notifications are sent for:
- Application approval/rejection
- Expiry warnings (30 days, 7 days, 1 day before expiration)

## Quick Start

### 1. Copy Environment File

```bash
cp .env.example .env
```

### 2. Configure SMTP Settings

Edit the `.env` file with your SMTP credentials:

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM_EMAIL=noreply@zidulbarosanilor.ro
MAIL_FROM_NAME=Zidul Barosanilor
```

### 3. Enable Email Sending

Email sending is now **automatically enabled** when SMTP credentials are configured in `.env`.

If `MAIL_USERNAME` and `MAIL_PASSWORD` are empty, the system will fallback to PHP's `mail()` function (requires server mail configuration).

## Gmail SMTP Setup (Recommended)

### Step 1: Enable 2-Factor Authentication

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already enabled

### Step 2: Generate App Password

1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select app: **Mail**
3. Select device: **Other (Custom name)** → Enter "Zidul Barosanilor"
4. Click **Generate**
5. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 3: Update .env

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-gmail@gmail.com
MAIL_PASSWORD=abcd efgh ijkl mnop  # App password without spaces
MAIL_FROM_EMAIL=your-gmail@gmail.com
MAIL_FROM_NAME=Zidul Barosanilor
```

**Important**:
- Remove spaces from the app password
- Use your full Gmail address for `MAIL_USERNAME`
- `MAIL_FROM_EMAIL` should match `MAIL_USERNAME` when using Gmail

## Alternative SMTP Providers

### SendGrid

```env
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your-sendgrid-api-key
```

### Mailgun

```env
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=postmaster@your-domain.mailgun.org
MAIL_PASSWORD=your-mailgun-password
```

### Amazon SES

```env
MAIL_HOST=email-smtp.us-east-1.amazonaws.com
MAIL_PORT=587
MAIL_USERNAME=your-aws-access-key-id
MAIL_PASSWORD=your-aws-secret-access-key
```

### Custom SMTP Server

```env
MAIL_HOST=mail.yourdomain.com
MAIL_PORT=587
MAIL_USERNAME=noreply@yourdomain.com
MAIL_PASSWORD=your-password
MAIL_FROM_EMAIL=noreply@yourdomain.com
MAIL_FROM_NAME=Zidul Barosanilor
```

## Testing Email Configuration

### Method 1: Manual Test Script

Create `test_email.php` in the project root:

```php
<?php
require_once 'api/helpers/EnvLoader.php';
require_once 'api/helpers/EmailSender.php';

try {
    $emailSender = new EmailSender();
    $success = $emailSender->send(
        'your-test-email@example.com',
        'Test Email - Zidul Barosanilor',
        '<h1>Success!</h1><p>SMTP configuration is working correctly.</p>'
    );

    if ($success) {
        echo "✓ Email sent successfully!\n";
    } else {
        echo "✗ Email sending failed\n";
    }
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}
```

Run:
```bash
php test_email.php
```

### Method 2: Admin Panel Manual Trigger

1. Login to Admin Panel
2. Approve a test application
3. Check if approval email is sent

### Method 3: Expiry Check Test

```bash
php api/cron/check_expiry.php
```

## Troubleshooting

### "SMTP connect() failed"

**Cause**: Cannot connect to SMTP server

**Solutions**:
- Verify SMTP host and port are correct
- Check firewall allows outbound connections on port 587
- Try port 465 with SSL:
  ```env
  MAIL_PORT=465
  ```
  Update EmailSender.php line 53: `PHPMailer::ENCRYPTION_SMTPS`

### "Invalid credentials"

**Cause**: Wrong username or password

**Solutions**:
- Double-check MAIL_USERNAME and MAIL_PASSWORD
- For Gmail, ensure you're using App Password, not account password
- Remove any spaces from app password

### "Could not authenticate"

**Cause**: Gmail security blocking

**Solutions**:
- Enable "Less secure app access" (not recommended)
- Use App Password instead (recommended)
- Check [Google Account Activity](https://myaccount.google.com/notifications)

### "Sender address rejected"

**Cause**: `MAIL_FROM_EMAIL` doesn't match authenticated account

**Solutions**:
- For Gmail: Use your Gmail address as `MAIL_FROM_EMAIL`
- For custom SMTP: Ensure `MAIL_FROM_EMAIL` is allowed by your provider

### Emails sent but not received

**Solutions**:
- Check spam/junk folder
- Verify recipient email is valid
- Check SMTP provider logs
- Test with a different recipient email

### PHP mail() fallback not working

**Cause**: Server `sendmail` not configured

**Solutions**:
- Install and configure sendmail:
  ```bash
  sudo apt-get install sendmail
  sudo sendmailconfig
  ```
- Or configure SMTP (recommended)

## Email Templates

Email templates are defined in `api/helpers/EmailSender.php`. Customize them as needed:

- **Approval Email**: `getApprovalEmailTemplate()`
- **Rejection Email**: `getRejectionEmailTemplate()`
- **Expiry Warning**: `getExpirationWarningTemplate()`

## Production Best Practices

1. **Use dedicated email service** (SendGrid, Mailgun, Amazon SES) instead of Gmail for production
2. **Configure SPF and DKIM records** for your domain to prevent spam filtering
3. **Monitor email logs** in `api/logs/app_*.log`
4. **Set up email bounce handling** (provider-specific)
5. **Rate limiting**: Most providers have sending limits (e.g., Gmail: 500/day)
6. **Use environment-specific configs**:
   ```env
   APP_ENV=production
   MAIL_HOST=smtp.mailgun.org  # Production SMTP
   ```

## Security Notes

- **Never commit `.env` to git** - It contains sensitive credentials
- `.env` is already in `.gitignore`
- Use strong, unique passwords for SMTP accounts
- Rotate credentials periodically
- Use App Passwords instead of main account passwords when possible

## Email Logs

All email operations are logged:

```bash
# View today's logs
tail -f api/logs/app_$(date +%Y-%m-%d).log | grep -i email

# View email errors only
grep -i "email.*error" api/logs/app_*.log
```

## Rate Limiting

Email sending is subject to SMTP provider limits:

| Provider | Daily Limit | Recommended Usage |
|----------|------------|-------------------|
| Gmail    | 500        | Development/Testing only |
| SendGrid | 100 (free) | 40,000 (paid) - Good for production |
| Mailgun  | 5,000 (trial) | Unlimited (paid) - Excellent |
| Amazon SES | 200 (free tier) | Very high (paid) - Enterprise |

## Support

If you encounter issues:

1. Check logs: `api/logs/app_*.log`
2. Review error messages in Admin Panel → Logs
3. Check `expiry_notifications` table `email_error` column
4. Test with different email provider
5. Verify PHP extensions:
   ```bash
   php -m | grep -E 'openssl|sockets'
   ```

Both `openssl` and `sockets` extensions are required for SMTP.
