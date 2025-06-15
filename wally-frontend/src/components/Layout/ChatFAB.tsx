import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'

import { Button } from '@/components/UI/Button'
import { useChatStore } from '@/store/chatStore'

const ChatFAB: React.FC = () => {
  const { isOpen, toggleChat } = useChatStore()

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3, delay: 1 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <Button
        size="lg"
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
          isOpen
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
        }`}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </motion.div>
      </Button>
      
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="absolute -top-12 right-0 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap"
        >
          Chat with Wally
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </motion.div>
      )}
    </motion.div>
  )
}

export default ChatFAB
