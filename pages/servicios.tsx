import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useState } from 'react';

const services = [
  {
    id: 'comunicacion-estrategica',
    title: 'Comunicación Estratégica',
    description: 'Diseño de planes integrales, auditorías de comunicación y gestión de crisis para fortalecer tu marca.',
    image: '/servicios/comunicacion.jpg',
    features: [
      'Diseño de planes integrales de comunicación',
      'Auditorías y diagnósticos de comunicación',
      'Gestión de crisis y reputación'
    ]
  },
  {
    id: 'marketing',
    title: 'Marketing Digital',
    description: 'Estrategias integrales de marketing digital, gestión profesional de redes sociales y campañas publicitarias efectivas.',
    image: '/servicios/marketing.jpg',
    features: [
      'Estrategias integrales de marketing digital',
      'Gestión profesional de redes sociales',
      'Campañas publicitarias digitales'
    ]
  },
  {
    id: 'diseño',
    title: 'Diseño y Branding',
    description: 'Desarrollo de identidad visual corporativa, diseño de logotipos y manuales de marca profesionales.',
    image: '/servicios/diseño.jpg',
    features: [
      'Desarrollo de identidad visual corporativa',
      'Diseño de logotipos y tipografías',
      'Manuales de marca y guías de estilo'
    ]
  },
  {
    id: 'audiovisual',
    title: 'Producción Audiovisual',
    description: 'Videos institucionales, fotografía corporativa y transmisiones en vivo profesionales.',
    image: '/servicios/audiovisual.jpg',
    features: [
      'Videos institucionales y promocionales',
      'Fotografía corporativa y eventos',
      'Transmisiones en vivo y streaming'
    ]
  },
  {
    id: 'prensa',
    title: 'Relaciones Públicas',
    description: 'Gestión de medios de comunicación, redacción de comunicados y organización de eventos.',
    image: '/servicios/prensa.jpg',
    features: [
      'Gestión de medios de comunicación',
      'Redacción de comunicados de prensa',
      'Organización de eventos mediáticos'
    ]
  },
  {
    id: 'consultoria',
    title: 'Consultoría Estratégica',
    description: 'Talleres de comunicación efectiva, coaching para portavoces y desarrollo de manuales de comunicación.',
    image: '/servicios/comunicacion.jpg',
    features: [
      'Talleres de comunicación efectiva',
      'Coaching para portavoces',
      'Desarrollo de manuales de comunicación'
    ]
  },
  {
    id: 'eventos',
    title: 'Eventos y Activaciones',
    description: 'Planificación y ejecución de eventos corporativos, activaciones de marca y campañas experienciales.',
    image: '/servicios/comunicacion.jpg',
    features: [
      'Planificación y ejecución de eventos corporativos',
      'Activaciones de marca y campañas experienciales',
      'Organización de webinars y seminarios'
    ]
  },
  {
    id: 'institucional',
    title: 'Comunicación Institucional',
    description: 'Campañas de difusión para entidades públicas, gestión de imagen para funcionarios y transparencia.',
    image: '/servicios/comunicacion.jpg',
    features: [
      'Campañas de difusión para entidades públicas',
      'Gestión de imagen para funcionarios',
      'Transparencia y rendición de cuentas'
    ]
  },
  {
    id: 'investigacion',
    title: 'Investigación y Análisis',
    description: 'Estudios de mercado, análisis de percepción y reputación, y monitorización de tendencias.',
    image: '/servicios/comunicacion.jpg',
    features: [
      'Estudios de mercado y públicos objetivos',
      'Análisis de percepción y reputación',
      'Monitorización de tendencias y competencia'
    ]
  },
  {
    id: 'publicidad-impresa',
    title: 'Publicidad Impresa',
    description: 'Folletos, volantes, tarjetas de presentación, banners personalizados y producción con entrega rápida.',
    image: '/servicios/diseño.jpg',
    features: [
      'Folletos, volantes y tarjetas de presentación',
      'Banners personalizados de alta calidad',
      'Diseño y producción con entrega rápida'
    ]
  },
  {
    id: 'souvenires',
    title: 'Souvenires',
    description: 'Tazas, llaveros, camisetas y bolsas personalizadas, artículos para eventos y regalos que fortalecen tu marca.',
    image: '/servicios/marketing.jpg',
    features: [
      'Tazas, llaveros, camisetas y bolsas personalizadas',
      'Artículos para eventos y promociones',
      'Regalos que fortalecen tu marca'
    ]
  }
];

