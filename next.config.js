/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Configuración para producción en GoDaddy
  output: 'standalone', // Optimiza para Node.js hosting
  
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    // Permitir imágenes externas si es necesario
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
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