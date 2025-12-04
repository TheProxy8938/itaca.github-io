<?php
if (!isset($currentPage)) {
    $currentPage = 'dashboard';
}
require_once '../config.php';

if (!isAuthenticated()) {
    header('Location: /admin/login.php');
    exit;
}

requireAuth();
$currentUser = getCurrentUser();
$userName = $currentUser['name'] ?? 'Admin';
$userRole = $currentUser['role'] ?? 'admin';
$roleLabel = $userRole === 'superadmin' ? 'Super Administrador' : 'Administrador';
$canAccessUsers = $userRole === 'superadmin';
$isDilan = isDilanSuperAdmin();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Administración - ITACA</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
    <link rel="stylesheet" href="admin-styles.css?v=20251203">
</head>
<body>
    <div class="admin-container">
        <aside class="sidebar">
            <div class="sidebar-header">
                <h1>ÍTACA</h1>
                <p>Panel de Administración</p>
            </div>
            <nav class="sidebar-nav">
                <div class="nav-section">
                    <a href="dashboard.php" class="nav-link <?php echo $currentPage === 'dashboard' ? 'active' : ''; ?>">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        <span>Dashboard</span>
                    </a>
                    <a href="contactos.php" class="nav-link <?php echo $currentPage === 'contactos' ? 'active' : ''; ?>">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        <span>Contactos</span>
                    </a>
                    <a href="clientes.php" class="nav-link <?php echo $currentPage === 'clientes' ? 'active' : ''; ?>">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        <span>Clientes</span>
                    </a>
                    <a href="campanas.php" class="nav-link <?php echo $currentPage === 'campanas' ? 'active' : ''; ?>">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
                        <span>Campañas</span>
                    </a>
                    <a href="metricas.php" class="nav-link <?php echo $currentPage === 'metricas' ? 'active' : ''; ?>">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                        <span>Métricas</span>
                    </a>
                    <?php if ($canAccessUsers): ?>
                    <a href="usuarios.php" class="nav-link <?php echo $currentPage === 'usuarios' ? 'active' : ''; ?>">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        <span>Usuarios</span>
                    </a>
                    <?php endif; ?>
                    <?php if ($isDilan): ?>
                    <a href="chat-dilan.php" class="nav-link <?php echo $currentPage === 'chat-dilan' ? 'active' : ''; ?>">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H7l-4 4V10a2 2 0 012-2h2"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 3h6v6"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2 2 2m-2-2v6"></path></svg>
                        <span>Chat Dilan</span>
                    </a>
                    <?php endif; ?>
                </div>
            </nav>
            <div class="sidebar-footer">
                <div class="user-info">
                    <div class="user-avatar"><?php echo strtoupper(substr($userName, 0, 1)); ?></div>
                    <div class="user-details">
                        <div class="user-name"><?php echo htmlspecialchars($userName); ?></div>
                        <div class="user-role"><?php echo htmlspecialchars($roleLabel); ?></div>
                    </div>
                </div>
                <a href="logout.php" class="btn-logout">Cerrar Sesión</a>
            </div>
        </aside>
        <main class="main-content">
