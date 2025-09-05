import React from 'react'
import { Zap, Menu, User, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'
import CreditCounter from './CreditCounter'

const AppShell = ({ children }) => {
  const { user } = useApp()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-effect border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">MemeFlow AI</h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-white/80 hover:text-white transition-colors">Templates</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">Gallery</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">Pricing</a>
            </nav>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              <CreditCounter variant="inline" />
              <button className="p-2 text-white/80 hover:text-white transition-colors">
                <User className="w-5 h-5" />
              </button>
              <button className="md:hidden p-2 text-white/80 hover:text-white transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

export default AppShell