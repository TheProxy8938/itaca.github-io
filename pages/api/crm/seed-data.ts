import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/database';
import { requireAuth } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    // Verificar autenticación y permisos de superadmin
    const authResult = await requireAuth(req, res);
    if (!authResult) {
      return;
    }

    if (authResult.admin.role !== 'superadmin') {
      return res.status(403).json({ message: 'Solo superadmins pueden ejecutar el seeder' });
    }

    console.log('🌱 Iniciando seeder de datos de prueba...');

    // 1. Crear clientes de prueba
    const clients = await Promise.all([
      prisma.client.upsert({
        where: { email: 'contacto@empresa1.com' },
        update: {},
        create: {
          name: 'Juan Pérez',
          email: 'contacto@empresa1.com',
          phone: '+52 55 1234 5678',
          company: 'Tecnología Avanzada S.A.',
          website: 'https://empresa1.com',
          address: 'Av. Reforma 123, CDMX',
          city: 'Ciudad de México',
          status: 'activo',
          priority: 'alta',
          source: 'referido',
          industry: 'Tecnología',
          monthlyBudget: 25000,
          totalRevenue: 150000,
          assignedToId: authResult.admin.id,
          nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          lastContactAt: new Date()
        }
      }),
      
      prisma.client.upsert({
        where: { email: 'marketing@empresa2.com' },
        update: {},
        create: {
          name: 'María González',
          email: 'marketing@empresa2.com',
          phone: '+52 55 9876 5432',
          company: 'Restaurantes del Valle',
          website: 'https://empresa2.com',
          status: 'negociacion',
          priority: 'media',
          source: 'web',
          industry: 'Restaurantes',
          monthlyBudget: 15000,
          totalRevenue: 45000,
          assignedToId: authResult.admin.id,
          nextFollowUp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          lastContactAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      }),
      
      prisma.client.upsert({
        where: { email: 'info@empresa3.com' },
        update: {},
        create: {
          name: 'Carlos López',
          email: 'info@empresa3.com',
          phone: '+52 55 5555 1234',
          company: 'Clínica Dental Moderna',
          status: 'prospecto',
          priority: 'alta',
          source: 'redes',
          industry: 'Salud',
          monthlyBudget: 8000,
          assignedToId: authResult.admin.id,
          nextFollowUp: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          lastContactAt: new Date()
        }
      }),
      
      prisma.client.upsert({
        where: { email: 'ventas@empresa4.com' },
        update: {},
        create: {
          name: 'Ana Martínez',
          email: 'ventas@empresa4.com',
          company: 'Moda y Estilo Boutique',
          status: 'inactivo',
          priority: 'baja',
          source: 'evento',
          industry: 'Retail',
          totalRevenue: 22000,
          assignedToId: authResult.admin.id,
          lastContactAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }),
      
      prisma.client.upsert({
        where: { email: 'director@empresa5.com' },
        update: {},
        create: {
          name: 'Roberto Sánchez',
          email: 'director@empresa5.com',
          phone: '+52 55 7777 8888',
          company: 'Constructora del Sur',
          status: 'perdido',
          priority: 'media',
          source: 'web',
          industry: 'Construcción',
          monthlyBudget: 30000,
          assignedToId: authResult.admin.id,
          lastContactAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        }
      })
    ]);

    console.log(`✅ Creados ${clients.length} clientes de prueba`);

    // 2. Crear campañas de prueba
    const campaigns = await Promise.all([
      prisma.campaign.upsert({
        where: { id: 'campaign-facebook-1' },
        update: {},
        create: {
          id: 'campaign-facebook-1',
          name: 'Campaña Facebook - Tecnología Avanzada',
          description: 'Generación de leads para empresa tecnológica',
          type: 'facebook_ads',
          status: 'activa',
          budget: 15000,
          startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          objective: 'leads',
          targetAudience: 'Empresarios tech 25-45 años',
          expectedROI: 300,
          impressions: 125000,
          clicks: 2500,
          conversions: 85,
          spend: 8500,
          revenue: 45000,
          createdById: authResult.admin.id,
          assignedToId: authResult.admin.id
        }
      }),
      
      prisma.campaign.upsert({
        where: { id: 'campaign-google-1' },
        update: {},
        create: {
          id: 'campaign-google-1',
          name: 'Google Ads - Restaurantes Valle',
          description: 'Promoción de restaurante local',
          type: 'google_ads',
          status: 'activa',
          budget: 10000,
          startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          objective: 'sales',
          targetAudience: 'Familias zona metropolitana',
          impressions: 85000,
          clicks: 1700,
          conversions: 95,
          spend: 6500,
          revenue: 28500,
          createdById: authResult.admin.id,
          assignedToId: authResult.admin.id
        }
      }),
      
      prisma.campaign.upsert({
        where: { id: 'campaign-instagram-1' },
        update: {},
        create: {
          id: 'campaign-instagram-1',
          name: 'Instagram Stories - Clínica Dental',
          type: 'instagram',
          status: 'planificacion',
          budget: 5000,
          startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          objective: 'awareness',
          targetAudience: 'Adultos 30-55 años zona norte',
          createdById: authResult.admin.id,
          assignedToId: authResult.admin.id
        }
      }),
      
      prisma.campaign.upsert({
        where: { id: 'campaign-email-1' },
        update: {},
        create: {
          id: 'campaign-email-1',
          name: 'Email Marketing - Boutique',
          description: 'Newsletter mensual con promociones',
          type: 'email',
          status: 'finalizada',
          budget: 2000,
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          impressions: 15000,
          clicks: 450,
          conversions: 18,
          spend: 1800,
          revenue: 9500,
          createdById: authResult.admin.id,
          assignedToId: authResult.admin.id
        }
      })
    ]);

    console.log(`✅ Creadas ${campaigns.length} campañas de prueba`);

    // 3. Crear métricas diarias para las campañas activas
    const metricsData = [];
    for (let i = 0; i < 15; i++) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      
      // Métricas para Facebook Ads
      metricsData.push({
        campaignId: 'campaign-facebook-1',
        date,
        impressions: Math.floor(Math.random() * 10000) + 5000,
        clicks: Math.floor(Math.random() * 200) + 100,
        conversions: Math.floor(Math.random() * 10) + 3,
        spend: Math.floor(Math.random() * 800) + 400,
        revenue: Math.floor(Math.random() * 3000) + 1500
      });
      
      // Métricas para Google Ads
      metricsData.push({
        campaignId: 'campaign-google-1',
        date,
        impressions: Math.floor(Math.random() * 7000) + 3000,
        clicks: Math.floor(Math.random() * 150) + 75,
        conversions: Math.floor(Math.random() * 8) + 2,
        spend: Math.floor(Math.random() * 600) + 300,
        revenue: Math.floor(Math.random() * 2000) + 1000
      });
    }

    // Insertar métricas
    for (const metric of metricsData) {
      await prisma.campaignMetric.upsert({
        where: {
          campaignId_date: {
            campaignId: metric.campaignId,
            date: metric.date
          }
        },
        update: {},
        create: {
          ...metric,
          ctr: metric.impressions > 0 ? (metric.clicks / metric.impressions) * 100 : 0,
          cpm: metric.impressions > 0 ? (metric.spend / metric.impressions) * 1000 : 0,
          cpc: metric.clicks > 0 ? metric.spend / metric.clicks : 0,
          roas: metric.spend > 0 ? metric.revenue / metric.spend : 0
        }
      });
    }

    console.log(`✅ Creadas ${metricsData.length} métricas diarias`);

    // 4. Crear interacciones de prueba
    const interactions = [];
    for (const client of clients) {
      // 2-3 interacciones por cliente
      for (let i = 0; i < Math.floor(Math.random() * 2) + 2; i++) {
        const types = ['llamada', 'email', 'reunion', 'whatsapp', 'nota'];
        const outcomes = ['positivo', 'negativo', 'neutral', 'seguimiento'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        interactions.push({
          clientId: client.id,
          adminId: authResult.admin.id,
          type,
          subject: `${type === 'llamada' ? 'Llamada de seguimiento' : 
                     type === 'email' ? 'Email informativo' :
                     type === 'reunion' ? 'Reunión estratégica' :
                     type === 'whatsapp' ? 'Mensaje WhatsApp' :
                     'Nota interna'} - ${client.name}`,
          description: `${type === 'llamada' ? 'Se realizó llamada para seguimiento del proyecto' :
                        type === 'email' ? 'Se envió propuesta comercial por email' :
                        type === 'reunion' ? 'Reunión para definir estrategia' :
                        type === 'whatsapp' ? 'Coordinación de próxima reunión' :
                        'Se agregaron notas sobre el cliente'}`,
          outcome: outcomes[Math.floor(Math.random() * outcomes.length)],
          duration: type === 'llamada' || type === 'reunion' ? Math.floor(Math.random() * 60) + 15 : null,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000)
        });
      }
    }

    for (const interaction of interactions) {
      await prisma.interaction.create({
        data: interaction
      });
    }

    console.log(`✅ Creadas ${interactions.length} interacciones de prueba`);

    // 5. Crear tareas de prueba
    const tasks = [];
    const taskTypes = ['general', 'cliente', 'campaña', 'creativo', 'revision'];
    const priorities = ['alta', 'media', 'baja'];
    const statuses = ['pendiente', 'en_proceso', 'completada'];

    for (let i = 0; i < 20; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const dueDate = new Date(Date.now() + (Math.floor(Math.random() * 14) - 7) * 24 * 60 * 60 * 1000);
      
      tasks.push({
        title: `Tarea ${i + 1}: ${taskTypes[Math.floor(Math.random() * taskTypes.length)]}`,
        description: 'Descripción de tarea generada automáticamente para pruebas',
        type: taskTypes[Math.floor(Math.random() * taskTypes.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        status,
        dueDate,
        completedAt: status === 'completada' ? new Date(Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000) : null,
        estimatedHours: Math.floor(Math.random() * 8) + 1,
        actualHours: status === 'completada' ? Math.floor(Math.random() * 10) + 1 : null,
        assignedToId: authResult.admin.id,
        createdById: authResult.admin.id,
        clientId: Math.random() > 0.5 ? clients[Math.floor(Math.random() * clients.length)].id : null,
        campaignId: Math.random() > 0.7 ? campaigns[Math.floor(Math.random() * campaigns.length)].id : null
      });
    }

    for (const task of tasks) {
      await prisma.task.create({
        data: task
      });
    }

    console.log(`✅ Creadas ${tasks.length} tareas de prueba`);

    // 6. Crear publicaciones en redes sociales
    const socialPosts = [];
    const platforms = ['instagram', 'facebook', 'tiktok', 'linkedin'];
    
    for (let i = 0; i < 10; i++) {
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      socialPosts.push({
        platform,
        content: `Contenido de prueba para ${platform} #${i + 1}. Marketing digital profesional con ÍTACA.`,
        hashtags: '#marketing #digital #itaca #comunicacion #redes',
        status: Math.random() > 0.5 ? 'publicada' : 'programada',
        scheduledFor: new Date(Date.now() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
        publishedAt: Math.random() > 0.5 ? new Date(Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000) : null,
        likes: Math.floor(Math.random() * 200),
        comments: Math.floor(Math.random() * 50),
        shares: Math.floor(Math.random() * 25),
        reach: Math.floor(Math.random() * 1000) + 500,
        createdById: authResult.admin.id,
        campaignId: Math.random() > 0.6 ? campaigns[Math.floor(Math.random() * campaigns.length)].id : null
      });
    }

    for (const post of socialPosts) {
      await prisma.socialPost.create({
        data: post
      });
    }

    console.log(`✅ Creadas ${socialPosts.length} publicaciones de redes sociales`);

    console.log('🎉 Seeder completado exitosamente');

    return res.status(200).json({
      success: true,
      message: 'Datos de prueba creados exitosamente',
      summary: {
        clients: clients.length,
        campaigns: campaigns.length,
        metrics: metricsData.length,
        interactions: interactions.length,
        tasks: tasks.length,
        socialPosts: socialPosts.length
      }
    });

  } catch (error) {
    console.error('❌ Error en seeder:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear datos de prueba',
      error: error.message
    });
  }
}