import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/database';
import { sendPasswordResetEmail, generateResetCode, isValidEmail } from '../../../lib/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const { email } = req.body;

    // Validar datos de entrada
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ 
        message: 'Por favor proporciona un email válido' 
      });
    }

    console.log('🔍 Buscando admin con email:', email);

    // Buscar el administrador por email
    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    // Por seguridad, siempre respondemos igual aunque el email no exista
    if (!admin) {
      console.log('⚠️ Email no encontrado:', email);
      return res.status(200).json({ 
        message: 'Si el email existe, recibirás un código de recuperación' 
      });
    }

    // Verificar que el admin esté activo
    if (!admin.active) {
      console.log('⚠️ Admin inactivo:', email);
      return res.status(200).json({ 
        message: 'Si el email existe, recibirás un código de recuperación' 
      });
    }

    console.log('✅ Admin encontrado:', admin.username);

    // Generar código de recuperación (6 dígitos)
    const resetCode = generateResetCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    console.log('🎲 Código generado:', resetCode);

    // Eliminar tokens existentes para este admin
    await prisma.passwordResetToken.deleteMany({
      where: { adminId: admin.id }
    });

    // Crear nuevo token de recuperación
    await prisma.passwordResetToken.create({
      data: {
        adminId: admin.id,
        token: resetCode,
        expiresAt,
        used: false
      }
    });

    console.log('💾 Token guardado en base de datos');

    // Intentar enviar email con el código
    const emailSent = await sendPasswordResetEmail(
      admin.email,
      resetCode,
      admin.name || admin.username
    );

    if (!emailSent) {
      console.error('❌ Error al enviar email');
      // En modo desarrollo, mostrar el código directamente
      if (process.env.NODE_ENV === 'development') {
        return res.status(200).json({ 
          message: `⚠️ Error de email. Tu código de recuperación es: ${resetCode}`,
          devMode: true,
          resetCode: resetCode
        });
      }
      return res.status(500).json({ 
        message: 'Error al enviar el email. Intenta nuevamente.' 
      });
    }

    console.log('📧 Email enviado exitosamente');

    return res.status(200).json({
      message: 'Si el email existe, recibirás un código de recuperación'
    });

  } catch (error) {
    console.error('❌ Error en forgot-password:', error);
    return res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
}