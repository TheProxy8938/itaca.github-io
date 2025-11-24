const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🚀 Inicializando base de datos...');
    
    // Verificar si ya existe un administrador
    const existingAdmin = await prisma.admin.findFirst();
    
    if (!existingAdmin) {
      console.log('👤 Creando administrador por defecto...');
      
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash('admin123', saltRounds);
      
      const admin = await prisma.admin.create({
        data: {
          username: 'admin',
          email: 'admin@itacacomunicacion.com',
          password: hashedPassword,
          name: 'Administrador Principal',
          role: 'superadmin'
        }
      });
      
      console.log('✅ Administrador creado:');
      console.log('   Username: admin');
      console.log('   Email: admin@itacacomunicacion.com');
      console.log('   Password: admin123');
      console.log('   Role: superadmin');
    } else {
      console.log('👤 Ya existe un administrador en la base de datos');
      console.log('   Username:', existingAdmin.username);
      console.log('   Email:', existingAdmin.email);
    }
    
    console.log('🎉 Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();