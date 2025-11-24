import { NextApiRequest, NextApiResponse } from 'next';
import { prisma, verifyPassword, cleanExpiredSessions } from '../../../lib/database';
import { createSession } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Método no permitido' 
    });
  }

  try {
    const { username, password } = req.body;

    // Validar campos requeridos
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son requeridos'
      });
    }

    console.log('🔍 Intentando login para usuario:', username);

    // Limpiar sesiones expiradas
    await cleanExpiredSessions();

    // Buscar administrador por username o email
    const admin = await prisma.admin.findFirst({
      where: {
        OR: [
          { username: username },
          { email: username }
        ],
        active: true
      }
    });

    if (!admin) {
      console.log('❌ Usuario no encontrado:', username);
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isValidPassword = await verifyPassword(password, admin.password);
    
    if (!isValidPassword) {
      console.log('❌ Contraseña incorrecta para:', username);
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Crear nueva sesión
    const { session, token } = await createSession(admin.id);

    console.log('✅ Login exitoso para:', admin.username);

    // Configurar cookie con el token
    res.setHeader('Set-Cookie', [
      `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict${
        process.env.NODE_ENV === 'production' ? '; Secure' : ''
      }`
    ]);

    return res.status(200).json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
        role: admin.role
      },
      token
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
}