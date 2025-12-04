<?php
require_once '../config.php';

if (!isAuthenticated()) {
    header('Location: /admin/login.php');
    exit;
}

$currentPage = isset($_GET['page']) ? $_GET['page'] : 'dashboard';
$userName = $_SESSION['user_name'] ?? 'Admin';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Administración - ITACA</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background-color: #f5f5f5;
            color: #333;
        }
        
        .admin-container {
            display: flex;
            min-height: 100vh;
        }
        
        /* Sidebar */
        .sidebar {
            width: 260px;
            background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
            color: white;
            padding: 0;
            position: fixed;
            height: 100vh;
            overflow-y: auto;
            box-shadow: 4px 0 10px rgba(0,0,0,0.1);
        }
        
        .sidebar-header {
            padding: 1.5rem;
            background: rgba(255,255,255,0.05);
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .sidebar-header h1 {
            font-size: 1.5rem;
            color: #22c55e;
            margin-bottom: 0.5rem;
        }
        
        .sidebar-header p {
            font-size: 0.85rem;
            color: rgba(255,255,255,0.7);
        }
        
        .sidebar-nav {
            padding: 1rem 0;
        }
        
        .nav-section {
            margin-bottom: 1.5rem;
        }
        
        .nav-section-title {
            padding: 0.5rem 1.5rem;
            font-size: 0.75rem;
            font-weight: 600;
            color: rgba(255,255,255,0.5);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .nav-link {
            display: flex;
            align-items: center;
            padding: 0.75rem 1.5rem;
            color: rgba(255,255,255,0.8);
            text-decoration: none;
            transition: all 0.2s;
            border-left: 3px solid transparent;
        }
        
        .nav-link:hover {
            background: rgba(255,255,255,0.05);
            color: white;
            border-left-color: #22c55e;
        }
        
        .nav-link.active {
            background: rgba(34,197,94,0.1);
            color: #22c55e;
            border-left-color: #22c55e;
            font-weight: 600;
        }
        
        .nav-link svg {
            width: 20px;
            height: 20px;
            margin-right: 0.75rem;
        }
        
        .nav-badge {
            margin-left: auto;
            background: #ef4444;
            color: white;
            font-size: 0.7rem;
            padding: 0.15rem 0.5rem;
            border-radius: 10px;
            font-weight: 600;
        }
        
        .sidebar-footer {
            padding: 1rem 1.5rem;
            border-top: 1px solid rgba(255,255,255,0.1);
            margin-top: auto;
        }
        
        .user-info {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            margin-right: 0.75rem;
        }
        
        .user-details {
            flex: 1;
        }
        
        .user-name {
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        .user-role {
            font-size: 0.75rem;
            color: rgba(255,255,255,0.6);
        }
        
        .btn-logout {
            display: block;
            width: 100%;
            padding: 0.6rem;
            background: rgba(239,68,68,0.2);
            color: #ef4444;
            border: 1px solid rgba(239,68,68,0.3);
            border-radius: 6px;
            text-align: center;
            text-decoration: none;
            font-size: 0.85rem;
            font-weight: 600;
            transition: all 0.2s;
        }
        
        .btn-logout:hover {
            background: #ef4444;
            color: white;
        }
        
        /* Main Content */
        .main-content {
            flex: 1;
            margin-left: 260px;
            padding: 2rem;
        }
        
        .page-header {
            margin-bottom: 2rem;
        }
        
        .page-title {
            font-size: 2rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 0.5rem;
        }
        
        .page-subtitle {
            color: #64748b;
            font-size: 1rem;
        }
        
        .content-area {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .sidebar {
                width: 70px;
            }
            
            .sidebar-header h1,
            .sidebar-header p,
            .nav-section-title,
            .nav-link span,
            .user-details,
            .btn-logout span {
                display: none;
            }
            
            .nav-link {
                justify-content: center;
                padding: 0.75rem;
            }
            
            .nav-link svg {
                margin-right: 0;
            }
            
            .main-content {
                margin-left: 70px;
            }
        }
    </style>
</head>
<body>
    <div class="admin-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <h1>ÍTACA</h1>
                <p>Panel de Administración</p>
            </div>
            
            <nav class="sidebar-nav">
                <div class="nav-section">
                    <div class="nav-section-title">Principal</div>
                    <a href="dashboard.php" class="nav-link <?php echo $currentPage === 'dashboard' ? 'active' : ''; ?>">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                        <span>Dashboard</span>
                    </a>
                </div>
                
                <div class="nav-section">
                    <div class="nav-section-title">Gestión</div>
                    <a href="contactos.php" class="nav-link <?php echo $currentPage === 'contactos' ? 'active' : ''; ?>">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        <span>Contactos</span>
                        <span class="nav-badge" id="new-contacts-badge">0</span>
                    </a>
                    
                    <a href="clientes.php" class="nav-link <?php echo $currentPage === 'clientes' ? 'active' : ''; ?>">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                        <span>Clientes</span>
                    </a>
                    
                    <a href="campanas.php" class="nav-link <?php echo $currentPage === 'campanas' ? 'active' : ''; ?>">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
                        </svg>
                        <span>Campañas</span>
                    </a>
                </div>
                
                <div class="nav-section">
                    <div class="nav-section-title">Configuración</div>
                    <a href="usuarios.php" class="nav-link <?php echo $currentPage === 'usuarios' ? 'active' : ''; ?>">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                        <span>Usuarios Admin</span>
                    </a>
                </div>
            </nav>
            
            <div class="sidebar-footer" style="position: absolute; bottom: 0; width: 260px;">
                <div class="user-info">
                    <div class="user-avatar"><?php echo strtoupper(substr($userName, 0, 1)); ?></div>
                    <div class="user-details">
                        <div class="user-name"><?php echo htmlspecialchars($userName); ?></div>
                        <div class="user-role">Administrador</div>
                    </div>
                </div>
                <a href="logout.php" class="btn-logout">
                    <span>Cerrar Sesión</span>
                </a>
            </div>
        </aside>
        
        <!-- Main Content -->
        <main class="main-content">
            <?php
            // Incluir el contenido según la página
            $page = $currentPage . '-content.php';
            if (file_exists($page)) {
                include $page;
            } else {
                include 'dashboard-content.php';
            }
            ?>
        </main>
    </div>
    
    <script>
        // Actualizar badge de contactos nuevos
        fetch('/api/contacts/get.php?status=new')
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('new-contacts-badge').textContent = data.total;
                }
            })
            .catch(e => console.error('Error:', e));
    </script>
</body>
</html>
