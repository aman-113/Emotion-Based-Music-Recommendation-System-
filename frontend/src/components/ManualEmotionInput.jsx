/**
 * components/ManualEmotionInput.jsx
 * Let users pick their emotion from a grid of clickable chips.
 */

import { EMOTIONS } from '../utils/emotions'

export default function ManualEmotionInput({ selected, onSelect }) {
  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto py-4">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-black leading-none">Pick your mood</h3>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-none">
          What vibe matches your heart right now?
        </p>
      </div>

      {/* Emotion Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {EMOTIONS.map((emotion) => {
          const isSelected = selected === emotion.id
          return (
            <button
              key={emotion.id}
              onClick={() => onSelect(emotion.id)}
              className={`
                relative group flex flex-col items-center gap-3 p-6 rounded-[2rem] border-2 transition-all duration-500
                ${isSelected
                  ? `${emotion.bg} ${emotion.border} ${emotion.color} scale-105 shadow-xl shadow-current/10 border-current`
                  : 'border-transparent bg-white/50 dark:bg-white/5 text-gray-500 hover:bg-white dark:hover:bg-white/10 hover:border-gray-200 dark:hover:border-white/10'
                }
              `}
            >
              <div className={`text-4xl transition-transform duration-500 group-hover:scale-125 ${isSelected ? 'animate-bounce-slow' : ''}`}>
                {emotion.emoji}
              </div>
              <div className="text-center">
                <span className="font-black text-xs block uppercase tracking-tighter">{emotion.label}</span>
              </div>
              
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-current flex items-center justify-center text-white shadow-lg">
                  <span className="text-[10px] font-black">✓</span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {selected && (
        <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-accent/5 text-accent animate-fade-in">
          <p className="text-sm font-black uppercase tracking-widest leading-none">
            Selected Vibe: {selected}
          </p>
        </div>
      )}
    </div>
  )
}

