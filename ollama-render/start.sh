#!/bin/bash
set -e

echo "🚀 Iniciando Ollama en Render..."

# Iniciar servidor Ollama en background
ollama serve &
OLLAMA_PID=$!

echo "⏳ Esperando que Ollama esté listo..."
for i in {1..30}; do
    if curl -s http://localhost:11434/api/version > /dev/null 2>&1; then
        echo "✅ Ollama está corriendo!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Timeout esperando Ollama"
        exit 1
    fi
    sleep 2
done

# Verificar si el modelo ya está descargado
if ! ollama list | grep -q "llama3.1:8b"; then
    echo "📥 Descargando modelo Llama 3.1 8B..."
    ollama pull llama3.1:8b
    echo "✅ Modelo descargado exitosamente!"
else
    echo "✅ Modelo Llama 3.1 8B ya está disponible"
fi

echo "🎉 Setup completo! Ollama está listo en puerto 11434"

# Mantener el proceso vivo
wait $OLLAMA_PID
