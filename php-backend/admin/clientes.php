<?php
$currentPage = 'clientes';
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
        $stmt = $db->prepare("DELETE FROM clients WHERE id = ?");
        if ($stmt->execute([$id])) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Error al eliminar cliente']);
        }
        exit;
    }
}

// Handle POST request (Create/Update)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
    $name = sanitizeInput($_POST['name'] ?? '');
    $email = sanitizeInput($_POST['email'] ?? '');
    $phone = sanitizeInput($_POST['phone'] ?? '');
    $company = sanitizeInput($_POST['company'] ?? '');
    $industry = sanitizeInput($_POST['industry'] ?? '');
    $status = sanitizeInput($_POST['status'] ?? 'active');
    $notes = sanitizeInput($_POST['notes'] ?? '');

    if (empty($name) || empty($email)) {
        echo json_encode(['success' => false, 'error' => 'Nombre y email son requeridos']);
        exit;
    }

    if ($id > 0) {
        // Update existing client
        $stmt = $db->prepare("UPDATE clients SET name=?, email=?, phone=?, company=?, industry=?, status=?, notes=?, updated_at=NOW() WHERE id=?");
        $success = $stmt->execute([$name, $email, $phone, $company, $industry, $status, $notes, $id]);
    } else {
        // Create new client
        $stmt = $db->prepare("INSERT INTO clients (name, email, phone, company, industry, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $success = $stmt->execute([$name, $email, $phone, $company, $industry, $status, $notes]);
    }

    echo json_encode(['success' => $success]);
    exit;
}

// Handle GET request (Fetch clients)
if (isset($_GET['action']) && $_GET['action'] === 'get') {
    $status = isset($_GET['status']) ? sanitizeInput($_GET['status']) : 'all';
    $search = isset($_GET['search']) ? sanitizeInput($_GET['search']) : '';

    $query = "SELECT * FROM clients WHERE 1=1";
    $params = [];

    if ($status !== 'all') {
        $query .= " AND status = ?";
        $params[] = $status;
    }

    if (!empty($search)) {
        $query .= " AND (name LIKE ? OR email LIKE ? OR company LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }

    $query .= " ORDER BY created_at DESC";

    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $clients = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'clients' => $clients]);
    exit;
}

// Get single client details
if (isset($_GET['action']) && $_GET['action'] === 'getOne') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($id > 0) {
        $stmt = $db->prepare("SELECT * FROM clients WHERE id = ?");
        $stmt->execute([$id]);
        $client = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'client' => $client]);
    } else {
        echo json_encode(['success' => false, 'error' => 'ID inválido']);
    }
    exit;
}

// Get statistics
$stmt = $db->query("SELECT COUNT(*) as total FROM clients");
$totalClients = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

$stmt = $db->query("SELECT COUNT(*) as active FROM clients WHERE status = 'active'");
$activeClients = $stmt->fetch(PDO::FETCH_ASSOC)['active'];

$stmt = $db->query("SELECT COUNT(*) as inactive FROM clients WHERE status = 'inactive'");
$inactiveClients = $stmt->fetch(PDO::FETCH_ASSOC)['inactive'];

include 'layout-header.php';
?>

<div class="flex-1 overflow-auto bg-gray-50">
    <div class="p-8">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800">Gestión de Clientes</h1>
            <button onclick="openAddModal()" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium">
                + Agregar Cliente
            </button>
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Total Clientes</p>
                        <p class="text-3xl font-bold text-gray-800 mt-2"><?php echo $totalClients; ?></p>
                    </div>
                    <div class="bg-blue-100 p-3 rounded-lg">
                        <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Clientes Activos</p>
                        <p class="text-3xl font-bold text-green-600 mt-2"><?php echo $activeClients; ?></p>
                    </div>
                    <div class="bg-green-100 p-3 rounded-lg">
                        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Clientes Inactivos</p>
                        <p class="text-3xl font-bold text-gray-400 mt-2"><?php echo $inactiveClients; ?></p>
                    </div>
                    <div class="bg-gray-100 p-3 rounded-lg">
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex-1">
                    <input type="text" id="searchInput" placeholder="Buscar por nombre, email o empresa..." 
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                </div>
                <div>
                    <select id="statusFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option value="all">Todos los estados</option>
                        <option value="active">Activos</option>
                        <option value="inactive">Inactivos</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Clients Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industria</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody id="clientsTableBody" class="bg-white divide-y divide-gray-200">
                    <tr>
                        <td colspan="7" class="px-6 py-4 text-center text-gray-500">Cargando...</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Add/Edit Client Modal -->
