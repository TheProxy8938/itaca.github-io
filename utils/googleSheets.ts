// Configuración para envío de formularios a Google Sheets
// Necesitarás crear un proyecto en Google Cloud Platform y habilitar la Sheets API

export const GOOGLE_SHEETS_CONFIG = {
  // Reemplaza con tu SHEET_ID real de Google Sheets
  SHEET_ID: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || 'TU_SHEET_ID_AQUI',
  
  // Reemplaza con tu API_KEY de Google Cloud Platform
  API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || 'TU_API_KEY_AQUI',
  
  // Nombre de la hoja donde se guardarán los datos
  SHEET_NAME: 'Contactos'
};

export interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  message: string;
  timestamp?: string;
  respondido?: boolean;
}

export const sendToGoogleSheets = async (formData: FormData): Promise<boolean> => {
  try {
    const timestamp = new Date().toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const dataToSend = [
      timestamp,
      formData.name,
      formData.email,
      formData.company || 'N/A',
      formData.phone || 'N/A',
      formData.service,
      formData.message,
      'NO' // Columna "Respondido" - por defecto NO
    ];

    // Usar Google Sheets API v4 para agregar datos
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.SHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.SHEET_NAME}:append?valueInputOption=RAW&key=${GOOGLE_SHEETS_CONFIG.API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [dataToSend]
      })
    });

    if (response.ok) {
      console.log('Datos enviados exitosamente a Google Sheets');
      return true;
    } else {
      console.error('Error al enviar datos a Google Sheets:', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Error al enviar formulario:', error);
    return false;
  }
};

// Función alternativa usando un servicio web (recomendado para producción)
export const sendToWebHook = async (formData: FormData): Promise<boolean> => {
  try {
    console.log('🚀 Iniciando envío a webhook...');
    
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
      respondido: false
    };

    console.log('📦 Datos a enviar:', dataToSend);

    // Puedes usar servicios como Zapier, Make.com, o tu propia API
    const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL || '';
    
    console.log('🔗 Webhook URL:', webhookUrl ? 'Configurada ✅' : 'No configurada ❌');
    
    if (!webhookUrl) {
      console.error('❌ No se ha configurado WEBHOOK_URL');
      return false;
    }

    console.log('📡 Enviando petición HTTP...');
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend)
    });

    console.log('📨 Respuesta del servidor:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (response.ok) {
      console.log('✅ Datos enviados exitosamente a webhook');
      return true;
    } else {
      console.error('❌ Error en la respuesta del webhook:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('🚨 Error al enviar a webhook:', error);
    return false;
  }
};