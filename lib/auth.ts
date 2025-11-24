import jwt from 'jsonwebtoken';
import { prisma } from './database';
import { NextApiRequest, NextApiResponse } from 'next';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_jwt_secret_muy_seguro_aqui';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos

export interface JWTPayload {
  adminId: number;
  username: string;
  email: string;
  role: string;
  sessionId: string;
}

// Función para generar un token JWT
export const generateToken = (payload: Omit<JWTPayload, 'sessionId'>, sessionId: string): string => {
  return jwt.sign(
    { ...payload, sessionId },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Función para verificar un token JWT
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    console.error('❌ Error al verificar token:', error);
    return null;
  }
};

// Función para crear una sesión de usuario
export const createSession = async (adminId: number) => {
  try {
    const expiresAt = new Date(Date.now() + SESSION_DURATION);
    
    const session = await prisma.session.create({
      data: {
        adminId,
        token: '', // Se actualizará después de generar el JWT
        expiresAt
      },
      include: {
        admin: true
      }
    });

    // Generar el token JWT con el ID de la sesión
    const token = generateToken({
      adminId: session.admin.id,
      username: session.admin.username,
      email: session.admin.email,
      role: session.admin.role
    }, session.id);

    // Actualizar la sesión con el token
    await prisma.session.update({
      where: { id: session.id },
      data: { token }
    });

    return { session: { ...session, token }, token };
  } catch (error) {
    console.error('❌ Error al crear sesión:', error);
    throw error;
  }
};

// Función para validar una sesión
export const validateSession = async (token: string) => {
  try {
    // Verificar el token JWT
    const payload = verifyToken(token);
    if (!payload) {
      return null;
    }

    // Verificar que la sesión existe en la base de datos
    const session = await prisma.session.findUnique({
      where: { 
        id: payload.sessionId,
        token: token
      },
      include: {
        admin: true
      }
    });

    if (!session) {
      return null;
    }

    // Verificar que la sesión no ha expirado
    if (session.expiresAt < new Date()) {
      // Eliminar sesión expirada
      await prisma.session.delete({
        where: { id: session.id }
      });
      return null;
    }

    // Verificar que el administrador está activo
    if (!session.admin.active) {
      return null;
    }

    return {
      admin: session.admin,
      session: session
    };
  } catch (error) {
    console.error('❌ Error al validar sesión:', error);
    return null;
  }
};

// Función para cerrar sesión
export const logout = async (token: string) => {
  try {
    const payload = verifyToken(token);
    if (payload) {
      await prisma.session.delete({
        where: { id: payload.sessionId }
      });
    }
    return true;
  } catch (error) {
    console.error('❌ Error al cerrar sesión:', error);
    return false;
  }
};

// Middleware para proteger rutas API
export const requireAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || 
               req.cookies.token;

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token de autenticación requerido' 
    });
  }

  const auth = await validateSession(token);
  
  if (!auth) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token inválido o expirado' 
    });
  }

  // Agregar datos del usuario autenticado a la request
  (req as any).user = auth.admin;
  (req as any).session = auth.session;
  
  return auth;
};

// Función para obtener el token del request
export const getTokenFromRequest = (req: NextApiRequest): string | null => {
  return req.headers.authorization?.replace('Bearer ', '') || 
         req.cookies.token || 
         null;
};