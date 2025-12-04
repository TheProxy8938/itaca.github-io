<?php
$currentPage = 'usuarios';
require_once '../config.php';

if (!isAuthenticated()) {
    header('Location: /admin/login.php');
    exit;
}

requireAuth('superadmin');

$db = getDB();
$currentUser = getCurrentUser();
$canManageSuperAdmins = canManageSuperAdmins();

// Handle DELETE request
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
    // Prevent deleting the currently logged-in user
    if ($id === $_SESSION['user_id']) {
        echo json_encode(['success' => false, 'error' => 'No puedes eliminar tu propia cuenta']);
        exit;
    }
    
    if ($id > 0) {
        $stmt = $db->prepare("SELECT id, role, email FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $targetUser = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$targetUser) {
            echo json_encode(['success' => false, 'error' => 'Usuario no encontrado']);
            exit;
        }

        if ($targetUser['role'] === 'superadmin' && !$canManageSuperAdmins) {
            echo json_encode(['success' => false, 'error' => 'No tienes permisos para eliminar super administradores']);
            exit;
        }

        $stmt = $db->prepare("DELETE FROM users WHERE id = ?");
        if ($stmt->execute([$id])) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Error al eliminar usuario']);
        }
        exit;
    }
}

// Handle POST request (Create/Update)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
    $name = sanitizeInput($_POST['name'] ?? '');
    $email = sanitizeInput($_POST['email'] ?? '');
    $role = sanitizeInput($_POST['role'] ?? 'admin');
    $password = $_POST['password'] ?? '';

    if (empty($name) || empty($email)) {
        echo json_encode(['success' => false, 'error' => 'Nombre y email son requeridos']);
        exit;
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'error' => 'Email inválido']);
        exit;
    }

    if ($role === 'superadmin' && !$canManageSuperAdmins) {
        echo json_encode(['success' => false, 'error' => 'No tienes permisos para crear o asignar super administradores']);
        exit;
    }

    if ($id > 0) {
        $stmt = $db->prepare("SELECT role FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $existingUser = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$existingUser) {
            echo json_encode(['success' => false, 'error' => 'Usuario no encontrado']);
            exit;
        }

        if ($existingUser['role'] === 'superadmin' && !$canManageSuperAdmins) {
            echo json_encode(['success' => false, 'error' => 'No tienes permisos para modificar super administradores']);
            exit;
        }

        // Update existing user
        if (!empty($password)) {
            // Update with new password
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
            $stmt = $db->prepare("UPDATE users SET name=?, email=?, password=?, role=?, updated_at=NOW() WHERE id=?");
            $success = $stmt->execute([$name, $email, $hashedPassword, $role, $id]);
        } else {
            // Update without changing password
            $stmt = $db->prepare("UPDATE users SET name=?, email=?, role=?, updated_at=NOW() WHERE id=?");
            $success = $stmt->execute([$name, $email, $role, $id]);
        }
    } else {
        // Create new user
        if (empty($password)) {
            echo json_encode(['success' => false, 'error' => 'La contraseña es requerida para nuevos usuarios']);
            exit;
        }

        // Check if email already exists
        $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            echo json_encode(['success' => false, 'error' => 'El email ya está registrado']);
            exit;
        }

        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $db->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
        $success = $stmt->execute([$name, $email, $hashedPassword, $role]);
    }

    echo json_encode(['success' => $success]);
    exit;
}

// Handle GET request (Fetch users)
if (isset($_GET['action']) && $_GET['action'] === 'get') {
    $role = isset($_GET['role']) ? sanitizeInput($_GET['role']) : 'all';
    $search = isset($_GET['search']) ? sanitizeInput($_GET['search']) : '';

    $query = "SELECT id, name, email, role, created_at, updated_at FROM users WHERE 1=1";
    $params = [];

    if ($role !== 'all') {
        $query .= " AND role = ?";
        $params[] = $role;
    }

    if (!empty($search)) {
        $query .= " AND (name LIKE ? OR email LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }

    $query .= " ORDER BY created_at DESC";

    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'users' => $users]);
    exit;
}

