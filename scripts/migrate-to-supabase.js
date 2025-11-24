const { PrismaClient } = require('@prisma/client');
const sqlite3 = require('sqlite3');
const bcrypt = require('bcryptjs');

// Cliente para PostgreSQL (Supabase)
const prismaPostgres = new PrismaClient();

async function migrateToSupabase() {
  console.log('🚀 Migrando datos de SQLite a Supabase PostgreSQL...\n');

  try {
    // Verificar si existe la base de datos SQLite
    const fs = require('fs');
    const sqlitePath = './prisma/database.db';
    
    if (!fs.existsSync(sqlitePath)) {
      console.log('ℹ️  No se encontró base de datos SQLite. Creando datos por defecto en Supabase...');
      await createDefaultDataSupabase();
      return;
    }

    console.log('📂 Base de datos SQLite encontrada, migrando datos...\n');

    // Conectar a SQLite
    const db = new sqlite3.Database(sqlitePath);

    // Migrar administradores
    await migrateAdminsToSupabase(db);
    
    // Migrar contactos
    await migrateContactsToSupabase(db);

    // Cerrar conexión SQLite
    db.close();

    console.log('\n✅ Migración a Supabase completada exitosamente!');
    console.log('📋 Resumen:');
    
    const adminCount = await prismaPostgres.admin.count();
    const contactCount = await prismaPostgres.contact.count();
    
    console.log(`   - Administradores: ${adminCount}`);
    console.log(`   - Contactos: ${contactCount}`);
    console.log(`   - Base de datos: Supabase PostgreSQL (GRATIS)`);

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    await prismaPostgres.$disconnect();
  }
}

async function migrateAdminsToSupabase(db) {
  return new Promise((resolve, reject) => {
    console.log('👤 Migrando administradores a Supabase...');
    
    db.all("SELECT * FROM admins", async (err, rows) => {
      if (err) {
        console.log('ℹ️  Tabla admins no encontrada, creando administrador por defecto');
        await createDefaultAdminSupabase();
        resolve();
        return;
      }

      try {
        for (const row of rows) {
          const existing = await prismaPostgres.admin.findUnique({
            where: { username: row.username }
          });

          if (!existing) {
            await prismaPostgres.admin.create({
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
            console.log(`   ✓ Admin migrado a Supabase: ${row.username}`);
          } else {
            console.log(`   - Admin ya existe en Supabase: ${row.username}`);
          }
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function migrateContactsToSupabase(db) {
  return new Promise((resolve, reject) => {
    console.log('📞 Migrando contactos a Supabase...');
    
    db.all("SELECT * FROM contacts", async (err, rows) => {
      if (err) {
        console.log('ℹ️  Tabla contacts no encontrada, continuando...');
        resolve();
        return;
      }

      try {
        let migratedCount = 0;
        for (const row of rows) {
          // Verificar si ya existe (por email y timestamp)
          const existing = await prismaPostgres.contact.findFirst({
            where: {
              AND: [
                { email: row.email },
                { createdAt: new Date(row.createdAt) }
              ]
            }
          });

          if (!existing) {
            await prismaPostgres.contact.create({
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
            migratedCount++;
          }
        }
        console.log(`   ✓ ${migratedCount} contactos nuevos migrados a Supabase`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function createDefaultDataSupabase() {
  await createDefaultAdminSupabase();
  console.log('✅ Datos por defecto creados en Supabase');
}

async function createDefaultAdminSupabase() {
  const existingAdmin = await prismaPostgres.admin.findFirst();
  
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await prismaPostgres.admin.create({
      data: {
        username: 'admin',
        email: 'admin@itacacomunicacion.com',
        password: hashedPassword,
        name: 'Administrador Principal',
        role: 'superadmin'
      }
    });
    
    console.log('✅ Administrador por defecto creado en Supabase:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Database: Supabase PostgreSQL');
  }
}

// Ejecutar migración
migrateToSupabase();