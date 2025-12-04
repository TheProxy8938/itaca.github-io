<?php
$currentPage = 'campanas';
require_once '../config.php';

if (!isAuthenticated()) {
    header('Location: /admin/login.php');
    exit;
}

requireAuth(['admin', 'superadmin']);

$db = getDB();

// Handle DELETE request
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($id > 0) {
        $stmt = $db->prepare("DELETE FROM campaigns WHERE id = ?");
        if ($stmt->execute([$id])) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Error al eliminar campaña']);
        }
        exit;
    }
}

// Handle POST request (Create/Update)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
    $name = sanitizeInput($_POST['name'] ?? '');
    $type = sanitizeInput($_POST['type'] ?? '');
    $status = sanitizeInput($_POST['status'] ?? 'planning');
    $start_date = sanitizeInput($_POST['start_date'] ?? '');
    $end_date = sanitizeInput($_POST['end_date'] ?? '');
    $budget = isset($_POST['budget']) ? floatval($_POST['budget']) : 0;
    $description = sanitizeInput($_POST['description'] ?? '');

    if (empty($name)) {
        echo json_encode(['success' => false, 'error' => 'El nombre es requerido']);
        exit;
    }

    if ($id > 0) {
        // Update existing campaign
        $stmt = $db->prepare("UPDATE campaigns SET name=?, type=?, status=?, start_date=?, end_date=?, budget=?, description=?, updated_at=NOW() WHERE id=?");
        $success = $stmt->execute([$name, $type, $status, $start_date, $end_date, $budget, $description, $id]);
    } else {
        // Create new campaign
        $stmt = $db->prepare("INSERT INTO campaigns (name, type, status, start_date, end_date, budget, description) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $success = $stmt->execute([$name, $type, $status, $start_date, $end_date, $budget, $description]);
    }

    echo json_encode(['success' => $success]);
    exit;
}

// Handle GET request (Fetch campaigns)
if (isset($_GET['action']) && $_GET['action'] === 'get') {
    $status = isset($_GET['status']) ? sanitizeInput($_GET['status']) : 'all';
    $search = isset($_GET['search']) ? sanitizeInput($_GET['search']) : '';

    $query = "SELECT * FROM campaigns WHERE 1=1";
    $params = [];

    if ($status !== 'all') {
        $query .= " AND status = ?";
        $params[] = $status;
    }

    if (!empty($search)) {
        $query .= " AND (name LIKE ? OR type LIKE ? OR description LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }

    $query .= " ORDER BY created_at DESC";

    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $campaigns = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'campaigns' => $campaigns]);
    exit;
}

// Get single campaign details
if (isset($_GET['action']) && $_GET['action'] === 'getOne') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($id > 0) {
        $stmt = $db->prepare("SELECT * FROM campaigns WHERE id = ?");
        $stmt->execute([$id]);
        $campaign = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'campaign' => $campaign]);
    } else {
        echo json_encode(['success' => false, 'error' => 'ID inválido']);
    }
    exit;
}

// Get statistics
$stmt = $db->query("SELECT COUNT(*) as total FROM campaigns");
$totalCampaigns = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

$stmt = $db->query("SELECT COUNT(*) as active FROM campaigns WHERE status = 'active'");
$activeCampaigns = $stmt->fetch(PDO::FETCH_ASSOC)['active'];

$stmt = $db->query("SELECT SUM(budget) as total_budget FROM campaigns WHERE status IN ('planning', 'active')");
$totalBudget = $stmt->fetch(PDO::FETCH_ASSOC)['total_budget'] ?? 0;

include 'layout-header.php';
?>

<div class="flex-1 overflow-auto bg-gray-50">
    <div class="p-8">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800">Gestión de Campañas</h1>
            <button onclick="openAddModal()" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium">
                + Crear Campaña
            </button>
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Total Campañas</p>
                        <p class="text-3xl font-bold text-gray-800 mt-2"><?php echo $totalCampaigns; ?></p>
                    </div>
                    <div class="bg-purple-100 p-3 rounded-lg">
                        <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Campañas Activas</p>
                        <p class="text-3xl font-bold text-green-600 mt-2"><?php echo $activeCampaigns; ?></p>
                    </div>
                    <div class="bg-green-100 p-3 rounded-lg">
                        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Presupuesto Total</p>
                        <p class="text-3xl font-bold text-blue-600 mt-2">$<?php echo number_format($totalBudget, 2); ?></p>
                    </div>
                    <div class="bg-blue-100 p-3 rounded-lg">
                        <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex-1">
                    <input type="text" id="searchInput" placeholder="Buscar por nombre, tipo o descripción..." 
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                </div>
                <div>
                    <select id="statusFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option value="all">Todos los estados</option>
                        <option value="planning">Planificación</option>
                        <option value="active">Activas</option>
                        <option value="completed">Completadas</option>
                        <option value="cancelled">Canceladas</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Campaigns Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fechas</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Presupuesto</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody id="campaignsTableBody" class="bg-white divide-y divide-gray-200">
                    <tr>
                        <td colspan="6" class="px-6 py-4 text-center text-gray-500">Cargando...</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Add/Edit Campaign Modal -->
