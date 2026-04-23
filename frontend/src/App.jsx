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
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark transition-colors duration-500 overflow-x-hidden selection:bg-accent/30">
      {/* Dynamic Background Elements */}
      <div className="mesh-gradient">
        <div className="bg-orb w-[600px] h-[600px] bg-accent/30 -top-20 -left-20" />
        <div className="bg-orb w-[500px] h-[500px] bg-blue-500/20 top-1/2 -right-20" />
        <div className="bg-orb w-[400px] h-[400px] bg-rose-500/20 -bottom-20 left-1/3" />
      </div>

      {/* Global Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-gray-200/40 dark:border-white/5
                      bg-white/60 dark:bg-surface-dark/60 backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform duration-300">
              <Music2 size={20} className="text-white" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="font-black text-xl tracking-tight leading-none" style={{ fontFamily: 'Syne, sans-serif' }}>
                Mood<span className="text-accent underline decoration-accent/30 decoration-4 underline-offset-4">Tunes</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Personalized Music</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter">System Online</span>
            </div>
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>
        </div>
      </nav>

      {/* Page Routes */}
      <main className="relative z-10">
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/recommendations" element={<Recommendations />} />
          {/* 404 fallback */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 animate-fade-in">
              <div className="relative">
                <p className="text-[12rem] font-black text-accent/10 select-none">404</p>
                <p className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-400">Lost in the void?</p>
              </div>
              <a href="/" className="btn-primary">Take Me Home</a>
            </div>
          } />
        </Routes>
      </main>
    </div>
  )
}

