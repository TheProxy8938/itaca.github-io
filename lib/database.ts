import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Singleton pattern para Prisma Client
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Función para hashear contraseñas
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Función para verificar contraseñas
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Función para crear el administrador por defecto
export const createDefaultAdmin = async () => {
  try {
    // Verificar si ya existe un administrador
    const existingAdmin = await prisma.admin.findFirst();
    
    if (!existingAdmin) {
      const defaultUsername = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
      const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@itacacomunicacion.com';
      const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
      
      const hashedPassword = await hashPassword(defaultPassword);
      
      const admin = await prisma.admin.create({
        data: {
          username: defaultUsername,
          email: defaultEmail,
          password: hashedPassword,
          name: 'Administrador Principal',
          role: 'superadmin'
        }
      });
      
      console.log('✅ Administrador por defecto creado:', {
        username: admin.username,
        email: admin.email
      });
      
      return admin;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error al crear administrador por defecto:', error);
    throw error;
  }
};

// Función para conectar a la base de datos y configuración inicial
export const initializeDatabase = async () => {
  try {
    // Verificar conexión
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos SQLite');
    
    // Crear administrador por defecto si no existe
    await createDefaultAdmin();
    
    return prisma;
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    throw error;
  }
};

// Función para limpiar sesiones expiradas
export const cleanExpiredSessions = async () => {
  try {
    const deleted = await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
    
    if (deleted.count > 0) {
      console.log(`🧹 ${deleted.count} sesiones expiradas eliminadas`);
    }
    
    return deleted.count;
  } catch (error) {
    console.error('❌ Error al limpiar sesiones:', error);
    return 0;
  }
};