// Get single user details
if (isset($_GET['action']) && $_GET['action'] === 'getOne') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($id > 0) {
        $stmt = $db->prepare("SELECT id, name, email, role, created_at FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'user' => $user]);
    } else {
        echo json_encode(['success' => false, 'error' => 'ID inválido']);
    }
    exit;
}

// Get statistics
$stmt = $db->query("SELECT COUNT(*) as total FROM users");
$totalUsers = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

$stmt = $db->query("SELECT COUNT(*) as admins FROM users WHERE role = 'admin'");
$totalAdmins = $stmt->fetch(PDO::FETCH_ASSOC)['admins'];

$stmt = $db->query("SELECT COUNT(*) as superadmins FROM users WHERE role = 'superadmin'");
$totalSuperAdmins = $stmt->fetch(PDO::FETCH_ASSOC)['superadmins'];

include 'layout-header.php';
?>

<div class="flex-1 overflow-auto bg-gray-50">
    <div class="p-8">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
            <button onclick="openAddModal()" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium">
                + Agregar Usuario
            </button>
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Total Usuarios</p>
                        <p class="text-3xl font-bold text-gray-800 mt-2"><?php echo $totalUsers; ?></p>
                    </div>
                    <div class="bg-indigo-100 p-3 rounded-lg">
                        <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Administradores</p>
                        <p class="text-3xl font-bold text-blue-600 mt-2"><?php echo $totalAdmins; ?></p>
                    </div>
                    <div class="bg-blue-100 p-3 rounded-lg">
                        <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm">Super Administradores</p>
                        <p class="text-3xl font-bold text-purple-600 mt-2"><?php echo $totalSuperAdmins; ?></p>
                    </div>
                    <div class="bg-purple-100 p-3 rounded-lg">
                        <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex-1">
                    <input type="text" id="searchInput" placeholder="Buscar por nombre o email..." 
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                </div>
                <div>
                    <select id="roleFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option value="all">Todos los roles</option>
                        <option value="admin">Administrador</option>
                        <option value="superadmin">Super Administrador</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Users Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Registro</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody id="usersTableBody" class="bg-white divide-y divide-gray-200">
                    <tr>
                        <td colspan="5" class="px-6 py-4 text-center text-gray-500">Cargando...</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Add/Edit User Modal -->
<div id="userModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
            <h2 id="modalTitle" class="text-2xl font-bold text-gray-800">Agregar Usuario</h2>
            <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>

        <form id="userForm" class="space-y-4">
            <input type="hidden" id="userId" name="id">
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nombre Completo *</label>
                <input type="text" id="userName" name="name" required
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input type="email" id="userEmail" name="email" required
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                <select id="userRole" name="role"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="admin">Administrador</option>
                    <?php if ($canManageSuperAdmins): ?>
                    <option value="superadmin">Super Administrador</option>
                    <?php endif; ?>
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña <span id="passwordRequired">*</span>
                    <span id="passwordOptional" class="text-gray-500 text-xs hidden">(dejar en blanco para mantener la actual)</span>
                </label>
                <input type="password" id="userPassword" name="password"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <p class="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
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
let users = [];
const currentUserId = <?php echo (int) $_SESSION['user_id']; ?>;
const CAN_MANAGE_SUPERADMINS = <?php echo $canManageSuperAdmins ? 'true' : 'false'; ?>;

// Load users on page load
document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    
    // Event listeners for filters
    document.getElementById('searchInput').addEventListener('input', loadUsers);
    document.getElementById('roleFilter').addEventListener('change', loadUsers);
    
    // Form submission
    document.getElementById('userForm').addEventListener('submit', handleSubmit);
});

