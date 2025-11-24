import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Head from 'next/head';

interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  message: string;
  status: string;
  createdAt: string;
}

// CRM Interfaces
interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: string;
  value?: number;
  assignedTo?: string;
  createdAt: string;
  lastContact?: string;
  nextFollowUp?: string;
  priority?: string;
}

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  startDate: string;
  endDate: string;
  assignedTo: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignedTo: string;
  clientName?: string;
}

interface DashboardData {
  summary: {
    totalClients: number;
    newClientsThisMonth: number;
    activeCampaigns: number;
    overdueTasksCount: number;
    monthlyRevenue: number;
    estimatedMonthlyValue: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    subject: string;
    client: string;
    createdAt: string;
  }>;
}

interface UrgentNotification {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  status: string;
  createdAt: string;
  priority: 'high' | 'critical';
  requestId?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [urgentNotifications, setUrgentNotifications] = useState<UrgentNotification[]>([]);
  const [newUrgentCount, setNewUrgentCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    loadInitialData();

    // Polling cada 30 segundos para notificaciones urgentes
    const urgentPolling = setInterval(() => {
      loadUrgentNotifications();
    }, 30000);

    return () => clearInterval(urgentPolling);
  }, [router]);

  const loadInitialData = async () => {
    try {
      await Promise.all([
        loadContacts(),
        loadDashboardData(),
        loadClients(),
        loadCampaigns(),
        loadTasks(),
        loadUrgentNotifications()
      ]);
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/contacts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts);
      }
    } catch (error) {
      console.error('Error cargando contactos:', error);
    }
  };

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/crm/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error cargando datos del CRM:', error);
    }
  };

  const loadClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/crm/clients', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setClients(data.clients);
      }
    } catch (error) {
      console.error('Error cargando clientes:', error);
    }
  };

  const loadCampaigns = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/crm/campaigns', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (error) {
      console.error('Error cargando campañas:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/crm/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
      }
    } catch (error) {
      console.error('Error cargando tareas:', error);
    }
  };

  const loadUrgentNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/contacts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Filtrar solo notificaciones urgentes
        const urgent = data.contacts.filter((contact: Contact) => 
          contact.status.startsWith('urgent_') || 
          contact.service.includes('URGENTE') ||
          contact.service.includes('EMERGENCIA')
        ).map((contact: Contact) => ({
          ...contact,
          priority: contact.status.includes('critical') || contact.service.includes('CRÍTICA') ? 'critical' : 'high',
          requestId: extractRequestId(contact.message)
        }));

        setUrgentNotifications(urgent);
        setNewUrgentCount(urgent.filter(u => u.status.includes('new') || u.status.includes('pending')).length);
      }
    } catch (error) {
      console.error('Error cargando notificaciones urgentes:', error);
    }
  };

  // Función helper para extraer ID de solicitud del mensaje
  const extractRequestId = (message: string): string => {
    const match = message.match(/📋 ID: (URG_[^\n]+)/);
    return match ? match[1] : '';
  };

  // Función para marcar notificación como atendida
  const handleMarkAsAttended = async (notificationId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/contacts/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'contacted'
        })
      });

      if (response.ok) {
        // Actualizar lista local
        setUrgentNotifications(prev => 
          prev.filter(n => n.id !== notificationId)
        );
        setNewUrgentCount(prev => Math.max(0, prev - 1));
        
        // Recargar datos
        await loadUrgentNotifications();
      }
    } catch (error) {
      console.error('Error marcando como atendida:', error);
    }
  };

  // CRUD Functions
  const handleCreateClient = async (clientData: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/crm/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(clientData)
      });

      if (response.ok) {
        await loadClients();
        await loadDashboardData();
        setShowClientModal(false);
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error creando cliente:', error);
    }
  };

  const handleCreateCampaign = async (campaignData: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/crm/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(campaignData)
      });

      if (response.ok) {
        await loadCampaigns();
        await loadDashboardData();
        setShowCampaignModal(false);
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error creando campaña:', error);
    }
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/crm/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      });

      if (response.ok) {
        await loadTasks();
        await loadDashboardData();
        setShowTaskModal(false);
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error creando tarea:', error);
    }
  };

  const handleCreateUser = async (userData: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        setShowUserModal(false);
        setEditingItem(null);
        // Opcionalmente recargar lista de usuarios si la tienes
      }
    } catch (error) {
      console.error('Error creando usuario:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Panel de Administración CRM - ÍTACA Comunicación</title>
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                CRM ÍTACA Comunicación
              </h1>
              <p className="text-gray-600">Bienvenido, {user.name} ({user.role})</p>
            </div>
            <div className="flex space-x-4 items-center">
              {/* Indicador de notificaciones urgentes */}
              {newUrgentCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative"
                >
                  <button
                    onClick={() => setActiveSection('urgent')}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 animate-pulse"
                  >
                    <span className="text-lg">🚨</span>
                    <span>URGENTES ({newUrgentCount})</span>
                  </button>
                  <motion.div
                    className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-red-900"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {newUrgentCount}
                  </motion.div>
                </motion.div>
              )}
              
              <button
                onClick={() => setShowUserModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                ➕ Nuevo Usuario
              </button>
              {user.role === 'superadmin' && (
                <button
                  onClick={() => router.push('/admin/users')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Gestionar Administradores
                </button>
              )}
              
              {/* Chat Personal exclusivo para Dilan Hernandez */}
              {(user.username === 'Dilan Hernandez' || user.name === 'Dilan Hernandez' || user.email === 'proxemodelan5@gmail.com') && (
                <button
                  onClick={() => router.push('/personal/chat')}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  💙 Mi Espacio Personal
                </button>
              )}
              
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', name: '🏠 Dashboard', icon: '📊' },
              { id: 'urgent', name: `🚨 URGENTES${newUrgentCount > 0 ? ` (${newUrgentCount})` : ''}`, icon: '⚡' },
              { id: 'clients', name: '👥 Clientes', icon: '👤' },
              { id: 'campaigns', name: '📢 Campañas', icon: '📈' },
              { id: 'tasks', name: '✓ Tareas', icon: '📋' },
              { id: 'contacts', name: '📧 Contactos Web', icon: '📬' },
              { id: 'metrics', name: '📊 Métricas', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeSection === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Urgent Notifications Section */}
        {activeSection === 'urgent' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-red-800 flex items-center space-x-2">
                <span className="text-3xl animate-pulse">🚨</span>
                <span>Notificaciones Urgentes</span>
                {newUrgentCount > 0 && (
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                    {newUrgentCount} pendientes
                  </span>
                )}
              </h2>
              <button
                onClick={loadUrgentNotifications}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>🔄</span>
                <span>Actualizar</span>
              </button>
            </div>

            {urgentNotifications.length === 0 ? (
              <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg">
                <div className="flex items-center">
                  <div className="text-green-600 text-4xl mr-4">✅</div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">¡Todo bajo control!</h3>
                    <p className="text-green-700">No hay notificaciones urgentes en este momento.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {urgentNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-6 rounded-lg border-l-4 ${
                      notification.priority === 'critical' 
                        ? 'bg-red-50 border-red-500' 
                        : 'bg-orange-50 border-orange-500'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className={`text-2xl ${
                            notification.priority === 'critical' ? 'animate-bounce' : 'animate-pulse'
                          }`}>
                            {notification.priority === 'critical' ? '🔴' : '🟡'}
                          </span>
                          <h3 className={`text-lg font-bold ${
                            notification.priority === 'critical' ? 'text-red-800' : 'text-orange-800'
                          }`}>
                            PRIORIDAD {notification.priority === 'critical' ? 'CRÍTICA' : 'ALTA'}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            notification.priority === 'critical' 
                              ? 'bg-red-200 text-red-800' 
                              : 'bg-orange-200 text-orange-800'
                          }`}>
                            {notification.priority === 'critical' ? '5-10 MIN' : '10-15 MIN'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-700">👤 Cliente:</p>
                            <p className="text-lg font-bold">{notification.name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700">🏢 Empresa:</p>
                            <p className="text-lg">{notification.company || 'No especificada'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700">📧 Email:</p>
                            <p className="text-blue-600">{notification.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700">📱 Teléfono:</p>
                            <p className="text-green-600">{notification.phone || 'No proporcionado'}</p>
                          </div>
                        </div>

                        {notification.requestId && (
                          <div className="mb-4">
                            <p className="text-sm font-semibold text-gray-700">🆔 ID de Solicitud:</p>
                            <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{notification.requestId}</p>
                          </div>
                        )}

                        <div className="mb-4">
                          <p className="text-sm font-semibold text-gray-700">💬 Mensaje:</p>
                          <div className="bg-white p-3 rounded border mt-2">
                            <pre className="whitespace-pre-wrap text-sm text-gray-800">{notification.message}</pre>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">
                          ⏰ Recibida: {new Date(notification.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="ml-6 space-y-2">
                        <a
                          href={`tel:${notification.phone}`}
                          className={`block w-full text-center px-4 py-2 rounded-lg font-semibold transition-colors ${
                            notification.phone 
                              ? 'bg-green-600 text-white hover:bg-green-700' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          📞 Llamar
                        </a>
                        <a
                          href={`mailto:${notification.email}`}
                          className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                          📧 Email
                        </a>
                        <a
                          href={`https://wa.me/${notification.phone?.replace(/[^\d]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`block w-full text-center px-4 py-2 rounded-lg font-semibold transition-colors ${
                            notification.phone 
                              ? 'bg-green-500 text-white hover:bg-green-600' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          💬 WhatsApp
                        </a>
                        <button
                          onClick={() => {
                            // Marcar como atendida
                            handleMarkAsAttended(notification.id);
                          }}
                          className="block w-full text-center px-4 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
                        >
                          ✅ Marcar Atendida
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500"
              >
                <div className="flex items-center">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-500">Clientes Totales</h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData?.summary?.totalClients || clients.length}
                    </p>
                  </div>
                  <div className="text-blue-500 text-2xl">👥</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500"
              >
                <div className="flex items-center">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-500">Campañas Activas</h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData?.summary?.activeCampaigns || campaigns.filter(c => c.status === 'active').length}
                    </p>
                  </div>
                  <div className="text-green-500 text-2xl">📢</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500"
              >
                <div className="flex items-center">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-500">Tareas Pendientes</h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData?.summary?.overdueTasksCount || tasks.filter(t => t.status === 'pending').length}
                    </p>
                  </div>
                  <div className="text-yellow-500 text-2xl">⏰</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500"
              >
                <div className="flex items-center">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-500">Contactos Web</h3>
                    <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
                  </div>
                  <div className="text-purple-500 text-2xl">📧</div>
                </div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowClientModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Nuevo Cliente</span>
              </button>
              <button
                onClick={() => setShowCampaignModal(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <span>📢</span>
                <span>Nueva Campaña</span>
              </button>
              <button
                onClick={() => setShowTaskModal(true)}
                className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
              >
                <span>✓</span>
                <span>Nueva Tarea</span>
              </button>
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Actividad Reciente</h2>
              </div>
              <div className="p-6">
                {dashboardData?.recentActivity?.slice(0, 5).map((activity, index) => (
                  <div key={activity.id} className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.subject}</p>
                      <p className="text-xs text-gray-500">{activity.client} • {new Date(activity.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {activity.type}
                    </span>
                  </div>
                )) || (
                  <p className="text-gray-500 text-center py-8">No hay actividad reciente</p>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Clients Section */}
        {activeSection === 'clients' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h2>
              <button
                onClick={() => setShowClientModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Nuevo Cliente</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asignado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clients.map((client) => (
                      <tr key={client.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{client.name}</div>
                            <div className="text-sm text-gray-500">{client.company}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            client.status === 'active' ? 'bg-green-100 text-green-800' :
                            client.status === 'negotiation' ? 'bg-yellow-100 text-yellow-800' :
                            client.status === 'prospect' ? 'bg-blue-100 text-blue-800' :
                            client.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {client.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${client.value?.toLocaleString() || '0'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.assignedTo || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setEditingItem(client);
                              setShowClientModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Campaigns Section */}
        {activeSection === 'campaigns' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Campañas</h2>
              <button
                onClick={() => setShowCampaignModal(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <span>📢</span>
                <span>Nueva Campaña</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaña</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Presupuesto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-500">{campaign.type}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                            campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                            campaign.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {campaign.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${campaign.budget.toLocaleString()} / ${campaign.spent.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div>CTR: {((campaign.clicks / campaign.impressions) * 100).toFixed(2)}%</div>
                            <div>Conv: {campaign.conversions}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setEditingItem(campaign);
                              setShowCampaignModal(true);
                            }}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Section */}
        {activeSection === 'tasks' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Tareas</h2>
              <button
                onClick={() => setShowTaskModal(true)}
                className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
              >
                <span>✓</span>
                <span>Nueva Tarea</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarea</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimiento</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asignado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tasks.map((task) => (
                      <tr key={task.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{task.title}</div>
                            <div className="text-sm text-gray-500">{task.clientName || 'Sin cliente'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            task.status === 'completed' ? 'bg-green-100 text-green-800' :
                            task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.assignedTo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setEditingItem(task);
                              setShowTaskModal(true);
                            }}
                            className="text-yellow-600 hover:text-yellow-900 mr-4"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Contacts Section */}
        {activeSection === 'contacts' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Contactos desde el Sitio Web</h2>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicio</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contacts.map((contact) => (
                      <tr key={contact.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contact.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.company || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.service}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            contact.status === 'new' ? 'bg-green-100 text-green-800' :
                            contact.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {contact.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Metrics Section */}
        {activeSection === 'metrics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Métricas Avanzadas</h2>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Sistema de Métricas Completo</h3>
                <p className="text-gray-600 mb-6">
                  Accede a métricas avanzadas, reportes interactivos y análisis de rendimiento de campañas
                </p>
                <button
                  onClick={() => window.open('/crm/metrics', '_blank')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                >
                  <span>📈</span>
                  <span>Ver Métricas Completas</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Client Modal */}
      {showClientModal && <ClientModal 
        isOpen={showClientModal}
        onClose={() => {
          setShowClientModal(false);
          setEditingItem(null);
        }}
        onSubmit={handleCreateClient}
        editingClient={editingItem}
      />}

      {/* Campaign Modal */}
      {showCampaignModal && <CampaignModal 
        isOpen={showCampaignModal}
        onClose={() => {
          setShowCampaignModal(false);
          setEditingItem(null);
        }}
        onSubmit={handleCreateCampaign}
        editingCampaign={editingItem}
        clients={clients}
      />}

      {/* Task Modal */}
      {showTaskModal && <TaskModal 
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setEditingItem(null);
        }}
        onSubmit={handleCreateTask}
        editingTask={editingItem}
        clients={clients}
      />}

      {/* User Modal */}
      {showUserModal && <UserModal 
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setEditingItem(null);
        }}
        onSubmit={handleCreateUser}
      />}
    </div>
  );
}

// Modal Components
function ClientModal({ isOpen, onClose, onSubmit, editingClient }: any) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'prospect',
    value: '',
    assignedTo: '',
    priority: 'medium'
  });

  useEffect(() => {
    if (editingClient) {
      setFormData({
        name: editingClient.name || '',
        email: editingClient.email || '',
        phone: editingClient.phone || '',
        company: editingClient.company || '',
        status: editingClient.status || 'prospect',
        value: editingClient.value?.toString() || '',
        assignedTo: editingClient.assignedTo || '',
        priority: editingClient.priority || 'medium'
      });
    }
  }, [editingClient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      value: parseFloat(formData.value) || 0,
      ...(editingClient && { id: editingClient.id })
    });
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'prospect',
      value: '',
      assignedTo: '',
      priority: 'medium'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">
          {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre completo"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="tel"
            placeholder="Teléfono"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Empresa"
            value={formData.company}
            onChange={(e) => setFormData({...formData, company: e.target.value})}
            className="w-full p-3 border rounded-lg"
          />
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="w-full p-3 border rounded-lg"
          >
            <option value="prospect">Prospecto</option>
            <option value="negotiation">Negociación</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="lost">Perdido</option>
          </select>
          <input
            type="number"
            placeholder="Valor estimado"
            value={formData.value}
            onChange={(e) => setFormData({...formData, value: e.target.value})}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Asignado a"
            value={formData.assignedTo}
            onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
            className="w-full p-3 border rounded-lg"
          />
          <select
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
            className="w-full p-3 border rounded-lg"
          >
            <option value="low">Prioridad Baja</option>
            <option value="medium">Prioridad Media</option>
            <option value="high">Prioridad Alta</option>
          </select>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingClient ? 'Actualizar' : 'Crear'} Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CampaignModal({ isOpen, onClose, onSubmit, editingCampaign, clients }: any) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'facebook',
    status: 'draft',
    budget: '',
    startDate: '',
    endDate: '',
    assignedTo: '',
    clientId: ''
  });

  useEffect(() => {
    if (editingCampaign) {
      setFormData({
        name: editingCampaign.name || '',
        type: editingCampaign.type || 'facebook',
        status: editingCampaign.status || 'draft',
        budget: editingCampaign.budget?.toString() || '',
        startDate: editingCampaign.startDate?.split('T')[0] || '',
        endDate: editingCampaign.endDate?.split('T')[0] || '',
        assignedTo: editingCampaign.assignedTo || '',
        clientId: editingCampaign.clientId || ''
      });
    }
  }, [editingCampaign]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      budget: parseFloat(formData.budget) || 0,
      ...(editingCampaign && { id: editingCampaign.id })
    });
    setFormData({
      name: '',
      type: 'facebook',
      status: 'draft',
      budget: '',
      startDate: '',
      endDate: '',
      assignedTo: '',
      clientId: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">
          {editingCampaign ? 'Editar Campaña' : 'Nueva Campaña'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre de la campaña"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-3 border rounded-lg"
            required
          />
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="w-full p-3 border rounded-lg"
          >
            <option value="facebook">Facebook Ads</option>
            <option value="google">Google Ads</option>
            <option value="instagram">Instagram Ads</option>
            <option value="tiktok">TikTok Ads</option>
            <option value="email">Email Marketing</option>
          </select>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="w-full p-3 border rounded-lg"
          >
            <option value="draft">Borrador</option>
            <option value="active">Activa</option>
            <option value="paused">Pausada</option>
            <option value="completed">Completada</option>
          </select>
          <input
            type="number"
            placeholder="Presupuesto"
            value={formData.budget}
            onChange={(e) => setFormData({...formData, budget: e.target.value})}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="date"
            placeholder="Fecha inicio"
            value={formData.startDate}
            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="date"
            placeholder="Fecha fin"
            value={formData.endDate}
            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            className="w-full p-3 border rounded-lg"
          />
          <select
            value={formData.clientId}
            onChange={(e) => setFormData({...formData, clientId: e.target.value})}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Seleccionar cliente</option>
            {clients.map((client: Client) => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Asignado a"
            value={formData.assignedTo}
            onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
            className="w-full p-3 border rounded-lg"
          />
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {editingCampaign ? 'Actualizar' : 'Crear'} Campaña
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TaskModal({ isOpen, onClose, onSubmit, editingTask, clients }: any) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    assignedTo: '',
    clientId: ''
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        status: editingTask.status || 'pending',
        priority: editingTask.priority || 'medium',
        dueDate: editingTask.dueDate?.split('T')[0] || '',
        assignedTo: editingTask.assignedTo || '',
        clientId: editingTask.clientId || ''
      });
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      ...(editingTask && { id: editingTask.id })
    });
    setFormData({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: '',
      assignedTo: '',
      clientId: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">
          {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Título de la tarea"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-3 border rounded-lg"
            required
          />
          <textarea
            placeholder="Descripción"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-3 border rounded-lg h-24 resize-none"
            required
          />
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="w-full p-3 border rounded-lg"
          >
            <option value="pending">Pendiente</option>
            <option value="in-progress">En Progreso</option>
            <option value="completed">Completada</option>
          </select>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
            className="w-full p-3 border rounded-lg"
          >
            <option value="low">Prioridad Baja</option>
            <option value="medium">Prioridad Media</option>
            <option value="high">Prioridad Alta</option>
          </select>
          <input
            type="date"
            placeholder="Fecha vencimiento"
            value={formData.dueDate}
            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
            className="w-full p-3 border rounded-lg"
            required
          />
          <select
            value={formData.clientId}
            onChange={(e) => setFormData({...formData, clientId: e.target.value})}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Seleccionar cliente</option>
            {clients.map((client: Client) => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Asignado a"
            value={formData.assignedTo}
            onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
            className="w-full p-3 border rounded-lg"
          />
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              {editingTask ? 'Actualizar' : 'Crear'} Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UserModal({ isOpen, onClose, onSubmit }: any) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    role: 'user'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      username: '',
      email: '',
      name: '',
      password: '',
      role: 'user'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">Crear Nuevo Usuario</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Nombre completo"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full p-3 border rounded-lg"
            required
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            className="w-full p-3 border rounded-lg"
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
            <option value="superadmin">Superadministrador</option>
          </select>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Crear Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}