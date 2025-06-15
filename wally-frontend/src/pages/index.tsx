import { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Sparkles, Mic, Send, ShoppingBag, Star, TrendingUp } from 'lucide-react'
import Lottie from 'lottie-react'

import ChatInterface from '@/components/Chat/ChatInterface'
import ProductRecommendations from '@/components/Products/ProductRecommendations'
import Hero from '@/components/Home/Hero'
import Features from '@/components/Home/Features'
import Stats from '@/components/Home/Stats'
import Testimonials from '@/components/Home/Testimonials'
import { Button } from '@/components/UI/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/Card'
import { useAuth } from '@/hooks/useAuth'
import { useChatStore } from '@/store/chatStore'

const Home: NextPage = () => {
  const { theme } = useTheme()
  const { user } = useAuth()
  const { isOpen: isChatOpen, toggleChat } = useChatStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* Stats Section */}
      <Stats />

      {/* Demo Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Experience Wally in Action
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See how Wally transforms your shopping experience with AI-powered recommendations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glass p-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Sparkles className="h-8 w-8 text-blue-500" />
                    Try Wally Now
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Ask Wally to find products, get recommendations, or analyze reviews.
                    Experience the future of shopping assistance.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Mic className="h-5 w-5 text-blue-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        "Find a gift under ₹1500 for my sister"
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <ShoppingBag className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        "Compare running shoes under ₹3000"
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Star className="h-5 w-5 text-purple-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        "What do reviews say about this product?"
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={toggleChat}
                    className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Start Chatting with Wally
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="/demo-screenshot.png"
                  alt="Wally Interface Demo"
                  className="w-full h-auto"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/600x400/3b82f6/ffffff?text=Wally+Demo'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        AI Processing...
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Analyzing your preferences and finding the best matches
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Shopping?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of smart shoppers who use Wally to make better purchasing decisions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={toggleChat}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Start Shopping with AI
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                View Product Categories
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Chat Interface */}
      <AnimatePresence>
        {isChatOpen && <ChatInterface />}
      </AnimatePresence>

      {/* Product Recommendations */}
      <ProductRecommendations />
    </div>
  )
}

export default Home
