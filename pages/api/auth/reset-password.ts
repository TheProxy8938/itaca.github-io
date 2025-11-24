import { NextApiRequest, NextApiResponse } from 'next';
import { prisma, hashPassword } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const { code, newPassword, confirmPassword } = req.body;

    // Validar datos de entrada
    if (!code || !newPassword || !confirmPassword) {
      return res.status(400).json({ 
        message: 'Todos los campos son requeridos' 
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ 
        message: 'Las contraseñas no coinciden' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Validar formato del código (6 dígitos)
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({ 
        message: 'Código inválido' 
      });
    }

    console.log('🔍 Validando código:', code);

    // Buscar el token de recuperación
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token: code,
        used: false,
        expiresAt: {
          gt: new Date() // Token no expirado
        }
      },
      include: {
        admin: true
      }
    });

    if (!resetToken) {
      console.log('⚠️ Token no válido o expirado:', code);
      return res.status(400).json({ 
        message: 'Código inválido o expirado' 
      });
    }

    console.log('✅ Token válido para admin:', resetToken.admin.username);

    // Verificar que el admin esté activo
    if (!resetToken.admin.active) {
      console.log('⚠️ Admin inactivo:', resetToken.admin.username);
      return res.status(400).json({ 
        message: 'Cuenta no disponible' 
      });
    }

    // Hashear la nueva contraseña
    const hashedPassword = await hashPassword(newPassword);
    console.log('🔐 Nueva contraseña hasheada');

    // Actualizar la contraseña del admin y marcar el token como usado
    await prisma.$transaction([
      // Actualizar contraseña
      prisma.admin.update({
        where: { id: resetToken.admin.id },
        data: { 
          password: hashedPassword,
          updatedAt: new Date()
        }
      }),
      // Marcar token como usado
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true }
      }),
      // Eliminar todas las sesiones del admin para forzar nuevo login
      prisma.session.deleteMany({
        where: { adminId: resetToken.admin.id }
      })
    ]);

    console.log('💾 Contraseña actualizada exitosamente');

    return res.status(200).json({
      message: 'Contraseña actualizada exitosamente',
      success: true
    });

  } catch (error) {
    console.error('❌ Error en reset-password:', error);
    return res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
}