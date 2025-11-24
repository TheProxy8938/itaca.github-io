import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/database';
import { requireAuth } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verificar autenticación
    const authResult = await requireAuth(req, res);
    if (!authResult) {
      return; // requireAuth ya manejó la respuesta
    }

    const { method } = req;

    switch (method) {
      case 'GET':
        return await handleGetMetrics(req, res);
      
      default:
        return res.status(405).json({ message: 'Método no permitido' });
    }

  } catch (error) {
    console.error('❌ Error en API metrics:', error);
    return res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
}

async function handleGetMetrics(req: NextApiRequest, res: NextApiResponse) {
  const { 
    startDate, 
    endDate, 
    campaign, 
    type = 'overview',
    granularity = 'daily' // daily, weekly, monthly
  } = req.query;

  console.log('📊 Generando métricas avanzadas:', { type, granularity, startDate, endDate });

  // Fechas por defecto (últimos 30 días)
  const end = endDate ? new Date(endDate as string) : new Date();
  const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  try {
    switch (type) {
      case 'overview':
        return await getOverviewMetrics(res, start, end);
        
      case 'campaigns':
        return await getCampaignMetrics(res, start, end, campaign as string);
        
      case 'clients':
        return await getClientMetrics(res, start, end);
        
      case 'team':
        return await getTeamMetrics(res, start, end);
        
      case 'financial':
        return await getFinancialMetrics(res, start, end, granularity as string);
        
      case 'performance':
        return await getPerformanceMetrics(res, start, end);
        
      default:
        return res.status(400).json({ message: 'Tipo de métricas no válido' });
    }

  } catch (error) {
    console.error('❌ Error generando métricas:', error);
    return res.status(500).json({ 
      message: 'Error al generar métricas' 
    });
  }
}

// Métricas generales de overview
async function getOverviewMetrics(res: NextApiResponse, start: Date, end: Date) {
  const [
    totalClients,
    newClients,
    activeClients,
    totalCampaigns,
    activeCampaigns,
    completedTasks,
    totalRevenue,
    avgDealSize,
    conversionRate,
    clientRetention
  ] = await Promise.all([
    // Total de clientes
    prisma.client.count(),
    
    // Nuevos clientes en período
    prisma.client.count({
      where: {
        createdAt: { gte: start, lte: end }
      }
    }),
    
    // Clientes activos
    prisma.client.count({
      where: {
        status: 'activo'
      }
    }),
    
    // Total de campañas
    prisma.campaign.count(),
    
    // Campañas activas
    prisma.campaign.count({
      where: {
        status: 'activa'
      }
    }),
    
    // Tareas completadas en período
    prisma.task.count({
      where: {
        status: 'completada',
        completedAt: { gte: start, lte: end }
      }
    }),
    
    // Ingresos totales
    prisma.client.aggregate({
      _sum: { totalRevenue: true }
    }),
    
    // Tamaño promedio del deal
    prisma.client.aggregate({
      _avg: { monthlyBudget: true },
      where: {
        monthlyBudget: { not: null }
      }
    }),
    
    // Tasa de conversión (prospectos a clientes activos)
    prisma.client.count({
      where: {
        status: 'activo',
        createdAt: { gte: start, lte: end }
      }
    }),
    
    // Retención de clientes (activos vs inactivos)
    prisma.client.count({
      where: {
        status: { in: ['activo', 'inactivo'] }
      }
    })
  ]);

  // Evolución de clientes por día
  const clientGrowth = await prisma.$queryRaw`
    SELECT 
      DATE("createdAt") as date,
      COUNT(*) as new_clients,
      SUM(COUNT(*)) OVER (ORDER BY DATE("createdAt")) as total_clients
    FROM "clients" 
    WHERE "createdAt" >= ${start} AND "createdAt" <= ${end}
    GROUP BY DATE("createdAt")
    ORDER BY date
  `;

  // Distribución de clientes por estado
  const clientsByStatus = await prisma.client.groupBy({
    by: ['status'],
    _count: { status: true },
    orderBy: { _count: { status: 'desc' } }
  });

  // Top 5 fuentes de leads
  const leadSources = await prisma.client.groupBy({
    by: ['source'],
    _count: { source: true },
    where: {
      source: { not: null },
      createdAt: { gte: start, lte: end }
    },
    orderBy: { _count: { source: 'desc' } },
    take: 5
  });

  return res.status(200).json({
    overview: {
      totalClients,
      newClients,
      activeClients,
      totalCampaigns,
      activeCampaigns,
      completedTasks,
      totalRevenue: totalRevenue._sum.totalRevenue || 0,
      avgDealSize: Math.round(avgDealSize._avg.monthlyBudget || 0),
      conversionRate: newClients > 0 ? Math.round((conversionRate / newClients) * 100) : 0,
      clientRetention: clientRetention > 0 ? Math.round((activeClients / clientRetention) * 100) : 0
    },
    charts: {
      clientGrowth,
      clientsByStatus: clientsByStatus.map(item => ({
        label: item.status,
        value: item._count.status
      })),
      leadSources: leadSources.map(item => ({
        label: item.source || 'Sin especificar',
        value: item._count.source
      }))
    }
  });
}

