import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { MotivationalAI } from '../../lib/motivational-ai';

interface Message {
  id: string;
  content: string;
  isFromUser: boolean;
  timestamp: Date;
  mood?: string;
  sentiment?: number;
}

interface User {
  id: number;
  username: string;
  name: string;
  role: string;
}

export default function PersonalChat() {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mood, setMood] = useState<string>('neutral');
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticación y que sea Dilan Hernandez
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    
    // Solo permitir acceso a Dilan Hernandez
    if (parsedUser.username !== 'Dilan Hernandez' && parsedUser.name !== 'Dilan Hernandez' && parsedUser.email !== 'proxemodelan5@gmail.com') {
      router.push('/admin/dashboard');
      return;
    }

    setUser(parsedUser);
    loadConversation();
    
    // Mensaje de bienvenida inicial
    if (messages.length === 0) {
      setTimeout(() => {
        sendWelcomeMessage(parsedUser.name || 'Dilan');
      }, 1000);
    }
  }, [router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversation = async () => {
    // Cargar conversación desde la base de datos
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/personal-chat/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error cargando conversación:', error);
    }
  };

  const sendWelcomeMessage = (userName: string) => {
    const welcomeResponse = MotivationalAI.generatePersonalResponse(
      'welcome', 
      { sentiment: 0, mood: 'neutral', keywords: [], stressLevel: 0, energyLevel: 5 },
      userName
    );

    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: welcomeResponse.content,
      isFromUser: false,
      timestamp: new Date(),
      mood: 'caring'
    };

    setMessages([welcomeMessage]);
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      isFromUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simular tiempo de respuesta de la IA
    setTimeout(() => {
      generateAIResponse(currentMessage, userMessage.id);
    }, 1500 + Math.random() * 2000); // 1.5-3.5 segundos
  };

  const generateAIResponse = async (userMessage: string, userMessageId: string) => {
    try {
      // Analizar el estado de ánimo del mensaje
      const moodAnalysis = MotivationalAI.analyzeMood(userMessage);
      
      // Actualizar mood general si es significativo
      if (moodAnalysis.stressLevel > 6 || Math.abs(moodAnalysis.sentiment) > 0.5) {
        setMood(moodAnalysis.mood);
      }

      // Generar respuesta personalizada
      const response = MotivationalAI.generatePersonalResponse(
        userMessage,
        moodAnalysis,
        user?.name || 'Dilan',
        {
          timeOfDay: getTimeOfDay(),
          recentMood: mood
        }
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        isFromUser: false,
        timestamp: new Date(),
        mood: response.tone,
        sentiment: moodAnalysis.sentiment
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Guardar en base de datos
      await saveMessages([
        { id: userMessageId, content: userMessage, isFromUser: true },
        aiMessage
      ], moodAnalysis);

    } catch (error) {
      console.error('Error generando respuesta:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: 'Dilan, mi querido amigo, parece que tengo un pequeño problema técnico. 💙 Pero quiero que sepas que estoy aquí para ti siempre. ¿Podrías intentar escribirme de nuevo?',
        isFromUser: false,
        timestamp: new Date(),
        mood: 'caring'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const saveMessages = async (newMessages: any[], moodAnalysis: any) => {
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/personal-chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: newMessages,
          moodAnalysis,
          currentMood: mood
        })
      });
    } catch (error) {
      console.error('Error guardando mensajes:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  };

  const generateAffirmation = () => {
    const affirmation = MotivationalAI.generateAffirmation(user?.name || 'Dilan');
    
    const aiMessage: Message = {
      id: Date.now().toString(),
      content: affirmation.content,
      isFromUser: false,
      timestamp: new Date(),
      mood: 'caring'
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  const generateAdvice = (topic: string) => {
    const advice = MotivationalAI.generateAdvice(topic, user?.name || 'Dilan');
    
    const aiMessage: Message = {
      id: Date.now().toString(),
      content: advice.content,
      isFromUser: false,
      timestamp: new Date(),
      mood: 'motivational'
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Verificando acceso...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Chat Personal - {user.name}</title>
        <meta name="description" content="Tu espacio personal de apoyo y motivación" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/admin/dashboard')}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  ← Dashboard
                </button>
                <div>
                  <h1 className="text-xl font-bold text-white">Tu Espacio Personal</h1>
                  <p className="text-white/70 text-sm">Aquí siempre encontrarás apoyo y motivación 💙</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  mood === 'happy' ? 'bg-yellow-500/20 text-yellow-300' :
                  mood === 'sad' ? 'bg-blue-500/20 text-blue-300' :
                  mood === 'stressed' ? 'bg-red-500/20 text-red-300' :
                  mood === 'motivated' ? 'bg-green-500/20 text-green-300' :
                  'bg-white/20 text-white/70'
                }`}>
                  {mood === 'happy' ? '😊 Alegre' :
                   mood === 'sad' ? '😔 Triste' :
                   mood === 'stressed' ? '😰 Estresado' :
                   mood === 'motivated' ? '🔥 Motivado' :
                   '😌 Tranquilo'}
                </div>
                
                <button
                  onClick={() => setShowMoodSelector(!showMoodSelector)}
                  className="text-white/80 hover:text-white text-lg"
                >
                  ⚙️
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={generateAffirmation}
              className="px-4 py-2 bg-pink-500/20 text-pink-200 rounded-full text-sm hover:bg-pink-500/30 transition-colors"
            >
              💙 Necesito amor
            </button>
            <button
              onClick={() => generateAdvice('motivation')}
              className="px-4 py-2 bg-green-500/20 text-green-200 rounded-full text-sm hover:bg-green-500/30 transition-colors"
            >
              🚀 Motivación
            </button>
            <button
              onClick={() => generateAdvice('stress')}
              className="px-4 py-2 bg-blue-500/20 text-blue-200 rounded-full text-sm hover:bg-blue-500/30 transition-colors"
            >
              🧘‍♂️ Relajarme
            </button>
            <button
              onClick={() => generateAdvice('confidence')}
              className="px-4 py-2 bg-purple-500/20 text-purple-200 rounded-full text-sm hover:bg-purple-500/30 transition-colors"
            >
              ✨ Confianza
            </button>
          </div>
        </div>

        {/* Chat Container */}
        <div className="max-w-4xl mx-auto px-6 pb-6">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 h-[calc(100vh-280px)]">
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ height: 'calc(100% - 80px)' }}>
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-4 rounded-2xl ${
                      message.isFromUser
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-white/10 text-white border border-white/20'
                    }`}>
                      {!message.isFromUser && (
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-xs">
                            💙
                          </div>
                          <span className="text-xs text-white/70 font-medium">
                            Tu IA Personal
                          </span>
                        </div>
                      )}
                      
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </div>
                      
                      <div className="mt-2 text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString('es-ES', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/10 border border-white/20 p-4 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-xs">
                        💙
                      </div>
                      <span className="text-white/70 text-sm">Pensando en ti...</span>
                    </div>
                    <div className="flex space-x-1 mt-2">
                      <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 border-t border-white/10">
              <div className="flex items-end space-x-4">
                <div className="flex-1">
                  <textarea
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Cuéntame cómo te sientes, qué piensas, o simplemente salúdame... 💙"
                    className="w-full bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    rows={3}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none"
                >
                  💫 Enviar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mood Selector Modal */}
        {showMoodSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowMoodSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-white font-bold text-lg mb-4">¿Cómo te sientes?</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'happy', label: '😊 Feliz', color: 'yellow' },
                  { key: 'motivated', label: '🔥 Motivado', color: 'green' },
                  { key: 'stressed', label: '😰 Estresado', color: 'red' },
                  { key: 'sad', label: '😔 Triste', color: 'blue' },
                  { key: 'tired', label: '😴 Cansado', color: 'gray' },
                  { key: 'neutral', label: '😌 Tranquilo', color: 'purple' }
                ].map((moodOption) => (
                  <button
                    key={moodOption.key}
                    onClick={() => {
                      setMood(moodOption.key);
                      setShowMoodSelector(false);
                    }}
                    className={`p-3 rounded-xl text-white text-sm transition-all hover:scale-105 ${
                      mood === moodOption.key ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'
                    }`}
                  >
                    {moodOption.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
}