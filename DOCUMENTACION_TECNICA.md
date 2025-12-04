# 📚 Documentación Técnica Completa - Itaca CRM

**Proyecto:** Itaca Comunicación - CRM & Website  
**Versión:** 1.0.0  
**Fecha:** Diciembre 2025  
**Repositorio:** https://github.com/TheProxy8938/itaca.github-io

---

## 📋 Índice

1. [Stack Tecnológico](#stack-tecnológico)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Estructura de Directorios](#estructura-de-directorios)
4. [Componentes React](#componentes-react)
5. [APIs y Rutas](#apis-y-rutas)
6. [Base de Datos](#base-de-datos)
7. [Configuración de Email](#configuración-de-email)
8. [Dependencias del Proyecto](#dependencias-del-proyecto)
9. [Scripts Disponibles](#scripts-disponibles)
10. [Variables de Entorno](#variables-de-entorno)

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** Next.js 13.4.19
- **Lenguaje:** TypeScript 5.2.2
- **UI Library:** React 18.2.0
- **Estilos:** Tailwind CSS 3.3.3
- **Animaciones:** Framer Motion 10.16.4
- **Componentes:** @headlessui/react 1.7.17

### Backend
- **Runtime:** Node.js (Requerido: v18.x o superior)
- **API:** Next.js API Routes
- **Autenticación:** 
  - JSON Web Tokens (jsonwebtoken 9.0.2)
  - NextAuth.js 4.23.1
  - bcryptjs 3.0.2 (encriptación de contraseñas)

### Base de Datos
- **Tipo:** PostgreSQL
- **Hosting:** Supabase
- **ORM:** Prisma 6.16.2
- **Cliente:** @prisma/client 6.16.3

### Librerías Adicionales
- **Gráficos:** Chart.js 4.5.0 + react-chartjs-2 5.3.0
- **Email:** 
  - @emailjs/browser 4.4.1 (formularios web)
  - nodemailer 6.10.1 (emails backend)
- **PDF:** jspdf 3.0.3
- **Excel:** xlsx 0.18.5
- **Capturas:** html2canvas 1.4.1

---

## 🏗️ Arquitectura del Proyecto

### Tipo de Aplicación
- **SSR/SSG Híbrido:** Combina Server-Side Rendering y Static Site Generation
- **Monolito Modular:** Frontend y Backend en el mismo proyecto
- **API RESTful:** Comunicación mediante endpoints HTTP

### Patrones de Diseño
- **MVC (Model-View-Controller)**
  - Models: Prisma Schema (`prisma/schema.prisma`)
  - Views: Componentes React (`components/`, `pages/`)
  - Controllers: API Routes (`pages/api/`)

- **Composición de Componentes**
  - Componentes reutilizables en `components/`
  - Páginas que componen componentes en `pages/`

### Flujo de Autenticación
```
Usuario → Login Form → API /auth/login → Validación
→ JWT Token → LocalStorage → Protected Routes
```

---

## 📁 Estructura de Directorios

```
itaca-crm/
│
├── 📂 components/               # Componentes React Reutilizables
│   ├── AnimatedWord.tsx        # Animación de palabras letra por letra
│   ├── BannerScroll.tsx        # Carrusel de banners
│   ├── CaseStudy.tsx           # Tarjeta de caso de éxito
│   ├── Chatbot.tsx             # Widget de chatbot
│   ├── HeroCarousel.tsx        # Carrusel principal del hero
│   ├── KeywordAnimation.tsx    # Animación de palabras clave
│   ├── Layout.tsx              # Layout base con nav/footer
│   └── ValueCard.tsx           # Tarjeta de valores de empresa
│
├── 📂 lib/                     # Librerías y Utilidades
│   ├── auth.ts                 # Funciones de autenticación JWT
│   ├── database.ts             # Prisma Client Singleton
│   ├── email.ts                # Configuración de Nodemailer
│   └── motivational-ai.ts      # Sistema de IA motivacional
│
├── 📂 pages/                   # Páginas y Rutas de Next.js
│   │
│   ├── 📂 api/                 # API Routes (Backend)
│   │   ├── 📂 admin/
│   │   │   ├── contacts.ts     # CRUD de contactos (admin)
│   │   │   ├── users.ts        # Gestión de usuarios admin
│   │   │   └── 📂 contacts/
│   │   │       └── [id].ts     # Operaciones por ID
│   │   │
│   │   ├── 📂 auth/
│   │   │   ├── login.ts        # Endpoint de login
│   │   │   ├── logout.ts       # Endpoint de logout
│   │   │   ├── forgot-password.ts  # Recuperación de contraseña
│   │   │   └── reset-password.ts   # Reset de contraseña
│   │   │
│   │   ├── 📂 chatbot/
│   │   │   └── urgent-request.ts   # Solicitudes urgentes del chatbot
│   │   │
│   │   ├── 📂 crm/
│   │   │   ├── clients.ts      # CRUD de clientes
│   │   │   ├── campaigns.ts    # CRUD de campañas
│   │   │   ├── tasks.ts        # CRUD de tareas
│   │   │   ├── metrics.ts      # Métricas y analytics
│   │   │   └── seed-data.ts    # Generador de datos de prueba
│   │   │
│   │   ├── 📂 dashboard/
│   │   │   └── stats.ts        # Estadísticas del dashboard
│   │   │
│   │   ├── 📂 personal-chat/
│   │   │   ├── conversations.ts    # Conversaciones del chat
│   │   │   └── messages.ts         # Mensajes del chat
│   │   │
│   │   └── contact.ts          # Endpoint de formulario de contacto
│   │
│   ├── 📂 admin/               # Panel Administrativo
│   │   ├── dashboard.tsx       # Dashboard principal
│   │   └── users.tsx           # Gestión de usuarios
│   │
│   ├── 📂 crm/                 # Sistema CRM
│   │   ├── dashboard.tsx       # Dashboard CRM
│   │   ├── clients.tsx         # Gestión de clientes
│   │   └── metrics.tsx         # Métricas avanzadas
│   │
│   ├── 📂 personal/            # Funcionalidades personales
│   │   └── chat.tsx            # Chat personal con IA
│   │
│   ├── _app.tsx                # App wrapper global
│   ├── index.tsx               # Página de inicio
│   ├── login.tsx               # Página de login
│   ├── contacto.tsx            # Formulario de contacto
│   ├── servicios.tsx           # Página de servicios
│   ├── casos-de-exito.tsx      # Casos de éxito
│   ├── nosotros.tsx            # Página sobre nosotros
│   ├── faq.tsx                 # Preguntas frecuentes
│   ├── forgot-password.tsx     # Recuperar contraseña
│   ├── reset-password.tsx      # Resetear contraseña
│   ├── politica-privacidad.tsx # Política de privacidad
│   └── terminos-condiciones.tsx # Términos y condiciones
│
├── 📂 prisma/                  # Configuración de Prisma ORM
│   ├── schema.prisma           # Esquema de base de datos
│   └── 📂 migrations/          # Migraciones de base de datos
│
├── 📂 public/                  # Archivos estáticos
│   ├── 📂 banner/              # Imágenes de banners
│   ├── 📂 ceo/                 # Foto del CEO
│   ├── 📂 equipo/              # Fotos del equipo
│   ├── 📂 servicios/           # Imágenes de servicios
│   └── 📂 videos/              # Videos de fondo
│
├── 📂 scripts/                 # Scripts de utilidad
│   └── seed-complete-database.js   # Población de BD
│
├── 📂 styles/                  # Estilos globales
│   └── globals.css             # CSS global + Tailwind
│
├── 📄 .env                     # Variables de entorno (desarrollo)
├── 📄 .env.local               # Variables de entorno (local)
├── 📄 .env.example             # Plantilla de variables
├── 📄 .gitignore               # Archivos ignorados por Git
├── 📄 next.config.js           # Configuración de Next.js
├── 📄 tailwind.config.js       # Configuración de Tailwind
├── 📄 tsconfig.json            # Configuración de TypeScript
├── 📄 postcss.config.js        # Configuración de PostCSS
├── 📄 package.json             # Dependencias y scripts
└── 📄 README.md                # Documentación principal
```

---

## ⚛️ Componentes React

### 1. **AnimatedWord.tsx**
**Propósito:** Anima palabras letra por letra con efecto de typing  
**Props:**
- `text: string` - Texto a animar
- `className?: string` - Clases CSS adicionales

**Tecnologías:** Framer Motion

---

### 2. **BannerScroll.tsx**
**Propósito:** Carrusel automático de banners promocionales  
**Características:**
- Auto-scroll cada 5 segundos
- Navegación con botones
- Indicadores de posición
- Responsive

**Estado:**
- `currentSlide: number` - Slide actual

---

### 3. **CaseStudy.tsx**
**Propósito:** Tarjeta de presentación de casos de éxito  
**Props:**
- `title: string` - Título del caso
- `description: string` - Descripción
- `image: string` - URL de imagen
- `results: string[]` - Resultados obtenidos

**Efectos:** Hover con scale y shadow

---

### 4. **Chatbot.tsx**
**Propósito:** Widget de chat para atención al cliente  
**Características:**
- Respuestas predefinidas
- Detección de palabras clave
- Formulario de solicitud urgente
- Conexión con API `/api/chatbot/urgent-request`

**Estado:**
- `isOpen: boolean` - Estado del chat
- `messages: Message[]` - Historial de mensajes
- `userInput: string` - Input del usuario

---

### 5. **HeroCarousel.tsx**
**Propósito:** Carrusel principal del hero section  
**Características:**
- Transiciones suaves
- Auto-play
- Controles de navegación
- Videos de fondo

**Tecnologías:** Framer Motion, AnimatePresence

---

### 6. **KeywordAnimation.tsx**
**Propósito:** Rotación de palabras clave con animación  
**Props:**
- `keywords: string[]` - Array de palabras
- `interval?: number` - Tiempo entre cambios (ms)

**Efectos:** Fade in/out con Framer Motion

---

### 7. **Layout.tsx**
**Propósito:** Layout base para todas las páginas  
**Incluye:**
- Navbar con navegación
- Footer con información de contacto
- Meta tags
- Scripts globales

**Props:**
- `children: ReactNode` - Contenido de la página
- `title?: string` - Título de la página

---

### 8. **ValueCard.tsx**
**Propósito:** Tarjeta de valores de la empresa  
**Props:**
- `icon: string` - Emoji o ícono
- `title: string` - Título del valor
- `description: string` - Descripción

**Efectos:** Hover con elevación

---

## 🔌 APIs y Rutas

### Autenticación (`/api/auth/`)

#### POST `/api/auth/login`
**Descripción:** Autenticación de usuarios  
**Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```
**Respuesta:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@itaca.com",
    "role": "SUPER_ADMIN"
  }
}
```

#### POST `/api/auth/logout`
**Descripción:** Cerrar sesión  
**Headers:** `Authorization: Bearer {token}`

#### POST `/api/auth/forgot-password`
**Descripción:** Solicitar recuperación de contraseña  
**Body:**
```json
{
  "email": "usuario@itaca.com"
}
```

#### POST `/api/auth/reset-password`
**Descripción:** Resetear contraseña con código  
**Body:**
```json
{
  "code": "123456",
  "newPassword": "nueva_contraseña"
}
```

---

### CRM (`/api/crm/`)

#### GET/POST `/api/crm/clients`
**Descripción:** Gestión de clientes  
**Métodos:**
- **GET:** Listar clientes con filtros
- **POST:** Crear nuevo cliente
- **PUT:** Actualizar cliente
- **DELETE:** Eliminar cliente

**Query Params (GET):**
- `status` - Filtrar por estado
- `priority` - Filtrar por prioridad
- `search` - Búsqueda por nombre/email

#### GET/POST `/api/crm/campaigns`
**Descripción:** Gestión de campañas de marketing  
**Campos:**
- `name`, `description`, `type`, `status`
- `budget`, `startDate`, `endDate`
- `objective`, `targetAudience`

#### GET/POST `/api/crm/tasks`
**Descripción:** Sistema de tareas  
**Campos:**
- `title`, `description`, `type`, `priority`
- `status`, `dueDate`, `assignedToId`
- `clientId`, `campaignId`

#### GET `/api/crm/metrics`
**Descripción:** Métricas y analytics avanzados  
**Query Params:**
- `type` - Tipo de métrica (revenue, campaigns, clients)
- `granularity` - Granularidad (day, week, month)
- `startDate`, `endDate` - Rango de fechas

---

### Dashboard (`/api/dashboard/`)

#### GET `/api/dashboard/stats`
**Descripción:** Estadísticas del dashboard  
**Respuesta:**
```json
{
  "stats": {
    "totalClients": 45,
    "activeClients": 32,
    "totalCampaigns": 12,
    "activeCampaigns": 5,
    "totalRevenue": 125000,
    "pendingTasks": 23
  },
  "recentActivity": [...],
  "topCampaigns": [...]
}
```

---

### Contacto (`/api/contact`)

#### POST `/api/contact`
**Descripción:** Formulario de contacto del sitio web  
**Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "company": "Empresa XYZ",
  "phone": "+52 555 1234",
  "service": "Marketing Digital",
  "message": "Mensaje del cliente"
}
```
**Integración:** EmailJS + Base de datos

---

## 🗄️ Base de Datos

### Tecnología
- **Sistema:** PostgreSQL 14+
- **Hosting:** Supabase
- **ORM:** Prisma 6.16.2

### Modelos Principales

#### 1. **Admin**
Usuarios administradores del sistema
```prisma
model Admin {
  id       Int     @id @default(autoincrement())
  username String  @unique
  email    String  @unique
  password String
  name     String?
  role     String  @default("admin")
  active   Boolean @default(true)
  department String?
  phone    String?
  // Relaciones...
}
```

#### 2. **Client**
Clientes de la empresa
```prisma
model Client {
  id            String   @id @default(cuid())
  name          String
  email         String   @unique
  phone         String?
  company       String?
  status        String   @default("prospecto")
  priority      String   @default("media")
  industry      String?
  monthlyBudget Float?
  assignedToId  Int?
  // Relaciones...
}
```

#### 3. **Campaign**
Campañas de marketing
```prisma
model Campaign {
  id             String   @id @default(cuid())
  name           String
  type           String
  status         String   @default("planificacion")
  budget         Float?
  startDate      DateTime?
  endDate        DateTime?
  objective      String?
  targetAudience String?
  createdById    Int
  // Relaciones...
}
```

#### 4. **Task**
Tareas y seguimiento
```prisma
model Task {
  id           String    @id @default(cuid())
  title        String
  description  String?
  type         String    @default("general")
  priority     String    @default("media")
  status       String    @default("pendiente")
  dueDate      DateTime?
  assignedToId Int?
  clientId     String?
  campaignId   String?
  // Relaciones...
}
```

#### 5. **Contact**
Contactos del formulario web
```prisma
model Contact {
  id      Int     @id @default(autoincrement())
  name    String
  email   String
  company String?
  phone   String?
  service String
  message String
  status  String  @default("new")
}
```

#### Otros Modelos
- **Session** - Sesiones de usuarios
- **Invoice** - Facturas
- **Contract** - Contratos
- **Interaction** - Interacciones con clientes
- **SocialPost** - Posts en redes sociales
- **Template** - Plantillas de email/documentos
- **Setting** - Configuraciones del sistema
- **CampaignMetric** - Métricas de campañas
- **PasswordResetToken** - Tokens de recuperación

### Comandos Prisma

```bash
# Generar Prisma Client
npx prisma generate

# Aplicar cambios al schema
npx prisma db push

# Abrir interfaz visual
npx prisma studio

# Poblar base de datos
npm run db:seed
```

---

## 📧 Configuración de Email

### **Email Corporativo Disponible**
```
📧 Email: ecabello@itaca.mx.com
🏢 Proveedor: Titan (GoDaddy)
⚠️ Nota: NO está conectado a Google Workspace
```

### Integración Actual

#### 1. **EmailJS** (Formularios Web)
**Uso:** Envío de formularios de contacto desde el sitio web  
**Configuración:**
```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_hjuxa1m
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_awl2zgn
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=0kpDXQLXxbKCjUhGa
```

**Implementación:**
```typescript
// pages/contacto.tsx
import emailjs from '@emailjs/browser';

await emailjs.send(
  serviceId,
  templateId,
  formData,
  publicKey
);
```

#### 2. **Nodemailer** (Backend)
**Uso:** Emails desde el servidor (recuperación de contraseña, notificaciones)  
**Configuración Disponible:**
```javascript
// lib/email.ts
const transporter = nodemailer.createTransporter({
  host: 'smtp.titan.email',  // SMTP de Titan
  port: 587,
  secure: false,
  auth: {
    user: 'ecabello@itaca.mx.com',
    pass: process.env.EMAIL_PASSWORD
  }
});
```

**Estado:** ⚠️ Configuración SMTP pendiente de activar

### Recomendaciones para Email

1. **Configurar SMTP de Titan:**
   - Host: `smtp.titan.email`
   - Puerto: 587 (TLS) o 465 (SSL)
   - Usuario: `ecabello@itaca.mx.com`
   - Contraseña: (configurar en .env)

2. **Variables de Entorno Necesarias:**
```env
EMAIL_HOST=smtp.titan.email
EMAIL_PORT=587
EMAIL_USER=ecabello@itaca.mx.com
EMAIL_PASSWORD=tu_contraseña_aqui
EMAIL_FROM=ecabello@itaca.mx.com
```

3. **Funcionalidades de Email:**
   - ✅ Formularios de contacto (EmailJS)
   - ⚠️ Recuperación de contraseña (pendiente)
   - ⚠️ Notificaciones de tareas (pendiente)
   - ⚠️ Bienvenida a nuevos clientes (pendiente)

---

## 📦 Dependencias del Proyecto

### Dependencias de Producción

```json
{
  "@emailjs/browser": "^4.4.1",        // Envío de emails desde frontend
  "@headlessui/react": "^1.7.17",      // Componentes UI accesibles
  "@prisma/client": "^6.16.3",         // Cliente de Prisma ORM
  "bcryptjs": "^3.0.2",                // Encriptación de contraseñas
  "chart.js": "^4.5.0",                // Librería de gráficos
  "framer-motion": "^10.16.4",         // Animaciones avanzadas
  "html2canvas": "^1.4.1",             // Capturas de pantalla
  "jsonwebtoken": "^9.0.2",            // JSON Web Tokens
  "jspdf": "^3.0.3",                   // Generación de PDFs
  "next": "^13.4.19",                  // Framework React
  "next-auth": "^4.23.1",              // Autenticación
  "nodemailer": "^6.10.1",             // Envío de emails backend
  "prisma": "^6.16.2",                 // Prisma CLI
  "react": "^18.2.0",                  // React
  "react-chartjs-2": "^5.3.0",         // React wrapper para Chart.js
  "react-dom": "^18.2.0",              // React DOM
  "tailwindcss": "^3.3.3",             // Framework CSS
  "xlsx": "^0.18.5"                    // Manejo de Excel
}
```

### Dependencias de Desarrollo

```json
{
  "@types/bcryptjs": "^2.4.6",         // Tipos TypeScript
  "@types/html2canvas": "^0.5.35",
  "@types/jsonwebtoken": "^9.0.10",
  "@types/node": "^20.6.0",
  "@types/nodemailer": "^7.0.2",
  "@types/react": "^18.2.21",
  "@types/react-dom": "^18.2.7",
  "autoprefixer": "^10.4.15",          // PostCSS autoprefixer
  "postcss": "^8.4.29",                // PostCSS
  "typescript": "^5.2.2"               // TypeScript compiler
}
```

### Requisitos del Sistema

```
Node.js: >= 18.0.0
npm: >= 9.0.0
PostgreSQL: >= 14.0 (Supabase)
```

---

## 🚀 Scripts Disponibles

### Desarrollo
```bash
npm run dev
# Inicia servidor de desarrollo en http://localhost:3000
# Hot reload habilitado
```

### Producción
```bash
npm run build
# Genera build optimizado para producción
# Incluye generación de Prisma Client

npm start
# Ejecuta el build de producción
```

### Base de Datos
```bash
npm run db:push
# Aplica cambios del schema a la base de datos
# No crea migraciones

npm run db:seed
# Ejecuta script de población de datos
# Crea usuarios, clientes, campañas de ejemplo

npm run db:studio
# Abre Prisma Studio en http://localhost:5555
# Interfaz visual para gestionar datos
```

### Utilidades
```bash
npm run lint
# Ejecuta ESLint para verificar código

npx prisma generate
# Genera Prisma Client manualmente

npx prisma migrate dev
# Crea y aplica migraciones
```

---

## 🔐 Variables de Entorno

### Archivo `.env.local`

```env
# ============================================
# BASE DE DATOS - SUPABASE POSTGRESQL
# ============================================
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

# ============================================
# SUPABASE API KEYS
# ============================================
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON_KEY]"

# ============================================
# AUTENTICACIÓN JWT
# ============================================
JWT_SECRET="tu_jwt_secret_muy_seguro_cambiar_en_produccion"

# ============================================
# EMAILJS (Formularios Web)
# ============================================
NEXT_PUBLIC_EMAILJS_SERVICE_ID="service_hjuxa1m"
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="template_awl2zgn"
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="0kpDXQLXxbKCjUhGa"

# ============================================
# EMAIL BACKEND - TITAN/GODADDY (Pendiente)
# ============================================
EMAIL_HOST="smtp.titan.email"
EMAIL_PORT="587"
EMAIL_USER="ecabello@itaca.mx.com"
EMAIL_PASSWORD="[PENDIENTE_CONFIGURAR]"
EMAIL_FROM="ecabello@itaca.mx.com"

# ============================================
# CONFIGURACIÓN DE ADMINISTRADOR
# ============================================
DEFAULT_ADMIN_USERNAME="admin"
DEFAULT_ADMIN_EMAIL="admin@itacacomunicacion.com"
DEFAULT_ADMIN_PASSWORD="admin123"

# ============================================
# WEBHOOK ZAPIER (Opcional)
# ============================================
NEXT_PUBLIC_WEBHOOK_URL="https://hooks.zapier.com/hooks/catch/24785560/u1peizl/"
```

### Variables Importantes

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `DATABASE_URL` | Conexión a PostgreSQL Supabase | ✅ Sí |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | ✅ Sí |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública Supabase | ✅ Sí |
| `JWT_SECRET` | Secreto para tokens JWT | ✅ Sí |
| `NEXT_PUBLIC_EMAILJS_*` | Credenciales de EmailJS | ✅ Sí |
| `EMAIL_*` | Config SMTP Titan | ⚠️ Opcional |

---

## 🌐 Arquitectura de Despliegue

### Opción 1: Vercel (Recomendado)

**Ventajas:**
- Despliegue automático desde GitHub
- HTTPS gratuito
- CDN global
- Serverless functions nativas
- Zero-config

**Pasos:**
1. Conectar repositorio GitHub
2. Configurar variables de entorno
3. Deploy automático

### Opción 2: GoDaddy VPS

**Requisitos:**
- Node.js 18+ instalado
- PM2 para proceso persistente
- Nginx como reverse proxy
- Certificado SSL

---

## 📊 Flujo de Datos

```
┌─────────────────┐
│   Usuario Web   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Next.js Pages  │ (SSR/SSG)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Routes     │ (Backend)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Prisma Client  │ (ORM)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │ (Supabase)
└─────────────────┘
```

---

## 🔒 Seguridad

### Implementaciones Actuales

1. **Autenticación JWT**
   - Tokens con expiración
   - Almacenamiento en localStorage
   - Validación en cada request

2. **Encriptación de Contraseñas**
   - bcryptjs con salt rounds = 10
   - Hashes seguros en BD

3. **Validación de Inputs**
   - Sanitización de datos
   - Validación de tipos
   - Prevención de SQL Injection (Prisma)

4. **CORS**
   - Configurado en Next.js
   - Dominios permitidos

5. **Variables de Entorno**
   - Secretos fuera del código
   - .gitignore configurado

### Recomendaciones

- [ ] Implementar rate limiting
- [ ] Agregar 2FA
- [ ] Auditoría de logs
- [ ] HTTPS obligatorio en producción
- [ ] Validación de emails con confirmación

---

## 📞 Soporte y Contacto

**Proyecto:** Itaca Comunicación  
**Email Corporativo:** ecabello@itaca.mx.com  
**Proveedor Email:** Titan (GoDaddy)  
**Repositorio:** https://github.com/TheProxy8938/itaca.github-io

---

## 📝 Notas Finales

### Estado del Proyecto
- ✅ Frontend completamente funcional
- ✅ Backend con API RESTful operativa
- ✅ Base de datos migrada a Supabase PostgreSQL
- ✅ Sistema de autenticación implementado
- ✅ Formularios de contacto con EmailJS
- ⚠️ Email backend (Nodemailer) pendiente de activar
- ✅ Build de producción exitoso
- ✅ Documentación completa

### Próximos Pasos Sugeridos

1. **Configurar SMTP de Titan**
   - Activar credenciales de ecabello@itaca.mx.com
   - Configurar variables de entorno EMAIL_*
   - Probar envío de emails de recuperación

2. **Deploy a Vercel**
   - Conectar repositorio
   - Configurar variables de entorno
   - Activar dominio personalizado

3. **Optimizaciones**
   - Implementar caché
   - Optimizar imágenes
   - Agregar Service Worker (PWA)

4. **Analytics**
   - Google Analytics
   - Vercel Analytics
   - Supabase Analytics

---

**Versión del Documento:** 1.0  
**Última Actualización:** Diciembre 2, 2025  
**Mantenido por:** Equipo Itaca Comunicación
po