// Métricas de campañas
async function getCampaignMetrics(res: NextApiResponse, start: Date, end: Date, campaignId?: string) {
  const where = {
    createdAt: { gte: start, lte: end },
    ...(campaignId && { id: campaignId })
  };

  const campaigns = await prisma.campaign.findMany({
    where,
    include: {
      metrics: {
        where: {
          date: { gte: start, lte: end }
        },
        orderBy: { date: 'asc' }
      },
      assignedTo: {
        select: { name: true, username: true }
      }
    }
  });

  // Métricas agregadas
  const totalMetrics = await prisma.campaignMetric.aggregate({
    _sum: {
      impressions: true,
      clicks: true,
      conversions: true,
      spend: true,
      revenue: true
    },
    where: {
      date: { gte: start, lte: end },
      ...(campaignId && { campaignId })
    }
  });

  // Performance por tipo de campaña
  const performanceByType = await prisma.campaign.groupBy({
    by: ['type'],
    _sum: {
      impressions: true,
      clicks: true,
      conversions: true,
      spend: true,
      revenue: true
    },
    _avg: {
      impressions: true,
      clicks: true,
      conversions: true
    },
    where
  });

  // Top campañas por ROI
  const topCampaignsByROI = await prisma.campaign.findMany({
    where: {
      ...where,
      spend: { gt: 0 }
    },
    select: {
      id: true,
      name: true,
      type: true,
      spend: true,
      revenue: true
    },
    take: 10
  });

  const campaignsWithROI = topCampaignsByROI
    .map(campaign => ({
      ...campaign,
      roi: campaign.spend > 0 ? Math.round(((campaign.revenue - campaign.spend) / campaign.spend) * 100) : 0,
      roas: campaign.spend > 0 ? Math.round((campaign.revenue / campaign.spend) * 100) / 100 : 0
    }))
    .sort((a, b) => b.roi - a.roi);

  return res.status(200).json({
    campaigns: campaigns.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      type: campaign.type,
      status: campaign.status,
      assignedTo: campaign.assignedTo?.name || campaign.assignedTo?.username || 'Sin asignar',
      totalImpressions: campaign.impressions,
      totalClicks: campaign.clicks,
      totalConversions: campaign.conversions,
      totalSpend: campaign.spend,
      totalRevenue: campaign.revenue,
      ctr: campaign.impressions > 0 ? Math.round((campaign.clicks / campaign.impressions) * 10000) / 100 : 0,
      conversionRate: campaign.clicks > 0 ? Math.round((campaign.conversions / campaign.clicks) * 10000) / 100 : 0,
      roas: campaign.spend > 0 ? Math.round((campaign.revenue / campaign.spend) * 100) / 100 : 0,
      dailyMetrics: campaign.metrics
    })),
    aggregated: {
      totalImpressions: totalMetrics._sum.impressions || 0,
      totalClicks: totalMetrics._sum.clicks || 0,
      totalConversions: totalMetrics._sum.conversions || 0,
      totalSpend: totalMetrics._sum.spend || 0,
      totalRevenue: totalMetrics._sum.revenue || 0,
      averageCTR: totalMetrics._sum.impressions > 0 ? 
        Math.round((totalMetrics._sum.clicks / totalMetrics._sum.impressions) * 10000) / 100 : 0,
      averageConversionRate: totalMetrics._sum.clicks > 0 ? 
        Math.round((totalMetrics._sum.conversions / totalMetrics._sum.clicks) * 10000) / 100 : 0,
      totalROAS: totalMetrics._sum.spend > 0 ? 
        Math.round((totalMetrics._sum.revenue / totalMetrics._sum.spend) * 100) / 100 : 0
    },
    charts: {
      performanceByType: performanceByType.map(item => ({
        type: item.type,
        impressions: item._sum.impressions || 0,
        clicks: item._sum.clicks || 0,
        conversions: item._sum.conversions || 0,
        spend: item._sum.spend || 0,
        revenue: item._sum.revenue || 0,
        avgCTR: item._sum.impressions > 0 ? 
          Math.round((item._sum.clicks / item._sum.impressions) * 10000) / 100 : 0
      })),
      topCampaigns: campaignsWithROI.slice(0, 5)
    }
  });
}

