import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/database';
import { requireAuth } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    // Verificar autenticación
    const authResult = await requireAuth(req, res);
    if (!authResult || !(authResult as any).admin) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    console.log('📊 Generando dashboard para admin:', authResult.admin.username);

    // Obtener fecha actual para filtros
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    // 1. Estadísticas de clientes
    const clientStats = await prisma.client.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    const totalClients = await prisma.client.count();
    const newClientsThisMonth = await prisma.client.count({
      where: {
        createdAt: {
          gte: startOfMonth
        }
      }
    });

    // 2. Estadísticas de campañas
    const campaignStats = await prisma.campaign.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    const activeCampaigns = await prisma.campaign.count({
      where: {
        status: 'activa'
      }
    });

    // 3. Métricas financieras del mes
    const monthlyRevenue = await prisma.client.aggregate({
      where: {
        createdAt: {
          gte: startOfMonth
        }
      },
      _sum: {
        totalRevenue: true
      }
    });

    const monthlyBudgets = await prisma.client.aggregate({
      where: {
        monthlyBudget: {
          not: null
        }
      },
      _sum: {
        monthlyBudget: true
      }
    });

    // 4. Tareas pendientes
    const taskStats = await prisma.task.groupBy({
      by: ['status', 'priority'],
      _count: {
        status: true
      },
      where: {
        status: {
          in: ['pendiente', 'en_proceso']
        }
      }
    });

    const overdueTasksCount = await prisma.task.count({
      where: {
        status: {
          in: ['pendiente', 'en_proceso']
        },
        dueDate: {
          lt: new Date()
        }
      }
    });

    // 5. Últimas interacciones
    const recentInteractions = await prisma.interaction.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        client: {
          select: {
            name: true,
            status: true
          }
        },
        admin: {
          select: {
            name: true,
            username: true
          }
        }
      }
    });

    // 6. Próximos seguimientos
    const upcomingFollowUps = await prisma.client.findMany({
      where: {
        nextFollowUp: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // próximos 7 días
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        priority: true,
        nextFollowUp: true,
        assignedTo: {
          select: {
            name: true,
            username: true
          }
        }
      },
      orderBy: {
        nextFollowUp: 'asc'
      },
      take: 10
    });

    // 7. Métricas de campañas activas
    const campaignMetrics = await prisma.campaign.findMany({
      where: {
        status: 'activa'
      },
      select: {
        id: true,
        name: true,
        type: true,
        impressions: true,
        clicks: true,
        conversions: true,
        spend: true,
        revenue: true,
        budget: true,
        assignedTo: {
          select: {
            name: true,
            username: true
          }
        }
      },
      orderBy: {
        spend: 'desc'
      },
      take: 5
    });

    // 8. Team workload
    const teamWorkload = await prisma.admin.findMany({
      where: {
        active: true
      },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        _count: {
          select: {
            assignedTasks: {
              where: {
                status: {
                  in: ['pendiente', 'en_proceso']
                }
              }
            },
            clients: {
              where: {
                status: {
                  in: ['prospecto', 'negociacion', 'activo']
                }
              }
            },
            assignedCampaigns: {
              where: {
                status: 'activa'
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    const dashboardData = {
      // Resumen general
      summary: {
        totalClients,
        newClientsThisMonth,
        activeCampaigns,
        overdueTasksCount,
        monthlyRevenue: monthlyRevenue._sum.totalRevenue || 0,
        estimatedMonthlyValue: monthlyBudgets._sum.monthlyBudget || 0
      },

      // Distribución de clientes por estado
      clientDistribution: clientStats.map(stat => ({
        status: stat.status,
        count: stat._count.status
      })),

      // Distribución de campañas por estado
      campaignDistribution: campaignStats.map(stat => ({
        status: stat.status,
        count: stat._count.status
      })),

      // Distribución de tareas
      taskDistribution: taskStats.map(stat => ({
        status: stat.status,
        priority: stat.priority,
        count: stat._count.status
      })),

      // Actividad reciente
      recentActivity: recentInteractions.map(interaction => ({
        id: interaction.id,
        type: interaction.type,
        subject: interaction.subject,
        client: interaction.client.name,
        clientStatus: interaction.client.status,
        admin: interaction.admin.name || interaction.admin.username,
        createdAt: interaction.createdAt
      })),

      // Próximos seguimientos
      upcomingFollowUps: upcomingFollowUps.map(client => ({
        id: client.id,
        name: client.name,
        email: client.email,
        status: client.status,
        priority: client.priority,
        nextFollowUp: client.nextFollowUp,
        assignedTo: client.assignedTo?.name || client.assignedTo?.username || 'Sin asignar'
      })),

      // Rendimiento de campañas
      campaignPerformance: campaignMetrics.map(campaign => {
        const ctr = campaign.clicks > 0 ? (campaign.clicks / campaign.impressions * 100) : 0;
        const roas = campaign.spend > 0 ? (campaign.revenue / campaign.spend) : 0;
        
        return {
          id: campaign.id,
          name: campaign.name,
          type: campaign.type,
          impressions: campaign.impressions,
          clicks: campaign.clicks,
          conversions: campaign.conversions,
          spend: campaign.spend,
          revenue: campaign.revenue,
          budget: campaign.budget,
          ctr: Math.round(ctr * 100) / 100,
          roas: Math.round(roas * 100) / 100,
          assignedTo: campaign.assignedTo?.name || campaign.assignedTo?.username || 'Sin asignar'
        };
      }),

      // Carga de trabajo del equipo
      teamWorkload: teamWorkload.map(member => ({
        id: member.id,
        name: member.name || member.username,
        role: member.role,
        activeTasks: member._count.assignedTasks,
        activeClients: member._count.clients,
        activeCampaigns: member._count.assignedCampaigns
      }))
    };

    console.log('✅ Dashboard generado exitosamente');

    return res.status(200).json(dashboardData);

  } catch (error) {
    console.error('❌ Error generando dashboard:', error);
    return res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
}