import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface MetricsData {
  overview?: any;
  campaigns?: any;
  clients?: any;
  team?: any;
  financial?: any;
  performance?: any;
  charts?: any;
}

export default function AdvancedMetrics() {
  const [metricsData, setMetricsData] = useState<MetricsData>({});
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');
  const [exportLoading, setExportLoading] = useState(false);
  
  const chartsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchMetrics();
  }, [selectedMetric, dateRange]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        type: selectedMetric,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });

      const response = await fetch(`/api/crm/metrics?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Error al cargar métricas');
      }

      const data = await response.json();
      setMetricsData(prev => ({ ...prev, [selectedMetric]: data }));
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar métricas');
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    if (!chartsRef.current) return;
    
    setExportLoading(true);
    try {
      const canvas = await html2canvas(chartsRef.current, {
        useCORS: true,
        background: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      
      pdf.addImage(imgData, 'PNG', 10, 10, 277, 190);
      pdf.text('Reporte de Métricas - ÍTACA CRM', 20, 25);
      pdf.text(`Período: ${dateRange.startDate} a ${dateRange.endDate}`, 20, 35);
      pdf.text(`Generado: ${new Date().toLocaleDateString('es-MX')}`, 20, 45);
      
      pdf.save(`metricas-itaca-${selectedMetric}-${Date.now()}.pdf`);
      alert('Reporte PDF generado exitosamente');
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar reporte PDF');
    } finally {
      setExportLoading(false);
    }
  };

  const exportToExcel = () => {
    try {
      const data = metricsData[selectedMetric];
      if (!data) return;

      const wb = XLSX.utils.book_new();
      
      // Crear hoja con datos principales
      const ws = XLSX.utils.json_to_sheet(
        Object.entries(data).flatMap(([key, value]) => {
          if (Array.isArray(value)) {
            return value.map((item, index) => ({
              Sección: key,
              Índice: index,
              ...item
            }));
          }
          return [{
            Sección: key,
            Datos: JSON.stringify(value)
          }];
        })
      );
      
      XLSX.utils.book_append_sheet(wb, ws, `Métricas ${selectedMetric}`);
      XLSX.writeFile(wb, `metricas-itaca-${selectedMetric}-${Date.now()}.xlsx`);
      
      alert('Reporte Excel generado exitosamente');
    } catch (error) {
      console.error('Error generando Excel:', error);
      alert('Error al generar reporte Excel');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount || 0);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-MX').format(num || 0);
  };

  const getChartOptions = (title: string) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: "bold" as "bold"
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return typeof value === 'number' && value > 1000 ? 
              (value / 1000).toFixed(1) + 'K' : value;
          }
        }
      }
    }
  });

  const renderOverviewCharts = () => {
    const data = metricsData.overview;
    if (!data?.charts) return null;

    const clientGrowthData = {
      labels: data.charts.clientGrowth?.map((item: any) => 
        new Date(item.date).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })
      ) || [],
      datasets: [{
        label: 'Clientes Totales',
        data: data.charts.clientGrowth?.map((item: any) => item.total_clients) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };

    const statusDistributionData = {
      labels: data.charts.clientsByStatus?.map((item: any) => item.label) || [],
      datasets: [{
        data: data.charts.clientsByStatus?.map((item: any) => item.value) || [],
        backgroundColor: [
          '#FCD34D', // prospecto - yellow
          '#FB923C', // negociacion - orange
          '#34D399', // activo - green
          '#9CA3AF', // inactivo - gray
          '#F87171'  // perdido - red
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    };

    const leadSourcesData = {
      labels: data.charts.leadSources?.map((item: any) => item.label) || [],
      datasets: [{
        label: 'Leads por Fuente',
        data: data.charts.leadSources?.map((item: any) => item.value) || [],
        backgroundColor: [
          '#8B5CF6',
          '#06B6D4',
          '#10B981',
          '#F59E0B',
          '#EF4444'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="h-80">
            <Line 
              data={clientGrowthData} 
              options={getChartOptions('Crecimiento de Clientes')} 
            />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="h-80">
            <Doughnut 
              data={statusDistributionData} 
              options={{
                ...getChartOptions('Distribución por Estado'),
                plugins: {
                  ...getChartOptions('').plugins,
                  legend: {
                    position: 'bottom' as const,
                  }
                }
              }} 
            />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="h-80">
            <Bar 
              data={leadSourcesData} 
              options={getChartOptions('Fuentes de Leads')} 
            />
          </div>
        </div>
      </div>
    );
  };

  const renderCampaignCharts = () => {
    const data = metricsData.campaigns;
    if (!data?.charts) return null;

    const performanceData = {
      labels: data.charts.performanceByType?.map((item: any) => item.type) || [],
      datasets: [
        {
          label: 'Impresiones',
          data: data.charts.performanceByType?.map((item: any) => item.impressions) || [],
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          yAxisID: 'y'
        },
        {
          label: 'Clics',
          data: data.charts.performanceByType?.map((item: any) => item.clicks) || [],
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          yAxisID: 'y'
        },
        {
          label: 'Conversiones',
          data: data.charts.performanceByType?.map((item: any) => item.conversions) || [],
          backgroundColor: 'rgba(245, 158, 11, 0.8)',
          yAxisID: 'y1'
        }
      ]
    };

    const roiData = {
      labels: data.charts.topCampaigns?.map((item: any) => item.name.substring(0, 20)) || [],
      datasets: [{
        label: 'ROI %',
        data: data.charts.topCampaigns?.map((item: any) => item.roi) || [],
        backgroundColor: data.charts.topCampaigns?.map((item: any) => 
          item.roi > 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'
        ) || [],
        borderColor: '#ffffff',
        borderWidth: 2
      }]
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="h-80">
            <Bar 
              data={performanceData} 
              options={{
                ...getChartOptions('Performance por Tipo de Campaña'),
                scales: {
                  y: {
                    type: 'linear' as const,
                    display: true,
                    position: 'left' as const,
                    beginAtZero: true
                  },
                  y1: {
                    type: 'linear' as const,
                    display: true,
                    position: 'right' as const,
                    beginAtZero: true,
                    grid: {
                      drawOnChartArea: false,
                    },
                  }
                }
              }} 
            />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="h-80">
            <Bar 
              data={roiData} 
              options={getChartOptions('ROI por Campaña')} 
            />
          </div>
        </div>
      </div>
    );
  };

  const renderKPICards = () => {
    const data = metricsData[selectedMetric];
    if (!data) return null;

    let kpis: Array<{title: string, value: string, change?: string, icon: string, color: string}> = [];

    switch (selectedMetric) {
      case 'overview':
        kpis = [
          {
            title: 'Total Clientes',
            value: formatNumber(data.overview?.totalClients || 0),
            change: `+${data.overview?.newClients || 0} nuevos`,
            icon: '👥',
            color: 'blue'
          },
          {
            title: 'Campañas Activas', 
            value: formatNumber(data.overview?.activeCampaigns || 0),
            change: `de ${data.overview?.totalCampaigns || 0} totales`,
            icon: '📈',
            color: 'green'
          },
          {
            title: 'Ingresos Totales',
            value: formatCurrency(data.overview?.totalRevenue || 0),
            change: `Prom: ${formatCurrency(data.overview?.avgDealSize || 0)}`,
            icon: '💰',
            color: 'yellow'
          },
          {
            title: 'Tasa Conversión',
            value: `${data.overview?.conversionRate || 0}%`,
            change: `Retención: ${data.overview?.clientRetention || 0}%`,
            icon: '🎯',
            color: 'purple'
          }
        ];
        break;
        
      case 'campaigns':
        kpis = [
          {
            title: 'Impresiones Totales',
            value: formatNumber(data.aggregated?.totalImpressions || 0),
            icon: '👁️',
            color: 'blue'
          },
          {
            title: 'Clics Totales',
            value: formatNumber(data.aggregated?.totalClicks || 0),
            change: `CTR: ${data.aggregated?.averageCTR || 0}%`,
            icon: '🖱️',
            color: 'green'
          },
          {
            title: 'Inversión Total',
            value: formatCurrency(data.aggregated?.totalSpend || 0),
            change: `ROAS: ${data.aggregated?.totalROAS || 0}x`,
            icon: '💸',
            color: 'red'
          },
          {
            title: 'Conversiones',
            value: formatNumber(data.aggregated?.totalConversions || 0),
            change: `Tasa: ${data.aggregated?.averageConversionRate || 0}%`,
            icon: '✅',
            color: 'purple'
          }
        ];
        break;
        
      case 'team':
        kpis = [
          {
            title: 'Miembros Activos',
            value: formatNumber(data.summary?.totalMembers || 0),
            icon: '👨‍💼',
            color: 'blue'
          },
          {
            title: 'Clientes Asignados',
            value: formatNumber(data.summary?.totalClients || 0),
            icon: '🤝',
            color: 'green'
          },
          {
            title: 'Horas Trabajadas',
            value: formatNumber(data.summary?.totalHours || 0),
            icon: '⏰',
            color: 'yellow'
          },
          {
            title: 'Ingresos Generados',
            value: formatCurrency(data.summary?.totalRevenue || 0),
            icon: '💎',
            color: 'purple'
          }
        ];
        break;
        
      case 'financial':
        kpis = [
          {
            title: 'Ingresos Recurrentes',
            value: formatCurrency(data.projections?.monthlyRecurring || 0),
            change: 'Mensual',
            icon: '🔄',
            color: 'green'
          },
          {
            title: 'Proyección Anual',
            value: formatCurrency(data.projections?.annualProjection || 0),
            icon: '📊',
            color: 'blue'
          },
          {
            title: 'Contratos Activos',
            value: formatNumber(data.projections?.activeContracts || 0),
            icon: '📄',
            color: 'purple'
          }
        ];
        break;
    }

    const getColorClasses = (color: string) => {
      const colors = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600', 
        yellow: 'bg-yellow-100 text-yellow-600',
        purple: 'bg-purple-100 text-purple-600',
        red: 'bg-red-100 text-red-600'
      };
      return colors[color] || colors.blue;
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-lg ${getColorClasses(kpi.color)}`}>
                <span className="text-2xl">{kpi.icon}</span>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                {kpi.change && (
                  <p className="text-xs text-gray-600 mt-1">{kpi.change}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando métricas avanzadas...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Métricas Avanzadas - ÍTACA CRM</title>
        <meta name="description" content="Panel de métricas y analítica avanzada" />
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
                  <h1 className="text-2xl font-bold text-gray-900">📊 Métricas Avanzadas</h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={exportToExcel}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  📊 Excel
                </button>
                <button
                  onClick={exportToPDF}
                  disabled={exportLoading}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                >
                  {exportLoading ? '⏳' : '📄'} PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Selector de Métrica */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Métrica
                </label>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="overview">📊 Resumen General</option>
                  <option value="campaigns">📈 Campañas</option>
                  <option value="clients">👥 Clientes</option>
                  <option value="team">🏢 Equipo</option>
                  <option value="financial">💰 Financiero</option>
                  <option value="performance">⚡ Rendimiento</option>
                </select>
              </div>

              {/* Fecha Inicio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Fecha Fin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Botón Actualizar */}
              <div className="flex items-end">
                <button
                  onClick={fetchMetrics}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  🔄 Actualizar
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Content */}
          <div ref={chartsRef}>
            {/* KPI Cards */}
            {renderKPICards()}

            {/* Charts */}
            <div className="space-y-6">
              {selectedMetric === 'overview' && renderOverviewCharts()}
              {selectedMetric === 'campaigns' && renderCampaignCharts()}
              
              {/* Team Performance */}
              {selectedMetric === 'team' && metricsData.team?.teamMembers && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">👨‍💼 Rendimiento del Equipo</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Miembro</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clientes</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tareas</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campañas</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horas</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingresos</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {metricsData.team.teamMembers.map((member: any) => (
                          <tr key={member.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                <div className="text-sm text-gray-500">{member.role}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {member.activeClients}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-900">{member.activeTasks}</span>
                              <span className="text-xs text-green-600 ml-1">({member.completedTasks} ✅)</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {member.activeCampaigns}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {member.totalHours}h
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(member.clientRevenue)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Campaign Performance */}
              {selectedMetric === 'campaigns' && metricsData.campaigns?.campaigns && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">📈 Rendimiento de Campañas</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaña</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Impresiones</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CTR</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversiones</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ROAS</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsable</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {metricsData.campaigns.campaigns.map((campaign: any) => (
                          <tr key={campaign.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                              <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                                campaign.status === 'activa' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {campaign.status}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {campaign.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatNumber(campaign.totalImpressions)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {campaign.ctr}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-900">{campaign.totalConversions}</span>
                              <span className="text-xs text-blue-600 ml-1">({campaign.conversionRate}%)</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`text-sm font-medium ${
                                campaign.roas >= 2 ? 'text-green-600' : 
                                campaign.roas >= 1 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {campaign.roas}x
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {campaign.assignedTo}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}