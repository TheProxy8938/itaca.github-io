# Sistema de Recuperación de Contraseñas - ÍTACA

## ✅ Implementación Completada

El sistema de recuperación de contraseñas está ahora completamente implementado con las siguientes funcionalidades:

### 🚀 Funcionalidades Incluidas

1. **Solicitar Recuperación** (`/forgot-password`):
   - Formulario para ingresar email del administrador
   - Validación de email existente y activo
   - Generación de código de 6 dígitos
   - Envío de email con código de recuperación

2. **Cambiar Contraseña** (`/reset-password`):
   - Formulario para ingresar código de recuperación
   - Validación de código y expiración (15 minutos)
   - Cambio seguro de contraseña con confirmación
   - Invalidación automática de sesiones existentes

3. **Base de Datos**:
   - Modelo `PasswordResetToken` en Supabase PostgreSQL
   - Tokens únicos con expiración automática
   - Códigos de un solo uso

### 📧 Configuración del Email (REQUERIDA)

Para que el sistema funcione completamente, necesitas configurar el servicio de email:

#### Opción 1: Gmail (Recomendada - GRATUITA)

1. **Crear una contraseña de aplicación en Gmail**:
   - Ve a tu [Cuenta de Google](https://myaccount.google.com/)
   - Selecciona "Seguridad" → "Verificación en dos pasos"
   - En la parte inferior, selecciona "Contraseñas de aplicaciones"
   - Genera una nueva contraseña para "Correo electrónico"

2. **Configurar variables de entorno**:
```bash
EMAIL_SERVICE="gmail"
EMAIL_USER="tu_email@gmail.com"
EMAIL_PASS="tu_contraseña_de_aplicacion_aqui"
```

#### Opción 2: SMTP Personalizado

```bash
EMAIL_SERVICE="smtp"
EMAIL_USER="tu_email@tudominio.com"
EMAIL_PASS="tu_contraseña"
SMTP_HOST="smtp.tuproveedor.com"
SMTP_PORT="587"
```

### 🔧 Archivo de Configuración

Actualiza tu archivo `.env.local` con las credenciales de email:

```bash
# Configuración de Email para recuperación de contraseñas
EMAIL_SERVICE="gmail"
EMAIL_USER="tu_email@gmail.com"
EMAIL_PASS="tu_app_password_aqui"
```

### 🎯 Flujo de Funcionamiento

1. **Usuario olvida contraseña**:
   - Hace clic en "¿Olvidaste tu contraseña?" en `/login`
   - Redirige a `/forgot-password`

2. **Solicita código**:
   - Ingresa su email en `/forgot-password`
   - Sistema valida email y genera código de 6 dígitos
   - Envía email con código (expira en 15 minutos)
   - Redirige automáticamente a `/reset-password`

3. **Cambia contraseña**:
   - Ingresa código de 6 dígitos en `/reset-password`
   - Crea nueva contraseña con confirmación
   - Sistema valida código y actualiza contraseña
   - Invalida sesiones existentes
   - Redirige a `/login`

### 📱 Características del Email

- **Diseño profesional** con branding de ÍTACA
- **Código destacado** fácil de leer
- **Instrucciones claras** paso a paso
- **Advertencias de seguridad** sobre expiración
- **Responsive** para móviles

### 🔒 Seguridad Implementada

- ✅ Códigos de 6 dígitos únicos
- ✅ Expiración automática (15 minutos)
- ✅ Un solo uso por token
- ✅ Validación de admin activo
- ✅ Hasheo seguro de contraseñas (bcrypt)
- ✅ Invalidación de sesiones tras cambio
- ✅ Eliminación automática de tokens usados

### 🧪 Testing

Una vez configurado el email, puedes probar:

1. Ir a `/login`
2. Hacer clic en "¿Olvidaste tu contraseña?"
3. Ingresar un email de administrador existente
4. Verificar que llegue el email con el código
5. Usar el código en `/reset-password`
6. Cambiar la contraseña
7. Verificar que puedes hacer login con la nueva contraseña

### 📂 Archivos Creados/Modificados

- `lib/email.ts` - Servicio de envío de emails
- `pages/api/auth/forgot-password.ts` - API para solicitar recuperación
- `pages/api/auth/reset-password.ts` - API para cambiar contraseña
- `pages/forgot-password.tsx` - Página de solicitud de código
- `pages/reset-password.tsx` - Página de cambio de contraseña
- `pages/login.tsx` - Agregado enlace de recuperación
- `prisma/schema.prisma` - Modelo PasswordResetToken
- `.env.local` - Variables de configuración de email

### 🎉 ¡Sistema Listo!

El sistema está completamente funcional. Solo necesitas:

1. **Configurar las credenciales de email** en `.env.local`
2. **Probar el flujo completo** de recuperación
3. **¡Disfrutar de la funcionalidad!**

---

**Nota**: El sistema usa Supabase PostgreSQL (gratuito) para almacenar los tokens de recuperación y Gmail (gratuito) para el envío de emails, manteniendo así el presupuesto $0 solicitado.