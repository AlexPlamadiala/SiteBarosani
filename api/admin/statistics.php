<?php
require_once '../config.php';

$adminId = checkAdminAuth();
$conn = getDBConnection();

try {
    // Statistici generale
    $stmt = $conn->query("SELECT * FROM statistics");
    $stats = $stmt->fetch();

    // Venituri totale
    $stmt = $conn->query("
        SELECT SUM(suma) as total_revenue
        FROM applications
        WHERE status = 'approved'
    ");
    $revenue = $stmt->fetch();

    // Cereri recente (ultimele 7 zile)
    $stmt = $conn->query("
        SELECT COUNT(*) as recent_applications
        FROM applications
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    ");
    $recentApps = $stmt->fetch();

    // Expirări în următoarele 7 zile
    $stmt = $conn->query("
        SELECT COUNT(*) as expiring_soon
        FROM barosani
        WHERE status = 'active'
        AND data_expirare BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
    ");
    $expiring = $stmt->fetch();

    echo json_encode([
        'success' => true,
        'statistics' => [
            'total_barosani' => $stats['total_barosani'],
            'platinum_count' => $stats['platinum_count'],
            'gold_count' => $stats['gold_count'],
            'basic_count' => $stats['basic_count'],
            'pending_applications' => $stats['pending_applications'],
            'monthly_revenue' => $stats['monthly_revenue'] ?? 0,
            'total_revenue' => $revenue['total_revenue'] ?? 0,
            'recent_applications' => $recentApps['recent_applications'],
            'expiring_soon' => $expiring['expiring_soon']
        ]
    ]);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
