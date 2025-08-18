#!/bin/bash
# Health check para Render
curl -f http://localhost:11434/api/version || exit 1
