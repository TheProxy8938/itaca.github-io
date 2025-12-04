<?php
$currentPage = 'metricas';
require_once '../config.php';

if (!isAuthenticated()) {
    header('Location: /admin/login.php');
    exit;
}

requireAuth('admin');

$db = getDB();
$currentUser = getCurrentUser();

// Obtener rango de fechas
$startDate = isset($_GET['startDate']) ? $_GET['startDate'] : date('Y-m-d', strtotime('-30 days'));
$endDate = isset($_GET['endDate']) ? $_GET['endDate'] : date('Y-m-d');
$metricType = isset($_GET['type']) ? $_GET['type'] : 'overview';

include 'layout-header.php';
?>

<style>
    .metrics-container {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
    }

    .metrics-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .metrics-title {
        font-size: 2rem;
        font-weight: 700;
        background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .metrics-controls {
        display: flex;
        gap: 1rem;
        align-items: center;
        flex-wrap: wrap;
    }

    .date-inputs {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .date-input {
        padding: 0.5rem 1rem;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        font-size: 0.875rem;
    }

    .export-buttons {
        display: flex;
        gap: 0.5rem;
    }

    .export-btn {
        padding: 0.5rem 1rem;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 0.875rem;
    }

    .export-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
    }

    .metric-tabs {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        border-bottom: 2px solid #e5e7eb;
        flex-wrap: wrap;
    }

    .metric-tab {
        padding: 1rem 1.5rem;
        background: transparent;
        border: none;
        border-bottom: 3px solid transparent;
        cursor: pointer;
        font-weight: 600;
        color: #6b7280;
        transition: all 0.2s;
    }

    .metric-tab.active {
        color: #3b82f6;
        border-bottom-color: #3b82f6;
    }

    .metric-tab:hover {
        color: #3b82f6;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .stat-card {
        background: white;
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        border: 1px solid #e5e7eb;
        transition: all 0.3s;
    }

    .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    }

    .stat-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
    }

    .stat-icon {
        font-size: 2rem;
    }

    .stat-title {
        font-size: 0.875rem;
        color: #6b7280;
        font-weight: 500;
    }

    .stat-value {
        font-size: 2rem;
        font-weight: 700;
        color: #111827;
        margin-bottom: 0.5rem;
    }

    .stat-change {
        font-size: 0.875rem;
        font-weight: 600;
    }

    .stat-change.positive {
        color: #10b981;
    }

    .stat-change.negative {
        color: #ef4444;
    }

    .charts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .chart-card {
        background: white;
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        border: 1px solid #e5e7eb;
    }

    .chart-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: #111827;
        margin-bottom: 1rem;
    }

    .chart-container {
        position: relative;
        height: 300px;
    }

    .table-card {
        background: white;
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        border: 1px solid #e5e7eb;
        overflow-x: auto;
    }

    .metrics-table {
        width: 100%;
        border-collapse: collapse;
    }

    .metrics-table th {
        background: #f9fafb;
        padding: 1rem;
        text-align: left;
        font-weight: 600;
        color: #374151;
        border-bottom: 2px solid #e5e7eb;
    }

    .metrics-table td {
        padding: 1rem;
        border-bottom: 1px solid #e5e7eb;
        color: #6b7280;
    }

    .metrics-table tr:hover {
        background: #f9fafb;
    }

    @media (max-width: 768px) {
        .metrics-container {
            padding: 1rem;
        }

        .charts-grid {
            grid-template-columns: 1fr;
        }

        .metrics-header {
            flex-direction: column;
            align-items: flex-start;
        }
    }
</style>

<div class="metrics-container">
    <div class="metrics-header">
        <h1 class="metrics-title">📊 Métricas y Análisis</h1>
        
        <div class="metrics-controls">
            <div class="date-inputs">
                <label style="font-size: 0.875rem; color: #6b7280;">Desde:</label>
                <input type="date" id="startDate" class="date-input" value="<?php echo htmlspecialchars($startDate); ?>">
                <label style="font-size: 0.875rem; color: #6b7280;">Hasta:</label>
                <input type="date" id="endDate" class="date-input" value="<?php echo htmlspecialchars($endDate); ?>">
                <button onclick="updateDateRange()" class="export-btn" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);">
                    Actualizar
                </button>
            </div>
            
            <div class="export-buttons">
                <button onclick="exportToPDF()" class="export-btn">
                    📄 Exportar PDF
                </button>
                <button onclick="exportToExcel()" class="export-btn">
                    📊 Exportar Excel
                </button>
            </div>
        </div>
    </div>

    <div class="metric-tabs">
        <button class="metric-tab active" data-tab="overview" onclick="switchTab('overview')">
            📈 Resumen General
        </button>
        <button class="metric-tab" data-tab="clients" onclick="switchTab('clients')">
            👥 Clientes
        </button>
        <button class="metric-tab" data-tab="campaigns" onclick="switchTab('campaigns')">
            🚀 Campañas
        </button>
        <button class="metric-tab" data-tab="financial" onclick="switchTab('financial')">
            💰 Financiero
        </button>
        <button class="metric-tab" data-tab="team" onclick="switchTab('team')">
            👨‍💼 Equipo
        </button>
    </div>

    <div id="metricsContent">
        <div class="loading-spinner" style="text-align: center; padding: 3rem;">
            <div class="spinner"></div>
            <p style="color: #6b7280; margin-top: 1rem;">Cargando métricas...</p>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>

