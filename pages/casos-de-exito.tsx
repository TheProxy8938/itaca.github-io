import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import CaseStudy from '../components/CaseStudy'

const successCases = [
  {
    name: "Carlos Rodríguez",
    company: "TechPro Solutions",
    testimonial: "Gracias a ÍTACA, aumentamos nuestras ventas en un 300% en solo 6 meses. Su estrategia de comunicación digital transformó completamente nuestra presencia online y nos posicionó como líderes en nuestro sector tecnológico.",
    image: "/testimonials/person1.jpg",
    industry: "Tecnología",
    services: ["Marketing Digital", "Comunicación Corporativa", "Branding"],
    results: ["300% aumento en ventas", "250% más leads calificados", "Posicionamiento como líder del sector"],
    challenge: "TechPro Solutions necesitaba diferenciarse en un mercado saturado y comunicar efectivamente sus soluciones tecnológicas complejas a audiencias no técnicas.",
    solution: "Desarrollamos una estrategia integral que incluyó rebranding completo, creación de contenido educativo, campaña de marketing digital multichannel y programa de thought leadership para el CEO.",
    timeline: "6 meses"
  },
  {
    name: "Ana Martínez",
    company: "Boutique Elegance",
    testimonial: "La estrategia digital que implementaron transformó completamente nuestro negocio. Pasamos de ser una boutique local a tener presencia nacional, con clientes en todo el país y ventas online que representan el 70% de nuestros ingresos.",
    image: "/testimonials/person2.jpg",
    industry: "Moda y Retail",
    services: ["E-commerce Strategy", "Social Media", "Influencer Marketing"],
    results: ["70% de ventas online", "Presencia nacional", "500% crecimiento en redes sociales"],
    challenge: "Boutique Elegance era conocida solo localmente y necesitaba expandirse al mercado digital para competir con grandes cadenas de moda.",
    solution: "Implementamos una plataforma e-commerce optimizada, estrategia de contenido visual, programa de influencer marketing con micro-influencers de moda y campañas segmentadas en redes sociales.",
    timeline: "8 meses"
  },
  {
    name: "Miguel Santos",
    company: "FitLife Gym",
    testimonial: "Su enfoque innovador en marketing digital nos ayudó a destacar en un mercado muy competitivo. Durante la pandemia, cuando todos los gimnasios cerraron, nosotros logramos mantener a nuestros clientes activos y atraer nuevos miembros con clases virtuales.",
    image: "/testimonials/person3.jpg",
    industry: "Fitness y Bienestar",
    services: ["Crisis Management", "Digital Transformation", "Community Building"],
    results: ["95% retención durante COVID", "200% aumento en membresías virtuales", "Nueva fuente de ingresos digital"],
    challenge: "La pandemia obligó al cierre físico del gimnasio y se necesitaba una transformación digital urgente para mantener la conexión con los clientes y generar ingresos.",
    solution: "Pivotamos rápidamente a un modelo híbrido con plataforma de clases virtuales, programa de entrenamiento personalizado online, comunidad digital activa y sistema de nutrición virtual.",
    timeline: "3 meses"
  },
  {
    name: "Dra. Patricia López",
    company: "Clínica Dental Sonrisas",
    testimonial: "ÍTACA nos ayudó a humanizar nuestra clínica dental y generar confianza en los pacientes. Ahora somos reconocidos como la clínica más confiable de la ciudad y tenemos lista de espera de 2 meses.",
    image: "/testimonials/person1.jpg",
    industry: "Salud y Medicina",
    services: ["Reputación Digital", "Marketing Médico", "Comunicación Paciente"],
    results: ["Lista de espera de 2 meses", "95% satisfacción del paciente", "Referidos aumentaron 400%"],
    challenge: "La clínica tenía una imagen fría y técnica que generaba ansiedad en los pacientes. Necesitaban humanizar la experiencia y generar confianza.",
    solution: "Desarrollamos una estrategia de comunicación empática, contenido educativo sobre salud dental, testimonios de pacientes reales, tours virtuales de la clínica y programa de seguimiento post-tratamiento.",
    timeline: "4 meses"
  },
  {
    name: "Roberto Mendez",
    company: "Restaurante Tradición",
    testimonial: "Transformaron nuestro restaurante familiar en una marca reconocida. Las reservas aumentaron un 400% y ahora tenemos planes de abrir una segunda sucursal gracias al posicionamiento que logramos.",
    image: "/testimonials/person2.jpg",
    industry: "Restaurantes y Gastronomía",
    services: ["Branding Gastronómico", "Marketing Local", "Storytelling"],
    results: ["400% aumento en reservas", "Reconocimiento como 'Mejor Restaurante Tradicional'", "Expansión planificada"],
    challenge: "Restaurante familiar con 30 años de historia pero sin presencia digital ni estrategia de marketing, compitiendo con cadenas modernas.",
    solution: "Creamos una narrativa emotiva sobre la tradición familiar, implementamos marketing gastronómico visual, programa de fidelización, eventos temáticos y partnerships con influencers food.",
    timeline: "5 meses"
  },
  {
    name: "Ing. Andrea Vega",
    company: "Constructora Vanguardia",
    testimonial: "Nos posicionaron como la constructora más innovadora y sostenible de la región. Los proyectos se venden antes de iniciar construcción y hemos aumentado el valor de nuestras propiedades un 25%.",
    image: "/testimonials/person3.jpg",
    industry: "Construcción e Inmobiliaria",
    services: ["B2B Marketing", "Comunicación Técnica", "Sustentabilidad"],
    results: ["Preventa 100% de proyectos", "25% aumento en valor de propiedades", "Reconocimiento por sustentabilidad"],
    challenge: "Constructora con proyectos de calidad pero sin diferenciación en un mercado comoditizado, necesitaba comunicar su propuesta de valor de sostenibilidad.",
    solution: "Desarrollamos una estrategia de comunicación técnica accesible, programa de certificación verde, content marketing sobre construcción sostenible y alianzas estratégicas con organizaciones ambientales.",
    timeline: "7 meses"
  }
];

