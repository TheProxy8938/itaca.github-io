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

$db = getDB();
$admin = getCurrentUser();
$adminId = (int) $admin['id'];

try {
    ensurePersonalChatTables($db);

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            handleGetConversation($db, $adminId);
            break;
        case 'POST':
            handleCreateConversation($db, $adminId);
            break;
        default:
            http_response_code(405);
            echo json_encode([
                'success' => false,
                'message' => 'Método no permitido'
            ]);
    }
} catch (Throwable $th) {
    error_log('Error en conversaciones personales: ' . $th->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor'
    ]);
}

function handleGetConversation(PDO $db, int $adminId): void
{
    $data = fetchConversationWithMessages($db, $adminId);

    $conversation = $data['conversation'];
    $messages = array_map(function ($message) {
        return [
            'id' => (int) $message['id'],
            'content' => $message['content'],
            'isFromUser' => (bool) $message['is_from_user'],
            'timestamp' => $message['created_at'],
            'mood' => $message['mood'],
            'sentiment' => $message['sentiment'],
            'keywords' => $message['keywords']
        ];
    }, $data['messages']);

    echo json_encode([
        'success' => true,
        'conversation' => [
            'id' => (int) $conversation['id'],
            'title' => $conversation['title'],
            'mood' => $conversation['mood'],
            'archived' => (bool) $conversation['archived'],
            'created_at' => $conversation['created_at'],
            'updated_at' => $conversation['updated_at']
        ],
        'messages' => $messages
    ]);
}

function handleCreateConversation(PDO $db, int $adminId): void
{
    $payload = json_decode(file_get_contents('php://input'), true) ?? [];

    $title = isset($payload['title']) && $payload['title']
        ? sanitizeInput($payload['title'])
        : 'Chat personal - ' . date('d/m/Y');

    $mood = isset($payload['mood']) && $payload['mood']
        ? sanitizeInput($payload['mood'])
        : 'neutral';

    $context = isset($payload['context']) && is_array($payload['context'])
        ? $payload['context']
        : null;

    $conversation = createPersonalConversation($db, $adminId, $title, $mood, $context);

    echo json_encode([
        'success' => true,
        'message' => 'Nueva conversación creada',
        'conversation' => [
            'id' => (int) $conversation['id'],
            'title' => $conversation['title'],
            'mood' => $conversation['mood'],
            'archived' => (bool) $conversation['archived'],
            'created_at' => $conversation['created_at'],
            'updated_at' => $conversation['updated_at']
        ]
    ]);
}
