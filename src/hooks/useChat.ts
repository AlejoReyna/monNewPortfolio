'use client';
import { useState, useRef, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  isRateLimit: boolean;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  modelUsed?: string;
}

export function useChat(userName?: string): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRateLimit, setIsRateLimit] = useState(false);
  const [modelUsed, setModelUsed] = useState<string>();
  const [usage, setUsage] = useState<{
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  }>();
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Cancelar request anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    setIsRateLimit(false);

    try {
      abortControllerRef.current = new AbortController();
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(({ role, content }) => ({ role, content })),
          userName,
        }),
        signal: abortControllerRef.current.signal,
      });

      const data = await response.json();

      // Log de debugging para el desarrollador
      console.log('🔍 Chat API Response:', {
        status: response.status,
        data: data,
        usage: data.usage
      });

      if (!response.ok) {
        if (response.status === 429 || data.isRateLimit) {
          setIsRateLimit(true);
          setError(data.error || 'Rate limit alcanzado');
        } else if (response.status === 401) {
          setError('❌ API key inválida. Verifica tu configuración.');
        } else if (response.status === 404) {
          setError('❌ Modelo no disponible.');
        } else {
          setError(data.error || `Error ${response.status}`);
        }
        return;
      }

      // Actualizar stats si están disponibles
      if (data.usage) {
        setUsage(data.usage);
      }
      
      if (data.model) {
        setModelUsed(data.model);
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Request cancelado, no hacer nada
      }
      
      console.error('Error sending message:', error);
      setError('❌ Error de conexión. Verifica tu internet e intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, [messages, userName, isLoading]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    setIsRateLimit(false);
    setUsage(undefined);
    setModelUsed(undefined);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    isRateLimit,
    usage,
    modelUsed,
  };
}
