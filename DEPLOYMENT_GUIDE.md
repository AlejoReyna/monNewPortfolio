# 🚀 INSTRUCCIONES DE DEPLOYMENT

## PASO 1: PREPARAR ARCHIVOS

Todos los archivos ya están creados en tu proyecto. Verifica que tengas:

```
monNewPortfolio/
├── ollama-render/
│   ├── Dockerfile
│   ├── start.sh
│   ├── health-check.sh
│   └── render.yaml
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts
│   │   └── page.tsx
│   ├── components/
│   │   └── hero-chat.tsx
│   └── hooks/
│       └── useChat.ts
└── .env.local
```

## PASO 2: DEPLOY EN RENDER

1. **Crear cuenta en Render**: https://render.com
2. **Conectar tu repositorio de GitHub**
3. **Crear Web Service** con estos settings:
   - **Name**: `ollama-chatbot` (o el nombre que prefieras)
   - **Environment**: `Docker`
   - **Plan**: `Free`
   - **Branch**: `main` (o tu rama principal)
   - **Dockerfile path**: `./ollama-render/Dockerfile`
   - **Health Check Path**: `/api/version`
   - **Auto-Deploy**: Yes

4. **Variables de entorno en Render**:
   - `OLLAMA_HOST`: `0.0.0.0:11434`
   - `OLLAMA_KEEP_ALIVE`: `24h`

5. **Deploy**: Hacer click en "Create Web Service"

⚠️ **IMPORTANTE**: El primer deploy tomará 10-15 minutos porque descarga el modelo Llama 3.1 8B (4.7GB)

## PASO 3: CONFIGURAR VARIABLES DE ENTORNO LOCALES

1. **Actualizar .env.local** con la URL real de Render:
```bash
# Reemplaza "tu-app-ollama" con el nombre real de tu servicio
OLLAMA_URL=https://ollama-chatbot-XXXX.onrender.com
```

2. **Obtener la URL**: La encontrarás en el dashboard de Render después del deploy

## PASO 4: DEPLOY EN VERCEL

1. **Instalar dependencias** (si es necesario):
```bash
npm install
```

2. **Test local**:
```bash
npm run dev
```

3. **Deploy en Vercel**:
```bash
# Si tienes Vercel CLI
vercel

# O conecta tu repo en vercel.com
```

4. **Configurar variables en Vercel**:
   - Ve a tu proyecto en vercel.com
   - Settings > Environment Variables
   - Agregar: `OLLAMA_URL` = `https://tu-app-ollama.onrender.com`

## PASO 5: TESTING

### Test del backend Ollama:
```bash
curl https://tu-app-ollama.onrender.com/api/version
```

Debería responder algo como:
```json
{"version":"0.1.32"}
```

### Test del chat:
```bash
curl -X POST https://tu-vercel-app.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hola"}]}'
```

## PASO 6: TROUBLESHOOTING

### Problema: Cold starts largos
**Síntoma**: El bot tarda mucho en responder la primera vez
**Solución**: Es normal en el plan gratuito. El sistema maneja esto automáticamente.

### Problema: Error 503
**Síntoma**: "El servicio está iniciando"
**Solución**: Esperar 30-60 segundos y volver a intentar.

### Problema: Timeout
**Síntoma**: El chat no responde
**Verificar**:
1. Estado de Render: https://dashboard.render.com
2. Logs en Render
3. Variables de entorno en Vercel

### Logs útiles:
- **Render**: Dashboard > Service > Logs
- **Vercel**: Dashboard > Functions > View Function Logs
- **Browser**: F12 > Console

## RESULTADO FINAL

✅ **Chatbot funcionando 100% gratis**
✅ **Deploy automático en Render + Vercel**  
✅ **Hero component con interfaz de chat**
✅ **Manejo de cold starts**
✅ **Retry automático**
✅ **Respuestas personalizadas de Alexis**

## COMANDOS ÚTILES

```bash
# Verificar estado del servidor
curl https://tu-app-ollama.onrender.com/api/version

# Test local
npm run dev

# Build de producción
npm run build

# Ver logs de Vercel
vercel logs

# Redeploy en Render
# (Se hace automáticamente al hacer push a GitHub)
```

## PERSONALIZACIÓN ADICIONAL

### Cambiar personalidad del bot:
Edita `src/app/api/chat/route.ts` línea ~16:
```typescript
const SYSTEM_PROMPT = `Eres Alexis, un desarrollador full-stack mexicano...`
```

### Agregar más sugerencias rápidas:
Edita `src/components/hero-chat.tsx` línea ~29:
```typescript
const quickSuggestions = [
  { en: "About me", es: "Sobre mí" },
  { en: "Projects", es: "Proyectos" },
  // Agregar más aquí
];
```

### Cambiar timeout:
Edita `src/app/api/chat/route.ts` línea ~50:
```typescript
signal: AbortSignal.timeout(30000), // 30 segundos
```

¡Tu chatbot está listo! 🎉
