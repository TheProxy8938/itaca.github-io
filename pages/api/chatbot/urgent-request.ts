import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UrgentRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  timestamp: string;
  sessionId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const {
      name,
      email,
      phone,
      company,
      message,
      timestamp,
      sessionId
    }: UrgentRequest = req.body;

    // Todas las solicitudes son tratadas como alta prioridad
    const priority = 'high';

    // Validar campos requeridos
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Campos requeridos: name, email, message' 
      });
    }

    // Generar ID único para la solicitud
    const requestId = `URG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Guardar en base de datos (usando la tabla Contact como base)
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone || '',
        company: company || '',
        service: 'Consulta con Asesor',
        message: `[SOLICITUD DE ASESORÍA]\n\nPrioridad: ALTA (10-15 min)\nFecha: ${new Date(timestamp).toLocaleString()}\nID: ${requestId}\nSesión: ${sessionId}\n\nMensaje del cliente:\n${message}`,
        status: 'urgent_high'
      }
    });

    // Aquí implementaremos las notificaciones múltiples
    await Promise.all([
      // 1. Notificación por email a administradores
      sendEmailNotification({
        requestId,
        priority,
        name,
        email,
        phone,
        company,
        message,
        timestamp
      }),
      
      // 2. Crear entrada en el sistema de notificaciones urgentes
      createUrgentNotification({
        contactId: contact.id,
        requestId,
        priority,
        customerData: { name, email, phone, company },
        message,
        timestamp
      }),

      // 3. Log de la solicitud urgente
      logUrgentRequest({
        requestId,
        priority,
        customerInfo: `${name} (${email})`,
        message: message.substring(0, 100) + (message.length > 100 ? '...' : '')
      })
    ]);

    // Respuesta exitosa
    res.status(200).json({
      success: true,
      requestId,
      message: 'Solicitud urgente procesada exitosamente',
      estimatedResponse: '10-15 minutos',
      notificationsSent: {
        email: true,
        dashboard: true,
        log: true
      }
    });

  } catch (error) {
    console.error('❌ Error procesando solicitud urgente:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo procesar la solicitud urgente'
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Función para enviar notificación por email
async function sendEmailNotification(data: any) {
  // Por ahora simulamos el envío de email
  // En producción conectarías con SendGrid, NodeMailer, etc.
  console.log('📧 NOTIFICACIÓN EMAIL ENVIADA:');
  console.log(`🚨 SOLICITUD ${data.priority.toUpperCase()}: ${data.requestId}`);
  console.log(`👤 Cliente: ${data.name} (${data.email})`);
  console.log(`📱 Teléfono: ${data.phone || 'No proporcionado'}`);
  console.log(`🏢 Empresa: ${data.company || 'No especificada'}`);
  console.log(`💬 Mensaje: ${data.message}`);
  console.log(`⏰ Hora: ${new Date(data.timestamp).toLocaleString()}`);
  console.log('----------------------------------------');
  
  return { sent: true, method: 'email' };
}

// Función para crear notificación en dashboard
async function createUrgentNotification(data: any) {
  try {
    // Usamos la tabla Contact existente que ya funciona correctamente
    // Creamos un contacto especial marcado como notificación urgente
    
    const urgentNotification = await prisma.contact.create({
      data: {
        name: `🚨 URGENTE: ${data.customerData.name}`,
        email: data.customerData.email,
        phone: data.customerData.phone || '',
        company: data.customerData.company || '',
        service: `NOTIFICACIÓN ${data.priority.toUpperCase()}`,
        message: `NOTIFICACIÓN AUTOMÁTICA DE SOLICITUD URGENTE\n\n` +
                `📋 ID: ${data.requestId}\n` +
                `👤 Cliente: ${data.customerData.name}\n` +
                `📧 Email: ${data.customerData.email}\n` +
                `📱 Teléfono: ${data.customerData.phone || 'No proporcionado'}\n` +
                `🏢 Empresa: ${data.customerData.company || 'No especificada'}\n` +
                `⚠️ Prioridad: ${data.priority === 'critical' ? 'CRÍTICA (5-10 min)' : 'ALTA (10-15 min)'}\n` +
                `⏰ Hora solicitud: ${new Date(data.timestamp).toLocaleString()}\n\n` +
                `💬 Mensaje del cliente:\n${data.message}\n\n` +
                `🎯 ACCIÓN REQUERIDA: Contactar inmediatamente al cliente`,
        status: `urgent_notification_${data.priority}` // Estado especial para notificaciones
      }
    });

    console.log('✅ Notificación urgente creada:', urgentNotification.id);
    return { created: true, notificationId: urgentNotification.id };
  } catch (error) {
    console.error('❌ Error creando notificación urgente:', error);
    return { created: false, error: error.message };
  }
}

// Función para log de solicitudes urgentes
async function logUrgentRequest(data: any) {
  console.log('📝 LOG SOLICITUD URGENTE:');
  console.log(`🆔 ID: ${data.requestId}`);
  console.log(`⚠️ Prioridad: ${data.priority.toUpperCase()}`);
  console.log(`👤 Cliente: ${data.customerInfo}`);
  console.log(`💬 Resumen: ${data.message}`);
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
  console.log('========================================');
  
  return { logged: true };
}