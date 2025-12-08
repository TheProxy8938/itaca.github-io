# 📸 Especificaciones de Imágenes para ÍTACA

## 🎯 Resumen Ejecutivo

Necesitas **11 imágenes** profesionales para la sección de servicios. Actualmente tienes **5 imágenes**, faltan **6 nuevas**.

---

## 📐 Especificaciones Técnicas

### **Dimensiones Recomendadas**
- **Tamaño óptimo:** 1200 x 800 píxeles (ratio 3:2)
- **Tamaño mínimo:** 800 x 600 píxeles (ratio 4:3)
- **Formato:** JPG o PNG
- **Peso máximo:** 300 KB por imagen (optimizado para web)
- **Calidad JPEG:** 70-80%

### **Características Visuales**
- Imágenes horizontales (landscape)
- Alta resolución para verse bien en pantallas Retina
- Buena iluminación y contraste
- Evitar texto incrustado en las imágenes
- Colores profesionales que combinen con verde/esmeralda

---

## 📁 Estructura de Archivos

**Ubicación:** `public/servicios/`

### ✅ **Imágenes Existentes (5)**
```
✓ comunicacion.jpg  → Comunicación Estratégica
✓ marketing.jpg     → Marketing Digital
✓ diseño.jpg        → Diseño y Branding
✓ audiovisual.jpg   → Producción Audiovisual
✓ prensa.jpg        → Relaciones Públicas
```

### ❌ **Imágenes Faltantes (6)**
```
⚠️ publicidad-impresa.jpg → Actualmente usa: diseño.jpg
⚠️ souvenires.jpg         → Actualmente usa: marketing.jpg
⚠️ consultoria.jpg        → Actualmente usa: comunicacion.jpg
⚠️ eventos.jpg            → Actualmente usa: comunicacion.jpg
⚠️ institucional.jpg      → Actualmente usa: comunicacion.jpg
⚠️ investigacion.jpg      → Actualmente usa: comunicacion.jpg
```

---

## 🎨 Guía Visual por Servicio

### 1. **Comunicación Estratégica** ✅
- **Archivo:** `comunicacion.jpg`
- **Contenido sugerido:** Reunión de estrategia, pizarra con planes, equipo colaborando
- **Estado:** Existente

### 2. **Marketing Digital** ✅
- **Archivo:** `marketing.jpg`
- **Contenido sugerido:** Dashboard de analytics, redes sociales, gráficos digitales
- **Estado:** Existente

### 3. **Diseño y Branding** ✅
- **Archivo:** `diseño.jpg`
- **Contenido sugerido:** Paletas de colores, logos, diseño gráfico en proceso
- **Estado:** Existente

### 4. **Publicidad Impresa** ❌
- **Archivo:** `publicidad-impresa.jpg` (FALTA)
- **Contenido sugerido:** Folletos, tarjetas de presentación, banners, material impreso
- **Palabras clave:** Printing, flyers, brochures, print design

### 5. **Souvenires** ❌
- **Archivo:** `souvenires.jpg` (FALTA)
- **Contenido sugerido:** Tazas personalizadas, llaveros, bolsas, merchandising corporativo
- **Palabras clave:** Merchandising, promotional items, corporate gifts

### 6. **Producción Audiovisual** ✅
- **Archivo:** `audiovisual.jpg`
- **Contenido sugerido:** Cámara profesional, iluminación, set de grabación, producción
- **Estado:** Existente

### 7. **Relaciones Públicas** ✅
- **Archivo:** `prensa.jpg`
- **Contenido sugerido:** Conferencia de prensa, micrófonos, entrevista, medios
- **Estado:** Existente

### 8. **Consultoría** ❌
- **Archivo:** `consultoria.jpg` (FALTA)
- **Contenido sugerido:** Consultor presentando, coaching, capacitación, workshop
- **Palabras clave:** Consulting, training, coaching, workshop

### 9. **Eventos y Activaciones** ❌
- **Archivo:** `eventos.jpg` (FALTA)
- **Contenido sugerido:** Evento corporativo, activación de marca, stand, audiencia
- **Palabras clave:** Events, corporate event, brand activation

