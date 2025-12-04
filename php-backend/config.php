<?php
// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_NAME', 'itaca_db');
define('DB_USER', 'itaca_user');
define('DB_PASS', 'Usuario8938!');
define('DB_CHARSET', 'utf8mb4');

// Configuración de sesiones
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 0); // Cambiar a 1 cuando tengas HTTPS
session_start();

// Configuración de zona horaria
date_default_timezone_set('America/Mexico_City');

// Roles especiales
define('SUPERADMIN_OWNER_EMAILS', [
    'proxemodelan5@gmail.com',
    'ecabello@itaca-mx.com'
]);

// Función para obtener conexión a la base de datos
function getDB() {
    static $pdo = null;
    
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            error_log("Error de conexión a la base de datos: " . $e->getMessage());
            die(json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos']));
        }
    }
    
    return $pdo;
}

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
    return isset($_SESSION['user_id']) && isset($_SESSION['user_email']);
}

// Obtener datos del usuario actual
function getCurrentUser(): ?array {
    if (!isAuthenticated()) {
        return null;
    }

    return [
        'id' => (int) $_SESSION['user_id'],
        'email' => $_SESSION['user_email'],
        'name' => $_SESSION['user_name'] ?? '',
        'role' => $_SESSION['user_role'] ?? 'admin'
    ];
}

// Determinar roles
function isSuperAdmin(): bool {
    $user = getCurrentUser();
    return $user && ($user['role'] === 'superadmin');
}

function isAdmin(): bool {
    $user = getCurrentUser();
    return $user && in_array($user['role'], ['admin', 'superadmin'], true);
}

function isOwnerSuperAdmin(): bool {
    $user = getCurrentUser();
    if (!$user || $user['role'] !== 'superadmin') {
        return false;
    }

    $email = strtolower($user['email']);
    foreach (SUPERADMIN_OWNER_EMAILS as $ownerEmail) {
        if ($email === strtolower($ownerEmail)) {
            return true;
        }
    }

    return false;
}

function isDilanSuperAdmin(): bool {
    $user = getCurrentUser();
    if (!$user || $user['role'] !== 'superadmin') {
        return false;
    }

    $email = strtolower($user['email']);
    $name = strtolower($user['name'] ?? '');

    return $email === 'proxemodelan5@gmail.com' || $name === 'dilan hernandez';
}

function canManageSuperAdmins(): bool {
    return isOwnerSuperAdmin();
}

function canManageAdmins(): bool {
    $user = getCurrentUser();
    if (!$user) {
        return false;
    }

    if ($user['role'] === 'superadmin') {
        return true;
    }

    return false;
}

// Función para requerir autenticación (y opcionalmente roles)
function requireAuth($allowedRoles = null) {
    if (!isAuthenticated()) {
        header('HTTP/1.1 401 Unauthorized');
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'No autorizado']);
        exit;
    }

    if ($allowedRoles !== null) {
        $user = getCurrentUser();
        $roles = is_array($allowedRoles) ? $allowedRoles : [$allowedRoles];

        if (!$user || !in_array($user['role'], $roles, true)) {
            header('HTTP/1.1 403 Forbidden');
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'message' => 'Acceso denegado']);
            exit;
        }
    }
}

// Función para sanitizar entrada
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Configurar headers CORS (permitir peticiones desde el frontend)
function setCORSHeaders() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Content-Type: application/json; charset=utf-8');
    
    // Manejar preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}
