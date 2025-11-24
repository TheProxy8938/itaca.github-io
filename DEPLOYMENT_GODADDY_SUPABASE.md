===============================================================================
                    GUÍA COMPLETA DE DEPLOYMENT A GODADDY
                    Con Base de Datos Supabase PostgreSQL
===============================================================================

📅 FECHA: 19 de Noviembre 2025
🎯 OBJETIVO: Subir proyecto Next.js a GoDaddy con Supabase como base de datos
⏱️ TIEMPO ESTIMADO: 45-60 minutos

===============================================================================
                    PARTE 1: PREPARAR SUPABASE (15 minutos)
===============================================================================

🔹 PASO 1.1: Verificar/Crear Proyecto en Supabase
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Ve a: https://app.supabase.com/
2. Inicia sesión (o crea cuenta si no tienes)
3. Verifica que tu proyecto existe: "itacacommunicacion"
4. Si no existe, crea uno nuevo:
   - Nombre: itacacommunicacion
   - Database Password: (guarda este password seguro)
   - Region: South America (São Paulo) - más cercano a México

🔹 PASO 1.2: Obtener Connection String
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. En tu proyecto de Supabase, ve a: Settings > Database
2. Busca "Connection string" sección
3. Selecciona "Transaction" mode (no Session ni Connection Pooling aún)
4. Copia la URL que se ve así:
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxx.supabase.co:5432/postgres

5. IMPORTANTE: Reemplaza [YOUR-PASSWORD] con tu password real
6. Guarda esta URL, la necesitarás en .env.local

EJEMPLO:
DATABASE_URL="postgresql://postgres:itacacommunicacion@db.mcmoueklnejwtlzenvee.supabase.co:5432/postgres"

🔹 PASO 1.3: Ejecutar Migraciones en Supabase
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Abre terminal en tu proyecto local
2. Asegúrate que .env tiene la URL de Supabase
3. Ejecuta:

   npx prisma generate
   npx prisma migrate deploy

4. Si hay errores, ejecuta:

   npx prisma db push

5. Verificar que las tablas se crearon:
   - Ve a Supabase > Table Editor
   - Deberías ver: admins, contacts, clients, campaigns, etc.