const solutions = [
  {
    name: 'Emprendedores',
    description: 'Soluciones adaptadas para startups y nuevos negocios que buscan establecer su presencia digital.',
    features: [
      'Estrategia de marca personalizada',
      'Presencia en redes sociales',
      'Contenido estratégico',
      'Análisis y reportes',
      'Soporte continuo'
    ],
    icon: '🚀',
    popular: false
  },
  {
    name: 'Empresas en Crecimiento',
    description: 'Estrategias integrales para empresas que buscan expandir su alcance y consolidar su mercado.',
    features: [
      'Marketing digital completo',
      'Comunicación corporativa',
      'Branding y diseño',
      'Gestión de reputación',
      'Consultoría estratégica'
    ],
    icon: '📈',
    popular: true
  },
  {
    name: 'Grandes Corporaciones',
    description: 'Soluciones empresariales completas para organizaciones con necesidades complejas de comunicación.',
    features: [
      'Estrategias omnicanal',
      'Manejo de crisis',
      'Relaciones públicas',
      'Producción audiovisual',
      'Account manager dedicado'
    ],
    icon: '🏢',
    popular: false
  }
];

export default function Servicios() {
  const [selectedService, setSelectedService] = useState('marketing');

  return (
    <Layout title="Servicios - ÍTACA Comunicación Estratégica">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Nuestros <span className="text-yellow-300">Servicios</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Soluciones integrales de comunicación estratégica para impulsar tu marca hacia el éxito
            </p>
          </motion.div>
        </div>
      </section>

      {/* Servicios Principales */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Qué Ofrecemos?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Servicios especializados diseñados para transformar tu comunicación empresarial
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden group hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedService(service.id)}
              >
                <div className="h-48 bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                  <div className="text-white text-6xl">
                    {service.id === 'comunicacion-estrategica' && '💼'}
                    {service.id === 'marketing' && '📊'}
                    {service.id === 'diseño' && '🎨'}
                    {service.id === 'audiovisual' && '🎬'}
                    {service.id === 'prensa' && '📰'}
                    {service.id === 'consultoria' && '🎯'}
                    {service.id === 'eventos' && '🎪'}
                    {service.id === 'institucional' && '🏛️'}
                    {service.id === 'investigacion' && '🔍'}
                    {service.id === 'publicidad-impresa' && '📄'}
                    {service.id === 'souvenires' && '🎁'}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex justify-end">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Ver más →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicio Detallado */}
      {selectedService && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {services
              .filter(service => service.id === selectedService)
              .map(service => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="h-64 lg:h-auto bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                      <div className="text-white text-8xl">
                        {service.id === 'comunicacion-estrategica' && '💼'}
                        {service.id === 'marketing' && '📊'}
                        {service.id === 'diseño' && '🎨'}
                        {service.id === 'audiovisual' && '🎬'}
                        {service.id === 'prensa' && '📰'}
                        {service.id === 'consultoria' && '🎯'}
                        {service.id === 'eventos' && '🎪'}
                        {service.id === 'institucional' && '🏛️'}
                        {service.id === 'investigacion' && '🔍'}
                        {service.id === 'publicidad-impresa' && '📄'}
                        {service.id === 'souvenires' && '🎁'}
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                        {service.description}
                      </p>
                      
                      <div className="mb-6">
                        <h4 className="text-lg font-bold text-gray-900 mb-3">
                          Incluye:
                        </h4>
                        <ul className="space-y-2">
                          {service.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-gray-600">
                              <span className="text-green-500 mr-2">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex justify-center">
                        <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full font-medium hover:from-green-700 hover:to-emerald-700 transition">
                          Solicitar Cotización
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </section>
      )}

      {/* Paquetes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Soluciones por Segmento
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ofrecemos soluciones personalizadas adaptadas a las necesidades específicas de cada tipo de empresa
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${
                  solution.popular ? 'border-blue-500 scale-105' : 'border-gray-200'
                }`}
              >
                {solution.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Más Solicitado
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <div className="text-4xl mb-4">{solution.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{solution.name}</h3>
                  <p className="text-gray-600">{solution.description}</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {solution.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-600">
                      <span className="text-green-500 mr-3">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button 
                  className={`w-full py-3 rounded-full font-medium transition ${
                    solution.popular
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => window.location.href = '/contacto'}
                >
                  Solicitar Información
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso de Trabajo */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestro Proceso
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Una metodología probada que garantiza resultados excepcionales
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Diagnóstico', description: 'Analizamos tu situación actual y objetivos' },
              { step: '02', title: 'Estrategia', description: 'Desarrollamos un plan personalizado' },
              { step: '03', title: 'Ejecución', description: 'Implementamos las acciones definidas' },
              { step: '04', title: 'Optimización', description: 'Medimos, analizamos y mejoramos' }
            ].map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {process.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{process.title}</h3>
                <p className="text-gray-600">{process.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Listo para comenzar tu transformación?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Conversemos sobre tus objetivos y diseñemos la estrategia perfecta para tu empresa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-bold hover:shadow-lg transition-shadow"
                onClick={() => window.location.href = '/contacto'}
              >
                Solicitar Cotización
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Agendar Reunión
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}