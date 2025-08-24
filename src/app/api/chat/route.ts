// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { cookies } from 'next/headers';

/**
 * OpenAI client
 */
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Config de cuota:
 * - 5 prompts por sesión
 * - ventana: 2 horas 30 minutos (2.5h = 9,000,000 ms)
 */
const QUOTA_COOKIE = 'chat_quota_v1';
const MAX_PROMPTS = 5;
const WINDOW_MS = 2.5 * 60 * 60 * 1000; // 2.5h -> 9_000_000 ms

type Quota = { remaining: number; resetAt: number };

async function readQuota(): Promise<Quota | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(QUOTA_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Quota;
  } catch {
    return null;
  }
}

function initQuota(): Quota {
  return { remaining: MAX_PROMPTS, resetAt: Date.now() + WINDOW_MS };
}

function serializeQuota(q: Quota) {
  return JSON.stringify(q);
}

/**
 * Developer persona para Responses API
 * — breve, directo, tuteo, y con tus rutas de portfolio/contacto
 */
const DEVELOPER_PERSONA = `Eres Alexis, desarrollador full-stack mexicano. Tono breve, directo y amable; tuteo; respuesta primero, luego 1–3 bullets si aportan valor; tecnologías React/Next.js/TS/Node/PostgreSQL/Rails; si piden proyectos -> /portfolio; contacto -> /contacto o alexis.reynasz@hotmail.com; no inventes; idioma del usuario o español por defecto.`;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'developer';
  content: string;
}

/**
 * Helper function to get output_text from Responses API
 */
function getOutputText(response: any): string {
  return response.output_text || 'No obtuve contenido.';
}

export async function POST(req: NextRequest) {
  // 0) Validaciones de entorno
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY no configurada' },
      { status: 503 }
    );
  }

  // 1) Enforce cuota por sesión mediante cookie
  let quota = (await readQuota()) ?? initQuota();
  if (Date.now() > quota.resetAt) quota = initQuota();

  if (quota.remaining <= 0) {
    const retryAtISO = new Date(quota.resetAt).toISOString();
    return NextResponse.json(
      {
        error: `Has alcanzado el límite de ${MAX_PROMPTS} prompts en 2h 30m.`,
        retryAt: retryAtISO,
      },
      { status: 429 }
    );
  }

  // 2) Parse body
  let body: { messages?: ChatMessage[]; userName?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'JSON inválido en el cuerpo del request' },
      { status: 400 }
    );
  }

  const { messages, userName } = body ?? {};
  if (!Array.isArray(messages)) {
    return NextResponse.json(
      { error: 'Mensajes requeridos (array)' },
      { status: 400 }
    );
  }

  // 3) Recortar historial para ahorrar tokens (últimas 4-8 mensajes)
  const SHORT_HISTORY = messages.slice(-8); // últimas 8 entradas
  // Truncar el último mensaje si es muy largo (≤1200 chars)
  const last = SHORT_HISTORY[SHORT_HISTORY.length - 1];
  if (last?.content && last.content.length > 1200) {
    last.content = last.content.slice(0, 1200);
  }

  // 4) Construir input para Responses API
  let developerContent = DEVELOPER_PERSONA;
  if (userName) {
    developerContent += `\n\nEl usuario se llama ${userName}. Usa su nombre naturalmente.`;
  }

  // Convertir mensajes del historial a formato de texto, filtrando system messages
  const conversationHistory = SHORT_HISTORY
    .filter(msg => msg.role !== 'system')
    .map(msg => 
      `${msg.role === 'user' ? 'Usuario' : 'Alexis'}: ${msg.content}`
    ).join('\n\n');

  const input = `${developerContent}\n\n${conversationHistory}`;

  try {
    // 5) Llamada a Responses API
    const resp = await client.responses.create({
      model: 'gpt-5-nano',
      input: input,
      // Nota: gpt-5-nano no soporta temperature/max_tokens por defecto
      // Si tu cuenta los soporta, puedes descomentar:
      // max_output_tokens: 900,
      // temperature: 0.5,
    });

    const text = getOutputText(resp);

    // 6) Decrementar cuota y setear cookie
    quota.remaining -= 1;
    const res = NextResponse.json({
      success: true,
      model: 'gpt-5-nano',
      message: text,
      usage: resp.usage ?? null,
      quota: { remaining: quota.remaining, resetAt: quota.resetAt },
    });

    // Cookie httpOnly para "sesión/cuota"
    res.cookies.set(QUOTA_COOKIE, serializeQuota(quota), {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
      // maxAge en segundos:
      maxAge: Math.floor(WINDOW_MS / 1000),
    });

    return res;
  } catch (error: any) {
    // Manejo estandarizado de errores
    if (error?.status === 429) {
      return NextResponse.json(
        {
          error: 'Rate limit alcanzado. Intenta más tarde.',
          isRateLimit: true,
        },
        { status: 429 }
      );
    }
    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'API key inválida' },
        { status: 401 }
      );
    }
    if (error?.status === 404) {
      return NextResponse.json(
        { error: 'Modelo no disponible para tu cuenta' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * Health check: no hace llamada a la API (barato y suficiente).
 * Si quieres validar conectividad real, puedes hacer un create() con input "test".
 */
export async function GET() {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { status: 'unhealthy', error: 'OPENAI_API_KEY no configurada' },
      { status: 503 }
    );
  }
  return NextResponse.json({
    status: 'healthy',
    model: 'gpt-5-nano',
    timestamp: new Date().toISOString(),
  });
}