async function loadUsers() {
    const role = document.getElementById('roleFilter').value;
    const search = document.getElementById('searchInput').value;
    
    try {
        const response = await fetch(`usuarios.php?action=get&role=${role}&search=${encodeURIComponent(search)}`);
        const data = await response.json();
        
        if (data.success) {
            users = data.users;
            renderUsersTable();
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">No se encontraron usuarios</td></tr>';
        return;
    }
    
    tbody.innerHTML = users.map(user => {
        const roleColors = {
            admin: 'bg-blue-100 text-blue-800',
            superadmin: 'bg-purple-100 text-purple-800'
        };
        
        const roleLabels = {
            admin: 'Administrador',
            superadmin: 'Super Admin'
        };
        
        const isCurrentUser = user.id === currentUserId;
        const isSuperAdmin = user.role === 'superadmin';
        const canModifyUser = !isSuperAdmin || CAN_MANAGE_SUPERADMINS;
        const canDeleteUser = canModifyUser && !isCurrentUser;
        
        return `
            <tr class="hover:bg-gray-50 ${isCurrentUser ? 'bg-green-50' : ''}">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                        ${escapeHtml(user.name)}
                        ${isCurrentUser ? '<span class="ml-2 text-xs text-green-600">(Tú)</span>' : ''}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${escapeHtml(user.email)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${roleColors[user.role] || 'bg-gray-100 text-gray-800'}">
                        ${roleLabels[user.role] || user.role}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${formatDate(user.created_at)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    ${canModifyUser ? `<button onclick="editUser(${user.id})" class="text-blue-600 hover:text-blue-900 mr-4">Editar</button>` : ''}
                    ${canDeleteUser ? `<button onclick="deleteUser(${user.id})" class="text-red-600 hover:text-red-900">Eliminar</button>` : ''}
                </td>
            </tr>
        `;
    }).join('');
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX') + ' ' + date.toLocaleTimeString('es-MX', {hour: '2-digit', minute: '2-digit'});
}

function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Agregar Usuario';
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('passwordRequired').classList.remove('hidden');
    document.getElementById('passwordOptional').classList.add('hidden');
    document.getElementById('userPassword').required = true;
    if (!CAN_MANAGE_SUPERADMINS) {
        document.getElementById('userRole').value = 'admin';
    }
    document.getElementById('userModal').classList.remove('hidden');
    document.getElementById('userModal').classList.add('flex');
}

async function editUser(id) {
    try {
        const response = await fetch(`usuarios.php?action=getOne&id=${id}`);
        const data = await response.json();
        
        if (data.success && data.user) {
            const user = data.user;
            if (user.role === 'superadmin' && !CAN_MANAGE_SUPERADMINS) {
                alert('No tienes permisos para modificar super administradores');
                return;
            }
            document.getElementById('modalTitle').textContent = 'Editar Usuario';
            document.getElementById('userId').value = user.id;
            document.getElementById('userName').value = user.name;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userRole').value = user.role;
            document.getElementById('userPassword').value = '';
            document.getElementById('passwordRequired').classList.add('hidden');
            document.getElementById('passwordOptional').classList.remove('hidden');
            document.getElementById('userPassword').required = false;
            
            document.getElementById('userModal').classList.remove('hidden');
            document.getElementById('userModal').classList.add('flex');
        }
    } catch (error) {
        console.error('Error loading user:', error);
    }
}

async function deleteUser(id) {
    const user = users.find(u => u.id === id);
    if (user && user.role === 'superadmin' && !CAN_MANAGE_SUPERADMINS) {
        alert('No tienes permisos para eliminar super administradores');
        return;
    }

    if (!confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        const response = await fetch(`usuarios.php?id=${id}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        
        if (data.success) {
            loadUsers();
        } else {
            alert('Error al eliminar usuario: ' + (data.error || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error al eliminar usuario');
    }
}

async function handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const password = formData.get('password');
    
    // Validate password if provided
    if (password && password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    try {
        const response = await fetch('usuarios.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success) {
            closeModal();
            loadUsers();
        } else {
            alert('Error: ' + (data.error || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error saving user:', error);
        alert('Error al guardar usuario');
    }
}

function closeModal() {
    document.getElementById('userModal').classList.add('hidden');
    document.getElementById('userModal').classList.remove('flex');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
</script>

<?php include 'layout-footer.php'; ?>
