import React from 'react'
import { motion } from 'framer-motion'
import { Star, Heart, ShoppingCart, ExternalLink, Badge as BadgeIcon } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/UI/Button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/UI/Card'
import { Badge } from '@/components/UI/Badge'
import { useCart } from '@/hooks/useCart'
import { formatCurrency } from '@/utils/currency'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviewCount: number
  wallyScore: number
  category: string
  brand: string
  description: string
  inStock: boolean
  freeShipping?: boolean
  trustScore?: number
}

interface ProductCardProps {
  product: Product
  compact?: boolean
  showWallyScore?: boolean
  onClick?: () => void
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  compact = false, 
  showWallyScore = true,
  onClick 
}) => {
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      wallyScore: product.wallyScore
    })
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`cursor-pointer ${compact ? 'w-full' : ''}`}
    >
      <Card className={`overflow-hidden product-card ${compact ? 'h-full flex flex-col' : 'h-96'}`}>
        <CardHeader className={`p-0 relative ${compact ? 'h-32' : 'h-48'}`}>
          <div className="relative w-full h-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://via.placeholder.com/300x200/3b82f6/ffffff?text=${encodeURIComponent(product.name)}`
              }}
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {discountPercentage > 0 && (
                <Badge className="bg-red-500 text-white">
                  {discountPercentage}% OFF
                </Badge>
              )}
              {product.freeShipping && (
                <Badge className="bg-green-500 text-white">
                  Free Shipping
                </Badge>
              )}
              {!product.inStock && (
                <Badge className="bg-gray-500 text-white">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Wally Score */}
            {showWallyScore && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <BadgeIcon className="h-3 w-3 mr-1" />
                  {product.wallyScore}/100
                </Badge>
              </div>
            )}

            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute bottom-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className={`flex-1 ${compact ? 'p-3' : 'p-4'}`}>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{product.brand}</span>
              <span>•</span>
              <span>{product.category}</span>
            </div>
            
            <h3 className={`font-semibold line-clamp-2 ${compact ? 'text-sm' : 'text-base'}`}>
              {product.name}
            </h3>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-xs text-muted-foreground">
                  ({product.reviewCount})
                </span>
              </div>
              
              {product.trustScore && (
                <Badge variant="outline" className="text-xs">
                  {product.trustScore}% Trust
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`font-bold ${compact ? 'text-base' : 'text-lg'}`}>
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            
            {!compact && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className={`${compact ? 'p-3 pt-0' : 'p-4 pt-0'}`}>
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default ProductCard
