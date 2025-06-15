import React, { createContext, useContext, useState, ReactNode } from 'react'

interface Settings {
  theme: 'light' | 'dark' | 'system'
  language: string
  voiceEnabled: boolean
  soundEnabled: boolean
  notifications: boolean
  currency: string
  wallyPersonality: 'friendly' | 'professional' | 'casual'
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
  resetSettings: () => void
}

const defaultSettings: Settings = {
  theme: 'system',
  language: 'en',
  voiceEnabled: true,
  soundEnabled: true,
  notifications: true,
  currency: 'INR',
  wallyPersonality: 'friendly'
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

interface SettingsProviderProps {
  children: ReactNode
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('wally-settings')
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings
    }
    return defaultSettings
  })

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('wally-settings', JSON.stringify(updated))
    }
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wally-settings')
    }
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