🔹 PASO 1.4: Migrar Datos desde SQLite (OPCIONAL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Si ya tienes datos en SQLite y quieres migrarlos:

1. Ejecuta el script de migración:

   node scripts/migrate-sqlite-to-supabase.js

2. Verifica en Supabase que los datos se migraron correctamente

===============================================================================
                    PARTE 2: PREPARAR PROYECTO LOCAL (10 minutos)
===============================================================================

🔹 PASO 2.1: Actualizar Variables de Entorno
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Verifica que .env.local tenga:

DATABASE_URL="postgresql://postgres:TU_PASSWORD@db.TU_PROYECTO.supabase.co:5432/postgres"
JWT_SECRET="genera_uno_nuevo_con_node_crypto"
NODE_ENV="production"
NEXT_PUBLIC_SITE_URL="https://www.tudominio.com"

# EmailJS (configura si no lo has hecho)
NEXT_PUBLIC_EMAILJS_SERVICE_ID="service_xxx"
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="template_xxx"
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="xxx"

2. Generar JWT_SECRET seguro:

   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

3. Copia el resultado y úsalo en JWT_SECRET

🔹 PASO 2.2: Probar Build Local
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Ejecuta build de producción:

   npm run build

2. Si hay errores, corrígelos antes de continuar
3. Prueba el build local:

   npm start

4. Verifica que funcione en: http://localhost:3000

🔹 PASO 2.3: Crear Usuario Dilan en Supabase
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Ejecuta el script de setup:

   node scripts/setup-dilan.js

2. Verifica en Supabase > Table Editor > admins
3. Debería estar el usuario: Dilan Hernandez

===============================================================================
                    PARTE 3: PREPARAR ARCHIVOS PARA GODADDY (10 minutos)
===============================================================================

🔹 PASO 3.1: Crear Archivo .gitignore (si no existe)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Asegúrate que .gitignore incluya:

node_modules/
.next/
.env.local
.env
*.db
*.db-journal
.DS_Store
*.log
npm-debug.log*

🔹 PASO 3.2: Comprimir Proyecto
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. EXCLUIR estas carpetas del ZIP (no subirlas):
   - node_modules/
   - .next/
   - .git/
   - prisma/database.db

2. INCLUIR en el ZIP:
   - Todos los archivos .js, .ts, .tsx, .json
   - Carpetas: components/, pages/, lib/, styles/, public/, prisma/
   - package.json y package-lock.json
   - next.config.js
   - .env.example (NO subir .env.local)
   - prisma/schema.prisma
   - prisma/migrations/

3. Crear ZIP del proyecto

===============================================================================
                    PARTE 4: SUBIR A GODADDY (20 minutos)
===============================================================================

🔹 PASO 4.1: Acceder a cPanel de GoDaddy
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Inicia sesión en: https://www.godaddy.com/
2. Ve a: My Products > Web Hosting > Manage
3. Accede a cPanel

🔹 PASO 4.2: Configurar Node.js Application
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OPCIÓN A: Si GoDaddy soporta Node.js Apps (hosting específico)
────────────────────────────────────────────────────────────────

1. En cPanel, busca "Setup Node.js App"
2. Clic en "Create Application"
3. Configurar:
   - Node.js version: 18.x (o la más reciente disponible)
   - Application mode: Production
   - Application root: public_html/marketing (o tu carpeta preferida)
   - Application URL: tu dominio
   - Application startup file: server.js (crear después)
   - Environment variables: (añadir después)

4. Clic en "Create"

OPCIÓN B: Si solo hay Hosting Compartido tradicional
────────────────────────────────────────────────────────────────

GoDaddy hosting compartido NO soporta Node.js directamente.
Necesitarás:
- Actualizar a plan VPS o Dedicado, O
- Usar Vercel/Netlify (gratis) y solo usar GoDaddy para el dominio

RECOMENDACIÓN: Usar Vercel (más fácil y gratis)
Ver: PARTE 5 - DEPLOYMENT ALTERNATIVO EN VERCEL

🔹 PASO 4.3: Subir Archivos (Si usas VPS/Dedicado)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. En cPanel > File Manager
2. Navega a public_html/marketing (o tu carpeta)
3. Sube el archivo ZIP
4. Extrae el ZIP
5. Elimina el archivo ZIP

🔹 PASO 4.4: Configurar Variables de Entorno
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. En Node.js App Manager > Environment Variables
2. Añadir una por una:

   DATABASE_URL = postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres
   JWT_SECRET = tu_jwt_secret_generado
   NODE_ENV = production
   NEXT_PUBLIC_SITE_URL = https://www.tudominio.com
   NEXT_PUBLIC_EMAILJS_SERVICE_ID = service_xxx
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID = template_xxx
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY = xxx

🔹 PASO 4.5: Instalar Dependencias y Build
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Conectar por SSH (si está disponible) o usar Terminal en cPanel
2. Navegar a la carpeta del proyecto:

   cd public_html/marketing

3. Instalar dependencias:

   npm install

4. Generar Prisma Client:

   npx prisma generate

5. Ejecutar migraciones:

   npx prisma migrate deploy

6. Build de producción:

   npm run build

7. Iniciar aplicación:

   npm start

   O si GoDaddy maneja el start automáticamente, reinicia la app

🔹 PASO 4.6: Verificar Funcionamiento
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Ve a tu dominio: https://www.tudominio.com
2. Verifica que carga correctamente
3. Prueba el login: /login
4. Usa credenciales de Dilan: proxemodelan5@gmail.com / Proxy-8938
5. Verifica el chat personal funcione

===============================================================================
                    PARTE 5: DEPLOYMENT ALTERNATIVO EN VERCEL (RECOMENDADO)
===============================================================================

Si GoDaddy no soporta Node.js o es muy complicado, usa Vercel (gratis):

🔹 PASO 5.1: Subir a GitHub
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Crea repositorio en GitHub (puede ser privado)
2. Sube tu proyecto (sin node_modules ni .env.local)

   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main

🔹 PASO 5.2: Deploy en Vercel
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Ve a: https://vercel.com/
2. Conecta tu cuenta de GitHub
3. Import Repository
4. Selecciona tu proyecto
5. Configure Project:
   - Framework Preset: Next.js (auto-detectado)
   - Root Directory: ./
   - Build Command: npm run build (default)
   - Output Directory: .next (default)

6. Environment Variables - Añadir:
   DATABASE_URL
   JWT_SECRET
   NODE_ENV = production
   NEXT_PUBLIC_EMAILJS_SERVICE_ID
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

7. Clic en "Deploy"
8. Espera 2-3 minutos

🔹 PASO 5.3: Configurar Dominio de GoDaddy
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. En Vercel > Project Settings > Domains
2. Añade tu dominio de GoDaddy: www.tudominio.com

3. Vercel te dará registros DNS:
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com

4. Ve a GoDaddy > My Products > Domains > DNS
5. Añade el registro CNAME que Vercel te dio
6. Espera 5-10 minutos para propagación

7. Tu sitio estará en: https://www.tudominio.com

===============================================================================
                    VERIFICACIÓN FINAL Y TROUBLESHOOTING
===============================================================================

✅ CHECKLIST POST-DEPLOYMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ ] Sitio carga correctamente
[ ] Login funciona
[ ] Dashboard muestra datos
[ ] Chat personal de Dilan funciona
[ ] Formularios de contacto envían emails
[ ] Imágenes cargan correctamente
[ ] No hay errores en consola del navegador
[ ] SSL/HTTPS funciona (candado verde)

❌ PROBLEMAS COMUNES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROBLEMA: "Error de base de datos"
SOLUCIÓN:
- Verifica DATABASE_URL en variables de entorno
- Confirma que las migraciones se ejecutaron
- Revisa logs de Supabase

PROBLEMA: "404 en páginas"
SOLUCIÓN:
- Verifica que npm run build se ejecutó correctamente
- Confirma que .next/ existe en servidor
- Reinicia la aplicación

PROBLEMA: "Error 500 en APIs"
SOLUCIÓN:
- Revisa logs del servidor
- Verifica todas las variables de entorno
- Confirma conexión a Supabase

PROBLEMA: "Imágenes no cargan"
SOLUCIÓN:
- Verifica que /public/ se subió correctamente
- Confirma permisos de carpetas (755)
- Revisa rutas en next.config.js

===============================================================================
                    CONTACTO Y SOPORTE
===============================================================================

📧 Supabase Support: https://supabase.com/support
📧 Vercel Support: https://vercel.com/support
📧 GoDaddy Support: https://www.godaddy.com/help

💡 Documentación:
- Next.js Deployment: https://nextjs.org/docs/deployment
- Prisma with Supabase: https://www.prisma.io/docs/guides/database/supabase
- Vercel Deployment: https://vercel.com/docs

===============================================================================
🎉 ¡FELICIDADES! Tu sitio debería estar en producción
===============================================================================
