import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Mic, 
  MicOff, 
  X, 
  Bot, 
  User, 
  Sparkles,
  Volume2,
  VolumeX,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Share2
} from 'lucide-react'
import { toast } from 'react-hot-toast'

import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/Card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/UI/Avatar'
import { Badge } from '@/components/UI/Badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/UI/Tooltip'
import { ScrollArea } from '@/components/UI/ScrollArea'
import { useChatStore } from '@/store/chatStore'
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition'
import { useTextToSpeech } from '@/hooks/useTextToSpeech'
import { useChat } from '@/hooks/useChat'
import { formatTime } from '@/utils/date'
import ProductCard from '@/components/Products/ProductCard'
import LoadingDots from '@/components/UI/LoadingDots'

interface Message {
  id: string
  content: string
  type: 'user' | 'bot'
  timestamp: Date
  products?: any[]
  wallyScore?: number
  metadata?: {
    intent?: string
    confidence?: number
    suggestions?: string[]
  }
}

const ChatInterface: React.FC = () => {
  const { isOpen, toggleChat } = useChatStore()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm Wally, your AI shopping assistant. How can I help you find the perfect product today?",
      type: 'bot',
      timestamp: new Date(),
      metadata: {
        suggestions: [
          "Find gifts under ₹1500",
          "Compare running shoes",
          "Show me electronics deals"
        ]
      }
    }
  ])
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    isListening,
    startListening,
    stopListening,
    transcript,
    clearTranscript,
    isSupported: voiceSupported
  } = useVoiceRecognition()

  const {
    speak,
    stop: stopSpeaking,
    isSpeaking,
    isSupported: ttsSupported
  } = useTextToSpeech()

  const {
    sendMessage,
    isLoading,
    error
  } = useChat()

  useEffect(() => {
    if (transcript && !isListening) {
      setMessage(transcript)
      clearTranscript()
    }
  }, [transcript, isListening, clearTranscript])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      type: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setMessage('')

    try {
      const response = await sendMessage(message.trim())
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        type: 'bot',
        timestamp: new Date(),
        products: response.products,
        wallyScore: response.wallyScore,
        metadata: {
          intent: response.intent,
          confidence: response.confidence,
          suggestions: response.suggestions
        }
      }

      setMessages(prev => [...prev, botMessage])

      // Auto-speak bot response if TTS is enabled
      if (ttsSupported) {
        speak(response.message)
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    }
  }

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion)
    inputRef.current?.focus()
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success('Message copied to clipboard')
  }

  const handleShareMessage = (content: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Wally AI Response',
        text: content
      })
    } else {
      handleCopyMessage(content)
    }
  }

  const handleFeedback = (messageId: string, positive: boolean) => {
    toast.success(positive ? 'Thanks for the positive feedback!' : 'Thanks for the feedback!')
    // Here you would send feedback to your analytics service
  }

  if (!isOpen) return null

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && toggleChat()}
      >
        <Card className="w-full max-w-4xl h-[80vh] flex flex-col glass">
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
            <CardTitle className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/wally-avatar.png" alt="Wally" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    W
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Wally AI Assistant</h3>
                <p className="text-sm text-muted-foreground">
                  {isLoading ? 'Thinking...' : 'Online'}
                </p>
              </div>
            </CardTitle>
            <div className="flex items-center gap-2">
              {ttsSupported && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={isSpeaking ? stopSpeaking : undefined}
                    >
                      {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isSpeaking ? 'Stop speaking' : 'Text-to-speech available'}
                  </TooltipContent>
                </Tooltip>
              )}
              <Button variant="ghost" size="sm" onClick={toggleChat}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full px-6 py-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <Avatar className="h-8 w-8 mt-1">
                      {msg.type === 'user' ? (
                        <>
                          <AvatarImage src="/user-avatar.png" alt="You" />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarImage src="/wally-avatar.png" alt="Wally" />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>

                    <div className={`flex-1 max-w-[80%] ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                      <div
                        className={`inline-block px-4 py-2 rounded-2xl ${
                          msg.type === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-md'
                            : 'bg-muted text-muted-foreground rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        
                        {msg.wallyScore && (
                          <div className="mt-2 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-yellow-500" />
                            <Badge variant="secondary">
                              Wally Score: {msg.wallyScore}/100
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{formatTime(msg.timestamp)}</span>
                        
                        {msg.type === 'bot' && (
                          <div className="flex items-center gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleCopyMessage(msg.content)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Copy message</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleShareMessage(msg.content)}
                                >
                                  <Share2 className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Share message</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleFeedback(msg.id, true)}
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Good response</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleFeedback(msg.id, false)}
                                >
                                  <ThumbsDown className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Needs improvement</TooltipContent>
                            </Tooltip>
                          </div>
                        )}
                      </div>

                      {/* Products */}
                      {msg.products && msg.products.length > 0 && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {msg.products.map((product) => (
                            <ProductCard
                              key={product.id}
                              product={product}
                              compact
                            />
                          ))}
                        </div>
                      )}

                      {/* Suggestions */}
                      {msg.metadata?.suggestions && msg.metadata.suggestions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {msg.metadata.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-7"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2">
                      <LoadingDots />
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>

          {/* Input */}
          <div className="p-6 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isListening ? 'Listening...' : 'Ask Wally anything...'}
                  disabled={isLoading}
                  className={`pr-12 ${isListening ? 'border-red-500 bg-red-50 dark:bg-red-950' : ''}`}
                />
                {voiceSupported && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 ${
                          isListening ? 'text-red-500 animate-pulse' : ''
                        }`}
                        onClick={handleVoiceToggle}
                      >
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isListening ? 'Stop recording' : 'Start voice input'}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <Button type="submit" disabled={!message.trim() || isLoading}>
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
            
            {error && (
              <p className="text-sm text-destructive mt-2">{error}</p>
            )}
          </div>
        </Card>
      </motion.div>
    </TooltipProvider>
  )
}

export default ChatInterface
