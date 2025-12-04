<?php
require_once '../../config.php';
require_once '../../lib/personal_chat.php';

setCORSHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

requireAuth('superadmin');

if (!isDilanSuperAdmin()) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'message' => 'Esta área es exclusiva para el superadministrador autorizado.'
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
    exit;
}

$db = getDB();
$admin = getCurrentUser();
$adminId = (int) $admin['id'];

try {
    ensurePersonalChatTables($db);

    $payload = json_decode(file_get_contents('php://input'), true) ?? [];
    $messages = isset($payload['messages']) && is_array($payload['messages']) ? $payload['messages'] : [];
    $moodAnalysis = isset($payload['moodAnalysis']) && is_array($payload['moodAnalysis']) ? $payload['moodAnalysis'] : [];
    $currentMood = isset($payload['currentMood']) && $payload['currentMood'] ? sanitizeInput($payload['currentMood']) : null;

    if (empty($messages)) {
        echo json_encode([
            'success' => false,
            'message' => 'No se recibieron mensajes para guardar'
        ]);
        exit;
    }

    $conversation = getActiveConversation($db, $adminId);
    if (!$conversation) {
        $conversation = createPersonalConversation(
            $db,
            $adminId,
            'Chat personal - ' . date('d/m/Y'),
            $currentMood ?? 'neutral'
        );
    }

    foreach ($messages as $message) {
        if (!isset($message['content'])) {
            continue;
        }

        $preparedMessage = [
            'content' => trim($message['content']),
            'isFromUser' => !empty($message['isFromUser']),
            'mood' => $message['mood'] ?? null,
            'sentiment' => isset($message['sentiment']) ? (float) $message['sentiment'] : null,
            'keywords' => isset($message['keywords']) && is_array($message['keywords']) ? $message['keywords'] : []
        ];

        savePersonalChatMessage($db, (int) $conversation['id'], $adminId, $preparedMessage, $moodAnalysis);
    }

    if ($currentMood) {
        $stmt = $db->prepare("UPDATE personal_chat_conversations SET mood = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$currentMood, (int) $conversation['id']]);
    }

    if (!empty($moodAnalysis)) {
        updatePersonalProfile($db, $adminId, $moodAnalysis, $currentMood);

        if (!empty($moodAnalysis['mood'])) {
            logDailyMood($db, $adminId, $moodAnalysis['mood'], $moodAnalysis['sentiment'] ?? null);
        }
    }

    echo json_encode([
        'success' => true,
        'message' => 'Mensajes guardados exitosamente'
    ]);
} catch (Throwable $th) {
    error_log('Error guardando mensajes personales: ' . $th->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'No fue posible guardar los mensajes en este momento'
    ]);
}
