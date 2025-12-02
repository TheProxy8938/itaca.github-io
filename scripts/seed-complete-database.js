const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando población completa de la base de datos...\n');

  try {
    // 1. Crear administradores
    console.log('👤 Creando administradores...');
    
    const adminPassword = await bcrypt.hash('admin123', 10);
    const dilanPassword = await bcrypt.hash('Proxy-8938', 10);
    
    const admin = await prisma.admin.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        email: 'admin@itacacomunicacion.com',
        password: adminPassword,
        name: 'Administrador Principal',
        role: 'SUPER_ADMIN',
        department: 'ADMINISTRACION',
        active: true,
      },
    });
    console.log('  ✓ Admin principal creado:', admin.email);

    const dilan = await prisma.admin.upsert({
      where: { email: 'proxemodelan5@gmail.com' },
      update: {},
      create: {
        username: 'dilan',
        email: 'proxemodelan5@gmail.com',
        password: dilanPassword,
        name: 'Dilan Hernandez',
        role: 'ADMIN',
        department: 'MARKETING',
        phone: '+1234567890',
        active: true,
      },
    });
    console.log('  ✓ Dilan Hernandez creado:', dilan.email);

    // 2. Crear configuraciones del sistema
    console.log('\n⚙️  Creando configuraciones del sistema...');
    
    const settings = [
      { id: 'company_name', value: 'Itaca Comunicación' },
      { id: 'company_email', value: 'contacto@itacacomunicacion.com' },
      { id: 'company_phone', value: '+52 123 456 7890' },
      { id: 'company_address', value: 'Ciudad de México, México' },
      { id: 'currency', value: 'MXN' },
      { id: 'tax_rate', value: '16' },
      { id: 'invoice_prefix', value: 'FAC' },
      { id: 'contract_prefix', value: 'CON' },
      { id: 'enable_notifications', value: 'true' },
      { id: 'session_timeout', value: '3600' },
    ];

    for (const setting of settings) {
      await prisma.setting.upsert({
        where: { id: setting.id },
        update: {},
        create: setting,
      });
    }
    console.log(`  ✓ ${settings.length} configuraciones creadas`);

    // 3. Crear plantillas de email
    console.log('\n📧 Creando plantillas de email...');
    
    const templates = [
      {
        name: 'Bienvenida Cliente',
        type: 'EMAIL',
        category: 'ONBOARDING',
        content: `Hola {{client_name}},

¡Bienvenido a Itaca Comunicación! Estamos emocionados de trabajar contigo.

Tu equipo de atención:
- Email: {{admin_email}}
- Teléfono: {{company_phone}}

Saludos,
El equipo de Itaca Comunicación`,
        variables: { client_name: 'Nombre del cliente', admin_email: 'Email del admin', company_phone: 'Teléfono' },
        isActive: true,
        createdById: dilan.id,
      },
      {
        name: 'Recordatorio de Reunión',
        type: 'EMAIL',
        category: 'MEETING',
        content: `Hola {{client_name}},

Este es un recordatorio de nuestra reunión programada:

📅 Fecha: {{meeting_date}}
⏰ Hora: {{meeting_time}}
📍 Lugar: {{meeting_location}}

Nos vemos pronto.

Saludos,
{{admin_name}}`,
        variables: { client_name: 'Nombre', meeting_date: 'Fecha', meeting_time: 'Hora', meeting_location: 'Ubicación', admin_name: 'Admin' },
        isActive: true,
        createdById: dilan.id,
      },
      {
        name: 'Factura Enviada',
        type: 'EMAIL',
        category: 'BILLING',
        content: `Hola {{client_name}},

Adjunto encontrarás la factura #{{invoice_number}} por un monto de {{amount}} {{currency}}.

Fecha de vencimiento: {{due_date}}

Para cualquier consulta, contáctanos.

Saludos,
Departamento de Facturación`,
        variables: { client_name: 'Nombre', invoice_number: 'Número', amount: 'Monto', currency: 'Moneda', due_date: 'Vencimiento' },
        isActive: true,
        createdById: admin.id,
      },
      {
        name: 'Propuesta de Campaña',
        type: 'DOCUMENT',
        category: 'PROPOSAL',
        content: `PROPUESTA DE CAMPAÑA DE MARKETING

Cliente: {{client_name}}
Campaña: {{campaign_name}}

OBJETIVOS:
{{campaign_objectives}}

ESTRATEGIA:
{{campaign_strategy}}

PRESUPUESTO ESTIMADO:
{{campaign_budget}} {{currency}}

DURACIÓN:
{{campaign_duration}}

Para más información, contacta a tu ejecutivo asignado.`,
        variables: { client_name: 'Cliente', campaign_name: 'Campaña', campaign_objectives: 'Objetivos', campaign_strategy: 'Estrategia', campaign_budget: 'Presupuesto', currency: 'Moneda', campaign_duration: 'Duración' },
        isActive: true,
        createdById: dilan.id,
      },
    ];

    for (const template of templates) {
      await prisma.template.create({ data: template });
    }
    console.log(`  ✓ ${templates.length} plantillas creadas`);

    // 4. Crear cliente de ejemplo
    console.log('\n👥 Creando cliente de ejemplo...');
    
    const exampleClient = await prisma.client.upsert({
      where: { email: 'ejemplo@cliente.com' },
      update: {},
      create: {
        name: 'Juan Pérez',
        email: 'ejemplo@cliente.com',
        phone: '+52 555 123 4567',
        company: 'Empresa Ejemplo S.A. de C.V.',
        industry: 'Tecnología',
        status: 'activo',
        source: 'WEB',
        priority: 'alta',
        address: 'Av. Reforma 123',
        city: 'Ciudad de México',
        country: 'México',
        monthlyBudget: 50000.00,
        assignedToId: dilan.id,
      },
    });
    console.log('  ✓ Cliente de ejemplo creado:', exampleClient.name);

    // 5. Crear campaña de ejemplo
    console.log('\n📊 Creando campaña de ejemplo...');
    
    const exampleCampaign = await prisma.campaign.create({
      data: {
        name: 'Campaña de Lanzamiento Digital',
        description: 'Campaña de ejemplo para lanzamiento de producto en redes sociales',
        type: 'redes_sociales',
        status: 'planificacion',
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-02-15'),
        budget: 50000.00,
        objective: 'Aumentar visibilidad de marca y generar leads',
        targetAudience: 'Profesionales 25-45 años interesados en tecnología',
        platform: 'Facebook, Instagram',
        createdById: admin.id,
        assignedToId: dilan.id,
      },
    });
    console.log('  ✓ Campaña de ejemplo creada:', exampleCampaign.name);

    // 6. Vincular cliente con campaña
    await prisma.clientCampaign.create({
      data: {
        clientId: exampleClient.id,
        campaignId: exampleCampaign.id,
        budget: 50000.00,
      },
    });
    console.log('  ✓ Cliente vinculado a campaña');

    // 7. Crear tareas de ejemplo
    console.log('\n✅ Creando tareas de ejemplo...');
    
    const tasks = [
      {
        title: 'Diseñar creativos para redes sociales',
        description: 'Crear 10 diseños para publicaciones en Instagram y Facebook',
        type: 'diseño',
        priority: 'alta',
        status: 'pendiente',
        dueDate: new Date('2025-01-10'),
        estimatedHours: 8.0,
        assignedToId: dilan.id,
        createdById: admin.id,
        campaignId: exampleCampaign.id,
        clientId: exampleClient.id,
      },
      {
        title: 'Redactar copy para anuncios',
        description: 'Escribir textos persuasivos para 5 anuncios diferentes',
        type: 'contenido',
        priority: 'alta',
        status: 'pendiente',
        dueDate: new Date('2025-01-12'),
        estimatedHours: 4.0,
        assignedToId: dilan.id,
        createdById: admin.id,
        campaignId: exampleCampaign.id,
        clientId: exampleClient.id,
      },
      {
        title: 'Configurar campañas en Facebook Ads',
        description: 'Crear y configurar audiencias, presupuestos y anuncios',
        type: 'publicidad',
        priority: 'media',
        status: 'pendiente',
        dueDate: new Date('2025-01-14'),
        estimatedHours: 6.0,
        assignedToId: dilan.id,
        createdById: admin.id,
        campaignId: exampleCampaign.id,
        clientId: exampleClient.id,
      },
    ];

    for (const task of tasks) {
      await prisma.task.create({ data: task });
    }
    console.log(`  ✓ ${tasks.length} tareas creadas`);

    // 8. Crear posts sociales de ejemplo
    console.log('\n📱 Creando posts sociales de ejemplo...');
    
    const posts = [
      {
        platform: 'instagram',
        content: '🚀 ¡Lanzamos algo increíble! Descubre nuestra nueva solución que transformará tu negocio. #Marketing #Digital',
        hashtags: '#Marketing #Digital #Transformación',
        scheduledFor: new Date('2025-01-15T10:00:00'),
        status: 'programado',
        campaignId: exampleCampaign.id,
        createdById: dilan.id,
      },
      {
        platform: 'facebook',
        content: '¿Quieres llevar tu marca al siguiente nivel? Te mostramos cómo. 💡',
        hashtags: '#Marketing #Marca',
        scheduledFor: new Date('2025-01-16T14:00:00'),
        status: 'programado',
        campaignId: exampleCampaign.id,
        createdById: dilan.id,
      },
      {
        platform: 'linkedin',
        content: 'Estrategias probadas para aumentar tu ROI en marketing digital. Lee nuestro último artículo. 📊',
        hashtags: '#MarketingDigital #ROI #Estrategia',
        scheduledFor: new Date('2025-01-17T09:00:00'),
        status: 'programado',
        campaignId: exampleCampaign.id,
        createdById: dilan.id,
      },
    ];

    for (const post of posts) {
      await prisma.socialPost.create({ data: post });
    }
    console.log(`  ✓ ${posts.length} posts sociales programados`);

    // 9. Crear métricas de campaña
    console.log('\n📈 Creando métricas iniciales...');
    
    await prisma.campaignMetric.create({
      data: {
        campaignId: exampleCampaign.id,
        date: new Date('2025-01-15'),
        impressions: 0,
        clicks: 0,
        conversions: 0,
        spend: 0,
        revenue: 0,
      },
    });
    console.log('  ✓ Métricas iniciales creadas');

    // 10. Crear interacción de ejemplo
    console.log('\n💬 Creando interacción de ejemplo...');
    
    await prisma.interaction.create({
      data: {
        clientId: exampleClient.id,
        adminId: dilan.id,
        type: 'llamada',
        subject: 'Llamada inicial de bienvenida',
        description: 'Cliente interesado en servicios de marketing digital. Programar reunión de seguimiento.',
        outcome: 'Positivo - Agendar reunión',
        duration: 15,
      },
    });
    console.log('  ✓ Interacción registrada');

    console.log('\n✨ ===================================');
    console.log('✨ BASE DE DATOS POBLADA EXITOSAMENTE');
    console.log('✨ ===================================\n');
    
    console.log('📋 RESUMEN DE DATOS CREADOS:');
    console.log('  • 2 Administradores (admin, dilan)');
    console.log('  • 10 Configuraciones del sistema');
    console.log('  • 4 Plantillas de email/documentos');
    console.log('  • 1 Cliente de ejemplo');
    console.log('  • 1 Campaña de marketing');
    console.log('  • 3 Tareas asignadas');
    console.log('  • 3 Posts sociales programados');
    console.log('  • 1 Interacción registrada');
    console.log('  • Métricas inicializadas\n');
    
    console.log('🔐 CREDENCIALES DE ACCESO:');
    console.log('  Admin Principal:');
    console.log('    Usuario: admin');
    console.log('    Email: admin@itacacomunicacion.com');
    console.log('    Password: admin123\n');
    console.log('  Dilan Hernandez:');
    console.log('    Usuario: dilan');
    console.log('    Email: proxemodelan5@gmail.com');
    console.log('    Password: Proxy-8938\n');

  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
