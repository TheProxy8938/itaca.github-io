-- ============================================
-- BASE DE DATOS COMPLETA ITACA COMUNICACIÓN
-- Compatible con MySQL 5.7+ / MariaDB 10.3+
-- Versión: 2.0 - Diciembre 2025
-- Incluye: CRM completo, Métricas, Chat Personal
-- ============================================

-- Tabla de usuarios administradores
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `username` VARCHAR(100) UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'admin' COMMENT 'admin, superadmin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`),
  INDEX `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de contactos/leads desde el formulario
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50),
  `company` VARCHAR(255),
  `message` TEXT,
  `status` VARCHAR(50) DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de clientes CRM (ampliada para métricas)
CREATE TABLE IF NOT EXISTS `clients` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50),
  `company` VARCHAR(255),
  `website` VARCHAR(255),
  `address` TEXT,
  `city` VARCHAR(100),
  `industry` VARCHAR(100),
  `status` VARCHAR(50) DEFAULT 'prospecto' COMMENT 'prospecto, negociacion, activo, inactivo, perdido',
  `priority` VARCHAR(50) DEFAULT 'media' COMMENT 'alta, media, baja',
  `source` VARCHAR(100) COMMENT 'web, referido, cold-call, etc',
  `monthly_budget` DECIMAL(10,2) DEFAULT 0,
  `total_revenue` DECIMAL(10,2) DEFAULT 0,
  `assigned_to_id` INT,
  `next_follow_up` DATETIME,
  `last_contact_at` TIMESTAMP NULL,
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`),
  INDEX `idx_status` (`status`),
  INDEX `idx_priority` (`priority`),
  INDEX `idx_assigned_to` (`assigned_to_id`),
  INDEX `idx_next_follow_up` (`next_follow_up`),
  FOREIGN KEY (`assigned_to_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de tareas CRM
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `client_id` INT,
  `campaign_id` INT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `status` VARCHAR(50) DEFAULT 'pendiente' COMMENT 'pendiente, en_progreso, completada, cancelada',
  `priority` VARCHAR(50) DEFAULT 'media' COMMENT 'alta, media, baja',
  `due_date` DATE,
  `assigned_to_id` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_client_id` (`client_id`),
  INDEX `idx_campaign_id` (`campaign_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_due_date` (`due_date`),
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`assigned_to_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
no tiene 
-- Tabla de campañas de marketing (con métricas)
CREATE TABLE IF NOT EXISTS `campaigns` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `type` VARCHAR(100) COMMENT 'social_media, google_ads, email, seo, etc',
  `status` VARCHAR(50) DEFAULT 'planificacion' COMMENT 'planificacion, activa, pausada, finalizada, revision',
  `start_date` DATE,
  `end_date` DATE,
  `budget` DECIMAL(10, 2),
  `description` TEXT,
  `impressions` INT DEFAULT 0,
  `clicks` INT DEFAULT 0,
  `conversions` INT DEFAULT 0,
  `spend` DECIMAL(10,2) DEFAULT 0,
  `revenue` DECIMAL(10,2) DEFAULT 0,
  `assigned_to_id` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_start_date` (`start_date`),
  INDEX `idx_assigned_to` (`assigned_to_id`),
  FOREIGN KEY (`assigned_to_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar usuario administrador por defecto
-- Password: admin123 (debes cambiarla después)
INSERT INTO `users` (`email`, `username`, `password`, `name`, `role`) VALUES
('ecabello@itaca-mx.com', 'ecabello', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Emmanuel Cabello', 'superadmin'),
('dilan@itaca-mx.com', 'dilan', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dilan Alberto González Hernández', 'superadmin')
ON DUPLICATE KEY UPDATE `email`=`email`;

-- ============================================
-- NUEVAS TABLAS PARA CHAT PERSONAL DE DILAN
-- ============================================

-- Tabla de conversaciones de chat personal
CREATE TABLE IF NOT EXISTS `personal_chat_conversations` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `admin_id` INT NOT NULL,
    `title` VARCHAR(255) DEFAULT 'Nueva conversación',
    `mood` VARCHAR(50) DEFAULT 'neutral' COMMENT 'happy, sad, stressed, motivated, neutral',
    `context` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_admin_id` (`admin_id`),
    INDEX `idx_created_at` (`created_at`),
    INDEX `idx_mood` (`mood`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de mensajes de chat personal
CREATE TABLE IF NOT EXISTS `personal_chat_messages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `conversation_id` INT NOT NULL,
    `admin_id` INT NOT NULL,
    `content` TEXT NOT NULL,
    `is_from_user` TINYINT(1) DEFAULT 1 COMMENT '1=usuario, 0=IA',
    `mood` VARCHAR(50),
    `sentiment` DECIMAL(3,2) COMMENT 'De -1.0 (negativo) a 1.0 (positivo)',
    `keywords` TEXT COMMENT 'Palabras clave detectadas, separadas por comas',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`conversation_id`) REFERENCES `personal_chat_conversations`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_conversation` (`conversation_id`),
    INDEX `idx_admin_id` (`admin_id`),
    INDEX `idx_created_at` (`created_at`),
    INDEX `idx_mood` (`mood`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA DE INTERACCIONES CON CLIENTES
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

-- Datos de ejemplo para clientes (opcional)
INSERT INTO `clients` (`name`, `email`, `phone`, `company`, `industry`, `status`) VALUES
('Empresa Demo 1', 'demo1@ejemplo.com', '+52 442 123 4567', 'Demo Corp', 'Tecnología', 'activo'),
('Empresa Demo 2', 'demo2@ejemplo.com', '+52 442 765 4321', 'Ejemplo SA', 'Retail', 'activo')
ON DUPLICATE KEY UPDATE `email`=`email`;

-- ============================================
-- VISTAS SQL PARA MÉTRICAS Y REPORTES
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
    c.created_at,
    u.name as assigned_to_name,
    COUNT(DISTINCT t.id) as total_tasks,
    COUNT(DISTINCT ci.id) as total_interactions
FROM `clients` c
LEFT JOIN `users` u ON c.assigned_to_id = u.id
LEFT JOIN `tasks` t ON c.id = t.client_id
LEFT JOIN `client_interactions` ci ON c.id = ci.client_id
WHERE c.status IN ('activo', 'negociacion')
GROUP BY c.id;

-- Vista de rendimiento de campañas
CREATE OR REPLACE VIEW `v_campaign_performance` AS
SELECT 
    camp.id,
    camp.name,
    camp.type,
    camp.status,
    camp.start_date,
    camp.end_date,
    camp.budget,
    camp.spend,
    camp.revenue,
    camp.impressions,
    camp.clicks,
    camp.conversions,
    CASE 
        WHEN camp.impressions > 0 THEN ROUND((camp.clicks / camp.impressions) * 100, 2)
        ELSE 0 
    END as ctr_percentage,
    CASE 
        WHEN camp.clicks > 0 THEN ROUND((camp.conversions / camp.clicks) * 100, 2)
        ELSE 0 
    END as conversion_rate,
    CASE 
        WHEN camp.spend > 0 THEN ROUND((camp.revenue - camp.spend) / camp.spend * 100, 2)
        ELSE 0 
    END as roi_percentage,
    u.name as assigned_to_name,
    COUNT(DISTINCT t.id) as total_tasks
FROM `campaigns` camp
LEFT JOIN `users` u ON camp.assigned_to_id = u.id
LEFT JOIN `tasks` t ON camp.id = t.campaign_id
GROUP BY camp.id;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
