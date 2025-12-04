<?php
require_once '../config.php';

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

// Validar que se recibieron datos
if (!$data) {
    // Intentar con POST tradicional
    $data = $_POST;
}

// Validar campos requeridos
$name = isset($data['name']) ? sanitizeInput($data['name']) : '';
$email = isset($data['email']) ? sanitizeInput($data['email']) : '';
$phone = isset($data['phone']) ? sanitizeInput($data['phone']) : '';
$company = isset($data['company']) ? sanitizeInput($data['company']) : '';
$message = isset($data['message']) ? sanitizeInput($data['message']) : '';

// Validaciones
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Por favor completa todos los campos requeridos (nombre, email y mensaje)'
    ]);
    exit;
}

// Validar formato de email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'El formato del email no es válido'
    ]);
    exit;
}

try {
    $db = getDB();
    
    // Insertar contacto en la base de datos
    $sql = "INSERT INTO contacts (name, email, phone, company, message, status, created_at) 
            VALUES (:name, :email, :phone, :company, :message, 'new', NOW())";
    
    $stmt = $db->prepare($sql);
    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':phone' => $phone,
        ':company' => $company,
        ':message' => $message
    ]);
    
    $contactId = $db->lastInsertId();
    
    // Enviar email de notificación (opcional)
    $to = 'ecabello@itaca-mx.com';
    $subject = 'Nuevo contacto desde itaca-mx.com';
    $emailBody = "Nuevo contacto recibido:\n\n";
    $emailBody .= "Nombre: $name\n";
    $emailBody .= "Email: $email\n";
    $emailBody .= "Teléfono: $phone\n";
    $emailBody .= "Empresa: $company\n";
    $emailBody .= "Mensaje:\n$message\n";
    
    $headers = "From: noreply@itaca-mx.com\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // Intentar enviar email (puede fallar si no hay configuración de mail)
    @mail($to, $subject, $emailBody, $headers);
    
    // Respuesta exitosa
    http_response_code(201);
    echo json_encode([
        'success' => true, 
        'message' => '¡Gracias por contactarnos! Te responderemos pronto.',
        'contactId' => $contactId
    ]);
    
} catch (PDOException $e) {
    error_log("Error al guardar contacto: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Error al procesar tu solicitud. Por favor intenta más tarde.'
    ]);
}
