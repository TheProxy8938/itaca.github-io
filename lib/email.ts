import nodemailer from 'nodemailer';

// Configuración del transporter de email
const createTransporter = () => {
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  
  // Opción alternativa con SMTP personalizado
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    console.log('📧 Enviando email a:', options.to);
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"ÍTACA Comunicación" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, '') // Fallback texto plano
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado exitosamente:', result.messageId);
    return true;

  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    return false;
  }
};

export const sendPasswordResetEmail = async (email: string, resetCode: string, name: string): Promise<boolean> => {
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Recuperar Contraseña - ÍTACA</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">ÍTACA Comunicación</h1>
        <p style="color: #f0f0f0; margin: 10px 0 0 0;">Comunicación Estratégica</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-top: 0;">Recuperar Contraseña</h2>
        
        <p>Hola <strong>${name}</strong>,</p>
        
        <p>Has solicitado recuperar tu contraseña para acceder al panel de administración de ÍTACA.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
          <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Tu código de recuperación es:</p>
          <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
            ${resetCode}
          </div>
          <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">Este código expira en 15 minutos</p>
        </div>
        
        <p><strong>Instrucciones:</strong></p>
        <ol style="line-height: 1.8;">
          <li>Ve a la página de recuperación de contraseña</li>
          <li>Ingresa este código: <code style="background: #f1f3f4; padding: 2px 6px; border-radius: 3px;">${resetCode}</code></li>
          <li>Crea tu nueva contraseña</li>
          <li>Inicia sesión con tu nueva contraseña</li>
        </ol>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px;"><strong>⚠️ Importante:</strong></p>
          <ul style="margin: 5px 0 0 0; font-size: 14px;">
            <li>Este código es de un solo uso</li>
            <li>Expira en 15 minutos</li>
            <li>Si no solicitaste este cambio, ignora este email</li>
          </ul>
        </div>
        
        <p>Si tienes problemas, contacta al administrador del sistema.</p>
        
        <p>Saludos,<br><strong>Equipo ÍTACA</strong></p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
        <p>Este es un email automático, no respondas a este mensaje.</p>
        <p>© ${new Date().getFullYear()} ÍTACA Comunicación Estratégica</p>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: 'Recuperar Contraseña - ÍTACA Comunicación',
    html: htmlTemplate,
    text: `
      ÍTACA Comunicación - Recuperar Contraseña
      
      Hola ${name},
      
      Has solicitado recuperar tu contraseña.
      
      Tu código de recuperación es: ${resetCode}
      
      Este código expira en 15 minutos y es de un solo uso.
      
      Instrucciones:
      1. Ve a la página de recuperación
      2. Ingresa el código: ${resetCode}
      3. Crea tu nueva contraseña
      
      Si no solicitaste este cambio, ignora este email.
      
      Saludos,
      Equipo ÍTACA
    `
  });
};

export const generateResetCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};