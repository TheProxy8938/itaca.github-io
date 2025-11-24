import { NextApiRequest, NextApiResponse } from 'next';
import { logout, getTokenFromRequest } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Método no permitido' 
    });
  }

  try {
    const token = getTokenFromRequest(req);
    
    if (token) {
      await logout(token);
    }

    // Limpiar cookie
    res.setHeader('Set-Cookie', [
      'token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict'
    ]);

    return res.status(200).json({
      success: true,
      message: 'Logout exitoso'
    });

  } catch (error) {
    console.error('❌ Error en logout:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
}