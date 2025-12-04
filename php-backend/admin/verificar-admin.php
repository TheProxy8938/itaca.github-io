<?php
// Script para verificar y crear/actualizar usuario administrador

require_once '../config.php';

echo "<!DOCTYPE html>";
echo "<html><head><meta charset='UTF-8'><title>Verificar Admin</title>";
echo "<style>body{font-family:Arial;max-width:800px;margin:50px auto;padding:20px;background:#f5f5f5;}";
echo ".box{background:white;padding:20px;border-radius:8px;margin:10px 0;box-shadow:0 2px 4px rgba(0,0,0,0.1);}";
echo ".success{color:#16a34a;font-weight:bold;}.error{color:#dc2626;font-weight:bold;}";
echo "pre{background:#f9f9f9;padding:10px;border-radius:4px;overflow:auto;}</style></head><body>";

echo "<h1>🔧 Verificación de Usuario Administrador</h1>";

try {
    $db = getDB();
    
    echo "<div class='box'><h2>📊 Estado de la Base de Datos</h2>";
    
    // Verificar si la tabla users existe
    $tables = $db->query("SHOW TABLES LIKE 'users'")->fetchAll();
    if (count($tables) > 0) {
        echo "<p class='success'>✅ Tabla 'users' existe</p>";
    } else {
        echo "<p class='error'>❌ Tabla 'users' NO existe</p>";
        echo "<p>Necesitas importar el archivo itaca-database.sql en phpMyAdmin</p>";
        echo "</div></body></html>";
        exit;
    }
    
    // Verificar usuarios existentes
    echo "<h3>Usuarios en la base de datos:</h3>";
    $users = $db->query("SELECT id, email, name, role, created_at FROM users")->fetchAll();
    
    if (count($users) > 0) {
        echo "<table border='1' cellpadding='10' style='border-collapse:collapse;width:100%;'>";
        echo "<tr style='background:#f0f0f0;'><th>ID</th><th>Email</th><th>Nombre</th><th>Role</th><th>Creado</th></tr>";
        foreach ($users as $user) {
            echo "<tr>";
            echo "<td>{$user['id']}</td>";
            echo "<td>{$user['email']}</td>";
            echo "<td>{$user['name']}</td>";
            echo "<td>{$user['role']}</td>";
            echo "<td>{$user['created_at']}</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<p class='error'>❌ No hay usuarios en la base de datos</p>";
    }
    
    echo "</div>";
    
    // Crear/Actualizar usuario admin
    echo "<div class='box'><h2>🔄 Crear/Actualizar Usuario Admin</h2>";
    
    $email = 'ecabello@itaca-mx.com';
    $password = 'admin123';
    $name = 'Emmanuel Cabello';
    $role = 'admin';
    
    // Generar hash de contraseña
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);
    
    // Verificar si el usuario ya existe
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $existingUser = $stmt->fetch();
    
    if ($existingUser) {
        // Actualizar usuario existente
        $stmt = $db->prepare("UPDATE users SET password = ?, name = ?, role = ? WHERE email = ?");
        $stmt->execute([$passwordHash, $name, $role, $email]);
        echo "<p class='success'>✅ Usuario actualizado exitosamente</p>";
    } else {
        // Crear nuevo usuario
        $stmt = $db->prepare("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)");
        $stmt->execute([$email, $passwordHash, $name, $role]);
        echo "<p class='success'>✅ Usuario creado exitosamente</p>";
    }
    
    echo "<h3>📋 Credenciales de acceso:</h3>";
    echo "<pre>";
    echo "URL: http://itaca-mx.com/admin/login.php\n";
    echo "Email: $email\n";
    echo "Contraseña: $password\n";
    echo "</pre>";
    
    echo "<h3>🔍 Verificación de contraseña:</h3>";
    // Verificar que la contraseña funciona
    if (password_verify($password, $passwordHash)) {
        echo "<p class='success'>✅ La contraseña se puede verificar correctamente</p>";
    } else {
        echo "<p class='error'>❌ Error al verificar la contraseña</p>";
    }
    
    echo "<h3>🧪 Hash generado:</h3>";
    echo "<pre>$passwordHash</pre>";
    
    echo "</div>";
    
    // Probar login
    echo "<div class='box'><h2>🧪 Prueba de Login</h2>";
    $stmt = $db->prepare("SELECT id, email, password, name, role FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if ($user) {
        echo "<p class='success'>✅ Usuario encontrado en la base de datos</p>";
        echo "<pre>";
        echo "ID: {$user['id']}\n";
        echo "Email: {$user['email']}\n";
        echo "Nombre: {$user['name']}\n";
        echo "Role: {$user['role']}\n";
        echo "</pre>";
        
        if (password_verify($password, $user['password'])) {
            echo "<p class='success'>✅✅✅ LOGIN FUNCIONARÍA CORRECTAMENTE ✅✅✅</p>";
            echo "<p>Puedes acceder con:<br>Email: <strong>$email</strong><br>Contraseña: <strong>$password</strong></p>";
        } else {
            echo "<p class='error'>❌ La contraseña NO coincide</p>";
        }
    } else {
        echo "<p class='error'>❌ Usuario no encontrado</p>";
    }
    
    echo "</div>";
    
    echo "<div class='box'>";
    echo "<h2>✅ Siguiente Paso</h2>";
    echo "<p><a href='/admin/login.php' style='background:#22c55e;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;display:inline-block;'>Ir al Login del Admin</a></p>";
    echo "</div>";
    
} catch (Exception $e) {
    echo "<div class='box'>";
    echo "<p class='error'>❌ Error: " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "</div>";
}

echo "</body></html>";
?>
