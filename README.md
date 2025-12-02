# 🚀 Itaca Comunicación - CRM & Website

Sistema integral de gestión de clientes (CRM) y sitio web corporativo para Itaca Comunicación.

## 📋 Características Principales

### Sitio Web Público
- **Landing Page** con diseño moderno y animaciones
- **Servicios**: Marketing, Comunicación, Diseño, Audiovisual, Prensa
- **Casos de Éxito** con proyectos destacados
- **Formulario de Contacto** con integración a base de datos
- **Chatbot Inteligente** para atención automatizada
- **FAQ** con preguntas frecuentes

### Sistema CRM
- **Dashboard Administrativo** con métricas en tiempo real
- **Gestión de Clientes** completa
- **Gestión de Campañas** de marketing
- **Sistema de Tareas** con asignación y seguimiento
- **Métricas y Reportes** avanzados
- **Sistema de Facturación** (en desarrollo)
- **Gestión de Contratos** (en desarrollo)

### Características Técnicas
- **Autenticación segura** con JWT
- **Base de datos PostgreSQL** en Supabase
- **API RESTful** con Next.js
- **Responsive Design** para todos los dispositivos
- **Animaciones** con Framer Motion
- **TypeScript** para mayor seguridad de tipos

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 13, React, TypeScript
- **Backend**: Next.js API Routes
- **Base de Datos**: PostgreSQL (Supabase)
- **ORM**: Prisma 6
- **Estilos**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Email**: EmailJS
- **Autenticación**: JWT + bcryptjs

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Proxy8938/itaca-crm.git
cd itaca-crm
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env.local` con:
```env
# Base de datos Supabase
DATABASE_URL="tu_database_url_aqui"

# Supabase API Keys
NEXT_PUBLIC_SUPABASE_URL="tu_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu_supabase_anon_key"

# JWT Secret
JWT_SECRET="tu_jwt_secret_seguro"

# EmailJS
NEXT_PUBLIC_EMAILJS_SERVICE_ID="tu_service_id"
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="tu_template_id"
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="tu_public_key"
```

4. **Configurar la base de datos**
```bash
# Generar Prisma Client
npx prisma generate

# Aplicar migraciones
npx prisma db push

# Poblar base de datos con datos iniciales
node scripts/seed-complete-database.js
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

El sitio estará disponible en `http://localhost:3000`

## 👤 Usuarios por Defecto

Después de ejecutar el seeding script, tendrás acceso a:

**Administrador Principal:**
- Email: `admin@itacacomunicacion.com`
- Password: `admin123`

**Dilan Hernandez:**
- Email: `proxemodelan5@gmail.com`
- Password: `Proxy-8938`

## 📁 Estructura del Proyecto

```
itaca-crm/
├── components/          # Componentes React reutilizables
├── lib/                # Utilidades y librerías
│   ├── auth.ts        # Autenticación JWT
│   ├── database.ts    # Prisma Client
│   └── email.ts       # Configuración de email
├── pages/             # Páginas y rutas
│   ├── api/          # API Routes
│   ├── admin/        # Dashboard administrativo
│   ├── crm/          # Sistema CRM
│   └── *.tsx         # Páginas públicas
├── prisma/           # Configuración de Prisma
│   └── schema.prisma # Esquema de base de datos
├── public/           # Archivos estáticos
├── scripts/          # Scripts de utilidad
├── styles/           # Estilos globales
└── utils/            # Funciones auxiliares
```

## 🚀 Despliegue en Producción

### Vercel (Recomendado)

1. **Conectar repositorio GitHub**
2. **Configurar variables de entorno** en Vercel Dashboard
3. **Desplegar automáticamente**

Ver documentación completa en: `DEPLOYMENT_GODADDY_SUPABASE.md`

### Build para producción
```bash
npm run build
npm start
```

## 📊 Base de Datos

El proyecto utiliza PostgreSQL con Prisma ORM. Modelos principales:

- **Admin** - Usuarios administradores
- **Client** - Clientes
- **Campaign** - Campañas de marketing
- **Task** - Tareas y seguimiento
- **Contact** - Contactos del formulario web
- **Invoice** - Facturas
- **Contract** - Contratos
- **Interaction** - Interacciones con clientes
- **SocialPost** - Publicaciones en redes sociales
- **Template** - Plantillas de email/documentos

## 🔒 Seguridad

- Autenticación JWT con tokens de sesión
- Contraseñas hasheadas con bcryptjs
- Variables de entorno protegidas
- Validación de permisos en API Routes
- Sanitización de inputs

## 📝 Scripts Disponibles

```bash
npm run dev          # Ejecutar en desarrollo
npm run build        # Build para producción
npm start            # Ejecutar build de producción
npm run lint         # Linter
npx prisma studio    # Interfaz visual de base de datos
npx prisma generate  # Generar Prisma Client
npx prisma db push   # Aplicar cambios de schema
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y pertenece a Itaca Comunicación.

## 📞 Contacto

**Itaca Comunicación**
- Email: contacto@itacacomunicacion.com
- Website: [En construcción]

---

Desarrollado con ❤️ por Itaca Comunicación
