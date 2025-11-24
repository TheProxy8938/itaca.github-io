import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/database';
import { requireAuth } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Método no permitido' 
    });
  }

  try {
    // Verificar autenticación
    const auth = await requireAuth(req, res);
    if (!auth) return; // requireAuth ya envió la respuesta

    console.log('👤 Usuario autenticado:', auth.admin.username);

    // Obtener contactos con paginación
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        skip: offset,
        take: limit
      }),
      prisma.contact.count()
    ]);

    console.log(`📊 Obtenidos ${contacts.length} contactos de ${total} total`);

    return res.status(200).json({
      success: true,
      contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error al obtener contactos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
}