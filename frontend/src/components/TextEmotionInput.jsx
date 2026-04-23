/**
 * components/TextEmotionInput.jsx
 * Textarea for users to describe their feelings — sent to HuggingFace for analysis.
 */

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { detectTextEmotion } from '../utils/api'
import { SpinnerIcon } from './Loader'
import { getEmotionMeta } from '../utils/emotions'

const MAX_CHARS = 500

export default function TextEmotionInput({ onDetected }) {
  const [text,        setText]        = useState('')
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState(null)
  const [result,      setResult]      = useState(null)

  const handleAnalyze = async () => {
    if (text.trim().length < 5) {
      setError('Please write at least a few words about your feelings.')
      return
    }
    setError(null)
    setLoading(true)
    setResult(null)

    try {
      const data = await detectTextEmotion(text.trim())
      setResult(data)
      onDetected(data.emotion) // Bubble emotion up to parent
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const meta = result ? getEmotionMeta(result.emotion) : null

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Write a line or two about your day, and we will read the vibe:
      </p>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) setText(e.target.value)
          }}
          placeholder="e.g. I've been feeling really anxious lately, can't stop overthinking..."
          rows={4}
          className="input-field resize-none"
        />
        <span className={`absolute bottom-3 right-3 text-xs font-mono
          ${text.length > MAX_CHARS * 0.8 ? 'text-orange-500' : 'text-gray-400'}`}>
          {text.length}/{MAX_CHARS}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          'I feel light and positive today',
          'I am mentally tired and need calm music',
          'I feel a bit low and emotional',
        ].map((sample) => (
          <button
            key={sample}
            type="button"
            onClick={() => setText(sample)}
            className="text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700
                       text-gray-500 dark:text-gray-400 hover:border-accent/50 hover:text-accent transition-colors"
          >
            {sample}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={loading || text.trim().length < 5}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <SpinnerIcon size={16} />
            Analyzing feelings...
          </>
        ) : (
          <>
            <Sparkles size={16} />
            Understand My Mood
          </>
        )}
      </button>

      {/* Result Display */}
      {result && meta && (
        <div className={`flex items-center gap-3 p-4 rounded-xl ${meta.bg} border-2 ${meta.border} animate-slide-up`}>
          <span className="text-3xl">{meta.emoji}</span>
          <div>
            <p className={`font-bold text-lg ${meta.color}`}>{meta.label}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Detected from your text
            </p>
          </div>
          {/* Confidence bar */}
          {result.scores && (
            <div className="ml-auto text-right">
              <p className="text-xs text-gray-400">Confidence</p>
              <p className={`font-bold text-sm ${meta.color}`}>
                {result.scores[result.emotion]?.toFixed(0) ?? '—'}%
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
