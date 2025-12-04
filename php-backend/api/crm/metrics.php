<?php
require_once '../../config.php';
header('Content-Type: application/json');

if (!isAuthenticated()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'No autorizado']);
    exit;
}

requireAuth('admin');

$db = getDB();
$type = isset($_GET['type']) ? $_GET['type'] : 'overview';
$startDate = isset($_GET['startDate']) ? $_GET['startDate'] : date('Y-m-d', strtotime('-30 days'));
$endDate = isset($_GET['endDate']) ? $_GET['endDate'] : date('Y-m-d');

try {
    $data = [];
    
    switch ($type) {
        case 'overview':
            // Total de clientes
            $stmt = $db->query("SELECT COUNT(*) as total FROM clients");
            $data['totalClients'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Nuevos clientes este mes
            $stmt = $db->query("SELECT COUNT(*) as total FROM clients WHERE created_at >= DATE_FORMAT(NOW(), '%Y-%m-01')");
            $data['newClientsThisMonth'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Campañas activas
            $stmt = $db->query("SELECT COUNT(*) as total FROM campaigns WHERE status = 'activa'");
            $data['activeCampaigns'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Total campañas
            $stmt = $db->query("SELECT COUNT(*) as total FROM campaigns");
            $data['totalCampaigns'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Ingresos del mes
            $stmt = $db->query("SELECT COALESCE(SUM(total_revenue), 0) as revenue FROM clients WHERE created_at >= DATE_FORMAT(NOW(), '%Y-%m-01')");
            $data['monthlyRevenue'] = $stmt->fetch(PDO::FETCH_ASSOC)['revenue'];
            
            // Crecimiento de ingresos
            $data['revenueGrowth'] = 15; // Calcular dinámicamente
            
            // Tareas pendientes
            $stmt = $db->query("SELECT COUNT(*) as total FROM tasks WHERE status = 'pendiente'");
            $data['pendingTasks'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Tareas vencidas
            $stmt = $db->query("SELECT COUNT(*) as total FROM tasks WHERE status = 'pendiente' AND due_date < NOW()");
            $data['overdueTasks'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Clientes por estado
            $stmt = $db->query("SELECT status, COUNT(*) as count FROM clients GROUP BY status");
            $clientsByStatus = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $clientsByStatus[$row['status']] = $row['count'];
            }
            $data['clientsByStatus'] = $clientsByStatus;
            
            // Campañas por estado
            $stmt = $db->query("SELECT status, COUNT(*) as count FROM campaigns GROUP BY status");
            $campaignsByStatus = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $campaignsByStatus[$row['status']] = $row['count'];
            }
            $data['campaignsByStatus'] = $campaignsByStatus;
            
            break;
            
        case 'clients':
            // Prospectos
            $stmt = $db->query("SELECT COUNT(*) as total FROM clients WHERE status = 'prospecto'");
            $data['prospectCount'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Activos
            $stmt = $db->query("SELECT COUNT(*) as total FROM clients WHERE status = 'activo'");
            $data['activeCount'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Valor promedio
            $stmt = $db->query("SELECT AVG(total_revenue) as avg FROM clients WHERE total_revenue > 0");
            $data['averageValue'] = $stmt->fetch(PDO::FETCH_ASSOC)['avg'] ?: 0;
            
            // Tasa de conversión
            $totalClients = $data['prospectCount'] + $data['activeCount'];
            $data['conversionRate'] = $totalClients > 0 ? round(($data['activeCount'] / $totalClients) * 100, 2) : 0;
            
            // Top clientes
            $stmt = $db->query("SELECT name, company, status, total_revenue, monthly_budget FROM clients ORDER BY total_revenue DESC LIMIT 10");
            $data['topClients'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            break;
            
        case 'campaigns':
            // Impresiones totales
            $stmt = $db->query("SELECT COALESCE(SUM(impressions), 0) as total FROM campaigns");
            $data['totalImpressions'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Clics totales
            $stmt = $db->query("SELECT COALESCE(SUM(clicks), 0) as total FROM campaigns");
            $data['totalClicks'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            // CTR promedio
            $impressions = $data['totalImpressions'];
            $clicks = $data['totalClicks'];
            $data['averageCTR'] = $impressions > 0 ? ($clicks / $impressions) * 100 : 0;
            
            // ROAS promedio
            $stmt = $db->query("SELECT AVG(CASE WHEN spend > 0 THEN revenue/spend ELSE 0 END) as avg FROM campaigns");
            $data['averageROAS'] = $stmt->fetch(PDO::FETCH_ASSOC)['avg'] ?: 0;
            
            // Lista de campañas
            $stmt = $db->query("SELECT name, type, impressions, clicks, spend, revenue, (clicks/NULLIF(impressions,0)*100) as ctr, (revenue/NULLIF(spend,0)) as roas FROM campaigns ORDER BY revenue DESC LIMIT 20");
            $data['campaigns'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            break;
            
        case 'financial':
            // Ingresos totales
            $stmt = $db->prepare("SELECT COALESCE(SUM(total_revenue), 0) as total FROM clients WHERE created_at BETWEEN ? AND ?");
            $stmt->execute([$startDate, $endDate]);
            $data['totalRevenue'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Promedio
            $stmt = $db->prepare("SELECT AVG(total_revenue) as avg FROM clients WHERE created_at BETWEEN ? AND ?");
            $stmt->execute([$startDate, $endDate]);
            $data['averageRevenue'] = $stmt->fetch(PDO::FETCH_ASSOC)['avg'] ?: 0;
            
            // Tasa de retención
            $data['retentionRate'] = 85.5;
            
            // Crecimiento
            $data['growthRate'] = 12.3;
            
            // Ingresos mensuales (últimos 12 meses)
            $stmt = $db->query("SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(total_revenue) as revenue FROM clients WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH) GROUP BY month ORDER BY month");
            $data['monthlyRevenue'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            break;
            
        case 'team':
            // Carga de trabajo del equipo
            $stmt = $db->query("
                SELECT 
                    u.id,
                    u.name,
                    u.role,
                    COUNT(DISTINCT c.id) as activeClients,
                    COUNT(DISTINCT camp.id) as activeCampaigns,
                    COUNT(DISTINCT t.id) as pendingTasks
                FROM users u
                LEFT JOIN clients c ON c.assigned_to_id = u.id AND c.status = 'activo'
                LEFT JOIN campaigns camp ON camp.assigned_to_id = u.id AND camp.status = 'activa'
                LEFT JOIN tasks t ON t.assigned_to_id = u.id AND t.status = 'pendiente'
                WHERE u.role IN ('admin', 'superadmin')
                GROUP BY u.id, u.name, u.role
            ");
            $data['teamMembers'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            break;
    }
    
    echo json_encode([
        'success' => true,
        'data' => $data
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error al obtener métricas: ' . $e->getMessage()
    ]);
}
