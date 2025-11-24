import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import ValueCard from '../components/ValueCard';

const teamMembers = [
  {
    name: "Dilan Hernández",
    position: "Programador Fullstack",
    description: "Apasionado del trabajo en equipo, la colaboracion y la innovacion.",
    image: "/equipo/dilan.jpg"
  },
  {
    name: "TAMBIEN DILAN HERNANDEZ",
    position: "Estratega Digital",
    description: "Experto en marketing digital y análisis de datos para optimizar campañas.",
    image: "/equipo/dilan2.jpg"
  },
  {
    name: "Ana Martínez",
    position: "Directora de Cuentas",
    description: "Especialista en relaciones públicas y gestión de la reputación corporativa.",
    image: "/team/ana.jpg"
  },
  {
    name: "Diego Silva",
    position: "Director de Producción",
    description: "Líder en producción audiovisual y contenido multimedia creativo.",
    image: "/team/diego.jpg"
  }
];

const values = [
  {
    icon: "🎯",
    title: "Humanidad",
    description: "Escuchar antes de hablar y poner a las personas en el centro."
  },
  {
    icon: "🤝",
    title: "Confianza",
    description: "Construyendo relaciones honestas, duraderas y con resultados."
  },
  {
    icon: "💡",
    title: "Claridad",
    description: "Una buena estrategia comienza con una idea bien dicha."
  },
  {
    icon: "🚀",
    title: "Creatividad",
    description: "Nos mueve con propósito para transformar sin perder el rumbo."
  },
  {
    icon: "📈",
    title: "Responsabilidad",
    description: "La ejercemos con plena conciencia del poder de cada mensaje y decisión."
  },
  {
    icon: "🧭",
    title: "Curiosidad",
    description: "Mantenemos siempre la mente abierta para descubrir nuevas oportunidades."
  }
];

