<?php
require_once 'config.php';

// Parola nouă dorită
$newPassword = "Barosan2025!";

try {
    // Generează hash
    $passwordHash = password_hash($newPassword, PASSWORD_DEFAULT);

    // Conectare la baza de date
    $conn = getDBConnection();

    // Update parola
    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE username = 'admin'");
    $stmt->execute([$passwordHash]);

    // Verifică dacă a funcționat
    $stmt = $conn->prepare("SELECT username, password FROM users WHERE username = 'admin'");
    $stmt->execute();
    $user = $stmt->fetch();

    echo "<div style='font-family: Arial; padding: 20px;'>";
    echo "<h2 style='color: green;'>✅ Parola a fost resetată cu succes!</h2>";
    echo "<div style='background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0;'>";
    echo "<p><strong>Username:</strong> admin</p>";
    echo "<p><strong>Parolă nouă:</strong> " . htmlspecialchars($newPassword) . "</p>";
    echo "</div>";

    // Verificare
    if (password_verify($newPassword, $user['password'])) {
        echo "<p style='color: green; font-weight: bold;'>✓ Verificare: Hash-ul este corect!</p>";
    } else {
        echo "<p style='color: red; font-weight: bold;'>✗ Atenție: Verificarea a eșuat!</p>";
    }

    echo "<hr style='margin: 30px 0;'>";
    echo "<h3>Acum poți face login:</h3>";
    echo "<p>Mergi la: <a href='http://localhost/SiteBarosani/admin/'>http://localhost/SiteBarosani/admin/</a></p>";
    echo "<p><strong>Username:</strong> admin</p>";
    echo "<p><strong>Parolă:</strong> " . htmlspecialchars($newPassword) . "</p>";
    echo "</div>";

} catch(PDOException $e) {
    echo "<div style='font-family: Arial; padding: 20px;'>";
    echo "<h2 style='color: red;'>❌ Eroare</h2>";
    echo "<p>" . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<p><strong>Verifică:</strong></p>";
    echo "<ul>";
    echo "<li>XAMPP MySQL rulează?</li>";
    echo "<li>Baza de date 'zid_barosani' există?</li>";
    echo "<li>Tabelul 'users' există?</li>";
    echo "</ul>";
    echo "</div>";
}
?>
