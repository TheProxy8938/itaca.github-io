const { PrismaClient } = require('@prisma/client');
const sqlite3 = require('sqlite3');
const bcrypt = require('bcryptjs');

// Cliente para MariaDB (nueva base de datos)
const prismaMySQL = new PrismaClient();

async function migrateSQLiteData() {
  console.log('🚀 Iniciando migración de SQLite a MariaDB...\n');

  try {
    // Verificar si existe la base de datos SQLite
    const fs = require('fs');
    const sqlitePath = './prisma/database.db';
    
    if (!fs.existsSync(sqlitePath)) {
      console.log('ℹ️  No se encontró base de datos SQLite. Creando datos por defecto...');
      await createDefaultData();
      return;
    }

    console.log('📂 Base de datos SQLite encontrada, migrando datos...\n');

    // Conectar a SQLite
    const db = new sqlite3.Database(sqlitePath);

    // Migrar administradores
    await migrateAdmins(db);
    
    // Migrar contactos
    await migrateContacts(db);

    // Migrar configuraciones
    await migrateSettings(db);

    // Cerrar conexión SQLite
    db.close();

    console.log('\n✅ Migración completada exitosamente!');
    console.log('📋 Resumen:');
    
    const adminCount = await prismaMySQL.admin.count();
    const contactCount = await prismaMySQL.contact.count();
    
    console.log(`   - Administradores: ${adminCount}`);
    console.log(`   - Contactos: ${contactCount}`);

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    await prismaMySQL.$disconnect();
  }
}

async function migrateAdmins(db) {
  return new Promise((resolve, reject) => {
    console.log('👤 Migrando administradores...');
    
    db.all("SELECT * FROM admins", async (err, rows) => {
      if (err) {
        console.log('ℹ️  Tabla admins no encontrada, creando administrador por defecto');
        await createDefaultAdmin();
        resolve();
        return;
      }

      try {
        for (const row of rows) {
          const existing = await prismaMySQL.admin.findUnique({
            where: { username: row.username }
          });

          if (!existing) {
            await prismaMySQL.admin.create({
              data: {
                username: row.username,
                email: row.email,
                password: row.password, // Ya está hasheado
                name: row.name || row.username,
                role: row.role || 'admin',
                active: row.active !== 0,
                createdAt: new Date(row.createdAt),
                updatedAt: new Date(row.updatedAt || row.createdAt)
              }
            });
            console.log(`   ✓ Admin migrado: ${row.username}`);
          } else {
            console.log(`   - Admin ya existe: ${row.username}`);
          }
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function migrateContacts(db) {
  return new Promise((resolve, reject) => {
    console.log('📞 Migrando contactos...');
    
    db.all("SELECT * FROM contacts", async (err, rows) => {
      if (err) {
        console.log('ℹ️  Tabla contacts no encontrada, continuando...');
        resolve();
        return;
      }

      try {
        for (const row of rows) {
          await prismaMySQL.contact.create({
            data: {
              name: row.name,
              email: row.email,
              company: row.company || '',
              phone: row.phone || '',
              service: row.service,
              message: row.message,
              status: row.status || 'new',
              createdAt: new Date(row.createdAt),
              updatedAt: new Date(row.updatedAt || row.createdAt)
            }
          });
        }
        console.log(`   ✓ ${rows.length} contactos migrados`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function migrateSettings(db) {
  return new Promise((resolve, reject) => {
    console.log('⚙️  Migrando configuraciones...');
    
    db.all("SELECT * FROM settings", async (err, rows) => {
      if (err) {
        console.log('ℹ️  Tabla settings no encontrada, continuando...');
        resolve();
        return;
      }

      try {
        for (const row of rows) {
          await prismaMySQL.setting.upsert({
            where: { id: row.id },
            update: { value: row.value },
            create: {
              id: row.id,
              value: row.value
            }
          });
        }
        console.log(`   ✓ ${rows.length} configuraciones migradas`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function createDefaultData() {
  await createDefaultAdmin();
  console.log('✅ Datos por defecto creados');
}

async function createDefaultAdmin() {
  const existingAdmin = await prismaMySQL.admin.findFirst();
  
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await prismaMySQL.admin.create({
      data: {
        username: 'admin',
        email: 'admin@itacacomunicacion.com',
        password: hashedPassword,
        name: 'Administrador Principal',
        role: 'superadmin'
      }
    });
    
    console.log('✅ Administrador por defecto creado:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
  }
}

// Ejecutar migración
migrateSQLiteData();