/**
 * components/ThemeToggle.jsx
 * Sun/Moon toggle button for dark/light mode.
 */

import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 
                 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10
                 transition-all duration-200 active:scale-90 group"
    >
      {/* Sun icon (light mode) */}
      <Sun
        size={18}
        className={`transition-all duration-300 text-amber-500
          ${isDark ? 'opacity-0 rotate-90 scale-0 absolute inset-0 m-auto' : 'opacity-100 rotate-0 scale-100'}`}
      />
      {/* Moon icon (dark mode) */}
      <Moon
        size={18}
        className={`transition-all duration-300 text-indigo-400
          ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0 absolute inset-0 m-auto'}`}
      />
    </button>
  )
}