### 10. **Comunicación Institucional** ❌
- **Archivo:** `institucional.jpg` (FALTA)
- **Contenido sugerido:** Edificio gubernamental, funcionarios, comunicados oficiales
- **Palabras clave:** Government, institutional, public sector

### 11. **Investigación y Análisis** ❌
- **Archivo:** `investigacion.jpg` (FALTA)
- **Contenido sugerido:** Datos, gráficos, investigación, análisis, métricas
- **Palabras clave:** Research, analysis, data, metrics, insights

---

## 🔧 Cómo Implementar las Nuevas Imágenes

### **Opción 1: Imágenes Propias**
1. Toma/diseña las 6 imágenes faltantes
2. Optimízalas a 1200x800px y máx 300KB
3. Renómbralas exactamente como se indica arriba
4. Guárdalas en `public/servicios/`

### **Opción 2: Banco de Imágenes**
**Sitios recomendados (gratis/premium):**
- **Unsplash** (https://unsplash.com) - Gratis, alta calidad
- **Pexels** (https://pexels.com) - Gratis
- **Pixabay** (https://pixabay.com) - Gratis
- **Freepik** (https://freepik.com) - Premium/Gratis

**Búsquedas sugeridas en inglés:**
```
publicidad-impresa.jpg → "print design", "brochure printing", "flyers"
souvenires.jpg → "promotional merchandise", "corporate gifts", "branded items"
consultoria.jpg → "business consulting", "training workshop", "coaching"
eventos.jpg → "corporate event", "brand activation", "business conference"
institucional.jpg → "government building", "institutional communication"
investigacion.jpg → "data analysis", "market research", "business metrics"
```

---

## ✨ Cómo Se Verán las Imágenes

### **Tarjetas de Servicios (Grid)**
- La imagen ocupa el 40% superior de la tarjeta
- Se aplica overlay verde oscuro semitransparente (70%)
- El título del servicio aparece centrado sobre la imagen
- Efecto hover: la imagen hace zoom suave (scale 1.1)

### **Vista Detallada**
- La imagen ocupa toda la mitad izquierda (50% del ancho)
- Overlay verde más suave (60%)
- Título grande centrado sobre la imagen
- Se muestra al hacer clic en "Ver más"

---

## 🚀 Beneficios de Usar Imágenes

✅ Aspecto más profesional y moderno
✅ Mejor engagement visual
✅ Identidad de marca más fuerte
✅ Diferenciación entre servicios
✅ Mayor credibilidad empresarial

---

## 📋 Checklist de Implementación

```
[ ] Descargar/crear 6 imágenes faltantes
[ ] Optimizar todas las imágenes a especificaciones
[ ] Renombrar con nombres exactos (sin espacios, minúsculas)
[ ] Guardar en public/servicios/
[ ] Verificar que todas las rutas funcionan
[ ] Probar en diferentes dispositivos (móvil/desktop)
[ ] Optimizar peso final si es necesario
```

---

## 🎯 Nombres de Archivo EXACTOS Requeridos

```bash
# COPIAR ESTOS NOMBRES EXACTAMENTE (sin .md, solo los .jpg)
comunicacion.jpg          # ✅ Ya existe
marketing.jpg             # ✅ Ya existe
diseño.jpg                # ✅ Ya existe
audiovisual.jpg           # ✅ Ya existe
prensa.jpg                # ✅ Ya existe
publicidad-impresa.jpg    # ❌ FALTA
souvenires.jpg            # ❌ FALTA
consultoria.jpg           # ❌ FALTA
eventos.jpg               # ❌ FALTA
institucional.jpg         # ❌ FALTA
investigacion.jpg         # ❌ FALTA
```

---

## 💡 Consejos Finales

1. **Consistencia:** Mantén un estilo visual similar en todas las imágenes
2. **Paleta:** Prioriza imágenes con tonos que combinen con verde/azul/gris
3. **Composición:** Imágenes con espacios "limpios" donde se pueda leer el texto
4. **Optimización:** Usa herramientas como TinyPNG o Squoosh para comprimir
5. **Pruebas:** Revisa cómo se ven en móvil y desktop antes de publicar

---

**¿Necesitas ayuda?**
Si prefieres usar colores sólidos o gradientes mientras consigues las imágenes, 
puedo ayudarte a crear placeholders temporales.
