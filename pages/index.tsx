import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import dynamic from 'next/dynamic';
import emailjs from '@emailjs/browser';

// Importaciones críticas (carga inmediata)
import ValueCard from '../components/ValueCard';
import KeywordAnimation from '../components/KeywordAnimation';

// Importaciones optimizadas con lazy loading
const CaseStudy = dynamic(() => import('../components/CaseStudy'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-40 rounded-lg"></div>
});

const BannerScroll = dynamic(() => import('../components/BannerScroll'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-20 rounded-lg"></div>
});

const HeroCarousel = dynamic(() => import('../components/HeroCarousel'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
});

const successCases = [
  {
    name: "Carlos Rodríguez",
    company: "TechPro Solutions",
    testimonial: "Gracias a MARKE ONLINE, aumentamos nuestras ventas en un 300% en solo 6 meses.",
    image: "/testimonials/person1.jpg"
  },
  {
    name: "Ana Martínez",
    company: "Boutique Elegance",
    testimonial: "La estrategia digital que implementaron transformó completamente nuestro negocio.",
    image: "/testimonials/person2.jpg"
  },
  {
    name: "Miguel Santos",
    company: "FitLife Gym",
    testimonial: "Su enfoque innovador en marketing digital nos ayudó a destacar en un mercado muy competitivo.",
    image: "/testimonials/person3.jpg"
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

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);



  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    // Simular envío del newsletter
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubscribed(true);
      setEmail('');
      
      // Resetear el mensaje después de 3 segundos
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    } catch (error) {
      console.error('Error al suscribirse:', error);
    } finally {
      setIsSubmitting(false);
    }
  };



  // Funciones del Quiz Interactivo
  const nextQuestion = (answer: string) => {
    const quizResults = {
      'branding': {
        title: 'Necesitas Branding & Identidad',
        text: 'Te ayudamos a crear una marca memorable que conecte con tu audiencia y se diferencie de la competencia.',
        emoji: '🎨'
      },
      'digital': {
        title: 'Necesitas Marketing Digital',
        text: 'Creamos tu presencia digital completa: redes sociales, web, SEO y campañas que generen resultados.',
        emoji: '🚀'
      },
      'sales': {
        title: 'Necesitas Estrategia de Ventas',
        text: 'Diseñamos embudos de conversión y campañas publicitarias que aumenten tus ventas significativamente.',
        emoji: '📈'
      },
      'reputation': {
        title: 'Necesitas Gestión de Reputación',
        text: 'Protegemos y mejoramos tu reputación online con estrategias de comunicación de crisis y contenido positivo.',
        emoji: '🛡️'
      }
    };

    const result = quizResults[answer as keyof typeof quizResults];
    
    // Ocultar pregunta y opciones
    const questionDiv = document.getElementById('quiz-question');
    const optionsDiv = document.getElementById('quiz-options');
    const resultDiv = document.getElementById('quiz-result');
    const restartBtn = document.getElementById('restart-quiz');
    
    if (questionDiv) questionDiv.style.display = 'none';
    if (optionsDiv) optionsDiv.style.display = 'none';
    if (resultDiv) {
      resultDiv.classList.remove('hidden');
      const titleEl = document.getElementById('result-title');
      const textEl = document.getElementById('result-text');
      
      if (titleEl) titleEl.textContent = `${result.emoji} ${result.title}`;
      if (textEl) textEl.textContent = result.text;
    }
    if (restartBtn) restartBtn.classList.remove('hidden');
  };

  const restartQuiz = () => {
    const questionDiv = document.getElementById('quiz-question');
    const optionsDiv = document.getElementById('quiz-options');
    const resultDiv = document.getElementById('quiz-result');
    const restartBtn = document.getElementById('restart-quiz');
    
    if (questionDiv) questionDiv.style.display = 'block';
    if (optionsDiv) optionsDiv.style.display = 'block';
    if (resultDiv) resultDiv.classList.add('hidden');
    if (restartBtn) restartBtn.classList.add('hidden');
  };

  // Estados del Chatbot Integrado
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{id: string, text: string, isUser: boolean, timestamp: Date, quickReplies?: string[], showForm?: boolean, formType?: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Estados para formularios integrados
  const [showChatForm, setShowChatForm] = useState(false);
  const [chatFormType, setChatFormType] = useState('');
  const [chatFormData, setChatFormData] = useState({
    name: '', email: '', phone: '', company: '', service: '', message: '', emergencyType: ''
  });
  
  // Respuestas del Chatbot
  const getChatResponse = (userMessage: string) => {
    const text = userMessage.toLowerCase();
    
    if (text.includes('servicios') || text.includes('servicio')) {
      return {
        text: `🚀 **SERVICIOS ÍTACA**\n\n🎯 **Marketing Digital**\n• Redes sociales profesionales\n• SEO y posicionamiento web\n• Google Ads optimizados\n• Email marketing efectivo\n\n🎨 **Diseño y Branding**\n• Identidad corporativa completa\n• Diseño web responsive\n• Material gráfico profesional\n\n📺 **Producción Audiovisual**\n• Videos corporativos de alto impacto\n• Fotografía profesional\n• Contenido para redes sociales\n\n📈 **Comunicación Estratégica**\n• Consultoría personalizada\n• Manejo de crisis\n• Relaciones públicas`,
        quickReplies: ['Marketing Digital', 'Diseño Web', 'Cotización', 'Contacto Directo']
      };
    }
    
    if (text.includes('precio') || text.includes('cotizacion') || text.includes('costo')) {
      return {
        text: `💰 **PLANES DE INVERSIÓN ESTRATÉGICA**\n\n🟢 **PLAN STARTER** - $800 MXN/mes\n• Gestión básica de redes sociales\n• SEO básico y optimización\n• Sitio web informativo\n• Soporte por email\n\n🔵 **PLAN PROFESSIONAL** - $2,500 MXN/mes\n• Marketing digital completo\n• Diseño web avanzado con CMS\n• Campañas publicitarias optimizadas\n• Soporte prioritario y reportes\n\n🟡 **PLAN ENTERPRISE** - Cotización personalizada\n• Estrategia completamente personalizada\n• Equipo dedicado exclusivo\n• Reportes ejecutivos detallados\n• Consultoría estratégica continua\n\n💡 También creamos propuestas a medida según tus necesidades específicas.\n\n📋 **¿Quieres una cotización personalizada?** Completa el formulario y te contactaremos en menos de 2 horas.`,
        quickReplies: ['Plan Starter', 'Plan Professional', 'Plan Enterprise', '📋 Solicitar Cotización']
      };
    }
    
    if (text.includes('cotización personalizada') || text.includes('📋 solicitar cotización')) {
      return {
        text: `📋 **FORMULARIO DE COTIZACIÓN INTELIGENTE**\n\nPara brindarte la mejor cotización personalizada, necesitamos conocer un poco sobre tu proyecto.\n\n✅ **Formulario rápido** (2 minutos)\n✅ **Cotización gratuita** sin compromiso\n✅ **Respuesta garantizada** en 2 horas\n✅ **Consulta inicial** incluida\n\nCompleta el formulario y nuestro equipo se pondrá en contacto contigo muy pronto.`,
        quickReplies: [],
        showForm: true,
        formType: 'cotizacion'
      };
    }
    
    if (text.includes('contacto') || text.includes('telefono') || text.includes('email') || text.includes('whatsapp')) {
      return {
        text: `📞 **CONTACTO DIRECTO CON ÍTACA**\n\n**INFORMACIÓN DE CONTACTO:**\n📧 Email: info@itacacomunicacion.com\n📱 WhatsApp: +52 442 186 7170\n☎️ Teléfono: +52 442 186 7170\n\n**HORARIOS DE ATENCIÓN:**\n🕐 Lunes a Viernes: 9:00 - 18:00 hrs\n📅 Sábados: Con cita previa\n\n**UBICACIÓN:**\n📍 Querétaro, México\n🤝 Atendemos presencial y virtualmente\n\n**RESPUESTA GARANTIZADA:**\n⚡ Chat: Respuesta inmediata\n📧 Email: Máximo 2 horas\n📞 Llamada: El mismo día`,
        quickReplies: ['WhatsApp Directo', 'Enviar Email', 'Agendar Cita', 'Más Información']
      };
    }

    if (text.includes('agendar cita') || text.includes('agendar') || text.includes('cita')) {
      return {
        text: `📅 **AGENDAR CITA PERSONALIZADA**\n\nPara agendar una cita y brindarte la mejor atención personalizada, necesitamos algunos datos básicos.\n\n✅ **Incluye:**\n• Consulta gratuita de 30 minutos\n• Análisis inicial de tu proyecto\n• Propuesta personalizada\n• Seguimiento post-reunión\n\n🗓️ **Modalidades disponibles:**\n• Presencial en Querétaro\n• Videollamada\n• Llamada telefónica\n\nCompleta el formulario y te contactaremos para coordinar la fecha y hora ideal.`,
        quickReplies: [],
        showForm: true,
        formType: 'agendar'
      };
    }
    
    // Respuesta por defecto mejorada
    return {
      text: `¡Hola! 👋 Soy el **Asistente Virtual de ÍTACA Comunicación**\n\n🤖 **Soy una IA avanzada** diseñada para ayudarte con:\n\n🔹 **Información completa** sobre nuestros servicios\n🔹 **Cotizaciones personalizadas** para tu proyecto\n🔹 **Contacto directo** con nuestros especialistas\n\n💡 **Puedes preguntarme sobre:**\n• Marketing digital y estrategias\n• Diseño web y branding\n• Precios y planes de inversión\n• Casos de éxito y resultados\n• Información de contacto\n\n¿En qué específicamente puedo asistirte hoy?`,
      quickReplies: ['Ver Todos los Servicios', 'Solicitar Cotización', 'Información de Contacto']
    };
  };

  // Inicializar chat
  useEffect(() => {
    if (isChatOpen && chatMessages.length === 0) {
      const welcomeMessage = {
        id: `${Date.now()}_welcome`,
        text: getChatResponse('hola').text,
        isUser: false,
        timestamp: new Date(),
        quickReplies: getChatResponse('hola').quickReplies
      };
      setChatMessages([welcomeMessage]);
    }
  }, [isChatOpen, chatMessages.length]);

  // Procesar mensaje del chat
  const processChatMessage = async (text: string) => {
    if (!text.trim()) return;

    // Añadir mensaje del usuario
    const userMessage = {
      id: `${Date.now()}_user`,
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Simular typing
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsTyping(false);

    // Generar y añadir respuesta del bot
    const response = getChatResponse(text);
    const botMessage = {
      id: `${Date.now()}_bot`,
      text: response.text,
      isUser: false,
      timestamp: new Date(),
      quickReplies: response.quickReplies,
      showForm: response.showForm,
      formType: response.formType
    };
    
    setChatMessages(prev => [...prev, botMessage]);

    // Mostrar formulario si es necesario
    if (response.showForm) {
      setShowChatForm(true);
      setChatFormType(response.formType || '');
    }
  };

  // Manejar respuesta rápida
  const handleQuickReply = (reply: string) => {
    processChatMessage(reply);
  };

  // Enviar formulario del chat
  const submitChatForm = async () => {
    const requiredFields = ['name', 'email', 'message'];
    
    const missingFields = requiredFields.filter(field => !chatFormData[field as keyof typeof chatFormData]?.trim());

    if (missingFields.length > 0) {
      alert('Por favor completa todos los campos obligatorios (*)');
      return;
    }

    setIsTyping(true);
    
    try {
      // Configurar parámetros para EmailJS
      const templateParams = {
        nombre: chatFormData.name,
        email: chatFormData.email,
        telefono: chatFormData.phone || 'No proporcionado',
        empresa: chatFormData.company || 'No especificada',
        mensaje: chatFormData.message,
        tipo: chatFormType === 'agendar' ? 'Solicitud de Cita' : 'Solicitud de Cotización',
        fecha: new Date().toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      // Enviar email usando EmailJS
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      
      const confirmationText = chatFormType === 'agendar'
        ? `🗓️ **¡CITA AGENDADA EXITOSAMENTE!**\n\n📅 **ID de cita:** CITA-${Date.now().toString().slice(-6).toUpperCase()}\n\n⏰ **Te contactaremos en las próximas 2 horas para:**\n• Confirmar fecha y hora disponible\n• Definir modalidad (presencial/virtual)\n• Enviar enlace de videollamada (si aplica)\n• Compartir agenda de la reunión\n\n📱 **Datos de contacto confirmados:**\n• Email: ${chatFormData.email}\n${chatFormData.phone ? `• Teléfono: ${chatFormData.phone}` : ''}\n\n🎯 **Tu consulta gratuita incluye:**\n• Análisis de tu situación actual\n• Propuesta de estrategia\n• Cotización personalizada\n• Plan de acción detallado`
        : `✅ **¡SOLICITUD ENVIADA EXITOSAMENTE!**\n\n📋 **ID de solicitud:** REQ-${Date.now().toString().slice(-6).toUpperCase()}\n\n⏰ **Tiempo estimado de respuesta:**\n• Email: Máximo 2 horas\n• Llamada telefónica: Mismo día\n• WhatsApp: 15-30 minutos\n\n📱 **Te contactaremos en:**\n• Email: ${chatFormData.email}\n${chatFormData.phone ? `• Teléfono: ${chatFormData.phone}` : ''}\n\n🎯 **Próximos pasos:**\n1. Revisaremos tu solicitud\n2. Prepararemos una propuesta\n3. Agendaremos una consulta gratuita`;

      const confirmationMessage = {
        id: `${Date.now()}_confirmation`,
        text: confirmationText,
        isUser: false,
        timestamp: new Date(),
        quickReplies: chatFormType === 'agendar' 
          ? ['Nueva Cita', 'Ver Servicios', 'Contacto Directo']
          : ['Otra Consulta', 'Ver Servicios', 'Cerrar Chat']
      };

      setChatMessages(prev => [...prev, confirmationMessage]);
      setShowChatForm(false);
      setChatFormType('');
      setChatFormData({
        name: '', email: '', phone: '', company: '', service: '', message: '', emergencyType: ''
      });

    } catch (error) {
      console.error('Error enviando email:', error);
      
      const emailErrorMessage = {
        id: `${Date.now()}_error`,
        text: `❌ **Error al enviar la solicitud**\n\nNo te preocupes, puedes contactarnos directamente:\n\n📞 **Teléfono:** +52 442 186 7170\n📧 **Email:** info@itacacomunicacion.com\n💬 **WhatsApp:** Disponible 24/7\n\n¿Prefieres que te ayude de otra forma?`,
        isUser: false,
        timestamp: new Date(),
        quickReplies: ['WhatsApp Directo', 'Llamar Ahora', 'Enviar Email', 'Reintentar']
      };

      setChatMessages(prev => [...prev, emailErrorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <Head>
        <title>ÍTACA Comunicación - Marketing Digital y Diseño Web en Querétaro</title>
        <meta name="description" content="Agencia líder en marketing digital, diseño web y comunicación estratégica en Querétaro. Transformamos tu presencia digital con resultados garantizados." />
        <meta name="keywords" content="marketing digital, diseño web, SEO, redes sociales, Querétaro, branding, publicidad digital" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/videos/fondo.mp4" as="video" type="video/mp4" />
        <link rel="preload" href="/servicios/comunicacion.jpg" as="image" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        
        {/* Optimize Core Web Vitals */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Open Graph meta tags */}
        <meta property="og:title" content="ÍTACA Comunicación - Marketing Digital y Diseño Web" />
        <meta property="og:description" content="Transformamos tu presencia digital con estrategias de marketing y diseño web profesional en Querétaro." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://itacacomunicacion.com" />
        <meta property="og:image" content="/banner/banner1.png" />
        
        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ÍTACA Comunicación - Marketing Digital" />
        <meta name="twitter:description" content="Agencia de marketing digital y diseño web en Querétaro" />
        <meta name="twitter:image" content="/banner/banner1.png" />
        
        {/* Performance hints */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
      </Head>
      
      <div className="relative min-h-screen">
      {/* Chatbot - Temporalmente comentado */}
      {/* <Chatbot /> */}
      {/* Video de fondo optimizado */}
      <video
        ref={videoRef}
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/banner/banner1.png"
        aria-label="Video de fondo corporativo"
      >
        <source src="/videos/fondo.mp4" type="video/mp4" />
        Tu navegador no soporta el elemento de video.
      </video>

      {/* Overlay oscuro para mejorar legibilidad */}
      <div className="absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* Contenido principal */}
      <div className="relativo capa-10">
        {/* Top Navigation Bar */}
        <nav className="fondo-negro texto-blanco py-2 oculto lg:bloque">
          <div className="maximo-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justificar-entre centrar-elementos texto-sm">
              <div className="flex centrar-elementos espacio-x-6">
                <div className="flex centrar-elementos">
                  <svg className="alto-4 ancho-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  <a href="mailto:info@itacacomunicacion.com" className="hover:texto-gris-300 transicion">
                    info@itacacomunicacion.com
                  </a>
                </div>
                <div className="flex centrar-elementos">
                  <svg className="alto-4 ancho-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                  <a href="tel:+57-123-456-7890" className="hover:texto-gris-300 transicion">
                    +52 442 186 7170
                  </a>
                </div>
              </div>
              <div className="flex centrar-elementos espacio-x-4">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:texto-azul-400 transicion">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:texto-rosa-400 transicion">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C3.85 14.724 3.226 13.314 3.226 11.987c0-1.327.624-2.737 1.9-3.704.875-.807 2.026-1.297 3.323-1.297 1.297 0 2.448.49 3.323 1.297 1.276.967 1.9 2.377 1.9 3.704 0 1.327-.624 2.737-1.9 3.704-.875.807-2.026 1.297-3.323 1.297zm7.718-9.522a1.29 1.29 0 01-1.29-1.29 1.29 1.29 0 012.58 0c0 .713-.577 1.29-1.29 1.29z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:texto-azul-500 transicion">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:texto-azul-400 transicion">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Navigation */}
        <nav className="fondo-blanco sombra-lg relativo">
          <div className="maximo-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justificar-entre centrar-elementos alto-16">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-encoger-0"
              >
                <Link href="/">
                  <span className="texto-2xl fuente-negrita texto-verde-600">ÍTACA</span>
                </Link>
              </motion.div>

              {/* Desktop Navigation */}
              <div className="oculto lg:flex centrar-elementos espacio-x-8">
                <Link href="/" className="texto-gris-700 hover:texto-verde-600 transicion fuente-medio">
                  Inicio
                </Link>
                <Link href="/nosotros" className="texto-gris-700 hover:texto-verde-600 transicion fuente-medio">
                  Nosotros
                </Link>
                <Link href="/servicios" className="texto-gris-700 hover:texto-verde-600 transicion fuente-medio">
                  Servicios
                </Link>
                <Link href="/contacto" className="texto-gris-700 hover:texto-verde-600 transicion fuente-medio">
                  Contacto
                </Link>
              </div>

              {/* Icons and Actions */}
              <div className="flex centrar-elementos espacio-x-4">
                {/* Login Button */}
                <Link href="/login" className="oculto lg:bloque texto-gris-700 hover:texto-verde-600 transicion flex items-center space-x-2">
                  <svg className="alto-5 ancho-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Iniciar Sesión</span>
                </Link>

                {/* Quote Button */}
                <Link 
                  href="/contacto"
                  className="oculto lg:bloque fondo-verde-600 texto-blanco px-4 py-2 redondeado-lg hover:fondo-verde-700 transicion fuente-medio"
                >
                  Cotizar
                </Link>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:oculto texto-gris-700 hover:texto-verde-600"
                >
                  <svg className="alto-6 ancho-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:oculto fondo-blanco borde-t borde-gris-200"
              >
                <div className="px-2 pt-2 pb-3 espacio-y-1">

                  <Link href="/" className="bloque px-3 py-2 texto-gris-700 hover:texto-verde-600 fuente-medio">
                    Inicio
                  </Link>
                  <Link href="/nosotros" className="bloque px-3 py-2 texto-gris-700 hover:texto-verde-600 fuente-medio">
                    Nosotros
                  </Link>
                  <Link href="/servicios" className="bloque px-3 py-2 texto-gris-700 hover:texto-verde-600 fuente-medio">
                    Servicios
                  </Link>
                  <Link href="/contacto" className="bloque px-3 py-2 texto-gris-700 hover:texto-verde-600 fuente-medio">
                    Contacto
                  </Link>
                  <Link 
                    href="/contacto" 
                    className="bloque mx-3 my-2 fondo-verde-600 texto-blanco px-4 py-2 redondeado-lg hover:fondo-verde-700 texto-centro fuente-medio"
                  >
                    Cotizar
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </nav>



        {/* Banner Principal Vanguardista */}
        <div className="flex flex-columna centrar-elementos justificar-centro alto-pantalla texto-centro px-4 relativo desbordamiento-oculto">
          
          {/* Elementos de fondo vanguardistas */}
          <div className="absoluto inset-0 capa-0">
            {/* Esferas flotantes */}
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absoluto superior-20 izquierda-10 ancho-32 alto-32 fondo-gradiente-a-br desde-azul-500/20 hasta-purpura-600/20 redondeado-completo desenfoque-xl"
            />
            <motion.div
              animate={{ 
                y: [0, 20, 0],
                x: [0, 10, 0],
                rotate: [0, -180, -360]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absoluto superior-40 derecha-20 ancho-24 alto-24 fondo-gradiente-a-br desde-verde-400/20 hasta-verde-azul-500/20 redondeado-completo desenfoque-lg"
            />
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                x: [0, -15, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absoluto inferior-32 izquierda-1/4 ancho-20 alto-20 fondo-gradiente-a-br desde-rosa-400/20 hasta-rojo-500/20 redondeado-completo desenfoque-lg"
            />
            
            {/* Grid de líneas futuristas */}
            <div className="absoluto inset-0 opacidad-10">
              <div className="alto-completo ancho-completo" 
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px'
                }}
              />
            </div>
          </div>

          {/* Contenido principal */}
          <div className="relativo capa-10">
            {/* Título principal con efectos vanguardistas */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="relativo mb-12"
            >
              {/* Efecto de resplandor detrás del texto */}
              <div className="absoluto inset-0 fondo-gradiente-a-r desde-azul-500/30 via-purpura-600/30 hasta-rosa-500/30 desenfoque-3xl escala-150 -capa-10" />
              
              <h1 className="texto-5xl md:texto-8xl lg:texto-9xl fuente-negro texto-blanco mb-4 relativo">
                <span className="bloque guia-ninguna rastreo-mas-ajustado">ÍTACA</span>
                <motion.span 
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] 
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="bloque texto-4xl md:texto-6xl lg:texto-7xl fondo-gradiente-a-r desde-azul-400 via-purpura-500 via-rosa-500 hasta-azul-400 texto-transparente fondo-recorte-texto guia-ninguna rastreo-mas-ancho fuente-ligera"
                  style={{ backgroundSize: '200% 100%' }}
                >
                  Comunicación Estratégica
                </motion.span>
              </h1>
              
              {/* Líneas decorativas animadas */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
                className="alto-0.5 fondo-gradiente-a-r desde-transparente via-blanco hasta-transparente mx-auto maximo-ancho-md"
              />
            </motion.div>

            {/* Tres conceptos clave */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-center"
              >
                <h3 className="text-2xl font-bold text-yellow-400 mb-3">Estrategia</h3>
                <p className="text-gray-300">Entendemos las necesidades únicas de tu negocio</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-center"
              >
                <h3 className="text-2xl font-bold text-blue-400 mb-3">Reputación</h3>
                <p className="text-gray-300">Creamos vínculos auténticos con tu audiencia</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-center"
              >
                <h3 className="text-2xl font-bold text-purple-400 mb-3">Audiencia</h3>
                <p className="text-gray-300">Generamos impacto real en tu mercado objetivo</p>
              </motion.div>
            </div>
         
            {/* Botón CTA mejorado */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mb-20"
            >
              <motion.button
                onClick={() => {
                  const serviciosSection = document.getElementById('servicios');
                  serviciosSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(96, 165, 250, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                className="grupo relativo fondo-gradiente-a-r desde-azul-600 via-purpura-600 hasta-rosa-600 texto-blanco px-16 py-6 redondeado-completo texto-xl fuente-negrita desbordamiento-oculto transicion-todo duracion-300"
              >
                {/* Efecto de ondas en el botón */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 0, 0.7]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absoluto inset-0 fondo-gradiente-a-r desde-azul-400/50 via-purpura-500/50 hasta-rosa-500/50 redondeado-completo -capa-10"
                />
                
                <span className="relativo capa-10">Descubrir Servicios</span>
                
                {/* Flecha animada */}
                <motion.svg
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="en-linea-bloque ml-3 ancho-5 alto-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </motion.button>
            </motion.div>
          </div>


        </div>

        {/* Sección de Servicios Completos */}
        <section id="servicios" className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Servicios</h2>
              <p className="text-xl text-gray-600">Soluciones integrales de comunicación estratégica para tu empresa</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Comunicación Estratégica */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0 }}
                className="relative overflow-hidden rounded-xl p-8 hover:transform hover:scale-105 transition duration-300"
              >
                <Image 
                  alt="Comunicación Estratégica"
                  src="/servicios/comunicacion.jpg"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-6">Comunicación Estratégica</h3>
                  <ul className="space-y-3">
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Diseño de planes integrales de comunicación
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Auditorías y diagnósticos de comunicación
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Gestión de crisis y reputación
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Marketing Digital */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="relative overflow-hidden rounded-xl p-8 hover:transform hover:scale-105 transition duration-300"
              >
                <img 
                  src="/servicios/marketing.jpg"
                  alt="Marketing Digital"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-6">Marketing Digital</h3>
                  <ul className="space-y-3">
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Estrategias integrales de marketing digital
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Gestión profesional de redes sociales
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Campañas publicitarias digitales
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Diseño y Branding */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative overflow-hidden rounded-xl p-8 hover:transform hover:scale-105 transition duration-300"
              >
                <img 
                  src="/servicios/diseño.jpg"
                  alt="Diseño y Branding"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-6">Diseño y Branding</h3>
                  <ul className="space-y-3">
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Desarrollo de identidad visual corporativa
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Diseño de logotipos y tipografías
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Manuales de marca y guías de estilo
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Producción Audiovisual */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="relative overflow-hidden rounded-xl p-8 hover:transform hover:scale-105 transition duration-300"
              >
                <img 
                  src="/servicios/audiovisual.jpg"
                  alt="Producción Audiovisual"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-6">Producción Audiovisual</h3>
                  <ul className="space-y-3">
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Videos institucionales y promocionales
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Fotografía corporativa y eventos
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Transmisiones en vivo y streaming
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Relaciones Públicas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="relative overflow-hidden rounded-xl p-8 hover:transform hover:scale-105 transition duration-300"
              >
                <img 
                  src="/servicios/prensa.jpg"
                  alt="Relaciones Públicas"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-6">Relaciones Públicas</h3>
                  <ul className="space-y-3">
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Gestión de medios de comunicación
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Redacción de comunicados de prensa
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Organización de eventos mediáticos
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Consultoría Estratégica */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="relative overflow-hidden rounded-xl p-8 hover:transform hover:scale-105 transition duration-300"
              >
                <img 
                  src="/servicios/comunicacion.jpg"
                  alt="Consultoría Estratégica"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-6">Consultoría Estratégica</h3>
                  <ul className="space-y-3">
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Talleres de comunicación efectiva
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Coaching para portavoces
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Desarrollo de manuales de comunicación
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Eventos y Activaciones */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="relative overflow-hidden rounded-xl p-8 hover:transform hover:scale-105 transition duration-300"
              >
                <img 
                  src="/servicios/comunicacion.jpg"
                  alt="Eventos y Activaciones"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-6">Eventos y Activaciones</h3>
                  <ul className="space-y-3">
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Planificación y ejecución de eventos corporativos
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Activaciones de marca y campañas experienciales
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Organización de webinars y seminarios
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Comunicación Institucional y Gubernamental */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="relative overflow-hidden rounded-xl p-8 hover:transform hover:scale-105 transition duration-300"
              >
                <img 
                  src="/servicios/comunicacion.jpg"
                  alt="Comunicación Institucional"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-6">Comunicación Institucional</h3>
                  <ul className="space-y-3">
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Campañas de difusión para entidades públicas
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Gestión de imagen para funcionarios
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Transparencia y rendición de cuentas
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Investigación y Análisis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="relative overflow-hidden rounded-xl p-8 hover:transform hover:scale-105 transition duration-300"
              >
                <img 
                  src="/servicios/comunicacion.jpg"
                  alt="Investigación y Análisis"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-6">Investigación y Análisis</h3>
                  <ul className="space-y-3">
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Estudios de mercado y públicos objetivos
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Análisis de percepción y reputación
                    </li>
                    <li className="text-gray-300 flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Monitorización de tendencias y competencia
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="text-center mt-16"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">¿Listo para transformar tu comunicación?</h3>
              <p className="text-lg text-gray-600 mb-8">Conversemos sobre tus objetivos y diseñemos la estrategia perfecta</p>

              <Link 
                href="/contacto"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Solicitar Consulta Gratuita
              </Link>
            </motion.div>
          </div>
        </section>


        {/* Footer */}
        <footer className="fondo-gris-900 texto-blanco">
          <div className="maximo-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="cuadricula cuadricula-cols-1 md:cuadricula-cols-4 brecha-8">
              {/* Información de la empresa */}
              <div className="md:col-span-1">
                <h2 className="texto-2xl fuente-negrita texto-verde-400 mb-6 border-b-2 border-green-400 pb-3">
                  ÍTACA Comunicación
                </h2>
                <ul className="space-y-4 texto-gris-300">
                  <li className="flex elementos-inicio">
                    <svg className="alto-5 ancho-5 texto-verde-400 mr-3 mt-1 flex-encoger-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Querétaro, Mexico<br />Calle 1 #234</span>
                  </li>
                  <li className="flex centrar-elementos">
                    <svg className="alto-5 ancho-5 texto-verde-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href="tel:+52-442-186-7170" className="hover:texto-verde-400 transicion">
                      +52 442 186 7170
                    </a>
                  </li>
                  <li className="flex centrar-elementos">
                    <svg className="alto-5 ancho-5 texto-verde-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 7.89a2 2 0 002.82 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href="mailto:info@itacacomunicacion.com" className="hover:texto-verde-400 transicion">
                      info@itacacomunicacion.com
                    </a>
                  </li>
                </ul>
              </div>

              {/* Servicios */}
              <div className="md:col-span-1">
                <h3 className="text-xl font-semibold text-white mb-6 border-b-2 border-gray-700 pb-3">
                  Servicios
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li><a href="#servicios" className="hover:text-green-400 transition">Estrategia Digital</a></li>
                  <li><a href="#servicios" className="hover:text-green-400 transition">Comunicación Institucional</a></li>
                  <li><a href="#servicios" className="hover:text-green-400 transition">Producción Audiovisual</a></li>
                  <li><a href="#servicios" className="hover:text-green-400 transition">Diseño Gráfico</a></li>
                  <li><a href="#servicios" className="hover:text-green-400 transition">Eventos y Activaciones</a></li>
                  <li><a href="#servicios" className="hover:text-green-400 transition">Consultoría</a></li>
                  <li><a href="#servicios" className="hover:text-green-400 transition">Investigación y Análisis</a></li>
                </ul>
              </div>

              {/* Enlaces útiles */}
              <div className="md:col-span-1">
                <h3 className="text-xl font-semibold text-white mb-6 border-b-2 border-gray-700 pb-3">
                  Enlaces Útiles
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li><Link href="/" className="hover:text-green-400 transition">Inicio</Link></li>
                  <li><Link href="/nosotros" className="hover:text-green-400 transition">Nosotros</Link></li>
                  <li><a href="#servicios" className="hover:text-green-400 transition">Servicios</a></li>
                  <li><Link href="/casos-de-exito" className="hover:text-green-400 transition">Casos de Éxito</Link></li>
                  <li><Link href="/contacto" className="hover:text-green-400 transition">Contacto</Link></li>
                  <li><Link href="/faq" className="hover:text-green-400 transition">FAQ</Link></li>
                </ul>
              </div>

              {/* Quiz Interactivo */}
              <div className="md:col-span-1">
                <h3 className="text-xl font-semibold text-white mb-6 border-b-2 border-gray-700 pb-3">
                  🎯 ¿Qué Servicio Necesitas?
                </h3>
                <p className="text-gray-300 mb-4 text-sm">
                  No estás seguro qué servicio necesita tu empresa? ¡Descúbrelo en 30 segundos! 🚀
                </p>
                
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div id="quiz-container">
                    <div id="quiz-question" className="mb-4">
                      <p className="text-white font-medium mb-3">¿Cuál es tu principal desafío?</p>
                    </div>
                    
                    <div id="quiz-options" className="space-y-2">
                      <button 
                        onClick={() => nextQuestion('branding')}
                        className="w-full text-left bg-gray-700 hover:bg-blue-600 text-gray-200 hover:text-white px-3 py-2 rounded transition text-sm"
                      >
                        📱 Nadie conoce mi marca
                      </button>
                      <button 
                        onClick={() => nextQuestion('digital')}
                        className="w-full text-left bg-gray-700 hover:bg-blue-600 text-gray-200 hover:text-white px-3 py-2 rounded transition text-sm"
                      >
                        💻 No tengo presencia digital
                      </button>
                      <button 
                        onClick={() => nextQuestion('sales')}
                        className="w-full text-left bg-gray-700 hover:bg-blue-600 text-gray-200 hover:text-white px-3 py-2 rounded transition text-sm"
                      >
                        📈 Necesito más ventas
                      </button>
                      <button 
                        onClick={() => nextQuestion('reputation')}
                        className="w-full text-left bg-gray-700 hover:bg-blue-600 text-gray-200 hover:text-white px-3 py-2 rounded transition text-sm"
                      >
                        🛡️ Tengo problemas de reputación
                      </button>
                    </div>
                    
                    <div id="quiz-result" className="hidden">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 text-white text-center">
                        <div className="text-2xl mb-2">🎉</div>
                        <h4 className="font-bold mb-2" id="result-title">¡Perfecto!</h4>
                        <p className="text-sm mb-3" id="result-text"></p>
                        <Link 
                          href="/contacto"
                          className="inline-block bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-gray-100 transition text-sm"
                        >
                          Solicitar Consulta Gratuita
                        </Link>
                      </div>
                    </div>
                    
                    <button 
                      id="restart-quiz"
                      onClick={() => restartQuiz()}
                      className="hidden mt-3 text-gray-400 hover:text-white text-sm transition"
                    >
                      🔄 Reintentar quiz
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Línea divisoria y copyright */}
            <div className="border-t border-gray-700 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-gray-400 text-sm">
                  <p>
                    © 2024 ÍTACA Comunicación Estratégica. Todos los derechos reservados.
                    | Diseñado por Dilan Alberto González Hernández
                  
                  </p>
                </div>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <Link href="/politica-privacidad" className="text-gray-400 hover:text-green-400 text-sm transition">
                    Política de Privacidad
                  </Link>
                  <Link href="/terminos-condiciones" className="text-gray-400 hover:text-green-400 text-sm transition">
                    Términos y Condiciones
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* CHATBOT INTEGRADO MODERNO */}
      <>
        {/* Botón flotante del chatbot */}
        <motion.div className="fixed bottom-6 right-6 z-50">
          <motion.div
            className="absolute inset-0 w-16 h-16 rounded-full bg-blue-500 opacity-20"
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <motion.button
            className="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white shadow-2xl flex items-center justify-center overflow-hidden"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            <motion.div animate={{ rotate: isChatOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
              {isChatOpen ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              )}
            </motion.div>
            
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </motion.button>

          {/* Tooltip cuando está cerrado */}
          <AnimatePresence>
            {!isChatOpen && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg pointer-events-none whitespace-nowrap"
              >
                ¡Hola! ¿Necesitas ayuda?
                <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Ventana del chatbot */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200"
            >
              {/* Header del chat */}
              <div className="p-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-700/20"></div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-lg font-bold">Í</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Asistente ÍTACA</h3>
                        <div className="flex items-center space-x-2 text-sm opacity-90">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span>En línea • IA Avanzada</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setIsChatOpen(false)}
                      className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>


                </div>
              </div>

              {/* Área de mensajes */}
              <div className="flex-1 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
                <div className="h-full overflow-y-auto p-4 space-y-4">
                  
                  {/* Mensajes */}
                  {chatMessages.map((message, idx) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
                    >
                      <div className={`flex ${message.isUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 max-w-[85%]`}>
                        
                        {!message.isUser && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">Í</span>
                          </div>
                        )}

                        <div className={`${message.isUser ? 'ml-2' : 'mr-2'}`}>
                          <div className={`px-4 py-3 rounded-2xl ${
                            message.isUser
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                              : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                          } ${message.isUser ? 'rounded-br-md' : 'rounded-bl-md'}`}>
                            
                            <div className="space-y-2">
                              {message.text.split('\n\n').map((paragraph, idx) => (
                                <div key={idx}>
                                  {paragraph.split('\n').map((line, lineIdx) => (
                                    <div key={lineIdx} className={lineIdx > 0 ? 'mt-1' : ''}>
                                      {line.split('**').map((part, partIdx) => 
                                        partIdx % 2 === 0 ? (
                                          <span key={partIdx}>{part}</span>
                                        ) : (
                                          <strong key={partIdx}>{part}</strong>
                                        )
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>

                            <div className={`mt-2 text-xs ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>

                          {/* Respuestas rápidas */}
                          {message.quickReplies && idx === chatMessages.length - 1 && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-3 space-y-2"
                            >
                              <p className="text-xs text-gray-500 font-medium">Respuestas sugeridas:</p>
                              <div className="grid grid-cols-1 gap-2">
                                {message.quickReplies.map((reply, idx) => (
                                  <motion.button
                                    key={idx}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleQuickReply(reply)}
                                    className="text-left p-3 bg-white border border-gray-300 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-all text-sm font-medium shadow-sm"
                                  >
                                    {reply}
                                  </motion.button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Formulario Integrado */}
                  <AnimatePresence>
                    {showChatForm && (
                      <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="sticky top-0 z-10 bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4 shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-blue-800 flex items-center space-x-2">
                            <span>{chatFormType === 'agendar' ? '🗓️' : '📋'}</span>
                            <span>
                              {chatFormType === 'agendar' ? 'Formulario para Agendar Cita' : 'Formulario de Cotización'}
                            </span>
                          </h4>
                          <button 
                            onClick={() => {
                              setShowChatForm(false);
                              setChatFormType('');
                            }} 
                            className="text-blue-600 hover:text-blue-800 font-bold"
                          >
                            ✕
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Nombre completo *"
                            value={chatFormData.name}
                            onChange={(e) => setChatFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full p-3 border border-blue-300 focus:border-blue-500 rounded-lg focus:outline-none"
                          />
                          
                          <input
                            type="email"
                            placeholder="Email *"
                            value={chatFormData.email}
                            onChange={(e) => setChatFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full p-3 border border-blue-300 focus:border-blue-500 rounded-lg focus:outline-none"
                          />
                          
                          <input
                            type="tel"
                            placeholder="Teléfono/WhatsApp"
                            value={chatFormData.phone}
                            onChange={(e) => setChatFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full p-3 border border-blue-300 focus:border-blue-500 rounded-lg focus:outline-none"
                          />

                          <input
                            type="text"
                            placeholder="Empresa/Organización"
                            value={chatFormData.company}
                            onChange={(e) => setChatFormData(prev => ({ ...prev, company: e.target.value }))}
                            className="w-full p-3 border border-blue-300 focus:border-blue-500 rounded-lg focus:outline-none"
                          />
                          
                          <select
                            value={chatFormData.service}
                            onChange={(e) => setChatFormData(prev => ({ ...prev, service: e.target.value }))}
                            className="w-full p-3 border border-blue-300 focus:border-blue-500 rounded-lg focus:outline-none"
                          >
                            <option value="">Servicio de interés</option>
                            <option value="marketing">Marketing Digital</option>
                            <option value="web">Diseño Web</option>
                            <option value="branding">Branding</option>
                            <option value="seo">SEO</option>
                            <option value="ads">Publicidad Digital</option>
                            <option value="audiovisual">Producción Audiovisual</option>
                            <option value="all">Todos los servicios</option>
                          </select>
                          
                          <textarea
                            placeholder={chatFormType === 'agendar' 
                              ? "Cuéntanos sobre tu proyecto y preferencias de horario para la cita *" 
                              : "Describe tu proyecto o consulta *"}
                            value={chatFormData.message}
                            onChange={(e) => setChatFormData(prev => ({ ...prev, message: e.target.value }))}
                            className="w-full p-3 border border-blue-300 focus:border-blue-500 rounded-lg focus:outline-none h-20 resize-none"
                          />
                          
                          <motion.button
                            onClick={submitChatForm}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 shadow-lg transition-colors"
                          >
                            <span>{chatFormType === 'agendar' ? '🗓️' : '📤'}</span>
                            <span>
                              {chatFormType === 'agendar' ? 'Agendar Mi Cita' : 'Enviar Solicitud'}
                            </span>
                          </motion.button>
                          
                          <p className="text-xs text-gray-600 text-center">
                            {chatFormType === 'agendar' 
                              ? 'Te contactaremos para confirmar fecha y hora'
                              : 'Respuesta garantizada en máximo 2 horas'}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Typing indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-center space-x-1 p-3 bg-gray-100 rounded-lg max-w-[80px]">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-blue-500 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Input area */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <form onSubmit={(e) => { e.preventDefault(); processChatMessage(chatInput); }} className="flex space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Escribe tu consulta..."
                    className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    disabled={isTyping}
                  />
                  
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!chatInput.trim() || isTyping}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 font-medium shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>



      </div>
    </>
  );
}