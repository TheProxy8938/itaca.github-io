import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    id: 1,
    question: "¿Qué servicios de comunicación estratégica ofrecen?",
    answer: "Ofrecemos una amplia gama de servicios que incluyen: estrategias de comunicación integral, marketing digital, diseño gráfico y branding, producción audiovisual, relaciones públicas y prensa, comunicación institucional, consultoría estratégica, y capacitación en comunicación efectiva. Cada servicio está diseñado para adaptarse a las necesidades específicas de tu empresa."
  },
  {
    id: 2,
    question: "¿Cómo funciona el proceso de trabajo con ÍTACA?",
    answer: "Nuestro proceso consta de 4 fases principales: 1) Diagnóstico inicial donde analizamos tu situación actual y objetivos, 2) Desarrollo de estrategia personalizada, 3) Implementación y ejecución de las acciones definidas, 4) Monitoreo, análisis y optimización continua. Mantenemos comunicación constante contigo en cada fase del proceso."
  },
  {
    id: 3,
    question: "¿Cuánto tiempo toma ver resultados en una estrategia de comunicación?",
    answer: "Los primeros resultados suelen ser visibles entre 4-6 semanas para acciones de comunicación digital y redes sociales. Para estrategias más complejas como posicionamiento de marca o comunicación institucional, los resultados significativos se observan entre 3-6 meses. El tiempo exacto depende de los objetivos específicos, la industria y el alcance del proyecto."
  },
  {
    id: 4,
    question: "¿Trabajan con empresas de todos los tamaños?",
    answer: "Sí, trabajamos con empresas de todos los tamaños, desde startups y pequeños negocios hasta grandes corporaciones e instituciones gubernamentales. Adaptamos nuestras estrategias y propuestas según el presupuesto, objetivos y necesidades específicas de cada cliente, asegurando siempre la máxima calidad en nuestros servicios."
  },
  {
    id: 5,
    question: "¿Qué incluye una consultoría de comunicación estratégica?",
    answer: "Una consultoría incluye: diagnóstico completo de tu situación comunicacional actual, análisis de audiencias y competencia, identificación de oportunidades y desafíos, desarrollo de estrategias específicas, recomendaciones de herramientas y canales, cronograma de implementación, y métricas para evaluar el éxito. Incluye también sesiones de seguimiento para asegurar la correcta implementación."
  },
  {
    id: 6,
    question: "¿Manejan crisis de comunicación y reputación?",
    answer: "Sí, tenemos amplia experiencia en manejo de crisis comunicacionales. Ofrecemos tanto servicios preventivos (desarrollo de protocolos de crisis, capacitación de voceros) como manejo de crisis activas (respuesta inmediata, control de daños, recuperación de reputación). Contamos con un equipo disponible 24/7 para situaciones de emergencia comunicacional."
  },
  {
    id: 7,
    question: "¿Cuáles son sus tarifas y formas de pago?",
    answer: "Nuestras tarifas se adaptan al tipo de proyecto y duración del mismo. Ofrecemos: consultoría por horas, proyectos específicos con precio fijo, y retainers mensuales para servicios continuos. Aceptamos pagos mediante transferencia bancaria y efectivo. Para proyectos grandes, manejamos esquemas de pago por fases. Contacta con nosotros para una cotización personalizada."
  },
  {
    id: 8,
    question: "¿Proporcionan capacitación a equipos internos?",
    answer: "Absolutamente. Ofrecemos talleres y capacitaciones en: comunicación efectiva, manejo de redes sociales, redacción corporativa, media training para voceros, manejo de crisis, comunicación interna, y herramientas digitales de comunicación. Las capacitaciones pueden ser presenciales o virtuales, y se adaptan al nivel y necesidades específicas de tu equipo."
  },
  {
    id: 9,
    question: "¿Cómo miden el éxito de una campaña de comunicación?",
    answer: "Utilizamos KPIs específicos según los objetivos: alcance e impresiones, engagement y interacciones, conversiones y leads generados, menciones en medios, análisis de sentimiento, tráfico web, reconocimiento de marca, y ROI. Proporcionamos reportes periódicos detallados con análisis de resultados y recomendaciones de optimización."
  },
  {
    id: 10,
    question: "¿Qué diferencia a ÍTACA de otras agencias de comunicación?",
    answer: "Nos diferenciamos por nuestro enfoque humanizado y estratégico, inspirado en el poema de Kavafis. Valoramos tanto el proceso como los resultados, actuamos como verdaderos aliados de nuestros clientes, combinamos creatividad con rigor analítico, ofrecemos servicios 360° de comunicación, y mantenemos un equipo multidisciplinario con amplia experiencia en diversos sectores."
  }
];

const FAQ = () => {
  const [activeId, setActiveId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Volver al inicio</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Preguntas <span className="text-yellow-300">Frecuentes</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Encuentra respuestas a las dudas más comunes sobre nuestros servicios de comunicación estratégica
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                >
                  <span className="font-semibold text-gray-900 text-lg">
                    {faq.question}
                  </span>
                  <motion.svg
                    animate={{ rotate: activeId === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-5 h-5 text-blue-600 flex-shrink-0 ml-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>
                
                <AnimatePresence>
                  {activeId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5">
                        <div className="w-full h-px bg-gray-200 mb-4"></div>
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿No encontraste lo que buscabas?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Nuestro equipo está listo para resolver todas tus dudas y diseñar la estrategia perfecta para tu empresa
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contacto"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Contáctanos
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

      {/* Additional Help Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Consulta Gratuita</h3>
              <p className="text-gray-700">
                Agenda una sesión gratuita de 30 minutos para evaluar tus necesidades de comunicación
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl"
            >
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Recursos Gratuitos</h3>
              <p className="text-gray-700">
                Accede a guías, plantillas y recursos de comunicación estratégica sin costo
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl"
            >
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Soporte Directo</h3>
              <p className="text-gray-700">
                Comunícate directamente con nuestro equipo para resolver cualquier duda específica
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer navigation */}
      <div className="text-center py-8">
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

export default FAQ