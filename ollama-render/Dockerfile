FROM ollama/ollama:latest

# Instalar curl como root
USER root
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Exponer puerto 10000 (que es lo que Render espera)
EXPOSE 10000

# Configurar Ollama para usar puerto 10000
ENV OLLAMA_HOST=0.0.0.0:10000

# Usar entrypoint correcto
ENTRYPOINT ["/bin/bash", "-c"]
CMD ["ollama serve & sleep 15 && ollama pull llama3.1:8b && echo 'Setup completo!' && wait"]
