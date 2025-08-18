FROM ollama/ollama:latest

# Instalar curl para health checks
USER root
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Cambiar a usuario ollama
USER ollama

# Exponer puerto
EXPOSE 11434

# Copiar scripts
COPY start.sh /start.sh
COPY health-check.sh /health-check.sh

# Hacer scripts ejecutables
USER root
RUN chmod +x /start.sh /health-check.sh
USER ollama

# Comando de inicio
CMD ["/start.sh"]
