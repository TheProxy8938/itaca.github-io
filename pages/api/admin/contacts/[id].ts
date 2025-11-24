import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../../../../lib/auth';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authResult = await requireAuth(req, res);
  if (!authResult) {
    return; // requireAuth ya envió la respuesta
  }

  const { id } = req.query;
  const contactId = parseInt(id as string);

  if (isNaN(contactId)) {
    return res.status(400).json({ error: 'ID de contacto inválido' });
  }

  try {
    switch (req.method) {
      case 'PUT':
        const { status } = req.body;
        
        if (!status) {
          return res.status(400).json({ error: 'Estado es requerido' });
        }

        const updatedContact = await prisma.contact.update({
          where: { id: contactId },
          data: { status }
        });

        res.status(200).json({
          success: true,
          contact: updatedContact,
          message: 'Contacto actualizado correctamente'
        });
        break;

      case 'GET':
        const contact = await prisma.contact.findUnique({
          where: { id: contactId }
        });

        if (!contact) {
          return res.status(404).json({ error: 'Contacto no encontrado' });
        }

        res.status(200).json({ contact });
        break;

      case 'DELETE':
        await prisma.contact.delete({
          where: { id: contactId }
        });

        res.status(200).json({
          success: true,
          message: 'Contacto eliminado correctamente'
        });
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error en API de contacto:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo procesar la solicitud'
    });
  } finally {
    await prisma.$disconnect();
  }
}