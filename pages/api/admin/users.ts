import { NextApiRequest, NextApiResponse } from 'next';
import { prisma, hashPassword } from '../../../lib/database';
import { requireAuth } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verificar autenticación
    const auth = await requireAuth(req, res);
    if (!auth) return;

    // Solo superadmins pueden gestionar administradores
    if (auth.admin.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Solo superadministradores pueden gestionar usuarios.'
      });
    }

    switch (req.method) {
      case 'GET':
        return await getAdmins(req, res);
      case 'POST':
        return await createAdmin(req, res);
      case 'PUT':
        return await updateAdmin(req, res);
      case 'DELETE':
        return await deleteAdmin(req, res);
      default:
        return res.status(405).json({
          success: false,
          message: 'Método no permitido'
        });
    }

  } catch (error) {
    console.error('❌ Error en API de administradores:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
}

// Obtener lista de administradores
async function getAdmins(req: NextApiRequest, res: NextApiResponse) {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            sessions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json({
      success: true,
      admins
    });

  } catch (error) {
    console.error('❌ Error al obtener administradores:', error);
    throw error;
  }
}

// Crear nuevo administrador
async function createAdmin(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { username, email, password, name, role = 'admin' } = req.body;

    // Validar campos requeridos
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario, email y contraseña son requeridos'
      });
    }

    // Validar rol
    if (!['admin', 'superadmin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Rol inválido. Debe ser "admin" o "superadmin"'
      });
    }

    // Verificar si ya existe
    const existing = await prisma.admin.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un administrador con ese usuario o email'
      });
    }

    // Crear administrador
    const hashedPassword = await hashPassword(password);
    
    const admin = await prisma.admin.create({
      data: {
        username,
        email,
        password: hashedPassword,
        name: name || username,
        role
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true
      }
    });

    console.log('✅ Administrador creado:', admin.username);

    return res.status(201).json({
      success: true,
      message: 'Administrador creado exitosamente',
      admin
    });

  } catch (error) {
    console.error('❌ Error al crear administrador:', error);
    throw error;
  }
}

// Actualizar administrador
async function updateAdmin(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, username, email, name, role, active } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID del administrador es requerido'
      });
    }

    // Verificar que existe
    const existingAdmin = await prisma.admin.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingAdmin) {
      return res.status(404).json({
        success: false,
        message: 'Administrador no encontrado'
      });
    }

    // Preparar datos de actualización
    const updateData: any = {};
    
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (role && ['admin', 'superadmin'].includes(role)) updateData.role = role;
    if (typeof active === 'boolean') updateData.active = active;

    // Actualizar
    const updatedAdmin = await prisma.admin.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        active: true,
        updatedAt: true
      }
    });

    // Si se desactivó, eliminar sesiones
    if (updateData.active === false) {
      await prisma.session.deleteMany({
        where: { adminId: parseInt(id) }
      });
    }

    console.log('✅ Administrador actualizado:', updatedAdmin.username);

    return res.status(200).json({
      success: true,
      message: 'Administrador actualizado exitosamente',
      admin: updatedAdmin
    });

  } catch (error) {
    console.error('❌ Error al actualizar administrador:', error);
    throw error;
  }
}

// Eliminar administrador (soft delete)
async function deleteAdmin(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID del administrador es requerido'
      });
    }

    const adminId = parseInt(id as string);

    // Verificar que existe
    const admin = await prisma.admin.findUnique({
      where: { id: adminId }
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrador no encontrado'
      });
    }

    // No permitir eliminar el último superadmin
    if (admin.role === 'superadmin') {
      const superadminCount = await prisma.admin.count({
        where: {
          role: 'superadmin',
          active: true
        }
      });

      if (superadminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'No se puede eliminar el último superadministrador'
        });
      }
    }

    // Desactivar en lugar de eliminar
    await prisma.admin.update({
      where: { id: adminId },
      data: { active: false }
    });

    // Eliminar todas las sesiones
    await prisma.session.deleteMany({
      where: { adminId }
    });

    console.log('✅ Administrador desactivado:', admin.username);

    return res.status(200).json({
      success: true,
      message: 'Administrador desactivado exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al eliminar administrador:', error);
    throw error;
  }
}