const industries = ["Todos", "Tecnología", "Moda y Retail", "Fitness y Bienestar", "Salud y Medicina", "Restaurantes y Gastronomía", "Construcción e Inmobiliaria"];

const CasosDeExito = () => {
  const [selectedIndustry, setSelectedIndustry] = useState("Todos");
  const [selectedCase, setSelectedCase] = useState<typeof successCases[0] | null>(null);

  const filteredCases = selectedIndustry === "Todos" 
    ? successCases 
    : successCases.filter(case_ => case_.industry === selectedIndustry);

  const openModal = (case_: typeof successCases[0]) => {
    setSelectedCase(case_);
  };

  const closeModal = () => {
    setSelectedCase(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Volver al inicio</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Casos de <span className="text-yellow-300">Éxito</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
              Descubre cómo hemos transformado la comunicación de empresas de diversos sectores, 
              generando resultados extraordinarios y duraderos
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Filtrar por Industria</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {industries.map((industry) => (
                <button
                  key={industry}
                  onClick={() => setSelectedIndustry(industry)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    selectedIndustry === industry
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cases Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCases.map((case_, index) => (
              <motion.div
                key={case_.company}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group cursor-pointer"
                onClick={() => openModal(case_)}
              >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                        {case_.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{case_.name}</h3>
                        <p className="text-blue-600 font-medium">{case_.company}</p>
                        <p className="text-sm text-gray-500">{case_.industry}</p>
                      </div>
                    </div>
                    
                    <blockquote className="text-gray-700 italic mb-6 leading-relaxed">
                      "{case_.testimonial.slice(0, 150)}..."
                    </blockquote>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {case_.services.slice(0, 2).map((service) => (
                        <span
                          key={service}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {service}
                        </span>
                      ))}
                      {case_.services.length > 2 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                          +{case_.services.length - 2} más
                        </span>
                      )}
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-green-600 font-semibold text-sm mb-2">Resultados destacados:</p>
                      <ul className="space-y-1">
                        {case_.results.slice(0, 2).map((result, idx) => (
                          <li key={idx} className="text-gray-600 text-sm flex items-center">
                            <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-4 border-t">
                      <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all group-hover:shadow-lg">
                        Ver Caso Completo
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedCase.company}</h2>
                  <p className="text-blue-600 font-medium text-lg">{selectedCase.industry}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">El Desafío</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedCase.challenge}</p>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Nuestra Solución</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedCase.solution}</p>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Testimonial del Cliente</h3>
                    <blockquote className="bg-gray-50 p-6 rounded-xl border-l-4 border-blue-500">
                      <p className="text-gray-700 italic leading-relaxed mb-4">"{selectedCase.testimonial}"</p>
                      <cite className="text-blue-600 font-semibold">
                        - {selectedCase.name}, {selectedCase.company}
                      </cite>
                    </blockquote>
                  </section>
                </div>

                <div className="space-y-6">
                  <section className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Servicios Implementados</h3>
                    <ul className="space-y-2">
                      {selectedCase.services.map((service, idx) => (
                        <li key={idx} className="flex items-center text-gray-700">
                          <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {service}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Resultados Obtenidos</h3>
                    <ul className="space-y-2">
                      {selectedCase.results.map((result, idx) => (
                        <li key={idx} className="flex items-center text-gray-700">
                          <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          {result}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Timeline del Proyecto</h3>
                    <div className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold">{selectedCase.timeline}</span>
                    </div>
                  </section>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t text-center">
                <Link
                  href="/contacto"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  ¿Quieres resultados similares? Conversemos
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Listo para ser nuestro próximo caso de éxito?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Cada historia de éxito comenzó con una conversación. Conversemos sobre cómo podemos transformar tu empresa
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contacto"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Solicitar Consulta Gratuita
              </Link>
              
              <a
                href="tel:+52-442-186-7170"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Llamar Ahora
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer navigation */}
      <div className="text-center py-8 bg-white">
        <Link 
          href="/"
          className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Volver al sitio principal
        </Link>
      </div>
    </div>
  )
}

export default CasosDeExito