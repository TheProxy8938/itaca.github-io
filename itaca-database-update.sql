-- ============================================
-- SCRIPT DE ACTUALIZACIÓN ITACA DATABASE
-- Fecha: Diciembre 2025
-- Versión: 2.0 - Sistema completo de CRM con Métricas y Chat Personal
-- ============================================
-- IMPORTANTE: Este script es SEGURO de ejecutar múltiples veces
-- Usa IF NOT EXISTS y ALTER TABLE ADD IF NOT EXISTS
-- ============================================

-- ============================================
-- 1. ACTUALIZAR TABLA USERS (Agregar campos nuevos)
-- ============================================

-- Agregar campo username si no existe
ALTER TABLE `users` 
ADD COLUMN IF NOT EXISTS `username` VARCHAR(100) UNIQUE AFTER `email`;

-- ============================================
-- 2. ACTUALIZAR TABLA CLIENTS (Agregar campos del CRM completo)
-- ============================================

ALTER TABLE `clients`
ADD COLUMN IF NOT EXISTS `website` VARCHAR(255) AFTER `email`,
ADD COLUMN IF NOT EXISTS `address` TEXT AFTER `company`,
ADD COLUMN IF NOT EXISTS `city` VARCHAR(100) AFTER `address`,
ADD COLUMN IF NOT EXISTS `priority` VARCHAR(50) DEFAULT 'media' AFTER `status`,
ADD COLUMN IF NOT EXISTS `source` VARCHAR(100) AFTER `priority`,
ADD COLUMN IF NOT EXISTS `monthly_budget` DECIMAL(10,2) DEFAULT 0 AFTER `source`,
ADD COLUMN IF NOT EXISTS `total_revenue` DECIMAL(10,2) DEFAULT 0 AFTER `monthly_budget`,
ADD COLUMN IF NOT EXISTS `assigned_to_id` INT AFTER `total_revenue`,
ADD COLUMN IF NOT EXISTS `next_follow_up` DATETIME AFTER `assigned_to_id`,
ADD COLUMN IF NOT EXISTS `last_contact_at` TIMESTAMP NULL AFTER `next_follow_up`;

-- Agregar índices si no existen
ALTER TABLE `clients`
ADD INDEX IF NOT EXISTS `idx_assigned_to` (`assigned_to_id`),
ADD INDEX IF NOT EXISTS `idx_priority` (`priority`),
ADD INDEX IF NOT EXISTS `idx_next_follow_up` (`next_follow_up`);

-- Agregar foreign key si no existe
ALTER TABLE `clients`
ADD CONSTRAINT `fk_clients_assigned_to` 
FOREIGN KEY IF NOT EXISTS (`assigned_to_id`) 
REFERENCES `users`(`id`) 
ON DELETE SET NULL;

-- ============================================
-- 3. ACTUALIZAR TABLA CAMPAIGNS (Agregar métricas)
-- ============================================

ALTER TABLE `campaigns`
ADD COLUMN IF NOT EXISTS `impressions` INT DEFAULT 0 AFTER `description`,
ADD COLUMN IF NOT EXISTS `clicks` INT DEFAULT 0 AFTER `impressions`,
ADD COLUMN IF NOT EXISTS `conversions` INT DEFAULT 0 AFTER `clicks`,
ADD COLUMN IF NOT EXISTS `spend` DECIMAL(10,2) DEFAULT 0 AFTER `conversions`,
ADD COLUMN IF NOT EXISTS `revenue` DECIMAL(10,2) DEFAULT 0 AFTER `spend`,
ADD COLUMN IF NOT EXISTS `assigned_to_id` INT AFTER `revenue`;

-- Agregar índice y foreign key
ALTER TABLE `campaigns`
ADD INDEX IF NOT EXISTS `idx_assigned_to` (`assigned_to_id`);

ALTER TABLE `campaigns`
ADD CONSTRAINT `fk_campaigns_assigned_to` 
FOREIGN KEY IF NOT EXISTS (`assigned_to_id`) 
REFERENCES `users`(`id`) 
ON DELETE SET NULL;

-- ============================================
-- 4. ACTUALIZAR TABLA TASKS (Agregar campos adicionales)
-- ============================================

ALTER TABLE `tasks`
ADD COLUMN IF NOT EXISTS `campaign_id` INT AFTER `client_id`;

ALTER TABLE `tasks`
ADD INDEX IF NOT EXISTS `idx_campaign_id` (`campaign_id`);

ALTER TABLE `tasks`
ADD CONSTRAINT `fk_tasks_campaign` 
FOREIGN KEY IF NOT EXISTS (`campaign_id`) 
REFERENCES `campaigns`(`id`) 
ON DELETE CASCADE;

-- ============================================
-- 5. CREAR TABLA DE CONVERSACIONES DE CHAT PERSONAL (NUEVA)
-- ============================================

