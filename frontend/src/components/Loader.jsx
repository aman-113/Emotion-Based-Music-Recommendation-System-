/**
 * components/Loader.jsx
 * Animated loading spinner with optional message.
 */

import { Music } from 'lucide-react'

export default function Loader({ message = 'Loading...', size = 'md' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 animate-fade-in">
      {/* Spinning ring with music icon */}
      <div className="relative">
        <div
          className={`${sizes[size]} rounded-full border-4 border-accent/20 border-t-accent animate-spin`}
        />
        <Music
          size={size === 'lg' ? 24 : 16}
          className="absolute inset-0 m-auto text-accent animate-pulse"
        />
      </div>

      {/* Message */}
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse-soft">
        {message}
      </p>
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