// Métricas de clientes
async function getClientMetrics(res: NextApiResponse, start: Date, end: Date) {
  // Evolución de clientes por estado
  const clientEvolution = await prisma.$queryRaw`
    SELECT 
      DATE("updatedAt") as date,
      status,
      COUNT(*) as count
    FROM "clients" 
    WHERE "updatedAt" >= ${start} AND "updatedAt" <= ${end}
    GROUP BY DATE("updatedAt"), status
    ORDER BY date, status
  `;

  // Clientes por industria
  const clientsByIndustry = await prisma.client.groupBy({
    by: ['industry'],
    _count: { industry: true },
    _sum: { totalRevenue: true, monthlyBudget: true },
    where: {
      industry: { not: null }
    },
    orderBy: { _count: { industry: 'desc' } }
  });

  // Top clientes por ingresos
  const topClients = await prisma.client.findMany({
    where: {
      totalRevenue: { gt: 0 }
    },
    select: {
      id: true,
      name: true,
      company: true,
      status: true,
      totalRevenue: true,
      monthlyBudget: true,
      assignedTo: {
        select: { name: true, username: true }
      }
    },
    orderBy: { totalRevenue: 'desc' },
    take: 10
  });

  // Tasa de conversión por fuente
  const conversionBySource = await prisma.client.groupBy({
    by: ['source'],
    _count: { source: true },
    where: {
      source: { not: null },
      createdAt: { gte: start, lte: end }
    }
  });

  const activeBySource = await prisma.client.groupBy({
    by: ['source'],
    _count: { source: true },
    where: {
      source: { not: null },
      status: 'activo',
      createdAt: { gte: start, lte: end }
    }
  });

  const conversionRates = conversionBySource.map(source => {
    const active = activeBySource.find(a => a.source === source.source);
    return {
      source: source.source,
      total: source._count.source,
      converted: active?._count.source || 0,
      conversionRate: source._count.source > 0 ? 
        Math.round((active?._count.source || 0) / source._count.source * 100) : 0
    };
  });

  return res.status(200).json({
    evolution: clientEvolution,
    byIndustry: clientsByIndustry.map(item => ({
      industry: item.industry || 'Sin especificar',
      count: item._count.industry,
      totalRevenue: item._sum.totalRevenue || 0,
      avgBudget: item._sum.monthlyBudget || 0
    })),
    topClients: topClients.map(client => ({
      ...client,
      assignedToName: client.assignedTo?.name || client.assignedTo?.username || 'Sin asignar'
    })),
    conversionRates
  });
}

// Métricas del equipo
async function getTeamMetrics(res: NextApiResponse, start: Date, end: Date) {
  const teamMembers = await prisma.admin.findMany({
    where: { active: true },
    include: {
      _count: {
        select: {
          clients: {
            where: {
              status: { in: ['prospecto', 'negociacion', 'activo'] }
            }
          },
          assignedTasks: {
            where: {
              status: { in: ['pendiente', 'en_proceso'] }
            }
          },
          assignedCampaigns: {
            where: {
              status: 'activa'
            }
          },
          interactions: {
            where: {
              createdAt: { gte: start, lte: end }
            }
          }
        }
      }
    }
  });

  // Productividad por miembro
  const productivity = await Promise.all(
    teamMembers.map(async (member) => {
      const completedTasks = await prisma.task.count({
        where: {
          assignedToId: member.id,
          status: 'completada',
          completedAt: { gte: start, lte: end }
        }
      });

      const totalHours = await prisma.task.aggregate({
        _sum: { actualHours: true },
        where: {
          assignedToId: member.id,
          status: 'completada',
          completedAt: { gte: start, lte: end },
          actualHours: { not: null }
        }
      });

      const clientRevenue = await prisma.client.aggregate({
        _sum: { totalRevenue: true },
        where: {
          assignedToId: member.id
        }
      });

      return {
        id: member.id,
        name: member.name || member.username,
        role: member.role,
        activeClients: member._count.clients,
        activeTasks: member._count.assignedTasks,
        activeCampaigns: member._count.assignedCampaigns,
        interactions: member._count.interactions,
        completedTasks,
        totalHours: totalHours._sum.actualHours || 0,
        clientRevenue: clientRevenue._sum.totalRevenue || 0
      };
    })
  );

  return res.status(200).json({
    teamMembers: productivity,
    summary: {
      totalMembers: teamMembers.length,
      totalClients: productivity.reduce((sum, member) => sum + member.activeClients, 0),
      totalTasks: productivity.reduce((sum, member) => sum + member.activeTasks, 0),
      totalCampaigns: productivity.reduce((sum, member) => sum + member.activeCampaigns, 0),
      totalInteractions: productivity.reduce((sum, member) => sum + member.interactions, 0),
      totalHours: productivity.reduce((sum, member) => sum + member.totalHours, 0),
      totalRevenue: productivity.reduce((sum, member) => sum + member.clientRevenue, 0)
    }
  });
}

