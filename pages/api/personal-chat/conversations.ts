import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/database';
import { requireAuth } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verificar autenticación
    const auth = await requireAuth(req, res);
    if (!auth) return;

    // Solo permitir acceso a Dilan Hernandez
    const isDilan = auth.admin.username === 'Dilan Hernandez' || 
                   auth.admin.name === 'Dilan Hernandez' ||
                   auth.admin.email === 'proxemodelan5@gmail.com';

    if (!isDilan) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Esta funcionalidad es exclusiva para Dilan Hernandez.'
      });
    }

    switch (req.method) {
      case 'GET':
        return await getConversations(req, res, auth.admin.id);
      case 'POST':
        return await createConversation(req, res, auth.admin.id);
      default:
        return res.status(405).json({
          success: false,
          message: 'Método no permitido'
        });
    }

  } catch (error) {
    console.error('❌ Error en API de conversaciones personales:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
}

// Obtener conversaciones existentes
async function getConversations(req: NextApiRequest, res: NextApiResponse, adminId: number) {
  try {
    // Por ahora simulamos una conversación hasta que las tablas estén creadas
    const mockConversation = {
      id: `conversation_${adminId}`,
      adminId,
      title: 'Chat Personal con tu IA Motivacional',
      mood: 'neutral',
      createdAt: new Date(),
      messages: []
    };

    return res.status(200).json({
      success: true,
      conversation: mockConversation,
      messages: []
    });

  } catch (error) {
    console.error('❌ Error obteniendo conversaciones:', error);
    
    // Fallback en caso de error de DB
    return res.status(200).json({
      success: true,
      conversation: {
        id: `fallback_${adminId}`,
        adminId,
        title: 'Chat Personal',
        mood: 'neutral',
        createdAt: new Date(),
        messages: []
      },
      messages: []
    });
  }
}

// Crear nueva conversación
async function createConversation(req: NextApiRequest, res: NextApiResponse, adminId: number) {
  try {
    const { title, mood, context } = req.body;

    // Simular creación de conversación hasta que las tablas estén disponibles
    const mockConversation = {
      id: `new_conversation_${Date.now()}`,
      adminId,
      title: title || `Chat del ${new Date().toLocaleDateString('es-ES')}`,
      mood: mood || 'neutral',
      context,
      archived: false,
      createdAt: new Date(),
      messages: []
    };

    console.log('💡 Nueva conversación simulada para Dilan:', mockConversation.title);

    return res.status(201).json({
      success: true,
      message: 'Nueva conversación creada',
      conversation: mockConversation
    });

  } catch (error) {
    console.error('❌ Error creando conversación:', error);
    
    // Fallback
    return res.status(200).json({
      success: true,
      message: 'Conversación lista (modo desarrollo)',
      conversation: {
        id: `fallback_new_${Date.now()}`,
        adminId,
        title: 'Chat Personal',
        mood: 'neutral',
        createdAt: new Date()
      }
    });
  }
}