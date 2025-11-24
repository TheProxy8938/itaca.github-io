// API Route para manejar el envío de formularios sin problemas de CORS
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/database';

interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🚀 API Route: Recibiendo datos del formulario');
    
    const formData: FormData = req.body;
    
    // Validar datos requeridos
    if (!formData.name || !formData.email || !formData.service || !formData.message) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos',
        received: formData 
      });
    }

    console.log('📦 Datos validados:', formData);

    // Guardar en base de datos SQLite
    console.log('💾 Guardando en base de datos...');
    const contact = await prisma.contact.create({
      data: {
        name: formData.name,
        email: formData.email,
        company: formData.company || '',
        phone: formData.phone || '',
        service: formData.service,
        message: formData.message
      }
    });
    
    console.log('✅ Contacto guardado con ID:', contact.id);

    // Crear timestamp para Zapier
    const timestamp = new Date().toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const dataToSend = {
      ...formData,
      timestamp,
      respondido: false,
      contactId: contact.id
    };

    // Enviar a Zapier desde el servidor
    const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.error('❌ No se encontró WEBHOOK_URL');
      return res.status(500).json({ error: 'Webhook URL not configured' });
    }

    console.log('📡 Enviando a Zapier desde el servidor...');
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend)
    });

    console.log('📨 Respuesta de Zapier:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (response.ok) {
      console.log('✅ Datos enviados exitosamente a Zapier');
      return res.status(200).json({ 
        success: true, 
        message: 'Formulario enviado correctamente',
        timestamp 
      });
    } else {
      console.error('❌ Error en Zapier:', response.status, response.statusText);
      return res.status(500).json({ 
        error: 'Error al enviar a Zapier',
        details: `${response.status} ${response.statusText}` 
      });
    }

  } catch (error) {
    console.error('🚨 Error en API Route:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}