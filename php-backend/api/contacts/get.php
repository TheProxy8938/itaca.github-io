<?php
require_once '../../config.php';

setCORSHeaders();
requireAuth();

// Solo permitir método GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

try {
    $db = getDB();
    
    // Obtener parámetros opcionales
    $status = isset($_GET['status']) ? sanitizeInput($_GET['status']) : null;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    
    // Construir query
    $sql = "SELECT id, name, email, phone, company, message, status, created_at, updated_at 
            FROM contacts";
    
    if ($status) {
        $sql .= " WHERE status = :status";
    }
    
    $sql .= " ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
    
    $stmt = $db->prepare($sql);
    
    if ($status) {
        $stmt->bindValue(':status', $status, PDO::PARAM_STR);
    }
    
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    
    $contacts = $stmt->fetchAll();
    
    // Obtener total de contactos
    $countSql = "SELECT COUNT(*) as total FROM contacts";
    if ($status) {
        $countSql .= " WHERE status = :status";
    }
    
    $countStmt = $db->prepare($countSql);
    if ($status) {
        $countStmt->bindValue(':status', $status, PDO::PARAM_STR);
    }
    $countStmt->execute();
    $total = $countStmt->fetch()['total'];
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'contacts' => $contacts,
        'total' => (int)$total,
        'limit' => $limit,
        'offset' => $offset
    ]);
    
} catch (PDOException $e) {
    error_log("Error al obtener contactos: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener contactos'
    ]);
}
