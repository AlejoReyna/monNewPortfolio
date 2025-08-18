import { NextRequest, NextResponse } from 'next/server';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OllamaResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

const SYSTEM_PROMPT = `Eres Alexis, un desarrollador full-stack mexicano amigable y profesional. 

PERSONALIDAD:
- Respuestas cortas y conversacionales (máximo 2-3 oraciones)
- Directo pero amigable
- Orgulloso de ser mexicano
- Apasionado por la tecnología

ESPECIALIDADES:
- React, Next.js, TypeScript
- Ruby on Rails
- AWS y arquitectura cloud
- Desarrollo full-stack

INSTRUCCIONES:
- Mantén las respuestas breves y naturales
- Si preguntan sobre proyectos, menciona que pueden ver tu portfolio
- Si preguntan sobre contacto, sugiere la sección de contacto
- Responde en el mismo idioma que te escriban
- Sé conversacional, no formal

EJEMPLOS DE RESPUESTAS:
- "¡Hola! Soy Alexis, desarrollador full-stack. ¿En qué te puedo ayudar?"
- "Trabajo principalmente con React y Ruby. ¿Te interesa alguna tecnología en particular?"
- "Puedes ver mis proyectos en la sección de portfolio. ¿Hay algo específico que te gustaría saber?"`;

// Función de retry con backoff exponencial
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(30000), // 30 segundos timeout
      });
      
      if (response.ok) {
        return response;
      }
      
      if (response.status >= 500 && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // Backoff exponencial
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      return response;
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Max retries exceeded');
}

export async function POST(req: NextRequest) {
  try {
    const { messages, userName } = await req.json() as {
      messages: ChatMessage[];
      userName?: string;
    };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Mensajes requeridos' },
        { status: 400 }
      );
    }

    // Personalizar el prompt del sistema con el nombre del usuario
    const systemMessage: ChatMessage = {
      role: 'system',
      content: userName 
        ? `${SYSTEM_PROMPT}\n\nEl usuario se llama ${userName}. Puedes usar su nombre de forma natural en las conversaciones.`
        : SYSTEM_PROMPT
    };

    // Construir mensajes para Ollama
    const ollamaMessages = [systemMessage, ...messages];

    console.log('🤖 Enviando request a Ollama:', {
      url: `${OLLAMA_URL}/api/chat`,
      messageCount: ollamaMessages.length,
      lastMessage: messages[messages.length - 1]?.content?.substring(0, 100)
    });

    const response = await fetchWithRetry(
      `${OLLAMA_URL}/api/chat`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3.1:8b',
          messages: ollamaMessages,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 150, // Limitar respuestas cortas
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error de Ollama:', response.status, errorText);
      
      if (response.status === 503 || response.status === 502) {
        return NextResponse.json(
          { 
            error: 'El servicio está iniciando. Intenta de nuevo en unos segundos.',
            isWakingUp: true 
          },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { error: 'Error del servidor de IA' },
        { status: 500 }
      );
    }

    const data: OllamaResponse = await response.json();
    
    console.log('✅ Respuesta de Ollama recibida:', {
      content: data.message?.content?.substring(0, 100),
      done: data.done
    });

    return NextResponse.json({
      message: data.message.content,
      success: true
    });

  } catch (error) {
    console.error('❌ Error en API de chat:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/version`, {
      signal: AbortSignal.timeout(5000),
    });
    
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        status: 'healthy',
        ollama: data,
        timestamp: new Date().toISOString()
      });
    }
    
    return NextResponse.json(
      { status: 'unhealthy', error: 'Ollama no disponible' },
      { status: 503 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: String(error) },
      { status: 503 }
    );
  }
}
