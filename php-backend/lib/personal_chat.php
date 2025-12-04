<?php

require_once __DIR__ . '/../config.php';

function ensurePersonalChatTables(PDO $db): void
{
    static $initialized = false;

    if ($initialized) {
        return;
    }

    $db->exec(
        "CREATE TABLE IF NOT EXISTS personal_chat_conversations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            admin_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            mood VARCHAR(50) DEFAULT 'neutral',
            context TEXT NULL,
            archived TINYINT(1) DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_admin_archived (admin_id, archived)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    $db->exec(
        "CREATE TABLE IF NOT EXISTS personal_chat_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            conversation_id INT NOT NULL,
            admin_id INT NOT NULL,
            content LONGTEXT NOT NULL,
            is_from_user TINYINT(1) NOT NULL DEFAULT 0,
            mood VARCHAR(50) NULL,
            sentiment DECIMAL(5,2) NULL,
            keywords TEXT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_chat_conversation
                FOREIGN KEY (conversation_id) REFERENCES personal_chat_conversations(id)
                ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    $db->exec(
        "CREATE TABLE IF NOT EXISTS personal_profiles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            admin_id INT NOT NULL UNIQUE,
            communication_style VARCHAR(100) DEFAULT 'empático',
            preferred_tone VARCHAR(100) DEFAULT 'cariñoso',
            interests TEXT NULL,
            goals TEXT NULL,
            active_hours TEXT NULL,
            stress_indicators TEXT NULL,
            motivation_triggers TEXT NULL,
            average_mood DECIMAL(5,2) DEFAULT 5,
            last_mood_update DATETIME NULL,
            total_conversations INT DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    $db->exec(
        "CREATE TABLE IF NOT EXISTS personal_daily_mood_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            admin_id INT NOT NULL,
            mood VARCHAR(50) NOT NULL,
            score INT NOT NULL DEFAULT 5,
            notes TEXT NULL,
            factors TEXT NULL,
            date DATE NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_admin_date (admin_id, date)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    $initialized = true;
}

function getActiveConversation(PDO $db, int $adminId): ?array
{
    ensurePersonalChatTables($db);

    $stmt = $db->prepare(
        "SELECT * FROM personal_chat_conversations
         WHERE admin_id = ? AND archived = 0
         ORDER BY created_at DESC
         LIMIT 1"
    );
    $stmt->execute([$adminId]);
    $conversation = $stmt->fetch(PDO::FETCH_ASSOC);

    return $conversation ?: null;
}

function createPersonalConversation(PDO $db, int $adminId, string $title, string $mood = 'neutral', ?array $context = null): array
{
    ensurePersonalChatTables($db);

    $stmt = $db->prepare(
        "INSERT INTO personal_chat_conversations (admin_id, title, mood, context)
         VALUES (?, ?, ?, ?)"
    );
    $stmt->execute([$adminId, $title, $mood, $context ? json_encode($context) : null]);

    $conversationId = (int) $db->lastInsertId();

    $stmt = $db->prepare("SELECT * FROM personal_chat_conversations WHERE id = ?");
    $stmt->execute([$conversationId]);

    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function fetchConversationWithMessages(PDO $db, int $adminId): array
{
    $conversation = getActiveConversation($db, $adminId);

    if (!$conversation) {
        $conversation = createPersonalConversation(
            $db,
            $adminId,
            'Chat Personal - ' . date('d/m/Y'),
            'neutral'
        );
    }

    $stmt = $db->prepare(
        "SELECT id, conversation_id, admin_id, content, is_from_user, mood, sentiment, keywords, created_at
         FROM personal_chat_messages
         WHERE conversation_id = ?
         ORDER BY created_at ASC"
    );
    $stmt->execute([$conversation['id']]);

    $messages = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $row['is_from_user'] = (bool) $row['is_from_user'];
        $row['sentiment'] = $row['sentiment'] !== null ? (float) $row['sentiment'] : null;
        $row['keywords'] = $row['keywords'] ? json_decode($row['keywords'], true) : [];
        $messages[] = $row;
    }

    return [
        'conversation' => $conversation,
        'messages' => $messages
    ];
}

function savePersonalChatMessage(PDO $db, int $conversationId, int $adminId, array $message, ?array $moodAnalysis = null): void
{
    $stmt = $db->prepare(
        "INSERT INTO personal_chat_messages (conversation_id, admin_id, content, is_from_user, mood, sentiment, keywords)
         VALUES (?, ?, ?, ?, ?, ?, ?)"
    );

    $stmt->execute([
        $conversationId,
        $adminId,
        $message['content'],
        !empty($message['isFromUser']) ? 1 : 0,
        $message['mood'] ?? ($moodAnalysis['mood'] ?? null),
        isset($message['sentiment']) ? $message['sentiment'] : ($moodAnalysis['sentiment'] ?? null),
        isset($message['keywords']) ? json_encode($message['keywords']) : ($moodAnalysis['keywords'] ?? null ? json_encode($moodAnalysis['keywords']) : null)
    ]);
}

function updatePersonalProfile(PDO $db, int $adminId, array $moodAnalysis, ?string $currentMood = null): void
{
    ensurePersonalChatTables($db);

    $stmt = $db->prepare("SELECT * FROM personal_profiles WHERE admin_id = ?");
    $stmt->execute([$adminId]);
    $profile = $stmt->fetch(PDO::FETCH_ASSOC);

    $keywords = $moodAnalysis['keywords'] ?? [];
    $timeOfDay = getChatTimeOfDay();
    $sentimentScore = isset($moodAnalysis['sentiment']) ? max(-1, min(1, (float) $moodAnalysis['sentiment'])) : null;

    if ($profile) {
        $existingStress = $profile['stress_indicators'] ? json_decode($profile['stress_indicators'], true) : [];
        $existingHours = $profile['active_hours'] ? json_decode($profile['active_hours'], true) : [];

        $mergedStress = array_unique(array_merge($existingStress ?? [], $keywords));
        $mergedHours = array_unique(array_merge($existingHours ?? [], [$timeOfDay]));

        $newAverageMood = $profile['average_mood'];
        if ($sentimentScore !== null) {
            $scaledSentiment = ($sentimentScore + 1) * 5; // 0-10
            $newAverageMood = $profile['average_mood'] > 0
                ? round(($profile['average_mood'] + $scaledSentiment) / 2, 2)
                : $scaledSentiment;
        }

        $stmt = $db->prepare(
            "UPDATE personal_profiles
             SET stress_indicators = ?,
                 active_hours = ?,
                 average_mood = ?,
                 last_mood_update = NOW(),
                 total_conversations = total_conversations + 1,
                 preferred_tone = COALESCE(?, preferred_tone)
             WHERE admin_id = ?"
        );

        $stmt->execute([
            json_encode($mergedStress),
            json_encode($mergedHours),
            $newAverageMood,
            $currentMood,
            $adminId
        ]);
    } else {
        $stmt = $db->prepare(
            "INSERT INTO personal_profiles (
                admin_id,
                communication_style,
                preferred_tone,
                interests,
                goals,
                active_hours,
                stress_indicators,
                motivation_triggers,
                average_mood,
                last_mood_update,
                total_conversations
             ) VALUES (?, 'empático', ?, NULL, NULL, ?, ?, NULL, ?, NOW(), 1)"
        );

        $avgMood = $sentimentScore !== null ? ($sentimentScore + 1) * 5 : 5;

        $stmt->execute([
            $adminId,
            $currentMood ?? 'cariñoso',
            json_encode([$timeOfDay]),
            json_encode($keywords),
            $avgMood
        ]);
    }
}

function logDailyMood(PDO $db, int $adminId, string $mood, ?float $sentiment): void
{
    ensurePersonalChatTables($db);

    $date = date('Y-m-d');
    $score = $sentiment !== null ? (int) round(($sentiment + 1) * 5) : 5;

    $stmt = $db->prepare(
        "INSERT INTO personal_daily_mood_logs (admin_id, mood, score, notes, factors, date)
         VALUES (?, ?, ?, 'Registrado desde chat personal', ?, ?)
         ON DUPLICATE KEY UPDATE
            mood = VALUES(mood),
            score = VALUES(score),
            factors = VALUES(factors),
            notes = 'Actualizado desde chat personal',
            created_at = created_at"
    );

    $stmt->execute([
        $adminId,
        $mood,
        $score,
        json_encode(['chat_personal']),
        $date
    ]);
}

function getChatTimeOfDay(): string
{
    $hour = (int) date('G');
    if ($hour >= 5 && $hour < 12) {
        return 'morning';
    }
    if ($hour >= 12 && $hour < 18) {
        return 'afternoon';
    }
    if ($hour >= 18 && $hour < 22) {
        return 'evening';
    }
    return 'night';
}
