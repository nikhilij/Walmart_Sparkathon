import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { 
  Home,
  Search,
  ShoppingBag,
  Heart,
  User,
  Settings,
  TrendingUp,
  Tag,
  Star,
  Clock,
  HelpCircle
} from 'lucide-react'

import { Badge } from '@/components/UI/Badge'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'

const Sidebar: React.FC = () => {
  const router = useRouter()
  const { user } = useAuth()
  const { itemCount } = useCart()

  const navigation = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      current: router.pathname === '/',
    },
    {
      name: 'Search',
      href: '/search',
      icon: Search,
      current: router.pathname === '/search',
    },
    {
      name: 'Products',
      href: '/products',
      icon: ShoppingBag,
      current: router.pathname.startsWith('/products'),
    },
    {
      name: 'Categories',
      href: '/categories',
      icon: Tag,
      current: router.pathname.startsWith('/categories'),
    },
    {
      name: 'Trending',
      href: '/trending',
      icon: TrendingUp,
      current: router.pathname === '/trending',
    },
    {
      name: 'Deals',
      href: '/deals',
      icon: Star,
      current: router.pathname === '/deals',
    },
  ]

  const userNavigation = user ? [
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      current: router.pathname === '/profile',
    },
    {
      name: 'Wishlist',
      href: '/wishlist',
      icon: Heart,
      current: router.pathname === '/wishlist',
    },
    {
      name: 'Orders',
      href: '/orders',
      icon: Clock,
      current: router.pathname === '/orders',
    },
    {
      name: 'Cart',
      href: '/cart',
      icon: ShoppingBag,
      current: router.pathname === '/cart',
      badge: itemCount > 0 ? itemCount.toString() : undefined,
    },
  ] : []

  const bottomNavigation = [
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      current: router.pathname === '/settings',
    },
    {
      name: 'Help',
      href: '/help',
      icon: HelpCircle,
      current: router.pathname === '/help',
    },
  ]

  return (
    <div className="flex flex-col h-full bg-background border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <span className="font-bold text-xl gradient-text">Wally</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <div className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                item.current
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </div>

        {user && userNavigation.length > 0 && (
          <div className="pt-4 mt-4 border-t border-border">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Your Account
            </h3>
            <div className="space-y-1">
              {userNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.current
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                  {item.badge && (
                    <Badge className="ml-auto">{item.badge}</Badge>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-border">
        <div className="space-y-1">
          {bottomNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                item.current
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
