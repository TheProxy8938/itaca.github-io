/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Configuración para exportación estática (GoDaddy hosting básico)
  output: 'export', // Genera archivos HTML estáticos
  
  images: {
    unoptimized: true, // Necesario para export estático
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // Configuración de producción
  productionBrowserSourceMaps: false,
  
  // Variables de entorno públicas
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
}

module.exports = nextConfig