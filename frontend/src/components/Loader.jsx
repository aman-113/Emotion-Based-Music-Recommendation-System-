/**
 * components/Loader.jsx
 * Animated loading spinner with humanized messaging.
 */

import { Music, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'

const MESSAGES = [
  'Tuning into your vibe...',
  'Scanning the musical universe...',
  'Finding the perfect rhythm for you...',
  'Gathering those good vibrations...',
  'Almost there, stay groovy...',
  'Matching beats to your heart...',
]

export default function Loader({ size = 'md' }) {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-20 animate-fade-in relative overflow-hidden">
      {/* Dynamic Background Effect */}
      <div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full scale-150 animate-pulse-soft" />

      {/* Spinning Container */}
      <div className="relative group">
        {/* Outer Ring */}
        <div className={`${sizes[size]} rounded-3xl border-4 border-accent/20 border-t-accent animate-spin-slow shadow-2xl overflow-hidden`}>
          <div className="absolute inset-0 bg-accent/10 backdrop-blur-sm" />
        </div>
        
        {/* Inner Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-xl border border-white/20">
            <Music size={32} className="text-accent animate-bounce-slow" />
          </div>
        </div>
        
        {/* Floating Sparkles */}
        <Sparkles size={16} className="absolute -top-4 -right-4 text-amber-400 animate-pulse" />
        <Sparkles size={12} className="absolute -bottom-2 -left-2 text-blue-400 animate-pulse delay-500" />
      </div>

      {/* Humanized Message */}
      <div className="text-center space-y-2 relative z-10">
        <p key={msgIndex} className="text-lg font-black tracking-tight animate-fade-in">
          {MESSAGES[msgIndex]}
        </p>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest animate-pulse">
          AI Brain is thinking
        </p>
      </div>
    </div>
  )
}

/** Inline spinner for buttons */
export function SpinnerIcon({ size = 16 }) {
  return (
    <svg
      className="animate-spin"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
      <path
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        fill="currentColor"
        className="opacity-75"
      />
    </svg>
  )
}
