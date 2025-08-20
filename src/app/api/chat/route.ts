import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Inicializar OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Para debugging
console.log('🔗 OpenAI configurado para GPT-5-nano');

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const SYSTEM_PROMPT = `Eres Alexis, desarrollador full-stack mexicano. Responde de forma breve y amigable. Tecnologías: React, Next.js, TypeScript, Ruby on Rails. Si preguntan proyectos, menciona tu portfolio. Si preguntan contacto, sugiere la sección de contacto.`;

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

    console.log('🤖 Enviando request a GPT-5-nano:', {
      model: 'gpt-5-nano',
      messageCount: openaiMessages.length,
      lastMessage: messages[messages.length - 1]?.content?.substring(0, 100),
      maxTokens: 1500 // ✅ Aumentado para dar más espacio al reasoning
    });

    // ✅ CORRECCIÓN PRINCIPAL: Usar openaiMessages en lugar de mensaje hardcodeado
    const completion = await openai.chat.completions.create({
      model: 'gpt-5-nano',
      messages: openaiMessages, // ❌ ANTES: [{ role: 'user', content: 'Hola' }]
      max_completion_tokens: 1500, // ✅ Aumentado para evitar "finish reason: length"
    });

    const responseMessage = completion.choices[0]?.message?.content;

    if (!responseMessage) {
      console.error('❌ No se recibió respuesta de OpenAI');
      console.error('❌ Finish reason:', completion.choices[0]?.finish_reason);
      console.error('❌ Usage:', completion.usage);
      
      // ✅ Mejor manejo: si hay reasoning pero no respuesta, intentar con menos tokens
      if (completion.choices[0]?.finish_reason === 'length') {
        console.log('🔄 Intentando con menos tokens...');
        try {
          const retryCompletion = await openai.chat.completions.create({
            model: 'gpt-5-nano',
            messages: openaiMessages,
            max_completion_tokens: 800, // ✅ Reducido para evitar el límite
          });
          
          const retryMessage = retryCompletion.choices[0]?.message?.content;
          if (retryMessage) {
            console.log('✅ Respuesta de retry exitosa');
            return NextResponse.json({
              message: retryMessage,
              success: true,
              usage: retryCompletion.usage,
              model: 'gpt-5-nano',
              retry: true
            });
          }
        } catch (retryError) {
          console.error('❌ Error en retry:', retryError);
        }
      }
      
      return NextResponse.json(
        { error: 'No se pudo generar respuesta. Intenta con un mensaje más corto.' },
        { status: 500 }
      );
    }

    console.log('✅ Respuesta de GPT-5-nano recibida:', {
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

    // Test simple call to GPT-5-nano
    const completion = await openai.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [{ role: 'user', content: 'test' }],
      max_completion_tokens: 100,
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