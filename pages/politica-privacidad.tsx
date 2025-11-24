import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const PoliticaPrivacidad = () => {
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
            Política de Privacidad
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introducción</h2>
            <p className="text-gray-700 leading-relaxed">
              En ÍTACA Comunicación Estratégica, respetamos y protegemos la privacidad de nuestros clientes y usuarios. Esta política de privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos su información personal cuando utiliza nuestros servicios o visita nuestro sitio web.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Información que Recopilamos</h2>
            <div className="space-y-4 text-gray-700">
              <h3 className="text-lg font-medium text-gray-800">2.1 Información Personal Directa</h3>
              <p className="leading-relaxed mb-4">Recopilamos información que usted nos proporciona directamente, incluyendo:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Nombre completo y datos de contacto (email, teléfono, dirección)</li>
                <li>Información de la empresa (nombre, cargo, sector empresarial)</li>
                <li>Información sobre proyectos y requerimientos específicos</li>
                <li>Comunicaciones que mantiene con nosotros</li>
                <li>Información de facturación y pago</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mt-6">2.2 Información Técnica</h3>
              <p className="leading-relaxed mb-4">Cuando visita nuestro sitio web, podemos recopilar automáticamente:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Dirección IP y ubicación geográfica aproximada</li>
                <li>Tipo de navegador y sistema operativo</li>
                <li>Páginas visitadas y tiempo de permanencia</li>
                <li>Fuente de referencia al sitio web</li>
                <li>Cookies y tecnologías similares de seguimiento</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Cómo Utilizamos su Información</h2>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed mb-4">Utilizamos la información recopilada para los siguientes propósitos:</p>
              
              <h3 className="text-lg font-medium text-gray-800">3.1 Prestación de Servicios</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Desarrollar y ejecutar estrategias de comunicación personalizadas</li>
                <li>Crear contenido y materiales específicos para su empresa</li>
                <li>Gestionar proyectos y mantener comunicación sobre el progreso</li>
                <li>Procesar pagos y gestionar la facturación</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800">3.2 Comunicación y Atención al Cliente</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Responder a consultas y solicitudes de información</li>
                <li>Proporcionar soporte técnico y asistencia</li>
                <li>Enviar actualizaciones sobre proyectos en curso</li>
                <li>Notificar cambios en nuestros servicios o políticas</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800">3.3 Mejora de Servicios</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Analizar el uso del sitio web para mejorar la experiencia del usuario</li>
                <li>Desarrollar nuevos servicios basados en las necesidades del mercado</li>
                <li>Realizar estudios de satisfacción del cliente</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Compartir Información</h2>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed mb-4">
                ÍTACA Comunicación Estratégica no vende, alquila ni comparte su información personal con terceros, excepto en las siguientes circunstancias:
              </p>
              
              <h3 className="text-lg font-medium text-gray-800">4.1 Proveedores de Servicios</h3>
              <p className="leading-relaxed mb-4">
                Podemos compartir información con proveedores de confianza que nos ayudan a operar nuestro negocio, como:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Servicios de hosting y almacenamiento en la nube</li>
                <li>Plataformas de gestión de proyectos y comunicación</li>
                <li>Proveedores de servicios de pago y facturación</li>
                <li>Servicios de análisis web y marketing digital</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800">4.2 Requisitos Legales</h3>
              <p className="leading-relaxed">
                Podemos divulgar información personal cuando sea requerido por ley o cuando creamos de buena fe que dicha divulgación es necesaria para proteger nuestros derechos, su seguridad o la seguridad de otros.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Seguridad de los Datos</h2>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed mb-4">
                Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger su información personal:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encriptación SSL para todas las transmisiones de datos</li>
                <li>Acceso restringido a información personal solo para personal autorizado</li>
                <li>Copias de seguridad regulares y almacenamiento seguro</li>
                <li>Actualización constante de sistemas de seguridad</li>
                <li>Capacitación regular del personal en protección de datos</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Retención de Datos</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Conservamos su información personal solo durante el tiempo necesario para cumplir con los propósitos para los cuales fue recopilada, incluyendo:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Durante la vigencia de la relación comercial</li>
              <li>Por el tiempo requerido por obligaciones legales y fiscales</li>
              <li>Para resolver disputas y hacer cumplir nuestros acuerdos</li>
              <li>Por un período máximo de 5 años después de la finalización del servicio</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Sus Derechos</h2>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed mb-4">Como titular de datos personales, usted tiene los siguientes derechos:</p>
              
              <h3 className="text-lg font-medium text-gray-800">7.1 Derechos de Acceso y Rectificación</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Conocer, actualizar y rectificar sus datos personales</li>
                <li>Solicitar prueba de la autorización otorgada para el tratamiento</li>
                <li>Ser informado sobre el uso que se ha dado a sus datos</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800">7.2 Derechos de Oposición y Cancelación</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Presentar quejas ante la Superintendencia de Industria y Comercio</li>
                <li>Revocar la autorización y/o solicitar la supresión de datos</li>
                <li>Acceder de forma gratuita a sus datos personales</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Cookies y Tecnologías de Seguimiento</h2>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed mb-4">
                Nuestro sitio web utiliza cookies y tecnologías similares para mejorar su experiencia:
              </p>
              
              <h3 className="text-lg font-medium text-gray-800">8.1 Tipos de Cookies</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento básico del sitio</li>
                <li><strong>Cookies de rendimiento:</strong> Nos ayudan a entender cómo los usuarios interactúan con el sitio</li>
                <li><strong>Cookies funcionales:</strong> Permiten recordar sus preferencias</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800">8.2 Control de Cookies</h3>
              <p className="leading-relaxed">
                Puede configurar su navegador para rechazar todas o algunas cookies, o para alertarle cuando se envían cookies. Sin embargo, si desactiva las cookies, algunas partes del sitio pueden no funcionar correctamente.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Transferencias Internacionales</h2>
            <p className="text-gray-700 leading-relaxed">
              Sus datos personales pueden ser transferidos y procesados en servidores ubicados fuera de Colombia. En tales casos, nos aseguramos de que existan las salvaguardas adecuadas para proteger su información de acuerdo con los estándares colombianos e internacionales de protección de datos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Menores de Edad</h2>
            <p className="text-gray-700 leading-relaxed">
              Nuestros servicios están dirigidos a empresas y profesionales. No recopilamos intencionalmente información personal de menores de 18 años. Si nos damos cuenta de que hemos recopilado información de un menor sin el consentimiento parental adecuado, eliminaremos esa información de nuestros registros.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Cambios a esta Política</h2>
            <p className="text-gray-700 leading-relaxed">
              Podemos actualizar esta política de privacidad ocasionalmente para reflejar cambios en nuestras prácticas o por razones legales, operativas o regulatorias. Le notificaremos sobre cambios significativos publicando la nueva política en nuestro sitio web y actualizando la fecha de "última actualización".
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Contacto</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Para ejercer sus derechos de protección de datos o si tiene preguntas sobre esta política de privacidad, puede contactarnos:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> info@itacacomunicacion.com<br />
                <strong>Empresa:</strong> ÍTACA Comunicación Estratégica<br />
                <strong>Responsable del Tratamiento:</strong> ÍTACA Comunicación Estratégica<br />
                <strong>Finalidad:</strong> Prestación de servicios de comunicación estratégica y marketing
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">13. Marco Legal</h2>
            <p className="text-gray-700 leading-relaxed">
              Esta política de privacidad se basa en la Ley 1581 de 2012 de Colombia sobre protección de datos personales y su decreto reglamentario 1377 de 2013, así como en las directrices de la Superintendencia de Industria y Comercio de Colombia.
            </p>
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

export default PoliticaPrivacidad