import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';

interface DashboardData {
  summary: {
    totalClients: number;
    newClientsThisMonth: number;
    activeCampaigns: number;
    overdueTasksCount: number;
    monthlyRevenue: number;
    estimatedMonthlyValue: number;
  };
  clientDistribution: Array<{ status: string; count: number }>;
  campaignDistribution: Array<{ status: string; count: number }>;
  taskDistribution: Array<{ status: string; priority: string; count: number }>;
  recentActivity: Array<{
    id: string;
    type: string;
    subject: string;
    client: string;
    clientStatus: string;
    admin: string;
    createdAt: string;
  }>;
  upcomingFollowUps: Array<{
    id: string;
    name: string;
    email: string;
    status: string;
    priority: string;
    nextFollowUp: string;
    assignedTo: string;
  }>;
  campaignPerformance: Array<{
    id: string;
    name: string;
    type: string;
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    revenue: number;
    budget: number;
    ctr: number;
    roas: number;
    assignedTo: string;
  }>;
  teamWorkload: Array<{
    id: number;
    name: string;
    role: string;
    activeTasks: number;
    activeClients: number;
    activeCampaigns: number;
  }>;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Error al cargar datos');
      }

      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar el dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      // Clientes
      'prospecto': 'bg-yellow-100 text-yellow-800',
      'negociacion': 'bg-orange-100 text-orange-800',
      'activo': 'bg-green-100 text-green-800',
      'inactivo': 'bg-gray-100 text-gray-800',
      'perdido': 'bg-red-100 text-red-800',
      
      // Campañas
      'planificacion': 'bg-blue-100 text-blue-800',
      'activa': 'bg-green-100 text-green-800',
      'pausada': 'bg-yellow-100 text-yellow-800',
      'finalizada': 'bg-gray-100 text-gray-800',
      'revision': 'bg-purple-100 text-purple-800',
      
      // Prioridades
      'alta': 'bg-red-100 text-red-800',
      'media': 'bg-yellow-100 text-yellow-800',
      'baja': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'alta':
        return '🔴';
      case 'media':
        return '🟡';
      case 'baja':
        return '🟢';
      default:
        return '⚪';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <>
      <Head>
        <title>Dashboard - ÍTACA CRM</title>
        <meta name="description" content="Panel de control del CRM de ÍTACA Comunicación" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  ÍTACA CRM
                </h1>
                <span className="ml-3 text-sm text-gray-500">Dashboard</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/crm/clients')}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  👥 Clientes
                </button>
                <button
                  onClick={() => router.push('/crm/metrics')}
                  className="text-purple-600 hover:text-purple-800 transition-colors font-medium"
                >
                  📊 Métricas Avanzadas
                </button>
                <button
                  onClick={() => router.push('/admin/users')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ⚙️ Usuarios
                </button>
                <button
                  onClick={() => router.push('/logout')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  🚪 Salir
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* KPIs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-xl">👥</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Clientes</p>
                  <p className="text-2xl font-bold text-gray-900">{data.summary.totalClients}</p>
                  <p className="text-xs text-green-600">+{data.summary.newClientsThisMonth} este mes</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">📈</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Campañas Activas</p>
                  <p className="text-2xl font-bold text-gray-900">{data.summary.activeCampaigns}</p>
                  <p className="text-xs text-blue-600">En ejecución</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-600 text-xl">⚠️</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Tareas Vencidas</p>
                  <p className="text-2xl font-bold text-gray-900">{data.summary.overdueTasksCount}</p>
                  <p className="text-xs text-red-600">Requieren atención</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">💰</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Ingresos del Mes</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(data.summary.monthlyRevenue)}
                  </p>
                  <p className="text-xs text-gray-600">
                    Proyectado: {formatCurrency(data.summary.estimatedMonthlyValue)}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Actividad Reciente */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">📋 Actividad Reciente</h3>
                </div>
                <div className="p-6">
                  {data.recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {data.recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0">
                            <span className="text-lg">
                              {activity.type === 'llamada' ? '📞' : 
                               activity.type === 'email' ? '📧' : 
                               activity.type === 'reunion' ? '🤝' : '📝'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {activity.subject}
                            </p>
                            <p className="text-sm text-gray-600">
                              Cliente: <span className="font-medium">{activity.client}</span>
                              <span className={`ml-2 inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(activity.clientStatus)}`}>
                                {activity.clientStatus}
                              </span>
                            </p>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <span>👤 {activity.admin}</span>
                              <span className="mx-1">•</span>
                              <span>{formatDate(activity.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No hay actividad reciente</p>
                  )}
                </div>
              </div>

              {/* Rendimiento de Campañas */}
              <div className="bg-white rounded-lg shadow-md mt-6">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">📊 Campañas Activas</h3>
                </div>
                <div className="p-6">
                  {data.campaignPerformance.length > 0 ? (
                    <div className="space-y-4">
                      {data.campaignPerformance.map((campaign) => (
                        <div key={campaign.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(campaign.type)}`}>
                              {campaign.type}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Impresiones</p>
                              <p className="font-semibold">{campaign.impressions.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Clics</p>
                              <p className="font-semibold">{campaign.clicks.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">CTR</p>
                              <p className="font-semibold">{campaign.ctr}%</p>
                            </div>
                            <div>
                              <p className="text-gray-500">ROAS</p>
                              <p className="font-semibold">{campaign.roas}x</p>
                            </div>
                          </div>
                          
                          <div className="mt-2 text-xs text-gray-500">
                            <span>👤 {campaign.assignedTo}</span>
                            <span className="mx-1">•</span>
                            <span>💰 {formatCurrency(campaign.spend)} / {formatCurrency(campaign.budget || 0)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No hay campañas activas</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Próximos Seguimientos */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">⏰ Próximos Seguimientos</h3>
                </div>
                <div className="p-6">
                  {data.upcomingFollowUps.length > 0 ? (
                    <div className="space-y-3">
                      {data.upcomingFollowUps.map((followUp) => (
                        <div key={followUp.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{followUp.name}</span>
                            <span className="text-lg">{getPriorityIcon(followUp.priority)}</span>
                          </div>
                          <p className="text-xs text-gray-600">{followUp.email}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            📅 {formatDate(followUp.nextFollowUp)}
                          </p>
                          <p className="text-xs text-gray-500">
                            👤 {followUp.assignedTo}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No hay seguimientos programados</p>
                  )}
                </div>
              </div>

              {/* Carga de Trabajo del Equipo */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">👥 Equipo</h3>
                </div>
                <div className="p-6">
                  {data.teamWorkload.length > 0 ? (
                    <div className="space-y-3">
                      {data.teamWorkload.map((member) => (
                        <div key={member.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{member.name}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(member.role)}`}>
                              {member.role}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                            <div>📋 {member.activeTasks}</div>
                            <div>👥 {member.activeClients}</div>
                            <div>📈 {member.activeCampaigns}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No hay miembros del equipo</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}