import React from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

import { Card, CardContent } from '@/components/UI/Card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/UI/Avatar'

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Fashion Enthusiast',
      avatar: 'https://via.placeholder.com/60',
      rating: 5,
      content: "Wally has completely transformed my shopping experience! The AI recommendations are spot-on, and I love how it detects fake reviews. I've saved so much time and money.",
    },
    {
      name: 'Rajesh Kumar',
      role: 'Tech Professional',
      avatar: 'https://via.placeholder.com/60',
      rating: 5,
      content: "The voice shopping feature is incredible. I can just ask Wally to find what I need while I'm busy with work. The Wally Score helps me make quick decisions.",
    },
    {
      name: 'Anita Patel',
      role: 'Busy Mom',
      avatar: 'https://via.placeholder.com/60',
      rating: 5,
      content: "As a mother of two, I don't have time to read through hundreds of reviews. Wally's AI summaries and trust scores make shopping so much easier and reliable.",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Don't just take our word for it - hear from real users who've transformed their shopping experience with Wally
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Quote className="h-6 w-6 text-blue-500 opacity-60" />
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
