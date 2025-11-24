import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../../../lib/auth';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const authResult = await requireAuth(req, res);
    if (!authResult) {
      return; // requireAuth ya envió la respuesta
    }

    const { method } = req;

    switch (method) {
      case 'GET':
        try {
          const tasks = await prisma.task.findMany({
            include: {
              client: {
                select: {
                  name: true,
                  email: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          });

          const formattedTasks = tasks.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate,
            assignedTo: task.assignedToId,
            clientId: task.clientId,
            clientName: task.client?.name,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt
          }));

          res.status(200).json({ tasks: formattedTasks });
        } catch (error) {
          console.error('Error fetching tasks:', error);
          res.status(500).json({ error: 'Error al obtener tareas' });
        }
        break;

      case 'POST':
        try {
          const { 
            title, 
            description, 
            status, 
            priority, 
            dueDate, 
            assignedTo, 
            clientId 
          } = req.body;

          if (!title || !description || !dueDate) {
            return res.status(400).json({ error: 'Título, descripción y fecha son requeridos' });
          }

          const task = await prisma.task.create({
            data: {
              title,
              description,
              status: status || 'pending',
              priority: priority || 'medium',
              dueDate: new Date(dueDate),
              assignedTo: assignedTo || null,
              client: clientId ? { connect: { id: clientId } } : undefined,
              createdBy: { connect: { id: authResult.admin.id } }
            },
            include: {
              client: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          });

          res.status(201).json({ 
            task: {
              ...task,
              clientName: (task as any).client?.name
            }
          });
        } catch (error) {
          console.error('Error creating task:', error);
          res.status(500).json({ error: 'Error al crear tarea' });
        }
        break;

      case 'PUT':
        try {
          const { 
            id,
            title, 
            description, 
            status, 
            priority, 
            dueDate, 
            assignedTo, 
            clientId 
          } = req.body;

          if (!id || !title) {
            return res.status(400).json({ error: 'ID y título son requeridos' });
          }

          const task = await prisma.task.update({
            where: { id },
            data: {
              title,
              description,
              status,
              priority,
              dueDate: dueDate ? new Date(dueDate) : undefined,
              assignedTo,
              client: clientId ? { connect: { id: clientId } } : undefined
            },
            include: {
              client: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          });

          res.status(200).json({ 
            task: {
              ...task,
              clientName: (task as any).client?.name
            }
          });
        } catch (error) {
          console.error('Error updating task:', error);
          res.status(500).json({ error: 'Error al actualizar tarea' });
        }
        break;

      case 'DELETE':
        try {
          const { id } = req.body;

          if (!id) {
            return res.status(400).json({ error: 'ID es requerido' });
          }

          await prisma.task.delete({
            where: { id }
          });

          res.status(200).json({ message: 'Tarea eliminada correctamente' });
        } catch (error) {
          console.error('Error deleting task:', error);
          res.status(500).json({ error: 'Error al eliminar tarea' });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    await prisma.$disconnect();
  }
}