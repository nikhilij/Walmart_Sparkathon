import { useState, useCallback, useEffect } from 'react'

interface TextToSpeechHook {
  speak: (text: string) => void
  stop: () => void
  isSpeaking: boolean
  isSupported: boolean
  voices: SpeechSynthesisVoice[]
  selectedVoice: SpeechSynthesisVoice | null
  setSelectedVoice: (voice: SpeechSynthesisVoice) => void
  rate: number
  setRate: (rate: number) => void
  pitch: number
  setPitch: (pitch: number) => void
  volume: number
  setVolume: (volume: number) => void
}

export const useTextToSpeech = (): TextToSpeechHook => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [volume, setVolume] = useState(1)

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(() => {
    if (!isSupported) return

    const updateVoices = () => {
      const availableVoices = speechSynthesis.getVoices()
      setVoices(availableVoices)
      
      // Set default voice (preferably English)
      if (!selectedVoice && availableVoices.length > 0) {
        const englishVoice = availableVoices.find(voice => voice.lang.startsWith('en'))
        setSelectedVoice(englishVoice || availableVoices[0])
      }
    }

    updateVoices()
    speechSynthesis.addEventListener('voiceschanged', updateVoices)

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', updateVoices)
    }
  }, [isSupported, selectedVoice])

  const speak = useCallback((text: string) => {
    if (!isSupported || !text.trim()) return

    // Cancel any ongoing speech
    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    
    if (selectedVoice) {
      utterance.voice = selectedVoice
    }
    
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = volume

    utterance.onstart = () => {
      setIsSpeaking(true)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
    }

    speechSynthesis.speak(utterance)
  }, [isSupported, selectedVoice, rate, pitch, volume])

  const stop = useCallback(() => {
    if (!isSupported) return
    
    speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [isSupported])

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    pitch,
    setPitch,
    volume,
    setVolume
  }
}
