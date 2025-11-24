import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title = "ÍTACA - Comunicación Estratégica" }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de navegación */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-shrink-0"
            >
              <Link href="/">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ÍTACA
                </span>
              </Link>
            </motion.div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-gray-700 hover:text-blue-600 transition px-3 py-2 rounded-md font-medium">
                  Inicio
                </Link>
                <Link href="/nosotros" className="text-gray-700 hover:text-blue-600 transition px-3 py-2 rounded-md font-medium">
                  Nosotros
                </Link>
                <Link href="/servicios" className="text-gray-700 hover:text-blue-600 transition px-3 py-2 rounded-md font-medium">
                  Servicios
                </Link>
                <Link href="/contacto" className="text-gray-700 hover:text-blue-600 transition px-3 py-2 rounded-md font-medium">
                  Contacto
                </Link>
                <Link href="/login" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-medium hover:from-blue-700 hover:to-purple-700 transition">
                  Iniciar Sesión
                </Link>
              </div>
            </div>

            {/* Menú móvil - botón hamburguesa */}
            <div className="md:hidden">
              <button className="text-gray-700 hover:text-blue-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo y descripción */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                ÍTACA Comunicación Estratégica
              </h3>
              <p className="text-gray-300 mb-4">
                Transformamos la comunicación de tu empresa con estrategias innovadoras y resultados medibles.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-pink-400 transition">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.295C3.897 14.341 3.29 12.017 3.29 12.017s.606-2.324 1.836-3.676C6.001 7.536 7.152 7.046 8.449 7.046c1.297 0 2.448.49 3.323 1.295c1.229 1.352 1.836 3.676 1.836 3.676s-.607 2.324-1.836 3.676c-.875.805-2.026 1.295-3.323 1.295zm7.119 0c-1.297 0-2.448-.49-3.323-1.295c-1.229-1.352-1.836-3.676-1.836-3.676s.607-2.324 1.836-3.676c.875-.805 2.026-1.295 3.323-1.295c1.297 0 2.448.49 3.323 1.295c1.229 1.352 1.836 3.676 1.836 3.676s-.607 2.324-1.836 3.676c-.875.805-2.026 1.295-3.323 1.295z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-500 transition">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Enlaces rápidos */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-blue-400 transition">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/nosotros" className="text-gray-300 hover:text-blue-400 transition">
                    Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="/servicios" className="text-gray-300 hover:text-blue-400 transition">
                    Servicios
                  </Link>
                </li>
                <li>
                  <Link href="/contacto" className="text-gray-300 hover:text-blue-400 transition">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-gray-300">
                <p>📧 info@itacacomunicacion.com</p>
                <p>📞 +57-123-456-7890</p>
                <p>📍 Bogotá, Colombia</p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; 2025 ÍTACA Comunicación Estratégica. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}