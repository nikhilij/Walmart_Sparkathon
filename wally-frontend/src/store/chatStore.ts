import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ChatState {
  isOpen: boolean
  toggleChat: () => void
  openChat: () => void
  closeChat: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      isOpen: false,
      toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
      openChat: () => set({ isOpen: true }),
      closeChat: () => set({ isOpen: false }),
    }),
    {
      name: 'chat-store',
      partialize: (state) => ({}), // Don't persist isOpen state
    }
  )
)
