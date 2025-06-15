import React from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  MessageCircle, 
  Brain, 
  Shield, 
  TrendingUp, 
  Zap,
  Star,
  CheckCircle,
  Users,
  Award
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/Card'

const Features: React.FC = () => {
  const features = [
    {
      icon: <MessageCircle className="h-8 w-8 text-blue-500" />,
      title: 'Conversational AI',
      description: 'Chat with Wally using natural language. Ask questions, get recommendations, and have a conversation about your shopping needs.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      title: 'Smart Recommendations',
      description: 'AI-powered product suggestions based on your preferences, budget, and shopping history for personalized experiences.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: 'Fake Review Detection',
      description: 'Advanced algorithms identify suspicious reviews and provide trust scores to help you make informed decisions.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-orange-500" />,
      title: 'Wally Score',
      description: 'Personalized product ratings from 0-100 based on your preferences, budget, and authentic reviews.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: 'Voice Shopping',
      description: 'Use voice commands to search for products, get recommendations, and navigate through your shopping journey.',
      color: 'from-yellow-500 to-amber-500'
    },
    {
      icon: <Star className="h-8 w-8 text-indigo-500" />,
      title: 'Review Summaries',
      description: 'AI-generated summaries of product reviews highlighting key pros and cons to save your time.',
      color: 'from-indigo-500 to-purple-500'
    }
  ]

  const stats = [
    { icon: <Users className="h-6 w-6" />, label: 'Active Users', value: '10K+' },
    { icon: <Award className="h-6 w-6" />, label: 'Products Analyzed', value: '1M+' },
    { icon: <CheckCircle className="h-6 w-6" />, label: 'Accuracy Rate', value: '95%' },
    { icon: <Sparkles className="h-6 w-6" />, label: 'Recommendations', value: '5M+' }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Wally?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience the future of online shopping with AI-powered assistance that understands your needs
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-2">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Features
