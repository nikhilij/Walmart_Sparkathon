import { useState, useEffect, useCallback } from 'react'

interface VoiceRecognitionHook {
  isListening: boolean
  transcript: string
  startListening: () => void
  stopListening: () => void
  clearTranscript: () => void
  isSupported: boolean
  error: string | null
}

declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }
}

export const useVoiceRecognition = (): VoiceRecognitionHook => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [recognition, setRecognition] = useState<any>(null)

  const isSupported = typeof window !== 'undefined' && 
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)

  useEffect(() => {
    if (!isSupported) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognitionInstance = new SpeechRecognition()

    recognitionInstance.continuous = false
    recognitionInstance.interimResults = true
    recognitionInstance.lang = 'en-US'

    recognitionInstance.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognitionInstance.onresult = (event: any) => {
      let finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        }
      }
      if (finalTranscript) {
        setTranscript(finalTranscript)
      }
    }

    recognitionInstance.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`)
      setIsListening(false)
    }

    recognitionInstance.onend = () => {
      setIsListening(false)
    }

    setRecognition(recognitionInstance)

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop()
      }
    }
  }, [isSupported])

  const startListening = useCallback(() => {
    if (!recognition || isListening) return
    
    try {
      setTranscript('')
      setError(null)
      recognition.start()
    } catch (err) {
      setError('Failed to start speech recognition')
    }
  }, [recognition, isListening])

  const stopListening = useCallback(() => {
    if (!recognition || !isListening) return
    
    try {
      recognition.stop()
    } catch (err) {
      setError('Failed to stop speech recognition')
    }
  }, [recognition, isListening])

  const clearTranscript = useCallback(() => {
    setTranscript('')
  }, [])

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    clearTranscript,
    isSupported,
    error
  }
}
