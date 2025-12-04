<?php
$currentPage = 'contactos';
require_once '../config.php';
requireAuth();

$db = getDB();
$userName = $_SESSION['user_name'] ?? 'Admin';

// Manejar acciones
$action = isset($_GET['action']) ? $_GET['action'] : 'list';
$message = '';
$error = '';

// Actualizar estado de contacto
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_status'])) {
    $contactId = $_POST['contact_id'];
    $newStatus = $_POST['status'];
    
    try {
        $stmt = $db->prepare("UPDATE contacts SET status = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$newStatus, $contactId]);
        $message = "Estado actualizado exitosamente";
    } catch (PDOException $e) {
        $error = "Error al actualizar el estado";
    }
}

// Eliminar contacto
if ($action === 'delete' && isset($_GET['id'])) {
    try {
        $stmt = $db->prepare("DELETE FROM contacts WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        $message = "Contacto eliminado exitosamente";
        header("Location: contactos.php");
        exit;
    } catch (PDOException $e) {
        $error = "Error al eliminar el contacto";
    }
}

// Obtener contactos
$filter = isset($_GET['filter']) ? $_GET['filter'] : 'all';
$search = isset($_GET['search']) ? $_GET['search'] : '';

$sql = "SELECT * FROM contacts WHERE 1=1";
$params = [];

if ($filter !== 'all') {
    $sql .= " AND status = ?";
    $params[] = $filter;
}

if ($search) {
    $sql .= " AND (name LIKE ? OR email LIKE ? OR company LIKE ? OR message LIKE ?)";
    $searchTerm = "%$search%";
    $params = array_merge($params, [$searchTerm, $searchTerm, $searchTerm, $searchTerm]);
}

$sql .= " ORDER BY created_at DESC";

try {
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $contacts = $stmt->fetchAll();
} catch (PDOException $e) {
    $contacts = [];
    $error = "Error al cargar contactos";
}

// Contar por estado
try {
    $stmt = $db->query("SELECT status, COUNT(*) as count FROM contacts GROUP BY status");
    $statusCounts = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
} catch (PDOException $e) {
    $statusCounts = [];
}

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Contactos - ITACA</title>
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
    .admin-container { display: flex; min-height: 100vh; }
    .sidebar { width: 260px; background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%); color: white; position: fixed; height: 100vh; }
    .sidebar-header { padding: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .sidebar-header h1 { font-size: 1.5rem; color: #22c55e; }
    .sidebar-nav { padding: 1rem 0; }
    .nav-link { display: flex; align-items: center; padding: 0.75rem 1.5rem; color: rgba(255,255,255,0.8); text-decoration: none; border-left: 3px solid transparent; }
    .nav-link:hover, .nav-link.active { background: rgba(34,197,94,0.1); color: #22c55e; border-left-color: #22c55e; }
    .nav-link svg { width: 20px; height: 20px; margin-right: 0.75rem; }
    .sidebar-footer { position: absolute; bottom: 0; width: 260px; padding: 1rem; border-top: 1px solid rgba(255,255,255,0.1); }
    .user-info { display: flex; align-items: center; margin-bottom: 1rem; }
    .user-avatar { width: 40px; height: 40px; border-radius: 50%; background: #22c55e; display: flex; align-items: center; justify-content: center; font-weight: 700; margin-right: 0.75rem; }
    .user-name { font-weight: 600; font-size: 0.9rem; }
    .user-role { font-size: 0.75rem; color: rgba(255,255,255,0.6); }
    .btn-logout { display: block; width: 100%; padding: 0.6rem; background: rgba(239,68,68,0.2); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); border-radius: 6px; text-align: center; text-decoration: none; font-size: 0.85rem; font-weight: 600; }
    .btn-logout:hover { background: #ef4444; color: white; }
    .main-content { flex: 1; margin-left: 260px; padding: 2rem; }
    .page-header { margin-bottom: 2rem; }
    .page-title { font-size: 2rem; font-weight: 700; color: #1e293b; }
    .page-subtitle { color: #64748b; }
    .status-badge { padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
    .status-new { background: #dbeafe; color: #1e40af; }
    .status-contacted { background: #fef3c7; color: #92400e; }
    .status-converted { background: #dcfce7; color: #16a34a; }
    .btn-sm { padding: 0.4rem 0.8rem !important; font-size: 0.8rem !important; }
<style>
    .filters-bar {
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        margin-bottom: 1.5rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .filters-row {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        align-items: center;
    }
    
    .filter-group {
        flex: 1;
        min-width: 200px;
    }
    
    .filter-label {
        display: block;
        font-size: 0.85rem;
        font-weight: 600;
        color: #64748b;
        margin-bottom: 0.5rem;
    }
    
    .filter-input, .filter-select {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        font-size: 0.95rem;
        transition: all 0.2s;
    }
    
    .filter-input:focus, .filter-select:focus {
        outline: none;
        border-color: #22c55e;
    }
    
    .filter-tabs {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
    }
    
    .filter-tab {
        padding: 0.5rem 1rem;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        background: white;
        color: #64748b;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        font-size: 0.85rem;
        transition: all 0.2s;
    }
    
    .filter-tab:hover {
        border-color: #22c55e;
        color: #22c55e;
    }
    
    .filter-tab.active {
        background: #22c55e;
        color: white;
        border-color: #22c55e;
    }
    
    .contacts-table {
        background: white;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        overflow: hidden;
    }
    
    .contact-row {
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .contact-row:hover {
        background: #f8fafc;
    }
    
    .contact-actions {
        display: flex;
        gap: 0.5rem;
    }
    
    .btn {
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.85rem;
        font-weight: 600;
        text-decoration: none;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .btn-primary {
        background: #22c55e;
        color: white;
    }
    
    .btn-primary:hover {
        background: #16a34a;
    }
    
    .btn-secondary {
        background: #e2e8f0;
        color: #475569;
    }
    
    .btn-secondary:hover {
        background: #cbd5e1;
    }
    
    .btn-danger {
        background: #ef4444;
        color: white;
    }
    
    .btn-danger:hover {
        background: #dc2626;
    }
    
    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 1000;
        align-items: center;
        justify-content: center;
    }
    
    .modal.active {
        display: flex;
    }
    
    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        max-width: 600px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }
    
    .modal-title {
        font-size: 1.5rem;
        font-weight: 700;
    }
    
    .btn-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #64748b;
    }
    
    .detail-row {
        margin-bottom: 1rem;
    }
    
    .detail-label {
        font-weight: 600;
        color: #64748b;
        font-size: 0.85rem;
        margin-bottom: 0.25rem;
    }
    
    .detail-value {
        color: #1e293b;
        font-size: 1rem;
    }
    
    .message-box {
        background: #f8fafc;
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #22c55e;
    }
    
    .alert {
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
    }
    
    .alert-success {
        background: #dcfce7;
        color: #16a34a;
        border-left: 4px solid #16a34a;
    }
    
    .alert-error {
        background: #fee2e2;
        color: #dc2626;
        border-left: 4px solid #dc2626;
    }
</style>

<div class="page-header">
    <h1 class="page-title">Gestión de Contactos</h1>
    <p class="page-subtitle">Administra las solicitudes de información recibidas</p>
</div>

<?php if ($message): ?>
    <div class="alert alert-success"><?php echo htmlspecialchars($message); ?></div>
<?php endif; ?>

<?php if ($error): ?>
    <div class="alert alert-error"><?php echo htmlspecialchars($error); ?></div>
<?php endif; ?>

<div class="filter-tabs">
    <a href="contactos.php?filter=all" class="filter-tab <?php echo $filter === 'all' ? 'active' : ''; ?>">
        Todos (<?php echo array_sum($statusCounts); ?>)
    </a>
    <a href="contactos.php?filter=new" class="filter-tab <?php echo $filter === 'new' ? 'active' : ''; ?>">
        Nuevos (<?php echo $statusCounts['new'] ?? 0; ?>)
    </a>
    <a href="contactos.php?filter=contacted" class="filter-tab <?php echo $filter === 'contacted' ? 'active' : ''; ?>">
        Contactados (<?php echo $statusCounts['contacted'] ?? 0; ?>)
    </a>
    <a href="contactos.php?filter=converted" class="filter-tab <?php echo $filter === 'converted' ? 'active' : ''; ?>">
        Convertidos (<?php echo $statusCounts['converted'] ?? 0; ?>)
    </a>
</div>

<div class="filters-bar">
    <form method="GET" class="filters-row">
        <input type="hidden" name="filter" value="<?php echo htmlspecialchars($filter); ?>">
        <div class="filter-group">
            <label class="filter-label">Buscar</label>
            <input type="text" name="search" class="filter-input" placeholder="Nombre, email, empresa..." value="<?php echo htmlspecialchars($search); ?>">
        </div>
        <div class="filter-group" style="flex: 0;">
            <label class="filter-label">&nbsp;</label>
            <button type="submit" class="btn btn-primary">Buscar</button>
        </div>
    </form>
</div>

<div class="contacts-table">
    <table style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr style="background: #f8fafc;">
                <th style="padding: 1rem; text-align: left;">Nombre</th>
                <th style="padding: 1rem; text-align: left;">Email</th>
                <th style="padding: 1rem; text-align: left;">Empresa</th>
                <th style="padding: 1rem; text-align: left;">Estado</th>
                <th style="padding: 1rem; text-align: left;">Fecha</th>
                <th style="padding: 1rem; text-align: left;">Acciones</th>
            </tr>
        </thead>
        <tbody>
            <?php if (count($contacts) > 0): ?>
                <?php foreach ($contacts as $contact): ?>
                    <tr class="contact-row" style="border-top: 1px solid #e2e8f0;">
                        <td style="padding: 1rem;"><strong><?php echo htmlspecialchars($contact['name']); ?></strong></td>
                        <td style="padding: 1rem;"><?php echo htmlspecialchars($contact['email']); ?></td>
                        <td style="padding: 1rem;"><?php echo htmlspecialchars($contact['company'] ?? '-'); ?></td>
                        <td style="padding: 1rem;">
                            <span class="status-badge status-<?php echo $contact['status']; ?>">
                                <?php echo $contact['status']; ?>
                            </span>
                        </td>
                        <td style="padding: 1rem;"><?php echo date('d/m/Y H:i', strtotime($contact['created_at'])); ?></td>
                        <td style="padding: 1rem;">
                            <div class="contact-actions">
                                <button onclick="viewContact(<?php echo $contact['id']; ?>)" class="btn btn-primary btn-sm">Ver</button>
                                <a href="?action=delete&id=<?php echo $contact['id']; ?>" 
                                   onclick="return confirm('¿Eliminar este contacto?')" 
                                   class="btn btn-danger btn-sm">Eliminar</a>
                            </div>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr>
                    <td colspan="6" style="padding: 3rem; text-align: center; color: #94a3b8;">
                        No se encontraron contactos
                    </td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<!-- Modal para ver detalles -->
<div id="contactModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2 class="modal-title">Detalle del Contacto</h2>
            <button class="btn-close" onclick="closeModal()">&times;</button>
        </div>
        <div id="modalBody"></div>
    </div>
</div>

<script>
function viewContact(id) {
    const contact = <?php echo json_encode($contacts); ?>.find(c => c.id == id);
    if (!contact) return;
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="detail-row">
            <div class="detail-label">Nombre Completo</div>
            <div class="detail-value">${contact.name}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Email</div>
            <div class="detail-value"><a href="mailto:${contact.email}">${contact.email}</a></div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Teléfono</div>
            <div class="detail-value">${contact.phone || '-'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Empresa</div>
            <div class="detail-value">${contact.company || '-'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Mensaje</div>
            <div class="message-box">${contact.message}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Fecha de Solicitud</div>
            <div class="detail-value">${new Date(contact.created_at).toLocaleString('es-MX')}</div>
        </div>
        <hr style="margin: 1.5rem 0; border: none; border-top: 1px solid #e2e8f0;">
        <form method="POST" style="margin-top: 1.5rem;">
            <input type="hidden" name="contact_id" value="${contact.id}">
            <div class="detail-row">
                <div class="detail-label">Cambiar Estado</div>
                <select name="status" class="filter-select" style="margin-bottom: 1rem;">
                    <option value="new" ${contact.status === 'new' ? 'selected' : ''}>Nuevo</option>
                    <option value="contacted" ${contact.status === 'contacted' ? 'selected' : ''}>Contactado</option>
                    <option value="converted" ${contact.status === 'converted' ? 'selected' : ''}>Convertido</option>
                </select>
            </div>
            <button type="submit" name="update_status" class="btn btn-primary" style="width: 100%;">
                Actualizar Estado
            </button>
        </form>
    `;
    
    document.getElementById('contactModal').classList.add('active');
}

function closeModal() {
    document.getElementById('contactModal').classList.remove('active');
}

// Cerrar modal al hacer clic fuera
document.getElementById('contactModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});
</script>

<?php include 'layout-footer.php'; ?>
