<?php
/**
 * Email Sender using PHPMailer
 * Sends emails via SMTP
 */
require_once __DIR__ . '/EnvLoader.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class EmailSender {
    private $fromEmail;
    private $fromName;
    private $host;
    private $port;
    private $username;
    private $password;
    private $useSMTP;

    public function __construct() {
        $this->host = EnvLoader::get('MAIL_HOST', 'smtp.gmail.com');
        $this->port = (int)EnvLoader::get('MAIL_PORT', 587);
        $this->username = EnvLoader::get('MAIL_USERNAME');
        $this->password = EnvLoader::get('MAIL_PASSWORD');
        $this->fromEmail = EnvLoader::get('MAIL_FROM_EMAIL', 'noreply@zidulbarosanilor.ro');
        $this->fromName = EnvLoader::get('MAIL_FROM_NAME', 'Zidul Barosanilor');

        // Use SMTP only if credentials are configured
        $this->useSMTP = !empty($this->username) && !empty($this->password);
    }

    /**
     * Send email using PHPMailer (SMTP or fallback to mail())
     *
     * @param string $to Recipient email
     * @param string $subject Email subject
     * @param string $htmlBody HTML email body
     * @return bool Success status
     * @throws Exception
     */
    public function send($to, $subject, $htmlBody) {
        $mail = new PHPMailer(true);

        try {
            // Server settings
            if ($this->useSMTP) {
                $mail->isSMTP();
                $mail->Host = $this->host;
                $mail->SMTPAuth = true;
                $mail->Username = $this->username;
                $mail->Password = $this->password;
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port = $this->port;
            } else {
                // Fallback to PHP mail() function
                $mail->isMail();
            }

            // Recipients
            $mail->setFrom($this->fromEmail, $this->fromName);
            $mail->addAddress($to);
            $mail->addReplyTo($this->fromEmail, $this->fromName);

            // Content
            $mail->isHTML(true);
            $mail->CharSet = 'UTF-8';
            $mail->Subject = $subject;
            $mail->Body = $htmlBody;
            $mail->AltBody = strip_tags($htmlBody); // Plain text alternative

            $mail->send();
            return true;

        } catch (Exception $e) {
            error_log("Email sending failed: {$mail->ErrorInfo}");
            throw new Exception("Email sending failed: {$mail->ErrorInfo}");
        }
    }

    /**
     * Send email using mail() function (simple, no SMTP) - DEPRECATED
     * Use send() instead
     */
    public function sendSimple($to, $subject, $htmlBody) {
        // Redirect to main send method for consistency
        try {
            return $this->send($to, $subject, $htmlBody);
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Send approval email to user
     */
    public function sendApprovalEmail($barosan) {
        $subject = "🎉 Felicitări! Ai fost aprobat pe Zidul Barosanilor!";

        $html = $this->getApprovalEmailTemplate($barosan);

        return $this->sendSimple($barosan['email'], $subject, $html);
    }

    /**
     * Send rejection email to user
     */
    public function sendRejectionEmail($applicationData, $reason = null) {
        $subject = "Cererea ta la Zidul Barosanilor";

        $html = $this->getRejectionEmailTemplate($applicationData, $reason);

        return $this->sendSimple($applicationData['email'], $subject, $html);
    }

    /**
     * Send expiration warning email
     */
    public function sendExpirationWarningEmail($barosan, $daysLeft) {
        $subject = "⚠️ Abonamentul tău expiră în {$daysLeft} zile!";

        $html = $this->getExpirationWarningTemplate($barosan, $daysLeft);

        return $this->sendSimple($barosan['email'], $subject, $html);
    }

    /**
     * Send expiry notification (wrapper for cron job)
     *
     * @param string $email Email address
     * @param string $nume Name
     * @param string $dataExpirare Expiry date
     * @param int $days Days until expiry
     * @param string $certificatId Certificate ID
     * @return bool Success status
     */
    public function sendExpiryNotification($email, $nume, $dataExpirare, $days, $certificatId) {
        // Build barosan array for template
        $barosan = [
            'email' => $email,
            'nume' => $nume,
            'data_expirare' => $dataExpirare,
            'certificat_id' => $certificatId,
            'tier' => 'basic' // Default, can be enhanced later
        ];

        return $this->sendExpirationWarningEmail($barosan, $days);
    }

    /**
     * Send upgrade verification email
     */
    public function sendUpgradeVerification($email, $name, $verificationLink, $expiresAt) {
        $subject = "🔐 Verificare pentru upgrade tier - Zidul Barosanilor";

        $html = $this->getUpgradeVerificationTemplate($name, $verificationLink, $expiresAt);

        return $this->sendSimple($email, $subject, $html);
    }

    /**
     * Get upgrade verification email template
     */
    private function getUpgradeVerificationTemplate($name, $verificationLink, $expiresAt) {
        $expiresFormatted = date('d.m.Y H:i', strtotime($expiresAt));

        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
                .info-box { background: white; border-left: 4px solid #9333ea; padding: 15px; margin: 20px 0; }
                .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 10px; border-radius: 5px; margin: 15px 0; font-size: 12px; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>🔐 Verificare Upgrade Tier</h1>
                    <p>Confirmă că tu vrei să faci upgrade</p>
                </div>

                <div class='content'>
                    <p>Bună <strong>{$name}</strong>,</p>

                    <p>Ai solicitat un upgrade de tier pentru contul tău pe Zidul Barosanilor. Pentru a confirma că această cerere vine de la tine, te rugăm să dai click pe butonul de mai jos:</p>

                    <p style='text-align: center;'>
                        <a href='{$verificationLink}' class='button'>✨ Confirmă și Upgrade</a>
                    </p>

                    <div class='info-box'>
                        <p><strong>Link:</strong> {$verificationLink}</p>
                        <p><strong>Expiră:</strong> {$expiresFormatted}</p>
                    </div>

                    <div class='warning'>
                        ⚠️ Dacă nu ai solicitat acest upgrade, ignoră acest email. Link-ul va expira automat.
                    </div>

                    <p>După verificare, vei putea alege noul tier și finaliza plata.</p>
                </div>

                <div class='footer'>
                    <p>© 2025 Zidul Barosanilor - Toate drepturile rezervate</p>
                    <p>Acest email a fost trimis automat. Nu răspunde la acest email.</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }

    /**
     * Get approval email HTML template
     */
    private function getApprovalEmailTemplate($barosan) {
        $siteUrl = EnvLoader::get('SITE_URL', 'http://localhost:5173');
        $certificateUrl = $siteUrl . '/zid';

        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #1a365d 0%, #2d5986 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; background: #D4AF37; color: #1a365d; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
                .info-box { background: white; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>🏆 Felicitări, {$barosan['nume']}!</h1>
                    <p>Acum faci parte oficial din Zidul Barosanilor!</p>
                </div>

                <div class='content'>
                    <p>Cererea ta a fost <strong>aprobată</strong> și acum apari pe zidul oficial!</p>

                    <div class='info-box'>
                        <h3>📋 Detalii Cont:</h3>
                        <p><strong>Nume:</strong> {$barosan['nume']}</p>
                        <p><strong>Tier:</strong> " . strtoupper($barosan['tier']) . "</p>
                        <p><strong>Certificat ID:</strong> {$barosan['certificat_id']}</p>
                        <p><strong>Data înregistrare:</strong> {$barosan['data_inregistrare']}</p>
                        <p><strong>Valabil până:</strong> {$barosan['data_expirare']}</p>
                    </div>

                    <p style='text-align: center;'>
                        <a href='{$certificateUrl}' class='button'>🎉 Vezi-te pe Zid</a>
                    </p>

                    <p><strong>Ce urmează?</strong></p>
                    <ul>
                        <li>Poți vedea certificatul tău oficial pe site</li>
                        <li>Profilul tău e vizibil tuturor vizitatorilor</li>
                        <li>Vei primi notificare înainte să expire abonamentul</li>
                    </ul>
                </div>

                <div class='footer'>
                    <p>Ai primit acest email pentru că ai fost aprobat pe Zidul Barosanilor.</p>
                    <p>© 2025 Zidul Barosanilor - Toate drepturile rezervate</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }

    /**
     * Get rejection email HTML template
     */
    private function getRejectionEmailTemplate($applicationData, $reason) {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #e74c3c; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Cererea ta la Zidul Barosanilor</h1>
                </div>

                <div class='content'>
                    <p>Bună {$applicationData['nume']},</p>

                    <p>Ne pare rău, dar cererea ta cu codul <strong>{$applicationData['code']}</strong> nu a putut fi aprobată.</p>

                    " . ($reason ? "<p><strong>Motiv:</strong> {$reason}</p>" : "") . "

                    <p>Poți încerca din nou oricând!</p>
                </div>

                <div class='footer'>
                    <p>© 2025 Zidul Barosanilor</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }

    /**
     * Get expiration warning HTML template
     */
    private function getExpirationWarningTemplate($barosan, $daysLeft) {
        $siteUrl = EnvLoader::get('SITE_URL', 'http://localhost:5173');
        $renewUrl = $siteUrl . '/cum-devin-barosan';

        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #f39c12; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; background: #D4AF37; color: #1a365d; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
                .warning-box { background: #fff3cd; border-left: 4px solid #f39c12; padding: 15px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>⚠️ Abonamentul tău expiră curând!</h1>
                </div>

                <div class='content'>
                    <p>Bună {$barosan['nume']},</p>

                    <div class='warning-box'>
                        <h3>Atenție!</h3>
                        <p>Abonamentul tău la Zidul Barosanilor expiră în <strong>{$daysLeft} zile</strong> (pe data de {$barosan['data_expirare']}).</p>
                    </div>

                    <p>După expirare, profilul tău nu va mai apărea pe zid și vei pierde toate beneficiile tier-ului <strong>" . strtoupper($barosan['tier']) . "</strong>.</p>

                    <p style='text-align: center;'>
                        <a href='{$renewUrl}' class='button'>🔄 Reînnoiește Abonamentul</a>
                    </p>

                    <p><strong>Beneficiile tale actuale:</strong></p>
                    <ul>
                        <li>Certificat ID: {$barosan['certificat_id']}</li>
                        <li>Tier: " . strtoupper($barosan['tier']) . "</li>
                        <li>Vizibilitate pe zid</li>
                    </ul>
                </div>

                <div class='footer'>
                    <p>© 2025 Zidul Barosanilor</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }
}
?>
