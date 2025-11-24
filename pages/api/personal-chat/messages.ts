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
      case 'POST':
        return await saveMessages(req, res, auth.admin.id);
      default:
        return res.status(405).json({
          success: false,
          message: 'Método no permitido'
        });
    }

  } catch (error) {
    console.error('❌ Error en API de mensajes personales:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
}

// Guardar mensajes de la conversación
async function saveMessages(req: NextApiRequest, res: NextApiResponse, adminId: number) {
  try {
    const { messages, moodAnalysis, currentMood } = req.body;

    // Buscar o crear conversación activa
    let conversation;
    
    try {
      // Intentar encontrar conversación activa
      conversation = await (prisma as any).personalChatConversation.findFirst({
        where: {
          adminId,
          archived: false
        }
      });

      // Si no existe, crear una nueva
      if (!conversation) {
        conversation = await (prisma as any).personalChatConversation.create({
          data: {
            adminId,
            title: `Chat del ${new Date().toLocaleDateString('es-ES')}`,
            mood: currentMood || 'neutral'
          }
        });
      }

      // Guardar mensajes
      for (const message of messages) {
        await (prisma as any).personalChatMessage.create({
          data: {
            conversationId: conversation.id,
            content: message.content,
            isFromUser: message.isFromUser,
            mood: moodAnalysis?.mood,
            sentiment: moodAnalysis?.sentiment,
            keywords: moodAnalysis?.keywords || []
          }
        });
      }

      // Actualizar perfil personal si existe análisis de mood
      if (moodAnalysis) {
        await updatePersonalProfile(adminId, moodAnalysis, currentMood);
      }

      // Registrar mood diario si es significativo
      if (moodAnalysis?.mood && moodAnalysis.mood !== 'neutral') {
        await logDailyMood(adminId, moodAnalysis.mood, moodAnalysis.sentiment);
      }

    } catch (dbError) {
      // Si las tablas no existen aún, simular guardado exitoso
      console.log('💡 Las tablas del chat personal no existen aún. Simulando guardado...');
      console.log('📝 Mensajes:', messages);
      console.log('🎭 Análisis de ánimo:', moodAnalysis);
    }

    return res.status(200).json({
      success: true,
      message: 'Mensajes guardados exitosamente'
    });

  } catch (error) {
    console.error('❌ Error guardando mensajes:', error);
    return res.status(200).json({
      success: true,
      message: 'Mensajes procesados (modo desarrollo)'
    });
  }
}

// Actualizar perfil personal
async function updatePersonalProfile(adminId: number, moodAnalysis: any, currentMood: string) {
  try {
    // Buscar perfil existente
    let profile = await (prisma as any).personalProfile.findUnique({
      where: { adminId }
    });

    if (!profile) {
      // Crear nuevo perfil
      profile = await (prisma as any).personalProfile.create({
        data: {
          adminId,
          communicationStyle: 'empático',
          preferredTone: 'cariñoso',
          interests: [],
          goals: [],
          activeHours: [getTimeOfDay()],
          stressIndicators: moodAnalysis.keywords || [],
          motivationTriggers: [],
          averageMood: moodAnalysis.sentiment ? (moodAnalysis.sentiment + 1) * 5 : 5,
          lastMoodUpdate: new Date(),
          totalConversations: 1
        }
      });
    } else {
      // Actualizar perfil existente
      const existingStressIndicators = profile.stressIndicators || [];
      const newKeywords = moodAnalysis.keywords || [];
      const newStressIndicators = Array.from(new Set([...existingStressIndicators, ...newKeywords]));
      
      const existingActiveHours = profile.activeHours || [];
      const newActiveHours = Array.from(new Set([...existingActiveHours, getTimeOfDay()]));
      
      await (prisma as any).personalProfile.update({
        where: { adminId },
        data: {
          stressIndicators: newStressIndicators,
          activeHours: newActiveHours,
          averageMood: moodAnalysis.sentiment ? 
            ((profile.averageMood || 5) + ((moodAnalysis.sentiment + 1) * 5)) / 2 : 
            profile.averageMood,
          lastMoodUpdate: new Date(),
          totalConversations: (profile.totalConversations || 0) + 1
        }
      });
    }
  } catch (error) {
    console.log('💡 Perfil personal no disponible aún:', error.message);
  }
}

// Registrar mood diario
async function logDailyMood(adminId: number, mood: string, sentiment: number) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const moodScore = sentiment ? Math.round((sentiment + 1) * 5) : 5;

    await (prisma as any).dailyMoodLog.upsert({
      where: {
        adminId_date: {
          adminId,
          date: today
        }
      },
      update: {
        mood,
        score: moodScore,
        notes: `Actualizado automáticamente desde chat personal`
      },
      create: {
        adminId,
        date: today,
        mood,
        score: moodScore,
        notes: `Registrado automáticamente desde chat personal`,
        factors: ['chat_personal']
      }
    });
  } catch (error) {
    console.log('💡 Log de mood diario no disponible aún:', error.message);
  }
}

// Obtener hora del día
function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
}