<?php
require_once '../config.php';

// Destruir sesión
session_unset();
session_destroy();

// Eliminar cookie
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 3600, '/');
}

// Redirigir al login
header('Location: /admin/login.php');
exit;