CREATE TABLE IF NOT EXISTS `personal_chat_conversations` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `admin_id` INT NOT NULL,
    `title` VARCHAR(255) DEFAULT 'Nueva conversación',
    `mood` VARCHAR(50) DEFAULT 'neutral',
    `context` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_admin_id` (`admin_id`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. CREAR TABLA DE MENSAJES DE CHAT PERSONAL (NUEVA)
-- ============================================

CREATE TABLE IF NOT EXISTS `personal_chat_messages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `conversation_id` INT NOT NULL,
    `admin_id` INT NOT NULL,
    `content` TEXT NOT NULL,
    `is_from_user` TINYINT(1) DEFAULT 1,
    `mood` VARCHAR(50),
    `sentiment` DECIMAL(3,2),
    `keywords` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`conversation_id`) REFERENCES `personal_chat_conversations`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_conversation` (`conversation_id`),
    INDEX `idx_admin_id` (`admin_id`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. CREAR TABLA DE INTERACCIONES CON CLIENTES (NUEVA)
-- ============================================

CREATE TABLE IF NOT EXISTS `client_interactions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `client_id` INT NOT NULL,
    `admin_id` INT NOT NULL,
    `type` VARCHAR(50) NOT NULL COMMENT 'call, email, meeting, note',
    `subject` VARCHAR(255),
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_client_id` (`client_id`),
    INDEX `idx_admin_id` (`admin_id`),
    INDEX `idx_type` (`type`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. ACTUALIZAR DATOS EXISTENTES
-- ============================================

-- Actualizar usuarios existentes sin username
UPDATE `users` 
SET `username` = SUBSTRING_INDEX(`email`, '@', 1)
WHERE `username` IS NULL OR `username` = '';

-- Agregar Dilan como superadmin si no existe
INSERT INTO `users` (`email`, `username`, `password`, `name`, `role`) 
VALUES ('dilan@itaca-mx.com', 'dilan', '$2y$10$YourHashHere', 'Dilan Alberto González Hernández', 'superadmin')
ON DUPLICATE KEY UPDATE 
    `role` = 'superadmin',
    `name` = 'Dilan Alberto González Hernández';

-- ============================================
-- 9. CREAR VISTAS PARA MÉTRICAS (OPCIONAL)
-- ============================================

-- Vista de clientes activos con ingresos
CREATE OR REPLACE VIEW `v_active_clients_revenue` AS
SELECT 
    c.id,
    c.name,
    c.company,
    c.status,
    c.monthly_budget,
    c.total_revenue,
    u.name as assigned_to_name,
    COUNT(DISTINCT i.id) as interaction_count,
    COUNT(DISTINCT t.id) as task_count
FROM `clients` c
LEFT JOIN `users` u ON c.assigned_to_id = u.id
LEFT JOIN `client_interactions` i ON c.id = i.client_id
LEFT JOIN `tasks` t ON c.id = t.client_id
WHERE c.status = 'active'
GROUP BY c.id;

-- Vista de rendimiento de campañas
CREATE OR REPLACE VIEW `v_campaign_performance` AS
SELECT 
    c.id,
    c.name,
    c.type,
    c.status,
    c.impressions,
    c.clicks,
    c.conversions,
    c.spend,
    c.revenue,
    CASE 
        WHEN c.impressions > 0 THEN ROUND((c.clicks / c.impressions) * 100, 2)
        ELSE 0 
    END as ctr,
    CASE 
        WHEN c.spend > 0 THEN ROUND(c.revenue / c.spend, 2)
        ELSE 0 
    END as roas,
    u.name as assigned_to_name
FROM `campaigns` c
LEFT JOIN `users` u ON c.assigned_to_id = u.id;

-- ============================================
-- 10. VERIFICACIÓN Y LOGS
-- ============================================

-- Mostrar resumen de tablas
SELECT 
    TABLE_NAME as 'Tabla',
    TABLE_ROWS as 'Registros (aprox)',
    ROUND((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024, 2) as 'Tamaño (MB)'
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = DATABASE()
ORDER BY TABLE_NAME;

-- ============================================
-- FIN DEL SCRIPT DE ACTUALIZACIÓN
-- ============================================

-- NOTAS IMPORTANTES:
-- 1. Este script usa IF NOT EXISTS para evitar errores
-- 2. Las foreign keys se agregan solo si no existen
-- 3. Es seguro ejecutarlo múltiples veces
-- 4. Actualiza las contraseñas después de ejecutar
-- 5. Las vistas se recrean automáticamente (OR REPLACE)

-- SIGUIENTE PASO:
-- Ejecuta este script en phpMyAdmin de GoDaddy
-- Sección: Base de datos > itacacom_db > SQL
-- Pega todo el contenido y haz clic en "Continuar"
