import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Service {
  title: string;
  imageSrc: string;
  features: string[];
}

const services: Service[] = [
  {
    title: 'Comunicación Estratégica',
    imageSrc: '/servicios/comunicacion.jpg',
    features: [
      'Diseño de planes integrales de comunicación',
      'Auditorías y diagnósticos de comunicación',
      'Gestión de crisis y reputación'
    ]
  },
  {
    title: 'Marketing Digital',
    imageSrc: '/servicios/marketing.jpg',
    features: [
      'Estrategias integrales de marketing digital',
      'Gestión profesional de redes sociales',
      'Campañas publicitarias digitales'
    ]
  },
  {
    title: 'Diseño y Branding',
    imageSrc: '/servicios/diseño.jpg',
    features: [
      'Desarrollo de identidad visual corporativa',
      'Diseño de logotipos y tipografías',
      'Manuales de marca y guías de estilo'
    ]
  },
  {
    title: 'Producción Audiovisual',
    imageSrc: '/servicios/audiovisual.jpg',
    features: [
      'Videos institucionales y promocionales',
      'Fotografía corporativa y eventos',
      'Transmisiones en vivo y streaming'
    ]
  },
  {
    title: 'Relaciones Públicas',
    imageSrc: '/servicios/prensa.jpg',
    features: [
      'Gestión de medios de comunicación',
      'Redacción de comunicados de prensa',
      'Organización de eventos mediáticos'
    ]
  },
  {
    title: 'Consultoría Estratégica',
    imageSrc: '/servicios/comunicacion.jpg',
    features: [
      'Talleres de comunicación efectiva',
      'Coaching para portavoces',
      'Desarrollo de manuales de comunicación'
    ]
  },
  {
    title: 'Eventos y Activaciones',
    imageSrc: '/servicios/comunicacion.jpg',
    features: [
      'Planificación y ejecución de eventos corporativos',
      'Activaciones de marca y campañas experienciales',
      'Organización de webinars y seminarios'
    ]
  },
  {
    title: 'Comunicación Institucional',
    imageSrc: '/servicios/comunicacion.jpg',
    features: [
      'Campañas de difusión para entidades públicas',
      'Gestión de imagen para funcionarios',
      'Transparencia y rendición de cuentas'
    ]
  },
  {
    title: 'Investigación y Análisis',
    imageSrc: '/servicios/comunicacion.jpg',
    features: [
      'Estudios de mercado y públicos objetivos',
      'Análisis de percepción y reputación',
      'Monitorización de tendencias y competencia'
    ]
  }
];

export default function ServicesGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {services.map((service, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          viewport={{ once: true }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="relative overflow-hidden rounded-xl p-8 cursor-pointer"
          style={{
            transform: `translateY(${hoveredIndex === null || hoveredIndex === index ? '0px' : '20px'}) translateZ(0)`,
            opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.6,
            zIndex: hoveredIndex === index ? 30 : 10,
            transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            filter: `brightness(${hoveredIndex === index ? 1.2 : 1}) saturate(${hoveredIndex === index ? 1.2 : 1})`,
            boxShadow: hoveredIndex === index ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 3px rgba(34, 197, 94, 0.5)' : 'none'
          }}
        >
          <img
            alt={service.title}
            src={service.imageSrc}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div 
            className="absolute inset-0 bg-black"
            style={{
              opacity: hoveredIndex === index ? 0.3 : 0.5,
              transition: 'opacity 0.5s ease'
            }}
          />
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-6">{service.title}</h3>
            <ul className="space-y-3">
              {service.features.map((feature, idx) => (
                <li key={idx} className="text-gray-300 flex items-center">
                  <svg className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
