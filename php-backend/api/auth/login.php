<?php
require_once '../../config.php';

setCORSHeaders();

// Solo permitir método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

// Obtener datos del formulario
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    $data = $_POST;
}

$email = isset($data['email']) ? sanitizeInput($data['email']) : '';
$password = isset($data['password']) ? $data['password'] : '';

// Validar campos
if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Email y contraseña son requeridos'
    ]);
    exit;
}

try {
    $db = getDB();
    
    // Buscar usuario por email
    $sql = "SELECT id, email, password, name, role FROM users WHERE email = :email LIMIT 1";
    $stmt = $db->prepare($sql);
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();
    
    // Verificar si el usuario existe y la contraseña es correcta
    if ($user && password_verify($password, $user['password'])) {
        // Crear sesión
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_role'] = $user['role'];
        
        // Regenerar ID de sesión por seguridad
        session_regenerate_id(true);
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Inicio de sesión exitoso',
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'name' => $user['name'],
                'role' => $user['role']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Email o contraseña incorrectos'
        ]);
    }
    
} catch (PDOException $e) {
    error_log("Error en login: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al procesar la solicitud'
    ]);
}
