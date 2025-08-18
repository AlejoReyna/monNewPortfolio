FROM ollama/ollama:latest

# Instalar curl como root
USER root
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Exponer puerto 10000 (que es lo que Render espera)
EXPOSE 10000

# Configurar Ollama para usar puerto 10000 y mantener modelos cargados
ENV OLLAMA_HOST=0.0.0.0:10000
ENV OLLAMA_KEEP_ALIVE=24h

# Comando optimizado - usar llama3.2:1b (más rápido y eficiente)
CMD ["sh", "-c", "ollama serve & sleep 15 && ollama pull llama3.2:1b && echo '🚀 Modelo Llama 3.2 1B listo!' && wait"]
