import React, { ReactNode } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'
import ChatFAB from './ChatFAB'
import { useSidebar } from '@/hooks/useSidebar'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter()
  const { isOpen: sidebarOpen } = useSidebar()
  
  const isHomePage = router.pathname === '/'
  const showSidebar = !isHomePage

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="flex flex-1">
        {showSidebar && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: sidebarOpen ? 0 : -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border lg:static lg:translate-x-0"
          >
            <Sidebar />
          </motion.aside>
        )}
        
        <main
          className={`flex-1 ${
            showSidebar && sidebarOpen ? 'lg:ml-0' : ''
          } transition-all duration-300`}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
      
      <Footer />
      <ChatFAB />
    </div>
  )
}

export default Layout
