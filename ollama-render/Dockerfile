FROM ollama/ollama:latest

# Instalar curl para health checks
USER root
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Cambiar a usuario ollama
USER ollama

# Exponer puerto
EXPOSE 11434

# Crear scripts directamente en el contenedor (más confiable)
RUN echo '#!/bin/bash\n\
set -e\n\
echo "🚀 Iniciando Ollama en Render..."\n\
ollama serve &\n\
OLLAMA_PID=$!\n\
echo "⏳ Esperando que Ollama esté listo..."\n\
for i in {1..30}; do\n\
    if curl -s http://localhost:11434/api/version > /dev/null 2>&1; then\n\
        echo "✅ Ollama está corriendo!"\n\
        break\n\
    fi\n\
    if [ $i -eq 30 ]; then\n\
        echo "❌ Timeout esperando Ollama"\n\
        exit 1\n\
    fi\n\
    sleep 2\n\
done\n\
if ! ollama list | grep -q "llama3.1:8b"; then\n\
    echo "📥 Descargando modelo Llama 3.1 8B..."\n\
    ollama pull llama3.1:8b\n\
    echo "✅ Modelo descargado exitosamente!"\n\
else\n\
    echo "✅ Modelo Llama 3.1 8B ya está disponible"\n\
fi\n\
echo "🎉 Setup completo! Ollama está listo en puerto 11434"\n\
wait $OLLAMA_PID' > /start.sh

# Hacer script ejecutable
USER root
RUN chmod +x /start.sh
USER ollama

# Comando de inicio
CMD ["/start.sh"]