// Métricas financieras
async function getFinancialMetrics(res: NextApiResponse, start: Date, end: Date, granularity: string) {
  // Ingresos por período
  const revenueQuery = granularity === 'monthly' ? 
    `DATE_TRUNC('month', "updatedAt")` :
    granularity === 'weekly' ?
    `DATE_TRUNC('week', "updatedAt")` :
    `DATE("updatedAt")`;

  const revenueEvolution = await prisma.$queryRaw`
    SELECT 
      ${revenueQuery} as period,
      SUM("totalRevenue") as revenue,
      COUNT(*) as client_count
    FROM "clients" 
    WHERE "updatedAt" >= ${start} AND "updatedAt" <= ${end}
    AND "totalRevenue" > 0
    GROUP BY ${revenueQuery}
    ORDER BY period
  `;

  // Proyecciones basadas en presupuestos mensuales
  const projections = await prisma.client.aggregate({
    _sum: { monthlyBudget: true },
    _count: { monthlyBudget: true },
    where: {
      monthlyBudget: { not: null },
      status: { in: ['activo', 'negociacion'] }
    }
  });

  // Facturas por estado
  const invoiceStats = await prisma.invoice.groupBy({
    by: ['status'],
    _sum: { total: true },
    _count: { status: true },
    where: {
      createdAt: { gte: start, lte: end }
    }
  });

  return res.status(200).json({
    revenueEvolution,
    projections: {
      monthlyRecurring: projections._sum.monthlyBudget || 0,
      annualProjection: (projections._sum.monthlyBudget || 0) * 12,
      activeContracts: projections._count.monthlyBudget || 0
    },
    invoices: invoiceStats.map(invoice => ({
      status: invoice.status,
      count: invoice._count.status,
      total: invoice._sum.total || 0
    }))
  });
}

// Métricas de rendimiento
async function getPerformanceMetrics(res: NextApiResponse, start: Date, end: Date) {
  // Tiempo promedio de respuesta (basado en interacciones)
  const responseTime = await prisma.$queryRaw`
    SELECT 
      AVG(EXTRACT(EPOCH FROM (i."createdAt" - c."lastContactAt")) / 3600) as avg_response_hours
    FROM "interactions" i
    JOIN "clients" c ON i."clientId" = c.id
    WHERE i."createdAt" >= ${start} AND i."createdAt" <= ${end}
    AND c."lastContactAt" IS NOT NULL
    AND i."createdAt" > c."lastContactAt"
  `;

  // Eficiencia de tareas
  const taskEfficiency = await prisma.task.aggregate({
    _avg: {
      actualHours: true,
      estimatedHours: true
    },
    where: {
      status: 'completada',
      completedAt: { gte: start, lte: end },
      actualHours: { not: null },
      estimatedHours: { not: null }
    }
  });

  // Satisfacción del cliente (basado en interacciones positivas)
  const satisfactionData = await prisma.interaction.groupBy({
    by: ['outcome'],
    _count: { outcome: true },
    where: {
      createdAt: { gte: start, lte: end },
      outcome: { not: null }
    }
  });

  return res.status(200).json({
    responseTime: {
      averageHours: parseFloat(responseTime[0]?.avg_response_hours || '0') || 0
    },
    taskEfficiency: {
      avgActualHours: taskEfficiency._avg.actualHours || 0,
      avgEstimatedHours: taskEfficiency._avg.estimatedHours || 0,
      efficiencyRatio: taskEfficiency._avg.estimatedHours > 0 ? 
        Math.round((taskEfficiency._avg.estimatedHours / taskEfficiency._avg.actualHours) * 100) : 100
    },
    satisfaction: satisfactionData.map(item => ({
      outcome: item.outcome,
      count: item._count.outcome
    }))
  });
}