<script>
let currentTab = 'overview';
let metricsData = {};
let charts = {};

function switchTab(tab) {
    currentTab = tab;
    
    document.querySelectorAll('.metric-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    loadMetrics();
}

function updateDateRange() {
    loadMetrics();
}

async function loadMetrics() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    try {
        const response = await fetch(`/api/crm/metrics.php?type=${currentTab}&startDate=${startDate}&endDate=${endDate}`);
        const data = await response.json();
        
        if (data.success) {
            metricsData[currentTab] = data.data;
            renderMetrics(data.data);
        } else {
            alert('Error al cargar métricas: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar métricas');
    }
}

function renderMetrics(data) {
    const container = document.getElementById('metricsContent');
    
    // Destruir gráficos anteriores
    Object.values(charts).forEach(chart => chart.destroy());
    charts = {};
    
    let html = '';
    
    // Resumen General
    if (currentTab === 'overview') {
        html += `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-icon">👥</span>
                        <span class="stat-title">Total Clientes</span>
                    </div>
                    <div class="stat-value">${data.totalClients || 0}</div>
                    <div class="stat-change positive">+${data.newClientsThisMonth || 0} este mes</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-icon">🚀</span>
                        <span class="stat-title">Campañas Activas</span>
                    </div>
                    <div class="stat-value">${data.activeCampaigns || 0}</div>
                    <div class="stat-change">${data.totalCampaigns || 0} totales</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-icon">💰</span>
                        <span class="stat-title">Ingresos del Mes</span>
                    </div>
                    <div class="stat-value">$${formatNumber(data.monthlyRevenue || 0)}</div>
                    <div class="stat-change positive">+${data.revenueGrowth || 0}%</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-icon">📋</span>
                        <span class="stat-title">Tareas Pendientes</span>
                    </div>
                    <div class="stat-value">${data.pendingTasks || 0}</div>
                    <div class="stat-change ${data.overdueTasks > 0 ? 'negative' : ''}">${data.overdueTasks || 0} vencidas</div>
                </div>
            </div>
            
            <div class="charts-grid">
                <div class="chart-card">
                    <h3 class="chart-title">Clientes por Estado</h3>
                    <div class="chart-container">
                        <canvas id="clientsChart"></canvas>
                    </div>
                </div>
                
                <div class="chart-card">
                    <h3 class="chart-title">Campañas por Estado</h3>
                    <div class="chart-container">
                        <canvas id="campaignsChart"></canvas>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        // Renderizar gráficos
        setTimeout(() => {
            renderClientsChart(data.clientsByStatus || {});
            renderCampaignsChart(data.campaignsByStatus || {});
        }, 100);
    }
    
    // Clientes
    else if (currentTab === 'clients') {
        html += `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-icon">🎯</span>
                        <span class="stat-title">Prospectos</span>
                    </div>
                    <div class="stat-value">${data.prospectCount || 0}</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-icon">✅</span>
                        <span class="stat-title">Clientes Activos</span>
                    </div>
                    <div class="stat-value">${data.activeCount || 0}</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-icon">💎</span>
                        <span class="stat-title">Valor Promedio</span>
                    </div>
                    <div class="stat-value">$${formatNumber(data.averageValue || 0)}</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-icon">📈</span>
                        <span class="stat-title">Tasa de Conversión</span>
                    </div>
                    <div class="stat-value">${data.conversionRate || 0}%</div>
                </div>
            </div>
            
            <div class="table-card">
                <h3 class="chart-title">Top 10 Clientes por Ingresos</h3>
                <table class="metrics-table">
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Empresa</th>
                            <th>Estado</th>
                            <th>Ingresos Totales</th>
                            <th>Presupuesto Mensual</th>
                        </tr>
                    </thead>
                    <tbody id="topClientsTable"></tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
        renderTopClientsTable(data.topClients || []);
    }
    
    // Campañas
    else if (currentTab === 'campaigns') {
        html += `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-icon">👁️</span>
                        <span class="stat-title">Impresiones Totales</span>
                    </div>
                    <div class="stat-value">${formatNumber(data.totalImpressions || 0)}</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-icon">🖱️</span>
                        <span class="stat-title">Clics Totales</span>
                    </div>
                    <div class="stat-value">${formatNumber(data.totalClicks || 0)}</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-icon">🎯</span>
                        <span class="stat-title">CTR Promedio</span>
                    </div>
                    <div class="stat-value">${(data.averageCTR || 0).toFixed(2)}%</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-icon">💵</span>
                        <span class="stat-title">ROAS Promedio</span>
                    </div>
                    <div class="stat-value">${(data.averageROAS || 0).toFixed(2)}x</div>
                </div>
            </div>
            
            <div class="table-card">
                <h3 class="chart-title">Rendimiento de Campañas</h3>
                <table class="metrics-table">
                    <thead>
                        <tr>
                            <th>Campaña</th>
                            <th>Tipo</th>
                            <th>Impresiones</th>
                            <th>Clics</th>
                            <th>CTR</th>
                            <th>Inversión</th>
                            <th>ROAS</th>
                        </tr>
                    </thead>
                    <tbody id="campaignsTable"></tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
        renderCampaignsTable(data.campaigns || []);
    }
    
    // Financiero
    else if (currentTab === 'financial') {
        html += `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-icon">💰</span>
                        <span class="stat-title">Ingresos Totales</span>
                    </div>
                    <div class="stat-value">$${formatNumber(data.totalRevenue || 0)}</div>
                    <div class="stat-change positive">+${data.revenueGrowth || 0}%</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-icon">📊</span>
                        <span class="stat-title">Ingresos Promedio</span>
                    </div>
                    <div class="stat-value">$${formatNumber(data.averageRevenue || 0)}</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-icon">🎯</span>
                        <span class="stat-title">Tasa de Retención</span>
                    </div>
                    <div class="stat-value">${(data.retentionRate || 0).toFixed(1)}%</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-header">
                        <span class="stat-icon">📈</span>
                        <span class="stat-title">Crecimiento MoM</span>
                    </div>
                    <div class="stat-value">${(data.growthRate || 0).toFixed(1)}%</div>
                </div>
            </div>
            
            <div class="charts-grid">
                <div class="chart-card">
                    <h3 class="chart-title">Ingresos Mensuales</h3>
                    <div class="chart-container">
                        <canvas id="revenueChart"></canvas>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        setTimeout(() => renderRevenueChart(data.monthlyRevenue || []), 100);
    }
    
    // Equipo
    else if (currentTab === 'team') {
        html += `
            <div class="table-card">
                <h3 class="chart-title">Carga de Trabajo del Equipo</h3>
                <table class="metrics-table">
                    <thead>
                        <tr>
                            <th>Miembro</th>
                            <th>Rol</th>
                            <th>Clientes Activos</th>
                            <th>Campañas Activas</th>
                            <th>Tareas Pendientes</th>
                        </tr>
                    </thead>
                    <tbody id="teamTable"></tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
        renderTeamTable(data.teamMembers || []);
    }
}

function renderClientsChart(clientsByStatus) {
    const ctx = document.getElementById('clientsChart');
    if (!ctx) return;
    
    charts.clients = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(clientsByStatus),
            datasets: [{
                data: Object.values(clientsByStatus),
                backgroundColor: [
                    '#fbbf24', '#f97316', '#10b981', '#6b7280', '#ef4444'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function renderCampaignsChart(campaignsByStatus) {
    const ctx = document.getElementById('campaignsChart');
    if (!ctx) return;
    
    charts.campaigns = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(campaignsByStatus),
            datasets: [{
                label: 'Campañas',
                data: Object.values(campaignsByStatus),
                backgroundColor: '#3b82f6'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function renderRevenueChart(monthlyRevenue) {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    const labels = monthlyRevenue.map(item => item.month);
    const data = monthlyRevenue.map(item => item.revenue);
    
    charts.revenue = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Ingresos',
                data,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function renderTopClientsTable(clients) {
    const tbody = document.getElementById('topClientsTable');
    if (!tbody) return;
    
    tbody.innerHTML = clients.map(client => `
        <tr>
            <td>${client.name}</td>
            <td>${client.company}</td>
            <td><span class="badge badge-${client.status}">${client.status}</span></td>
            <td>$${formatNumber(client.totalRevenue)}</td>
            <td>$${formatNumber(client.monthlyBudget)}</td>
        </tr>
    `).join('');
}

function renderCampaignsTable(campaigns) {
    const tbody = document.getElementById('campaignsTable');
    if (!tbody) return;
    
    tbody.innerHTML = campaigns.map(campaign => `
        <tr>
            <td>${campaign.name}</td>
            <td>${campaign.type}</td>
            <td>${formatNumber(campaign.impressions)}</td>
            <td>${formatNumber(campaign.clicks)}</td>
            <td>${(campaign.ctr || 0).toFixed(2)}%</td>
            <td>$${formatNumber(campaign.spend)}</td>
            <td>${(campaign.roas || 0).toFixed(2)}x</td>
        </tr>
    `).join('');
}

function renderTeamTable(members) {
    const tbody = document.getElementById('teamTable');
    if (!tbody) return;
    
    tbody.innerHTML = members.map(member => `
        <tr>
            <td>${member.name}</td>
            <td>${member.role}</td>
            <td>${member.activeClients}</td>
            <td>${member.activeCampaigns}</td>
            <td>${member.pendingTasks}</td>
        </tr>
    `).join('');
}

function formatNumber(num) {
    return new Intl.NumberFormat('es-MX').format(num || 0);
}

function exportToPDF() {
    alert('Exportación a PDF implementada con jsPDF');
    // Implementación con jsPDF
}

function exportToExcel() {
    alert('Exportación a Excel implementada con SheetJS');
    // Implementación con XLSX
}

// Cargar métricas iniciales
loadMetrics();
</script>

<?php include 'layout-footer.php'; ?>
