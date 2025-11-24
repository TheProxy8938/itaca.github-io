import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/database';
import { requireAuth } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verificar autenticación
    const authResult = await requireAuth(req, res);
    if (!authResult) {
      return; // requireAuth ya manejó la respuesta
    }

    const { method } = req;

    switch (method) {
      case 'GET':
        return await handleGetClients(req, res, authResult.admin);
      
      case 'POST':
        return await handleCreateClient(req, res, authResult.admin);
      
      case 'PUT':
        return await handleUpdateClient(req, res, authResult.admin);
      
      case 'DELETE':
        return await handleDeleteClient(req, res, authResult.admin);
      
      default:
        return res.status(405).json({ message: 'Método no permitido' });
    }

  } catch (error) {
    console.error('❌ Error en API clients:', error);
    return res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
}

// GET - Listar clientes con filtros y paginación
async function handleGetClients(req: NextApiRequest, res: NextApiResponse, admin: any) {
  const { 
    page = '1', 
    limit = '10', 
    search = '', 
    status = '', 
    priority = '',
    assignedTo = ''
  } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const offset = (pageNum - 1) * limitNum;

  // Construir filtros
  const where: any = {};
  
  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { email: { contains: search as string, mode: 'insensitive' } },
      { company: { contains: search as string, mode: 'insensitive' } }
    ];
  }

  if (status) {
    where.status = status;
  }

  if (priority) {
    where.priority = priority;
  }

  if (assignedTo && assignedTo !== 'all') {
    where.assignedToId = parseInt(assignedTo as string);
  }

  console.log('🔍 Buscando clientes con filtros:', where);

  // Obtener clientes con paginación
  const [clients, totalCount] = await Promise.all([
    prisma.client.findMany({
      where,
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            username: true
          }
        },
        _count: {
          select: {
            interactions: true,
            campaigns: true,
            tasks: true
          }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { updatedAt: 'desc' }
      ],
      skip: offset,
      take: limitNum
    }),
    prisma.client.count({ where })
  ]);

  const totalPages = Math.ceil(totalCount / limitNum);

  return res.status(200).json({
    clients: clients.map(client => ({
      ...client,
      assignedToName: client.assignedTo?.name || client.assignedTo?.username || 'Sin asignar',
      interactionCount: client._count.interactions,
      campaignCount: client._count.campaigns,
      taskCount: client._count.tasks
    })),
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalCount,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1
    }
  });
}

// POST - Crear nuevo cliente
async function handleCreateClient(req: NextApiRequest, res: NextApiResponse, admin: any) {
  const {
    name,
    email,
    phone,
    company,
    website,
    address,
    city,
    country = 'México',
    status = 'prospecto',
    priority = 'media',
    source,
    industry,
    monthlyBudget,
    assignedToId,
    nextFollowUp
  } = req.body;

  // Validaciones
  if (!name || !email) {
    return res.status(400).json({ 
      message: 'Nombre y email son requeridos' 
    });
  }

  // Verificar email único
  const existingClient = await prisma.client.findUnique({
    where: { email }
  });

  if (existingClient) {
    return res.status(400).json({ 
      message: 'Ya existe un cliente con este email' 
    });
  }

  console.log('📝 Creando cliente:', { name, email, company });

  const client = await prisma.client.create({
    data: {
      name,
      email,
      phone,
      company,
      website,
      address,
      city,
      country,
      status,
      priority,
      source,
      industry,
      monthlyBudget: monthlyBudget ? parseFloat(monthlyBudget) : null,
      assignedToId: assignedToId ? parseInt(assignedToId) : null,
      nextFollowUp: nextFollowUp ? new Date(nextFollowUp) : null,
      lastContactAt: new Date()
    },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          username: true
        }
      }
    }
  });

  // Crear interacción inicial
  await prisma.interaction.create({
    data: {
      clientId: client.id,
      adminId: admin.id,
      type: 'nota',
      subject: 'Cliente registrado',
      description: `Cliente ${client.name} registrado en el sistema`,
      outcome: 'neutral'
    }
  });

  console.log('✅ Cliente creado exitosamente:', client.id);

  return res.status(201).json({
    message: 'Cliente creado exitosamente',
    client: {
      ...client,
      assignedToName: client.assignedTo?.name || client.assignedTo?.username || 'Sin asignar'
    }
  });
}

