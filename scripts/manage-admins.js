const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function questionHidden(prompt) {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    
    let password = '';
    
    process.stdin.on('data', function(char) {
      char = char + '';
      
      switch(char) {
        case '\n':
        case '\r':
        case '\u0004':
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdout.write('\n');
          resolve(password);
          break;
        case '\u0003':
          process.exit();
          break;
        default:
          password += char;
          process.stdout.write('*');
          break;
      }
    });
  });
}

async function createAdmin() {
  try {
    console.log('\n🔐 === CREAR NUEVO ADMINISTRADOR ===\n');

    const username = await question('Nombre de usuario: ');
    if (!username) {
      console.log('❌ El nombre de usuario es requerido');
      return;
    }

    const email = await question('Email: ');
    if (!email) {
      console.log('❌ El email es requerido');
      return;
    }

    const name = await question('Nombre completo (opcional): ');
    
    const password = await questionHidden('Contraseña: ');
    if (!password) {
      console.log('❌ La contraseña es requerida');
      return;
    }

    console.log('\nRoles disponibles:');
    console.log('1. admin - Acceso básico');
    console.log('2. superadmin - Acceso completo');
    const roleChoice = await question('Selecciona el rol (1-2): ');
    
    const role = roleChoice === '2' ? 'superadmin' : 'admin';

    // Verificar si el usuario o email ya existen
    const existing = await prisma.admin.findFirst({
      where: {
        OR: [
          { username: username },
          { email: email }
        ]
      }
    });

    if (existing) {
      console.log('❌ Ya existe un administrador con ese usuario o email');
      return;
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear el administrador
    const admin = await prisma.admin.create({
      data: {
        username: username,
        email: email,
        password: hashedPassword,
        name: name || username,
        role: role
      }
    });

    console.log('\n✅ Administrador creado exitosamente:');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Usuario: ${admin.username}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Nombre: ${admin.name}`);
    console.log(`   Rol: ${admin.role}`);

  } catch (error) {
    console.error('❌ Error al crear administrador:', error.message);
  }
}

async function listAdmins() {
  try {
    console.log('\n📋 === ADMINISTRADORES EXISTENTES ===\n');
    
    const admins = await prisma.admin.findMany({
      where: { active: true },
      orderBy: { createdAt: 'asc' }
    });

    if (admins.length === 0) {
      console.log('No hay administradores registrados');
      return;
    }

    admins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.name}`);
      console.log(`   Usuario: ${admin.username}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Rol: ${admin.role}`);
      console.log(`   Creado: ${admin.createdAt.toLocaleDateString()}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error al listar administradores:', error.message);
  }
}

async function deactivateAdmin() {
  try {
    console.log('\n⚠️  === DESACTIVAR ADMINISTRADOR ===\n');
    
    await listAdmins();
    
    const username = await question('Usuario a desactivar: ');
    if (!username) {
      console.log('❌ Operación cancelada');
      return;
    }

    const admin = await prisma.admin.findUnique({
      where: { username: username }
    });

    if (!admin) {
      console.log('❌ No se encontró el administrador');
      return;
    }

    if (!admin.active) {
      console.log('❌ El administrador ya está desactivado');
      return;
    }

    const confirm = await question(`¿Desactivar a ${admin.name} (${admin.username})? (s/N): `);
    
    if (confirm.toLowerCase() !== 's' && confirm.toLowerCase() !== 'si') {
      console.log('❌ Operación cancelada');
      return;
    }

    await prisma.admin.update({
      where: { id: admin.id },
      data: { active: false }
    });

    // Eliminar todas las sesiones del usuario
    await prisma.session.deleteMany({
      where: { adminId: admin.id }
    });

    console.log(`✅ Administrador ${admin.username} desactivado`);

  } catch (error) {
    console.error('❌ Error al desactivar administrador:', error.message);
  }
}

async function main() {
  console.log('🎛️  GESTOR DE ADMINISTRADORES - ÍTACA');
  console.log('===================================');
  
  while (true) {
    console.log('\nOpciones:');
    console.log('1. Crear administrador');
    console.log('2. Listar administradores');
    console.log('3. Desactivar administrador');
    console.log('4. Salir');
    
    const choice = await question('\nSelecciona una opción (1-4): ');
    
    switch (choice) {
      case '1':
        await createAdmin();
        break;
      case '2':
        await listAdmins();
        break;
      case '3':
        await deactivateAdmin();
        break;
      case '4':
        console.log('👋 ¡Hasta luego!');
        process.exit(0);
        break;
      default:
        console.log('❌ Opción inválida');
        break;
    }
  }
}

// Manejar cierre del programa
process.on('SIGINT', () => {
  console.log('\n👋 ¡Hasta luego!');
  process.exit(0);
});

main().catch(console.error).finally(() => {
  rl.close();
  prisma.$disconnect();
});