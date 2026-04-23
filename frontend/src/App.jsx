/**
 * App.jsx
 * Root component — sets up routing, theme, and global layout.
 */

import { Routes, Route } from 'react-router-dom'
import { Music2 } from 'lucide-react'
import { useTheme } from './hooks/useTheme'
import ThemeToggle from './components/ThemeToggle'
import Home from './pages/Home'
import Recommendations from './pages/Recommendations'

export default function App() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark transition-colors duration-300">
      {/* Global Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-gray-200/60 dark:border-white/5
                      bg-white/80 dark:bg-surface-dark/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center">
              <Music2 size={16} className="text-white" />
            </div>
            <span className="font-black text-lg tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
              Mood<span className="text-accent">Tunes</span>
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-gray-400 font-mono">
              AI Music · v1.0
            </span>
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>
        </div>
      </nav>

      {/* Page Routes */}
      <main>
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/recommendations" element={<Recommendations />} />
          {/* 404 fallback */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
              <p className="text-6xl font-black text-accent/30">404</p>
              <p className="text-gray-500">Page not found</p>
              <a href="/" className="btn-primary">Go Home</a>
            </div>
          } />
        </Routes>
      </main>
    </div>
  )
}
