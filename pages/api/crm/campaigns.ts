import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../../../lib/auth';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const authResult = await requireAuth(req, res);
    if (!authResult) {
      return; // requireAuth ya envió la respuesta
    }

    const { method } = req;

    switch (method) {
      case 'GET':
        try {
          const campaigns = await prisma.campaign.findMany({
            include: {
              metrics: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          });

          type CampaignWithMetrics = typeof campaigns extends (infer U)[] ? U : never;

          const formattedCampaigns = campaigns.map((campaign: CampaignWithMetrics & { metrics: { impressions: number; clicks: number; conversions: number; spend: number; }[] }) => {
            // Calcular métricas totales
            const totalImpressions = campaign.metrics.reduce((sum, m) => sum + m.impressions, 0);
            const totalClicks = campaign.metrics.reduce((sum, m) => sum + m.clicks, 0);
            const totalConversions = campaign.metrics.reduce((sum, m) => sum + m.conversions, 0);
            const totalSpent = campaign.metrics.reduce((sum, m) => sum + m.spend, 0);

            return {
              id: campaign.id,
              name: campaign.name,
              type: campaign.type,
              status: campaign.status,
              budget: campaign.budget,
              spent: totalSpent,
              impressions: totalImpressions,
              clicks: totalClicks,
              conversions: totalConversions,
              startDate: campaign.startDate,
              endDate: campaign.endDate,
              assignedTo: campaign.assignedToId
            };
          });

          res.status(200).json({ campaigns: formattedCampaigns });
        } catch (error) {
          console.error('Error fetching campaigns:', error);
          res.status(500).json({ error: 'Error al obtener campañas' });
        }
        break;

      case 'POST':
        try {
          const { 
            name, 
            type, 
            status, 
            budget, 
            startDate, 
            endDate, 
            assignedTo, 
            clientId 
          } = req.body;

          if (!name || !type || !budget) {
            return res.status(400).json({ error: 'Campos requeridos faltantes' });
          }

          const campaign = await prisma.campaign.create({
            data: {
              name,
              type,
              status: status || 'draft',
              budget: parseFloat(budget),
              startDate: startDate ? new Date(startDate) : new Date(),
              endDate: endDate ? new Date(endDate) : null,
              description: '',
              objective: '',
              targetAudience: '',
              expectedROI: 0,
              assignedToId: 1,
              createdById: 1
            }
          });
          
          res.status(201).json({ 
            campaign: {
              ...campaign,
              spent: 0,
              impressions: 0,
              clicks: 0,
              conversions: 0
            }
          });
        } catch (error) {
          console.error('Error creating campaign:', error);
          res.status(500).json({ error: 'Error al crear campaña' });
        }
        break;

      case 'PUT':
        try {
          const { 
            id,
            name, 
            type, 
            status, 
            budget, 
            startDate, 
            endDate, 
            assignedTo, 
            clientId 
          } = req.body;

          if (!id || !name) {
            return res.status(400).json({ error: 'ID y nombre son requeridos' });
          }

          const campaign = await prisma.campaign.update({
            where: { id },
            data: {
              name,
              type,
              status,
              budget: budget ? parseFloat(budget) : undefined,
              startDate: startDate ? new Date(startDate) : undefined,
              endDate: endDate ? new Date(endDate) : undefined
            },
            include: {
              metrics: true
            }
          });

          const totalImpressions = campaign.metrics.reduce((sum, m) => sum + m.impressions, 0);
          const totalClicks = campaign.metrics.reduce((sum, m) => sum + m.clicks, 0);
          const totalConversions = campaign.metrics.reduce((sum, m) => sum + m.conversions, 0);
          const totalSpent = campaign.metrics.reduce((sum, m) => sum + m.spend, 0);

          res.status(200).json({ 
            campaign: {
              ...campaign,
              spent: totalSpent,
              impressions: totalImpressions,
              clicks: totalClicks,
              conversions: totalConversions
            }
          });
        } catch (error) {
          console.error('Error updating campaign:', error);
          res.status(500).json({ error: 'Error al actualizar campaña' });
        }
        break;

      case 'DELETE':
        try {
          const { id } = req.body;

          if (!id) {
            return res.status(400).json({ error: 'ID es requerido' });
          }

          // Primero eliminar métricas relacionadas
          await prisma.campaignMetric.deleteMany({
            where: { campaignId: id }
          });

          // Luego eliminar la campaña
          await prisma.campaign.delete({
            where: { id }
          });

          res.status(200).json({ message: 'Campaña eliminada correctamente' });
        } catch (error) {
          console.error('Error deleting campaign:', error);
          res.status(500).json({ error: 'Error al eliminar campaña' });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    await prisma.$disconnect();
  }
}