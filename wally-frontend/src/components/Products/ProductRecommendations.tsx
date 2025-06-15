import React from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Sparkles, TrendingUp, Star, Filter } from 'lucide-react'

import { Button } from '@/components/UI/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/Card'
import ProductCard from './ProductCard'
import { Badge } from '@/components/UI/Badge'
import api from '@/utils/api'

const ProductRecommendations: React.FC = () => {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const response = await api.get('/products/recommend')
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const mockProducts = [
    {
      id: '1',
      name: 'Wireless Bluetooth Headphones',
      price: 2999,
      originalPrice: 4999,
      image: 'https://via.placeholder.com/300x200',
      rating: 4.5,
      reviewCount: 1234,
      wallyScore: 87,
      category: 'Electronics',
      brand: 'AudioTech',
      description: 'Premium wireless headphones with noise cancellation',
      inStock: true,
      freeShipping: true,
      trustScore: 94
    },
    {
      id: '2',
      name: 'Smart Fitness Watch',
      price: 8999,
      originalPrice: 12999,
      image: 'https://via.placeholder.com/300x200',
      rating: 4.3,
      reviewCount: 856,
      wallyScore: 92,
      category: 'Wearables',
      brand: 'FitTech',
      description: 'Advanced fitness tracking with heart rate monitor',
      inStock: true,
      freeShipping: true,
      trustScore: 89
    },
    {
      id: '3',
      name: 'Portable Power Bank',
      price: 1499,
      originalPrice: 2199,
      image: 'https://via.placeholder.com/300x200',
      rating: 4.2,
      reviewCount: 567,
      wallyScore: 78,
      category: 'Accessories',
      brand: 'PowerMax',
      description: '20000mAh fast charging power bank',
      inStock: true,
      freeShipping: false,
      trustScore: 91
    }
  ]

  const products = recommendations?.products || mockProducts

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-blue-500" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Recommended for You
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover products handpicked by Wally's AI based on your preferences and shopping patterns
          </p>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <TrendingUp className="h-3 w-3 mr-1" />
              Trending
            </Badge>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <Star className="h-3 w-3 mr-1" />
              Top Rated
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Picks
            </Badge>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product: any, index: number) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Button size="lg" variant="outline">
            Load More Products
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default ProductRecommendations
