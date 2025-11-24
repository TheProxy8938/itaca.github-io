import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const TerminosCondiciones = () => {
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

      {/* Content */}
      <motion.div 
        className="max-w-4xl mx-auto px-4 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Términos y Condiciones
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            ÍTACA Comunicación Estratégica
          </motion.p>
          <motion.p 
            className="text-sm text-gray-500 mt-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </motion.p>
        </div>

        {/* Legal Content */}
        <motion.div 
          className="bg-white rounded-lg shadow-lg p-8 space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Aceptación de los Términos</h2>
            <p className="text-gray-700 leading-relaxed">
              Al acceder y utilizar los servicios de ÍTACA Comunicación Estratégica, usted acepta estar vinculado por estos términos y condiciones, todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de las leyes locales aplicables. Si no está de acuerdo con alguno de estos términos, tiene prohibido usar o acceder a este sitio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Servicios Ofrecidos</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ÍTACA Comunicación Estratégica ofrece servicios profesionales de comunicación que incluyen:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Estrategias de marketing digital y tradicional</li>
              <li>Diseño gráfico y creación de contenido visual</li>
              <li>Servicios audiovisuales y producción multimedia</li>
              <li>Gestión de prensa y relaciones públicas</li>
              <li>Comunicación corporativa y consultoría estratégica</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Responsabilidades del Cliente</h2>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                El cliente se compromete a:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Proporcionar información veraz y actualizada para la prestación de servicios</li>
                <li>Colaborar de manera activa en el desarrollo de los proyectos</li>
                <li>Cumplir con los plazos de pago establecidos en el contrato de servicios</li>
                <li>Respetar los derechos de autor y propiedad intelectual de los trabajos entregados</li>
                <li>Notificar cualquier cambio en los requerimientos del proyecto de manera oportuna</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Propiedad Intelectual</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Todos los materiales, diseños, estrategias y contenidos creados por ÍTACA Comunicación Estratégica en el marco de los servicios contratados permanecerán como propiedad de la empresa hasta el pago total de los honorarios acordados.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Una vez realizado el pago completo, los derechos de uso comercial de los materiales desarrollados específicamente para el cliente se transferirán al mismo, manteniendo ÍTACA los derechos de autoría y la posibilidad de utilizar los trabajos como referencia en su portafolio profesional.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Limitación de Responsabilidad</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ÍTACA Comunicación Estratégica no será responsable de daños indirectos, incidentales, especiales, consecuenciales o punitivos, incluyendo pero no limitado a pérdida de beneficios, datos, uso, o cualquier otra pérdida intangible.
            </p>
            <p className="text-gray-700 leading-relaxed">
              La responsabilidad total de ÍTACA en cualquier caso no excederá el monto pagado por el cliente por los servicios específicos que dieron origen al reclamo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Términos de Pago</h2>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                Los términos de pago se establecerán en cada contrato específico de servicios. En general:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Los proyectos pueden requerir un anticipo del 50% antes del inicio de los trabajos</li>
                <li>Los pagos pendientes deberán realizarse según el cronograma acordado</li>
                <li>Los retrasos en los pagos pueden resultar en la suspensión de los servicios</li>
                <li>Los métodos de pago aceptados incluyen transferencias bancarias y efectivo</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Cancelaciones y Reembolsos</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Las cancelaciones de proyectos deben ser comunicadas por escrito con al menos 48 horas de anticipación. Los trabajos ya realizados serán facturados según el avance del proyecto.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Los reembolsos se evaluarán caso por caso y dependerán del estado de avance del proyecto y los recursos ya invertidos por ÍTACA.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Confidencialidad</h2>
            <p className="text-gray-700 leading-relaxed">
              ÍTACA Comunicación Estratégica se compromete a mantener la confidencialidad de toda información privilegiada del cliente a la que tenga acceso durante la prestación de servicios. Esta obligación permanecerá vigente incluso después de la finalización de la relación comercial.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Modificaciones de los Términos</h2>
            <p className="text-gray-700 leading-relaxed">
              ÍTACA Comunicación Estratégica se reserva el derecho de revisar estos términos y condiciones en cualquier momento sin previo aviso. Los cambios entrarán en vigor inmediatamente después de su publicación en este sitio web.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Ley Aplicable</h2>
            <p className="text-gray-700 leading-relaxed">
              Estos términos y condiciones se rigen por las leyes de Colombia. Cualquier disputa relacionada con estos términos será resuelta en los tribunales competentes de la jurisdicción donde ÍTACA Comunicación Estratégica tenga su domicilio principal.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Contacto</h2>
            <p className="text-gray-700 leading-relaxed">
              Para cualquier consulta sobre estos términos y condiciones, puede contactarnos a través de:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> info@itacacomunicacion.com<br />
                <strong>Empresa:</strong> ÍTACA Comunicación Estratégica
              </p>
            </div>
          </section>
        </motion.div>

        {/* Footer navigation */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Volver al sitio principal
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default TerminosCondiciones