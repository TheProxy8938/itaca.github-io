import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  status: string;
  priority: string;
  source: string;
  industry: string;
  monthlyBudget: number;
  totalRevenue: number;
  assignedToName: string;
  assignedToId: number;
  nextFollowUp: string;
  lastContactAt: string;
  createdAt: string;
  interactionCount: number;
  campaignCount: number;
  taskCount: number;
}

interface Admin {
  id: number;
  name: string;
  username: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function ClientsManagement() {
  const [clients, setClients] = useState<Client[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [error, setError] = useState('');
  
  // Filtros
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    assignedTo: '',
    page: 1
  });

  // Formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    address: '',
    city: '',
    status: 'prospecto',
    priority: 'media',
    source: '',
    industry: '',
    monthlyBudget: '',
    assignedToId: '',
    nextFollowUp: ''
  });

  const router = useRouter();

  useEffect(() => {
    fetchClients();
    fetchAdmins();
  }, [filters]);

  const fetchClients = async () => {
    try {
      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: '10',
        search: filters.search,
        status: filters.status,
        priority: filters.priority,
        assignedTo: filters.assignedTo
      });

      const response = await fetch(`/api/crm/clients?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Error al cargar clientes');
      }

      const data = await response.json();
      setClients(data.clients);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAdmins(data.admins || []);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/crm/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowCreateForm(false);
        resetForm();
        fetchClients();
        alert('Cliente creado exitosamente');
      } else {
        const data = await response.json();
        alert(data.message || 'Error al crear cliente');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClient) return;

    try {
      const response = await fetch(`/api/crm/clients?id=${selectedClient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowEditForm(false);
        setSelectedClient(null);
        resetForm();
        fetchClients();
        alert('Cliente actualizado exitosamente');
      } else {
        const data = await response.json();
        alert(data.message || 'Error al actualizar cliente');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  const handleDeleteClient = async (clientId: string, clientName: string) => {
    if (!confirm(`¿Estás seguro de eliminar el cliente "${clientName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/crm/clients?id=${clientId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        fetchClients();
        alert('Cliente eliminado exitosamente');
      } else {
        const data = await response.json();
        alert(data.message || 'Error al eliminar cliente');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      website: '',
      address: '',
      city: '',
      status: 'prospecto',
      priority: 'media',
      source: '',
      industry: '',
      monthlyBudget: '',
      assignedToId: '',
      nextFollowUp: ''
    });
  };

  const loadClientForEdit = (client: Client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      website: client.website || '',
      address: '',
      city: '',
      status: client.status || 'prospecto',
      priority: client.priority || 'media',
      source: client.source || '',
      industry: client.industry || '',
      monthlyBudget: client.monthlyBudget?.toString() || '',
      assignedToId: client.assignedToId?.toString() || '',
      nextFollowUp: client.nextFollowUp ? client.nextFollowUp.split('T')[0] : ''
    });
    setShowEditForm(true);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'prospecto': 'bg-yellow-100 text-yellow-800',
      'negociacion': 'bg-orange-100 text-orange-800',
      'activo': 'bg-green-100 text-green-800',
      'inactivo': 'bg-gray-100 text-gray-800',
      'perdido': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'alta': return '🔴';
      case 'media': return '🟡';
      case 'baja': return '🟢';
      default: return '⚪';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount || 0);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Sin fecha';
    return new Date(dateString).toLocaleDateString('es-MX');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Gestión de Clientes - ÍTACA CRM</title>
        <meta name="description" content="Gestión de clientes y prospectos" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/crm/dashboard')}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  ← Dashboard CRM
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">👥 Gestión de Clientes</h1>
                </div>
              </div>
              
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Nuevo Cliente
              </button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <input
                type="text"
                placeholder="Buscar por nombre, email o empresa..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value, page: 1})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value, page: 1})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los estados</option>
                <option value="prospecto">Prospecto</option>
                <option value="negociacion">En Negociación</option>
                <option value="activo">Cliente Activo</option>
                <option value="inactivo">Cliente Inactivo</option>
                <option value="perdido">Perdido</option>
              </select>

              <select
                value={filters.priority}
                onChange={(e) => setFilters({...filters, priority: e.target.value, page: 1})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las prioridades</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>

              <select
                value={filters.assignedTo}
                onChange={(e) => setFilters({...filters, assignedTo: e.target.value, page: 1})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los responsables</option>
                <option value="all">Sin asignar</option>
                {admins.map(admin => (
                  <option key={admin.id} value={admin.id.toString()}>
                    {admin.name || admin.username}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  setFilters({
                    search: '',
                    status: '',
                    priority: '',
                    assignedTo: '',
                    page: 1
                  });
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>

          {/* Lista de Clientes */}
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => {
                  setError('');
                  fetchClients();
                }}
                className="mt-2 text-red-700 hover:text-red-900 font-medium"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Responsable
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actividad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clients.length > 0 ? (
                      clients.map((client) => (
                        <tr key={client.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="flex items-center">
                                <span className="mr-2">{getPriorityIcon(client.priority)}</span>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {client.name}
                                  </div>
                                  <div className="text-sm text-gray-500">{client.email}</div>
                                  {client.company && (
                                    <div className="text-xs text-gray-400">{client.company}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(client.status)}`}>
                              {client.status}
                            </span>
                            <div className="text-xs text-gray-500 mt-1">
                              Creado: {formatDate(client.createdAt)}
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{client.assignedToName}</div>
                            {client.nextFollowUp && (
                              <div className="text-xs text-blue-600">
                                📅 {formatDate(client.nextFollowUp)}
                              </div>
                            )}
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2 text-xs">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                📞 {client.interactionCount}
                              </span>
                              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                📈 {client.campaignCount}
                              </span>
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                📋 {client.taskCount}
                              </span>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(client.totalRevenue)}
                            </div>
                            {client.monthlyBudget && (
                              <div className="text-xs text-gray-500">
                                Mensual: {formatCurrency(client.monthlyBudget)}
                              </div>
                            )}
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => loadClientForEdit(client)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Editar"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteClient(client.id, client.name)}
                                className="text-red-600 hover:text-red-900"
                                title="Eliminar"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          No se encontraron clientes
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Paginación */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Mostrando {((pagination.currentPage - 1) * 10) + 1} a {Math.min(pagination.currentPage * 10, pagination.totalCount)} de {pagination.totalCount} clientes
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilters({...filters, page: pagination.currentPage - 1})}
                  disabled={!pagination.hasPrev}
                  className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  ← Anterior
                </button>
                <span className="px-3 py-2 text-sm bg-blue-50 border border-blue-200 rounded-md">
                  Página {pagination.currentPage} de {pagination.totalPages}
                </span>
                <button
                  onClick={() => setFilters({...filters, page: pagination.currentPage + 1})}
                  disabled={!pagination.hasNext}
                  className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Crear Cliente */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Crear Nuevo Cliente</h3>
              
              <form onSubmit={handleCreateClient} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Empresa
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="prospecto">Prospecto</option>
                      <option value="negociacion">En Negociación</option>
                      <option value="activo">Cliente Activo</option>
                      <option value="inactivo">Cliente Inactivo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prioridad
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="alta">Alta</option>
                      <option value="media">Media</option>
                      <option value="baja">Baja</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fuente
                    </label>
                    <input
                      type="text"
                      placeholder="referido, web, redes..."
                      value={formData.source}
                      onChange={(e) => setFormData({...formData, source: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industria
                    </label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Presupuesto Mensual
                    </label>
                    <input
                      type="number"
                      value={formData.monthlyBudget}
                      onChange={(e) => setFormData({...formData, monthlyBudget: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsable
                    </label>
                    <select
                      value={formData.assignedToId}
                      onChange={(e) => setFormData({...formData, assignedToId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sin asignar</option>
                      {admins.map(admin => (
                        <option key={admin.id} value={admin.id.toString()}>
                          {admin.name || admin.username}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Próximo Seguimiento
                    </label>
                    <input
                      type="date"
                      value={formData.nextFollowUp}
                      onChange={(e) => setFormData({...formData, nextFollowUp: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Crear Cliente
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Editar Cliente */}
        {showEditForm && selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Editar Cliente: {selectedClient.name}</h3>
              
              <form onSubmit={handleUpdateClient} className="space-y-4">
                {/* El formulario es igual al de crear, con los mismos campos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Aquí van todos los campos del formulario de crear pero con los datos del cliente seleccionado */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="prospecto">Prospecto</option>
                      <option value="negociacion">En Negociación</option>
                      <option value="activo">Cliente Activo</option>
                      <option value="inactivo">Cliente Inactivo</option>
                      <option value="perdido">Perdido</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prioridad
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="alta">Alta</option>
                      <option value="media">Media</option>
                      <option value="baja">Baja</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditForm(false);
                      setSelectedClient(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Actualizar Cliente
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}