<div id="campaignModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
            <h2 id="modalTitle" class="text-2xl font-bold text-gray-800">Crear Campaña</h2>
            <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>

        <form id="campaignForm" class="space-y-4">
            <input type="hidden" id="campaignId" name="id">
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nombre de la Campaña *</label>
                <input type="text" id="campaignName" name="name" required
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                    <select id="campaignType" name="type"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option value="">Seleccionar tipo</option>
                        <option value="marketing">Marketing Digital</option>
                        <option value="social_media">Redes Sociales</option>
                        <option value="email">Email Marketing</option>
                        <option value="seo">SEO</option>
                        <option value="paid_ads">Publicidad Pagada</option>
                        <option value="content">Marketing de Contenidos</option>
                        <option value="events">Eventos</option>
                        <option value="other">Otro</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                    <select id="campaignStatus" name="status"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option value="planning">Planificación</option>
                        <option value="active">Activa</option>
                        <option value="completed">Completada</option>
                        <option value="cancelled">Cancelada</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio</label>
                    <input type="date" id="campaignStartDate" name="start_date"
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de Fin</label>
                    <input type="date" id="campaignEndDate" name="end_date"
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                </div>

                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Presupuesto</label>
                    <div class="relative">
                        <span class="absolute left-3 top-2 text-gray-500">$</span>
                        <input type="number" id="campaignBudget" name="budget" step="0.01" min="0"
                               class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    </div>
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea id="campaignDescription" name="description" rows="4"
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"></textarea>
            </div>

            <div class="flex justify-end gap-4 mt-6">
                <button type="button" onclick="closeModal()" 
                        class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    Cancelar
                </button>
                <button type="submit" 
                        class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                    Guardar
                </button>
            </div>
        </form>
    </div>
</div>

<script>
let campaigns = [];

// Load campaigns on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCampaigns();
    
    // Event listeners for filters
    document.getElementById('searchInput').addEventListener('input', loadCampaigns);
    document.getElementById('statusFilter').addEventListener('change', loadCampaigns);
    
    // Form submission
    document.getElementById('campaignForm').addEventListener('submit', handleSubmit);
});

async function loadCampaigns() {
    const status = document.getElementById('statusFilter').value;
    const search = document.getElementById('searchInput').value;
    
    try {
        const response = await fetch(`campanas.php?action=get&status=${status}&search=${encodeURIComponent(search)}`);
        const data = await response.json();
        
        if (data.success) {
            campaigns = data.campaigns;
            renderCampaignsTable();
        }
    } catch (error) {
        console.error('Error loading campaigns:', error);
    }
}

function renderCampaignsTable() {
    const tbody = document.getElementById('campaignsTableBody');
    
    if (campaigns.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-gray-500">No se encontraron campañas</td></tr>';
        return;
    }
    
    tbody.innerHTML = campaigns.map(campaign => {
        const statusColors = {
            planning: 'bg-yellow-100 text-yellow-800',
            active: 'bg-green-100 text-green-800',
            completed: 'bg-blue-100 text-blue-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        
        const statusLabels = {
            planning: 'Planificación',
            active: 'Activa',
            completed: 'Completada',
            cancelled: 'Cancelada'
        };
        
        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900">${escapeHtml(campaign.name)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${escapeHtml(campaign.type || '-')}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[campaign.status] || 'bg-gray-100 text-gray-800'}">
                        ${statusLabels[campaign.status] || campaign.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                        ${campaign.start_date ? formatDate(campaign.start_date) : '-'} 
                        ${campaign.end_date ? ' - ' + formatDate(campaign.end_date) : ''}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">$${parseFloat(campaign.budget || 0).toLocaleString('es-MX', {minimumFractionDigits: 2})}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="editCampaign(${campaign.id})" class="text-blue-600 hover:text-blue-900 mr-4">Editar</button>
                    <button onclick="deleteCampaign(${campaign.id})" class="text-red-600 hover:text-red-900">Eliminar</button>
                </td>
            </tr>
        `;
    }).join('');
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX');
}

function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Crear Campaña';
    document.getElementById('campaignForm').reset();
    document.getElementById('campaignId').value = '';
    document.getElementById('campaignModal').classList.remove('hidden');
    document.getElementById('campaignModal').classList.add('flex');
}

async function editCampaign(id) {
    try {
        const response = await fetch(`campanas.php?action=getOne&id=${id}`);
        const data = await response.json();
        
        if (data.success && data.campaign) {
            const campaign = data.campaign;
            document.getElementById('modalTitle').textContent = 'Editar Campaña';
            document.getElementById('campaignId').value = campaign.id;
            document.getElementById('campaignName').value = campaign.name;
            document.getElementById('campaignType').value = campaign.type || '';
            document.getElementById('campaignStatus').value = campaign.status;
            document.getElementById('campaignStartDate').value = campaign.start_date || '';
            document.getElementById('campaignEndDate').value = campaign.end_date || '';
            document.getElementById('campaignBudget').value = campaign.budget || '';
            document.getElementById('campaignDescription').value = campaign.description || '';
            
            document.getElementById('campaignModal').classList.remove('hidden');
            document.getElementById('campaignModal').classList.add('flex');
        }
    } catch (error) {
        console.error('Error loading campaign:', error);
    }
}

async function deleteCampaign(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta campaña?')) {
        return;
    }
    
    try {
        const response = await fetch(`campanas.php?id=${id}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        
        if (data.success) {
            loadCampaigns();
        } else {
            alert('Error al eliminar campaña: ' + (data.error || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error deleting campaign:', error);
        alert('Error al eliminar campaña');
    }
}

async function handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    try {
        const response = await fetch('campanas.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            closeModal();
            loadCampaigns();
        } else {
            alert('Error: ' + (data.error || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error saving campaign:', error);
        alert('Error al guardar campaña');
    }
}

function closeModal() {
    document.getElementById('campaignModal').classList.add('hidden');
    document.getElementById('campaignModal').classList.remove('flex');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
</script>

<?php include 'layout-footer.php'; ?>
