<?php
require_once '../config.php';
requireAuth();

$db = getDB();

// Obtener estadísticas
$stats = [
    'total_contacts' => 0,
    'new_contacts' => 0,
    'total_clients' => 0,
    'active_campaigns' => 0,
    'recent_contacts' => []
];

try {
    // Total contactos
    $stmt = $db->query("SELECT COUNT(*) as total FROM contacts");
    $stats['total_contacts'] = $stmt->fetch()['total'];
    
    // Contactos nuevos (últimos 7 días)
    $stmt = $db->query("SELECT COUNT(*) as total FROM contacts WHERE status = 'new'");
    $stats['new_contacts'] = $stmt->fetch()['total'];
    
    // Total clientes
    $stmt = $db->query("SELECT COUNT(*) as total FROM clients WHERE status = 'active'");
    $stats['total_clients'] = $stmt->fetch()['total'];
    
    // Campañas activas
    $stmt = $db->query("SELECT COUNT(*) as total FROM campaigns WHERE status = 'active'");
    $stats['active_campaigns'] = $stmt->fetch()['total'];
    
    // Contactos recientes
    $stmt = $db->query("SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5");
    $stats['recent_contacts'] = $stmt->fetchAll();
    
} catch (PDOException $e) {
    error_log("Error al obtener estadísticas: " . $e->getMessage());
}
?>

<div class="page-header">
    <h1 class="page-title">Dashboard</h1>
    <p class="page-subtitle">Bienvenido al panel de administración de ÍTACA</p>
</div>

<style>
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .stat-card {
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        border-left: 4px solid #22c55e;
    }
    
    .stat-card.blue { border-left-color: #3b82f6; }
    .stat-card.orange { border-left-color: #f59e0b; }
    .stat-card.purple { border-left-color: #a855f7; }
    
    .stat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .stat-title {
        font-size: 0.85rem;
        color: #64748b;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .stat-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .stat-icon.green { background: #dcfce7; color: #16a34a; }
    .stat-icon.blue { background: #dbeafe; color: #2563eb; }
    .stat-icon.orange { background: #fed7aa; color: #d97706; }
    .stat-icon.purple { background: #f3e8ff; color: #9333ea; }
    
    .stat-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 0.5rem;
    }
    
    .stat-change {
        font-size: 0.85rem;
        color: #16a34a;
        font-weight: 600;
    }
    
    .table-container {
        background: white;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        overflow: hidden;
    }
    
    .table-header {
        padding: 1.5rem;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .table-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1e293b;
    }
    
    .btn-view-all {
        padding: 0.5rem 1rem;
        background: #22c55e;
        color: white;
        border-radius: 6px;
        text-decoration: none;
        font-size: 0.85rem;
        font-weight: 600;
        transition: all 0.2s;
    }
    
    .btn-view-all:hover {
        background: #16a34a;
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
    }
    
    thead {
        background: #f8fafc;
    }
    
    th {
        padding: 1rem;
        text-align: left;
        font-size: 0.85rem;
        font-weight: 600;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    td {
        padding: 1rem;
        border-top: 1px solid #e2e8f0;
    }
    
    tbody tr:hover {
        background: #f8fafc;
    }
    
    .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
    }
    
    .status-new {
        background: #dbeafe;
        color: #1e40af;
    }
    
    .status-contacted {
        background: #fef3c7;
        color: #92400e;
    }
    
    .status-converted {
        background: #dcfce7;
        color: #16a34a;
    }
    
    .empty-state {
        padding: 3rem;
        text-align: center;
        color: #94a3b8;
    }
</style>

<div class="stats-grid">
    <div class="stat-card">
        <div class="stat-header">
            <span class="stat-title">Total Contactos</span>
            <div class="stat-icon green">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
            </div>
        </div>
        <div class="stat-value"><?php echo number_format($stats['total_contacts']); ?></div>
        <div class="stat-change">📈 Solicitudes recibidas</div>
    </div>
    
    <div class="stat-card blue">
        <div class="stat-header">
            <span class="stat-title">Contactos Nuevos</span>
            <div class="stat-icon blue">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
        </div>
        <div class="stat-value"><?php echo number_format($stats['new_contacts']); ?></div>
        <div class="stat-change">⏳ Pendientes de respuesta</div>
    </div>
    
    <div class="stat-card orange">
        <div class="stat-header">
            <span class="stat-title">Clientes Activos</span>
            <div class="stat-icon orange">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
            </div>
        </div>
        <div class="stat-value"><?php echo number_format($stats['total_clients']); ?></div>
        <div class="stat-change">👥 En cartera</div>
    </div>
    
    <div class="stat-card purple">
        <div class="stat-header">
            <span class="stat-title">Campañas Activas</span>
            <div class="stat-icon purple">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
                </svg>
            </div>
        </div>
        <div class="stat-value"><?php echo number_format($stats['active_campaigns']); ?></div>
        <div class="stat-change">📢 En ejecución</div>
    </div>
</div>

<div class="table-container">
    <div class="table-header">
        <h2 class="table-title">Contactos Recientes</h2>
        <a href="contactos.php" class="btn-view-all">Ver Todos</a>
    </div>
    
    <?php if (count($stats['recent_contacts']) > 0): ?>
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Empresa</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($stats['recent_contacts'] as $contact): ?>
                    <tr>
                        <td><strong><?php echo htmlspecialchars($contact['name']); ?></strong></td>
                        <td><?php echo htmlspecialchars($contact['email']); ?></td>
                        <td><?php echo htmlspecialchars($contact['company'] ?? '-'); ?></td>
                        <td>
                            <span class="status-badge status-<?php echo $contact['status']; ?>">
                                <?php echo $contact['status']; ?>
                            </span>
                        </td>
                        <td><?php echo date('d/m/Y H:i', strtotime($contact['created_at'])); ?></td>
                        <td>
                            <a href="contactos.php?view=<?php echo $contact['id']; ?>" style="color: #22c55e; text-decoration: none; font-weight: 600;">
                                Ver →
                            </a>
                        </td>
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
