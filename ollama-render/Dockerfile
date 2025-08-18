FROM ollama/ollama:latest

# Instalar curl como root
USER root
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Exponer puerto
EXPOSE 11434

# Comando simple que funciona
CMD ["sh", "-c", "ollama serve & sleep 15 && ollama pull llama3.1:8b && echo 'Setup completo!' && wait"]
