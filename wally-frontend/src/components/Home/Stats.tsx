import React from 'react'
import { motion } from 'framer-motion'

const Stats: React.FC = () => {
  const stats = [
    { value: '10K+', label: 'Happy Customers', description: 'Shoppers using Wally daily' },
    { value: '95%', label: 'Accuracy Rate', description: 'In product recommendations' },
    { value: '1M+', label: 'Products Analyzed', description: 'Across multiple categories' },
    { value: '4.9★', label: 'User Rating', description: 'Based on user feedback' },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Join the growing community of smart shoppers
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats
