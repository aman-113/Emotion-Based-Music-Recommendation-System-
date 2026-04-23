/**
 * utils/emotions.js
 * Emotion metadata: labels, emoji, colors for UI rendering.
 */

export const EMOTIONS = [
  {
    id:    'happy',
    label: 'Happy',
    emoji: '😄',
    color: 'text-yellow-500',
    bg:    'bg-yellow-100 dark:bg-yellow-900/30',
    border:'border-yellow-400',
    description: 'Joyful, elated, upbeat',
  },
  {
    id:    'sad',
    label: 'Sad',
    emoji: '😢',
    color: 'text-blue-500',
    bg:    'bg-blue-100 dark:bg-blue-900/30',
    border:'border-blue-400',
    description: 'Down, melancholic, tearful',
  },
  {
    id:    'angry',
    label: 'Angry',
    emoji: '😠',
    color: 'text-red-500',
    bg:    'bg-red-100 dark:bg-red-900/30',
    border:'border-red-400',
    description: 'Frustrated, irritated, furious',
  },
  {
    id:    'neutral',
    label: 'Neutral',
    emoji: '😐',
    color: 'text-gray-500',
    bg:    'bg-gray-100 dark:bg-gray-800/50',
    border:'border-gray-400',
    description: 'Calm, indifferent, balanced',
  },
  {
    id:    'calm',
    label: 'Calm',
    emoji: '😌',
    color: 'text-teal-500',
    bg:    'bg-teal-100 dark:bg-teal-900/30',
    border:'border-teal-400',
    description: 'Relaxed, peaceful, composed',
  },
]

/** Get emotion metadata by id */
export const getEmotionMeta = (id) =>
  EMOTIONS.find((e) => e.id === id?.toLowerCase()) || EMOTIONS[3] // default neutral

/** Capitalize first letter */
export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
