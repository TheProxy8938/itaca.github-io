/**
 * Script de Migración: SQLite → Supabase PostgreSQL
 * 
 * Este script migra todos los datos existentes de SQLite a Supabase
 * Ejecutar DESPUÉS de haber configurado las migraciones en Supabase
 */

const { PrismaClient } = require('@prisma/client');
const path = require('path');

// Cliente SQLite (base de datos origen)
const prismaSource = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./prisma/database.db'
    }
  }
});

// Cliente PostgreSQL (base de datos destino - Supabase)
const prismaTarget = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function migrateData() {
  console.log('🚀 === INICIANDO MIGRACIÓN DE DATOS ===\n');

  try {
    // Verificar conexión a ambas bases de datos
    console.log('🔍 Verificando conexiones...');
    await prismaSource.$connect();
    console.log('✅ Conectado a SQLite (origen)');
    
    await prismaTarget.$connect();
    console.log('✅ Conectado a Supabase PostgreSQL (destino)\n');

    // ========================================================================
    // 1. MIGRAR ADMINISTRADORES
    // ========================================================================
    console.log('👥 Migrando administradores...');
    const admins = await prismaSource.admin.findMany();
    console.log(`   Encontrados: ${admins.length} administradores`);

    if (admins.length > 0) {
      for (const admin of admins) {
        try {
          await prismaTarget.admin.upsert({
            where: { email: admin.email },
            update: {
              username: admin.username,
              password: admin.password,
              name: admin.name,
              role: admin.role,
              active: admin.active,
              avatar: admin.avatar,
              department: admin.department,
              hourlyRate: admin.hourlyRate,
              notifications: admin.notifications,
              phone: admin.phone,
            },
            create: {
              username: admin.username,
              email: admin.email,
              password: admin.password,
              name: admin.name,
              role: admin.role,
              active: admin.active,
              avatar: admin.avatar,
              department: admin.department,
              hourlyRate: admin.hourlyRate,
              notifications: admin.notifications,
              phone: admin.phone,
              createdAt: admin.createdAt,
              updatedAt: admin.updatedAt,
            }
          });
          console.log(`   ✓ Migrado: ${admin.username}`);
        } catch (error) {
          console.error(`   ✗ Error migrando ${admin.username}:`, error.message);
        }
      }
    }

    // ========================================================================
    // 2. MIGRAR CONTACTOS
    // ========================================================================
    console.log('\n📧 Migrando contactos...');
    const contacts = await prismaSource.contact.findMany();
    console.log(`   Encontrados: ${contacts.length} contactos`);

    if (contacts.length > 0) {
      for (const contact of contacts) {
        try {
          await prismaTarget.contact.create({
            data: {
              name: contact.name,
              email: contact.email,
              company: contact.company,
              phone: contact.phone,
              service: contact.service,
              message: contact.message,
              status: contact.status,
              createdAt: contact.createdAt,
              updatedAt: contact.updatedAt,
            }
          });
          console.log(`   ✓ Migrado: ${contact.name}`);
        } catch (error) {
          console.error(`   ✗ Error migrando contacto ${contact.name}:`, error.message);
        }
      }
    }

    // ========================================================================
    // 3. MIGRAR CLIENTES (Si existen)
    // ========================================================================
    console.log('\n🏢 Migrando clientes...');
    try {
      const clients = await prismaSource.client.findMany();
      console.log(`   Encontrados: ${clients.length} clientes`);

      if (clients.length > 0) {
        for (const client of clients) {
          try {
            await prismaTarget.client.upsert({
              where: { email: client.email },
              update: {
                name: client.name,
                phone: client.phone,
                company: client.company,
                website: client.website,
                address: client.address,
                city: client.city,
                country: client.country,
                status: client.status,
                priority: client.priority,
                source: client.source,
                industry: client.industry,
                monthlyBudget: client.monthlyBudget,
                totalRevenue: client.totalRevenue,
                lastContactAt: client.lastContactAt,
                nextFollowUp: client.nextFollowUp,
                assignedToId: client.assignedToId,
              },
              create: {
                id: client.id,
                name: client.name,
                email: client.email,
                phone: client.phone,
                company: client.company,
                website: client.website,
                address: client.address,
                city: client.city,
                country: client.country,
                status: client.status,
                priority: client.priority,
                source: client.source,
                industry: client.industry,
                monthlyBudget: client.monthlyBudget,
                totalRevenue: client.totalRevenue,
                createdAt: client.createdAt,
                updatedAt: client.updatedAt,
                lastContactAt: client.lastContactAt,
                nextFollowUp: client.nextFollowUp,
                assignedToId: client.assignedToId,
              }
            });
            console.log(`   ✓ Migrado: ${client.name}`);
          } catch (error) {
            console.error(`   ✗ Error migrando cliente ${client.name}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.log('   ℹ️  No hay clientes para migrar');
    }

    // ========================================================================
    // 4. MIGRAR CAMPAÑAS (Si existen)
    // ========================================================================
    console.log('\n📊 Migrando campañas...');
    try {
      const campaigns = await prismaSource.campaign.findMany();
      console.log(`   Encontrados: ${campaigns.length} campañas`);

      if (campaigns.length > 0) {
        for (const campaign of campaigns) {
          try {
            await prismaTarget.campaign.create({
              data: {
                id: campaign.id,
                name: campaign.name,
                type: campaign.type,
                status: campaign.status,
                budget: campaign.budget,
                spent: campaign.spent,
                impressions: campaign.impressions,
                clicks: campaign.clicks,
                conversions: campaign.conversions,
                startDate: campaign.startDate,
                endDate: campaign.endDate,
                description: campaign.description,
                objectives: campaign.objectives,
                targetAudience: campaign.targetAudience,
                assignedToId: campaign.assignedToId,
                createdById: campaign.createdById,
                createdAt: campaign.createdAt,
                updatedAt: campaign.updatedAt,
              }
            });
            console.log(`   ✓ Migrado: ${campaign.name}`);
          } catch (error) {
            console.error(`   ✗ Error migrando campaña ${campaign.name}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.log('   ℹ️  No hay campañas para migrar');
    }

    // ========================================================================
    // 5. MIGRAR TAREAS (Si existen)
    // ========================================================================
    console.log('\n✅ Migrando tareas...');
    try {
      const tasks = await prismaSource.task.findMany();
      console.log(`   Encontrados: ${tasks.length} tareas`);

      if (tasks.length > 0) {
        for (const task of tasks) {
          try {
            await prismaTarget.task.create({
              data: {
                id: task.id,
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                dueDate: task.dueDate,
                completedAt: task.completedAt,
                estimatedHours: task.estimatedHours,
                actualHours: task.actualHours,
                clientId: task.clientId,
                campaignId: task.campaignId,
                assignedToId: task.assignedToId,
                createdById: task.createdById,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
              }
            });
            console.log(`   ✓ Migrado: ${task.title}`);
          } catch (error) {
            console.error(`   ✗ Error migrando tarea ${task.title}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.log('   ℹ️  No hay tareas para migrar');
    }

    console.log('\n✨ === MIGRACIÓN COMPLETADA EXITOSAMENTE ===\n');
    
    // Resumen
    console.log('📊 RESUMEN DE MIGRACIÓN:');
    console.log(`   Administradores: ${admins.length}`);
    console.log(`   Contactos: ${contacts.length}`);
    console.log('\n🎉 Todos los datos han sido migrados a Supabase!');
    console.log('💡 Ahora puedes eliminar el archivo database.db si lo deseas\n');

  } catch (error) {
    console.error('\n❌ ERROR DURANTE LA MIGRACIÓN:', error);
    throw error;
  } finally {
    await prismaSource.$disconnect();
    await prismaTarget.$disconnect();
  }
}

// Ejecutar migración
migrateData()
  .catch((error) => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
