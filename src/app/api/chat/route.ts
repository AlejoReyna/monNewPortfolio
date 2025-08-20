import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Inicializar OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Para debugging
console.log('🔗 OpenAI configurado para GPT-5 nano');

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
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

    // Verificar API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY no configurada');
      return NextResponse.json(
        { error: 'Configuración de API faltante' },
        { status: 500 }
      );
    }

    // Personalizar el prompt del sistema con el nombre del usuario
    const systemMessage: ChatMessage = {
      role: 'system',
      content: userName 
        ? `${SYSTEM_PROMPT}\n\nEl usuario se llama ${userName}. Puedes usar su nombre de forma natural en las conversaciones.`
        : SYSTEM_PROMPT
    };

    // Construir mensajes para OpenAI
    const openaiMessages = [systemMessage, ...messages];

    console.log('🤖 Enviando request a GPT-5 nano:', {
      model: 'gpt-5-nano',
      messageCount: openaiMessages.length,
      lastMessage: messages[messages.length - 1]?.content?.substring(0, 100)
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-5-nano',
      messages: openaiMessages,
      max_tokens: 500, // Límite para controlar costos y respuestas concisas
      temperature: 0.3, // Menos aleatorio = más consistente
      top_p: 0.8,
      frequency_penalty: 0.1,
      presence_penalty: 0.1,
    });

    const responseMessage = completion.choices[0]?.message?.content;

    if (!responseMessage) {
      console.error('❌ No se recibió respuesta de OpenAI');
      return NextResponse.json(
        { error: 'No se pudo generar respuesta' },
        { status: 500 }
      );
    }

    console.log('✅ Respuesta de GPT-5 nano recibida:', {
      content: responseMessage.substring(0, 100),
      usage: completion.usage
    });

    return NextResponse.json({
      message: responseMessage,
      success: true,
      usage: completion.usage,
      model: 'gpt-5-nano'
    });

  } catch (error) {
    console.error('❌ Error en API de chat:', error);
    
    // Manejar errores específicos de OpenAI
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: 'API key inválida. Verifica tu OPENAI_API_KEY en .env.local' },
          { status: 401 }
        );
      }
      
      if (error.status === 429) {
        return NextResponse.json(
          { 
            error: 'Límite de velocidad alcanzado. Intenta en unos segundos.',
            isRateLimit: true 
          },
          { status: 429 }
        );
      }

      if (error.status === 404) {
        return NextResponse.json(
          { error: 'Modelo gpt-5-nano no disponible para tu cuenta' },
          { status: 404 }
        );
      }

      if (error.status === 400) {
        return NextResponse.json(
          { error: 'Request inválido a la API' },
          { status: 400 }
        );
      }
    }
    
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
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { status: 'unhealthy', error: 'OPENAI_API_KEY no configurada' },
        { status: 503 }
      );
    }

    // Test simple call to GPT-5 nano
    const completion = await openai.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 1,
    });

    return NextResponse.json({
      status: 'healthy',
      model: 'gpt-5-nano',
      timestamp: new Date().toISOString(),
      usage: completion.usage
    });
  } catch (error) {
    console.error('❌ Health check failed:', error);
    return NextResponse.json(
      { status: 'unhealthy', error: String(error) },
      { status: 503 }
    );
  }
}