// PUT - Actualizar cliente
async function handleUpdateClient(req: NextApiRequest, res: NextApiResponse, admin: any) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ message: 'ID del cliente requerido' });
  }

  const {
    name,
    email,
    phone,
    company,
    website,
    address,
    city,
    country,
    status,
    priority,
    source,
    industry,
    monthlyBudget,
    totalRevenue,
    assignedToId,
    nextFollowUp,
    notes
  } = req.body;

  console.log('📝 Actualizando cliente:', id);

  // Verificar que el cliente existe
  const existingClient = await prisma.client.findUnique({
    where: { id: id as string }
  });

  if (!existingClient) {
    return res.status(404).json({ message: 'Cliente no encontrado' });
  }

  // Verificar email único (excepto el cliente actual)
  if (email && email !== existingClient.email) {
    const emailExists = await prisma.client.findUnique({
      where: { email }
    });

    if (emailExists) {
      return res.status(400).json({ 
        message: 'Ya existe otro cliente con este email' 
      });
    }
  }

  const client = await prisma.client.update({
    where: { id: id as string },
    data: {
      name,
      email,
      phone,
      company,
      website,
      address,
      city,
      country,
      status,
      priority,
      source,
      industry,
      monthlyBudget: monthlyBudget ? parseFloat(monthlyBudget) : null,
      totalRevenue: totalRevenue ? parseFloat(totalRevenue) : undefined,
      assignedToId: assignedToId ? parseInt(assignedToId) : null,
      nextFollowUp: nextFollowUp ? new Date(nextFollowUp) : null,
      lastContactAt: new Date()
    },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          username: true
        }
      }
    }
  });

  // Crear interacción de actualización si hay cambios significativos
  if (notes || status !== existingClient.status) {
    await prisma.interaction.create({
      data: {
        clientId: client.id,
        adminId: admin.id,
        type: 'nota',
        subject: 'Cliente actualizado',
        description: notes || `Estado del cliente actualizado a: ${status}`,
        outcome: 'neutral'
      }
    });
  }

  console.log('✅ Cliente actualizado exitosamente:', client.id);

  return res.status(200).json({
    message: 'Cliente actualizado exitosamente',
    client: {
      ...client,
      assignedToName: client.assignedTo?.name || client.assignedTo?.username || 'Sin asignar'
    }
  });
}

// DELETE - Eliminar cliente
async function handleDeleteClient(req: NextApiRequest, res: NextApiResponse, admin: any) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ message: 'ID del cliente requerido' });
  }

  console.log('🗑️ Eliminando cliente:', id);

  // Verificar que el cliente existe
  const existingClient = await prisma.client.findUnique({
    where: { id: id as string },
    include: {
      _count: {
        select: {
          interactions: true,
          campaigns: true,
          contracts: true,
          invoices: true
        }
      }
    }
  });

  if (!existingClient) {
    return res.status(404).json({ message: 'Cliente no encontrado' });
  }

  // Prevenir eliminación si tiene datos relacionados importantes
  if (existingClient._count.contracts > 0 || existingClient._count.invoices > 0) {
    return res.status(400).json({ 
      message: 'No se puede eliminar cliente con contratos o facturas asociados' 
    });
  }

  // Eliminar cliente (las relaciones se eliminan por CASCADE)
  await prisma.client.delete({
    where: { id: id as string }
  });

  console.log('✅ Cliente eliminado exitosamente:', id);

  return res.status(200).json({
    message: 'Cliente eliminado exitosamente'
  });
}