export default function Nosotros() {
  return (
    <Layout title="Nosotros - ÍTACA Comunicación Estratégica">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Conoce a <span className="text-yellow-300">ÍTACA</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Somos un equipo apasionado por transformar la comunicación de las empresas, 
              creando estrategias que conectan auténticamente con las audiencias.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Nuestra Historia */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Nuestra Historia
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  ÍTACA nació en 2025 con una visión clara: revolucionar la forma en que las empresas 
                  se comunican con sus audiencias. Inspirados en el viaje épico de Ulises hacia Ítaca, 
                  entendemos que cada empresa tiene su propio camino hacia el éxito.
                </p>
                <p>
                  Durante estos años, hemos acompañado a más de 200 empresas en su transformación digital, 
                  ayudándoles a construir marcas sólidas y a establecer conexiones genuinas con sus clientes.
                </p>
                <p>
                  Nuestro enfoque se basa en la comprensión profunda de cada negocio, combinando estrategia, 
                  creatividad y tecnología para lograr resultados extraordinarios.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">8+ Años</h3>
                  <p className="text-gray-600">Transformando empresas</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Fundador */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestro Fundador
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conoce a la mente visionaria detrás de ÍTACA
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-1">
                <div className="bg-white rounded-xl p-8 h-full">
                  <div className="text-center">
                    {/* Foto del fundador */}
                    <img 
                      src="/ceo/emmanuel.jpg" 
                      alt="Emmanuel Cabello Flores - CEO y Fundador de ÍTACA"
                      className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-2xl mx-auto mb-6"
                    />
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      Emmanuel Cabello Flores
                    </h3>
                    <p className="text-xl text-blue-600 font-medium mb-4">
                      Fundador & CEO de ÍTACA
                    </p>
                    
                    {/* Credenciales y logros */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">20+</div>
                          <div className="text-sm text-gray-600">Años de Experiencia</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">6+</div>
                          <div className="text-sm text-gray-600">Instituciones Públicas</div>
                        </div>
                      </div>
                    </div>

                    {/* Contacto */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-bold text-gray-900 mb-2">Contacto</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <span className="text-blue-500 mr-2">📞</span>
                          <span>442 186 7170</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-green-500 mr-2">✉️</span>
                          <span>ecabellof14@gmail.com</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  La Visión Detrás de ÍTACA
                </h3>
                
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    <strong className="text-gray-900">Licenciado en Periodismo y Comunicación (UAQ)</strong>
                    <br />
                    <span className="text-sm text-gray-500">Cédula Profesional: 9402231</span>
                  </p>
                  <p>
                    Emmanuel Cabello Flores es un apasionado del servicio público y la comunicación con más de 20 años 
                    de experiencia en el sector. Ha colaborado en diversas dependencias gubernamentales del Poder 
                    Ejecutivo del Estado de Querétaro, desde las bases hasta puestos directivos.
                  </p>
                  <p>
                    Su trayectoria incluye roles en la Coordinación de Comunicación Social, las secretarías de 
                    Desarrollo Urbano y Obras Públicas, de la Contraloría y el Instituto Queretano del Transporte. 
                    Actualmente se desempeña como Jefe de Prensa y Difusión en la Universidad Tecnológica de Querétaro.
                  </p>
                  <p>
                    Esta experiencia le ha permitido ampliar su visión sobre las necesidades ciudadanas, el desempeño 
                    público y las diferentes formas de comunicar, siendo la base fundamental para la creación de ÍTACA.
                  </p>
                </div>

                {/* Formación y especialización */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Formación Especializada</h4>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-1">🎓</span>
                      <span>Licenciatura en Periodismo y Comunicación - Universidad Autónoma de Querétaro</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2 mt-1">📺</span>
                      <span>Diplomado Creadores de Contenidos de Televisión - UNAM-STIRyT</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">⚡</span>
                      <span>Gestión Estratégica de Comunicación en Manejo de Crisis - Consultores Schwarz</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2 mt-1">🗳️</span>
                      <span>Semanario Marketing Político - MKT POLÍTICO Centro de Formación</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 mt-1">🎯</span>
                      <span>Seminario Internacional de Relaciones Públicas y Publicidad - UAQ</span>
                    </li>
                  </ul>
                </div>

                {/* Experiencia Destacada */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Trayectoria Profesional</h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span className="font-medium">Jefe de Prensa y Difusión</span>
                      <span className="text-blue-600">2021 - Actual</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span className="font-medium">Secretario Particular - Instituto Queretano del Transporte</span>
                      <span className="text-blue-600">2018 - 2021</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span className="font-medium">Jefe de Comunicación - Múltiples Dependencias</span>
                      <span className="text-blue-600">2009 - 2018</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Experiencia en Medios de Comunicación</span>
                      <span className="text-blue-600">2001 - 2009</span>
                    </div>
                  </div>
                </div>

                {/* Quote inspiracional */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border-l-4 border-blue-500">
                  <blockquote className="text-lg font-medium text-gray-800 italic">
                    "Cuando emprendas tu viaje a Ítaca, pide que el camino sea largo, 
                    lleno de aventuras, lleno de experiencias..."
                  </blockquote>
                  <cite className="block mt-2 text-sm text-gray-600">— Constantino Kavafis (Inspiración para ÍTACA)</cite>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

            {/* Sección Quiénes Somos */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Quiénes Somos</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
En Ítaca somos más que una agencia: somos compañeros de viaje. Creemos que cada marca, institución o proyecto atraviesa su propia odisea, un camino lleno de retos, decisiones y aprendizajes.


Inspirados en el poema de Kavafis, valoramos tanto el viaje como el destino. Por eso acompañamos a nuestros clientes como aliados estratégicos, con una visión integral, humana y auténtica de la comunicación.              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h3 className="text-2xl font-bold text-white mb-4">Misión</h3>
                <p className="text-gray-300">
                  Nuestra misión no es solo comunicar, sino construir puentes y abrir conversaciones que hagan que los mensajes lleguen realmente a donde deben llegar.
                </p>
                <blockquote className="mt-6 text-center italic text-gray-400 text-lg border-l-4 border-blue-500 pl-4">
                  "Que tu viaje sea largo, lleno de aventuras y experiencias"
                </blockquote>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <h3 className="text-2xl font-bold text-white mb-4">Visión</h3>
                <p className="text-gray-300">
                  Ser un referente en comunicación estratégica, reconocidos por transformar cada proceso en un viaje y reinventar la forma de comunicar desde lo público, lo social o estratégico, haciendo del contenido un puente que transforma ideas en acciones.
                </p>
                <blockquote className="mt-6 text-center italic text-gray-400 text-lg border-l-4 border-green-500 pl-4">
                  "Ítaca te brindó tan hermoso viaje. Sin ella no habrías emprendido el camino"
                </blockquote>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <h3 className="text-2xl font-bold text-white mb-4">Valores</h3>
                <p className="text-gray-300">
                  Nuestros valores no son solo discursos: son brújula, como la esencia del viaje que emprendemos contigo. Creemos en la humanidad, la claridad, la confianza, la creatividad, la responsabilidad y la curiosidad.
                </p>
                <blockquote className="mt-6 text-center italic text-gray-400 text-lg border-l-4 border-pink-500 pl-4">
                  "Ten siempre a Ítaca en tu mente. Llegar allí es tu destino"
                </blockquote>
              </motion.div>
            </div>
          </div>
        </section>


      {/* Valores */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Nuestros Valores
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Los principios que guían cada decisión y acción en ÍTACA
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ValueCard {...value} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo */}
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
              Nuestro Equipo
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Profesionales apasionados con la experiencia y creatividad para llevar tu marca al siguiente nivel
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center group hover:shadow-lg transition-shadow"
              >
                <div className="w-24 h-24 mx-auto mb-4 group-hover:scale-105 transition-transform">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover border-2 border-gray-200 shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.position}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Listo para transformar tu comunicación?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Conversemos sobre cómo ÍTACA puede ayudarte a alcanzar tus objetivos de comunicación.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-bold hover:shadow-lg transition-shadow"
              onClick={() => window.location.href = '/contacto'}
            >
              Conversemos
            </motion.button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}