/**
 * components/ManualEmotionInput.jsx
 * Let users pick their emotion from a grid of clickable chips.
 */

import { EMOTIONS } from '../utils/emotions'

export default function ManualEmotionInput({ selected, onSelect }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        How are you feeling right now? Pick the closest emotion:
      </p>

      {/* Emotion Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {EMOTIONS.map((emotion) => {
          const isSelected = selected === emotion.id
          return (
            <button
              key={emotion.id}
              onClick={() => onSelect(emotion.id)}
              className={`
                emotion-chip flex flex-col items-center gap-1 py-3 px-2 rounded-2xl
                transition-all duration-200 hover:scale-105 active:scale-95
                ${isSelected
                  ? `${emotion.bg} ${emotion.border} ${emotion.color} scale-105 shadow-md`
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                }
              `}
            >
              <span className="text-2xl">{emotion.emoji}</span>
              <span className="font-semibold text-xs">{emotion.label}</span>
              <span className={`text-[10px] opacity-70 hidden sm:block ${isSelected ? '' : 'text-gray-400'}`}>
                {emotion.description}
              </span>
            </button>
          )
        })}
      </div>

      {selected && (
        <p className="text-center text-sm text-accent font-medium animate-fade-in">
          ✓ Selected: <span className="font-bold capitalize">{selected}</span>
        </p>
      )}
    </div>
  )
}