<div id="clientModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
            <h2 id="modalTitle" class="text-2xl font-bold text-gray-800">Agregar Cliente</h2>
            <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>

        <form id="clientForm" class="space-y-4">
            <input type="hidden" id="clientId" name="id">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                    <input type="text" id="clientName" name="name" required
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input type="email" id="clientEmail" name="email" required
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                    <input type="tel" id="clientPhone" name="phone"
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Empresa</label>
                    <input type="text" id="clientCompany" name="company"
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Industria</label>
                    <input type="text" id="clientIndustry" name="industry"
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                    <select id="clientStatus" name="status"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                    </select>
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Notas</label>
                <textarea id="clientNotes" name="notes" rows="4"
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
let clients = [];

// Load clients on page load
document.addEventListener('DOMContentLoaded', function() {
    loadClients();
    
    // Event listeners for filters
    document.getElementById('searchInput').addEventListener('input', loadClients);
    document.getElementById('statusFilter').addEventListener('change', loadClients);
    
    // Form submission
    document.getElementById('clientForm').addEventListener('submit', handleSubmit);
});

async function loadClients() {
    const status = document.getElementById('statusFilter').value;
    const search = document.getElementById('searchInput').value;
    
    try {
        const response = await fetch(`clientes.php?action=get&status=${status}&search=${encodeURIComponent(search)}`);
        const data = await response.json();
        
        if (data.success) {
            clients = data.clients;
            renderClientsTable();
        }
    } catch (error) {
        console.error('Error loading clients:', error);
    }
}

function renderClientsTable() {
    const tbody = document.getElementById('clientsTableBody');
    
    if (clients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-4 text-center text-gray-500">No se encontraron clientes</td></tr>';
        return;
    }
    
    tbody.innerHTML = clients.map(client => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${escapeHtml(client.name)}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${escapeHtml(client.email)}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${escapeHtml(client.phone || '-')}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${escapeHtml(client.company || '-')}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${escapeHtml(client.industry || '-')}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }">
                    ${client.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="editClient(${client.id})" class="text-blue-600 hover:text-blue-900 mr-4">Editar</button>
                <button onclick="deleteClient(${client.id})" class="text-red-600 hover:text-red-900">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Agregar Cliente';
    document.getElementById('clientForm').reset();
    document.getElementById('clientId').value = '';
    document.getElementById('clientModal').classList.remove('hidden');
    document.getElementById('clientModal').classList.add('flex');
}

async function editClient(id) {
    try {
        const response = await fetch(`clientes.php?action=getOne&id=${id}`);
        const data = await response.json();
        
        if (data.success && data.client) {
            const client = data.client;
            document.getElementById('modalTitle').textContent = 'Editar Cliente';
            document.getElementById('clientId').value = client.id;
            document.getElementById('clientName').value = client.name;
            document.getElementById('clientEmail').value = client.email;
            document.getElementById('clientPhone').value = client.phone || '';
            document.getElementById('clientCompany').value = client.company || '';
            document.getElementById('clientIndustry').value = client.industry || '';
            document.getElementById('clientStatus').value = client.status;
            document.getElementById('clientNotes').value = client.notes || '';
            
            document.getElementById('clientModal').classList.remove('hidden');
            document.getElementById('clientModal').classList.add('flex');
        }
    } catch (error) {
        console.error('Error loading client:', error);
    }
}

async function deleteClient(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
        return;
    }
    
    try {
        const response = await fetch(`clientes.php?id=${id}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        
        if (data.success) {
            loadClients();
        } else {
            alert('Error al eliminar cliente: ' + (data.error || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error deleting client:', error);
        alert('Error al eliminar cliente');
    }
}

async function handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    try {
        const response = await fetch('clientes.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            closeModal();
            loadClients();
        } else {
            alert('Error: ' + (data.error || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error saving client:', error);
        alert('Error al guardar cliente');
    }
}

function closeModal() {
    document.getElementById('clientModal').classList.add('hidden');
    document.getElementById('clientModal').classList.remove('flex');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
</script>

<?php include 'layout-footer.php'; ?>
