/**
 * Script para crear todos los usuarios necesarios en Supabase
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAllUsers() {
  console.log('🎯 === CREANDO TODOS LOS USUARIOS ===\n');

  try {
    // ========================================================================
    // 1. CREAR ADMIN POR DEFECTO
    // ========================================================================
    console.log('👤 Creando usuario admin...');
    
    const adminExists = await prisma.admin.findFirst({
      where: { username: 'admin' }
    });

    if (adminExists) {
      console.log('⚠️  Usuario admin ya existe');
    } else {
      const adminPassword = await bcrypt.hash('admin123', 12);
      
      const admin = await prisma.admin.create({
        data: {
          username: 'admin',
          email: 'admin@itacacomunicacion.com',
          password: adminPassword,
          name: 'Administrador',
          role: 'admin',
          department: 'administración',
          active: true,
          notifications: {
            email: true,
            push: true
          }
        }
      });

      console.log('✅ Usuario admin creado:');
      console.log('   Username: admin');
      console.log('   Email: admin@itacacomunicacion.com');
      console.log('   Password: admin123');
      console.log('   Role:', admin.role);
    }

    // ========================================================================
    // 2. CREAR DILAN HERNANDEZ
    // ========================================================================
    console.log('\n👤 Creando usuario Dilan Hernandez...');
    
    const dilanExists = await prisma.admin.findFirst({
      where: {
        OR: [
          { username: 'Dilan Hernandez' },
          { email: 'proxemodelan5@gmail.com' }
        ]
      }
    });

    if (dilanExists) {
      console.log('⚠️  Usuario Dilan Hernandez ya existe');
    } else {
      const dilanPassword = await bcrypt.hash('Proxy-8938', 12);
      
      const dilan = await prisma.admin.create({
        data: {
          username: 'Dilan Hernandez',
          email: 'proxemodelan5@gmail.com',
          password: dilanPassword,
          name: 'Dilan Hernandez',
          role: 'superadmin',
          department: 'dirección',
          active: true,
          phone: '+52 442 XXX XXXX',
          notifications: {
            email: true,
            push: true,
            personalChat: true,
            motivationalReminders: true
          }
        }
      });

      console.log('✅ Usuario Dilan Hernandez creado:');
      console.log('   Username: Dilan Hernandez');
      console.log('   Email: proxemodelan5@gmail.com');
      console.log('   Password: Proxy-8938');
      console.log('   Role:', dilan.role);
      console.log('   Department:', dilan.department);
    }

    console.log('\n✨ === TODOS LOS USUARIOS CREADOS EXITOSAMENTE ===\n');
    
    console.log('🔐 CREDENCIALES DE ACCESO:\n');
    console.log('ADMIN:');
    console.log('   Usuario: admin');
    console.log('   Password: admin123');
    console.log('   URL: http://localhost:3000/login\n');
    
    console.log('DILAN HERNANDEZ:');
    console.log('   Usuario: proxemodelan5@gmail.com');
    console.log('   Password: Proxy-8938');
    console.log('   Chat Personal: http://localhost:3000/personal/chat\n');

  } catch (error) {
    console.error('❌ Error creando usuarios:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createAllUsers()
  .catch((error) => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
