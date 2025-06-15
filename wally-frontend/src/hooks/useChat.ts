import { useState, useCallback } from 'react'
import api from '@/utils/api'

interface ChatResponse {
  message: string
  products?: any[]
  wallyScore?: number
  intent?: string
  confidence?: number
  suggestions?: string[]
}

export const useChat = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (message: string): Promise<ChatResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.post('/chat/query', { message })
      return response.data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to send message'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    sendMessage,
    isLoading,
    error,
  }
}
