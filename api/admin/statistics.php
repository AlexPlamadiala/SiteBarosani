<?php
require_once '../config.php';

$adminId = checkAdminAuth();
$conn = getDBConnection();

try {
    // Calculate tier counts dynamically from barosani table (active only)
    $stmt = $conn->query("
        SELECT
            COUNT(*) as total_barosani,
            SUM(CASE WHEN tier = 'platinum' THEN 1 ELSE 0 END) as platinum_count,
            SUM(CASE WHEN tier = 'gold' THEN 1 ELSE 0 END) as gold_count,
            SUM(CASE WHEN tier = 'basic' THEN 1 ELSE 0 END) as basic_count
        FROM barosani
        WHERE status = 'active'
        AND data_expirare >= CURDATE()
    ");
    $tierCounts = $stmt->fetch();

    // Pending applications count
    $stmt = $conn->query("
        SELECT COUNT(*) as pending_applications
        FROM applications
        WHERE status = 'pending' OR status = 'payment_confirmed'
    ");
    $pendingApps = $stmt->fetch();

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

    // Suprem count (din tabela separată)
    $stmt = $conn->query("
        SELECT COUNT(*) as suprem_count
        FROM barosani_suprem
        WHERE status = 'active' AND data_expirare > NOW()
    ");
    $supremCount = $stmt->fetch();

    echo json_encode([
        'success' => true,
        'statistics' => [
            'total_barosani' => (int)($tierCounts['total_barosani'] ?? 0),
            'suprem_count' => (int)($supremCount['suprem_count'] ?? 0),
            'platinum_count' => (int)($tierCounts['platinum_count'] ?? 0),
            'gold_count' => (int)($tierCounts['gold_count'] ?? 0),
            'basic_count' => (int)($tierCounts['basic_count'] ?? 0),
            'pending_applications' => (int)($pendingApps['pending_applications'] ?? 0),
            'monthly_revenue' => 0,
            'total_revenue' => (int)($revenue['total_revenue'] ?? 0),
            'recent_applications' => (int)($recentApps['recent_applications'] ?? 0),
            'expiring_soon' => (int)($expiring['expiring_soon'] ?? 0)
        ]
    ]);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
