<?php
require_once '../config.php';

// Verificar autenticación
if (!isAuthenticated()) {
    header('Location: /admin/login.php');
    exit;
}

$db = getDB();

// Obtener estadísticas
try {
    // Total de contactos
    $stmt = $db->query("SELECT COUNT(*) as total FROM contacts");
    $totalContacts = $stmt->fetch()['total'];
    
    // Contactos nuevos (últimos 7 días)
    $stmt = $db->query("SELECT COUNT(*) as total FROM contacts WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
    $newContacts = $stmt->fetch()['total'];
    
    // Contactos por estado
    $stmt = $db->query("SELECT status, COUNT(*) as count FROM contacts GROUP BY status");
    $statusCounts = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
    
    // Últimos contactos
    $stmt = $db->query("SELECT * FROM contacts ORDER BY created_at DESC LIMIT 10");
    $recentContacts = $stmt->fetchAll();
    
} catch (PDOException $e) {
    error_log("Error al obtener estadísticas: " . $e->getMessage());
    $totalContacts = 0;
    $newContacts = 0;
    $statusCounts = [];
    $recentContacts = [];
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Administración - ITACA Comunicación</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #f5f5f5;
            color: #333;
        }
        
        .header {
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            color: white;
            padding: 1.5rem 2rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .header-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .header h1 {
            font-size: 1.5rem;
            font-weight: 600;
        }
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
            text-decoration: none;
            display: inline-block;
            transition: all 0.2s;
        }
        
        .btn-primary {
            background-color: white;
            color: #22c55e;
        }
        
        .btn-primary:hover {
            background-color: #f0fdf4;
        }
        
        .container {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 2rem;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .stat-card h3 {
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .stat-card .value {
            font-size: 2.5rem;
            font-weight: 700;
            color: #22c55e;
        }
        
        .contacts-table {
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .table-header {
            padding: 1.5rem;
            border-bottom: 1px solid #e5e5e5;
        }
        
        .table-header h2 {
            font-size: 1.25rem;
            color: #333;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        thead {
            background-color: #f9fafb;
        }
        
        th, td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid #e5e5e5;
        }
        
        th {
            font-weight: 600;
            font-size: 0.85rem;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        tbody tr:hover {
            background-color: #f9fafb;
        }
        
        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 500;
            text-transform: uppercase;
        }
        
        .status-new {
            background-color: #dbeafe;
            color: #1e40af;
        }
        
        .status-contacted {
            background-color: #fef3c7;
            color: #92400e;
        }
        
        .status-converted {
            background-color: #d1fae5;
            color: #065f46;
        }
        
        .empty-state {
            padding: 3rem;
            text-align: center;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <h1>Panel de Administración</h1>
            <div class="user-info">
                <span>Hola, <?php echo htmlspecialchars($_SESSION['user_name']); ?></span>
                <a href="/admin/logout.php" class="btn btn-primary">Cerrar sesión</a>
            </div>
        </div>
    </div>
    
    <div class="container">
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total de Contactos</h3>
                <div class="value"><?php echo number_format($totalContacts); ?></div>
            </div>
            
            <div class="stat-card">
                <h3>Nuevos (7 días)</h3>
                <div class="value"><?php echo number_format($newContacts); ?></div>
            </div>
            
            <div class="stat-card">
                <h3>Pendientes</h3>
                <div class="value"><?php echo number_format($statusCounts['new'] ?? 0); ?></div>
            </div>
            
            <div class="stat-card">
                <h3>Convertidos</h3>
                <div class="value"><?php echo number_format($statusCounts['converted'] ?? 0); ?></div>
            </div>
        </div>
        
        <div class="contacts-table">
            <div class="table-header">
                <h2>Contactos Recientes</h2>
            </div>
            
            <?php if (count($recentContacts) > 0): ?>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Empresa</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($recentContacts as $contact): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($contact['name']); ?></td>
                                <td><?php echo htmlspecialchars($contact['email']); ?></td>
                                <td><?php echo htmlspecialchars($contact['phone'] ?? '-'); ?></td>
                                <td><?php echo htmlspecialchars($contact['company'] ?? '-'); ?></td>
                                <td>
                                    <span class="status-badge status-<?php echo $contact['status']; ?>">
                                        <?php echo $contact['status']; ?>
                                    </span>
                                </td>
                                <td><?php echo date('d/m/Y H:i', strtotime($contact['created_at'])); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <div class="empty-state">
                    <p>No hay contactos registrados aún.</p>
                </div>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
