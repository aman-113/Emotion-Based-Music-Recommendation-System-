/**
 * pages/Home.jsx
 * Main page: user selects detection method, emotion detected, weather fetched,
 * then navigates to Recommendations page.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Type, Hand, Music, ArrowRight, Sparkles } from 'lucide-react'
import EmotionDetector from '../components/EmotionDetector'
import ManualEmotionInput from '../components/ManualEmotionInput'
import TextEmotionInput from '../components/TextEmotionInput'
import WeatherBadge from '../components/WeatherBadge'
import { getEmotionMeta } from '../utils/emotions'
import { SpinnerIcon } from '../components/Loader'

// Input method tabs
const METHODS = [
  { id: 'manual',  label: 'Pick Emotion',  icon: Hand,   desc: 'Choose from a list' },
  { id: 'text',    label: 'Describe Mood', icon: Type,   desc: 'Type how you feel' },
  { id: 'webcam',  label: 'Face Scan',     icon: Camera, desc: 'Use your camera' },
]

export default function Home() {
  const navigate = useNavigate()

  const [method,   setMethod]   = useState('manual')
  const [emotion,  setEmotion]  = useState(null)
  const [weather,  setWeather]  = useState(null)

  const emotionMeta = emotion ? getEmotionMeta(emotion) : null

  const handleGetRecommendations = () => {
    if (!emotion) return
    // Pass state via router navigation
    navigate('/recommendations', {
      state: {
        emotion,
        weather: weather || null,
      },
    })
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Orbs */}
      <div className="bg-orb w-96 h-96 bg-accent top-[-100px] left-[-100px]" />
      <div className="bg-orb w-80 h-80 bg-blue-500 bottom-[10%] right-[-80px]" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12 space-y-8">
        {/* Hero Header */}
        <div className="text-center space-y-3 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                          bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-2">
            <Sparkles size={14} />
            AI-Powered Music Recommendations
          </div>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            Mood
            <span className="text-accent">Tunes</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto">
            Music that understands exactly how you feel right now
          </p>
        </div>

        {/* Step 1 — Detection Method */}
        <div className="glass-card p-6 space-y-5 animate-slide-up">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">1</span>
            <h2 className="font-bold text-lg">How do you want to share your mood?</h2>
          </div>

          {/* Method Tabs */}
          <div className="grid grid-cols-3 gap-2">
            {METHODS.map(({ id, label, icon: Icon, desc }) => (
              <button
                key={id}
                onClick={() => { setMethod(id); setEmotion(null) }}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200
                  ${method === id
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
              >
                <Icon size={20} />
                <span className="text-xs font-semibold">{label}</span>
                <span className="text-[10px] opacity-60 hidden sm:block">{desc}</span>
              </button>
            ))}
          </div>

          {/* Method Content */}
          <div className="pt-2">
            {method === 'webcam' && (
              <EmotionDetector onDetected={setEmotion} />
            )}
            {method === 'manual' && (
              <ManualEmotionInput selected={emotion} onSelect={setEmotion} />
            )}
            {method === 'text' && (
              <TextEmotionInput onDetected={setEmotion} />
            )}
          </div>
        </div>

        {/* Step 2 — Weather (optional) */}
        <div className={`glass-card p-6 space-y-4 transition-all duration-300 animate-slide-up
          ${emotion ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}
          style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">2</span>
              <h2 className="font-bold text-lg">Add weather context</h2>
            </div>
            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
              Optional
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Let us tailor your playlist to match the weather outside.
          </p>
          <WeatherBadge weather={weather} onWeatherFetched={setWeather} />
        </div>

        {/* Step 3 — Get Recommendations CTA */}
        <div className={`animate-slide-up transition-all duration-300 ${emotion ? 'opacity-100' : 'opacity-30'}`}
          style={{ animationDelay: '200ms' }}>

          {/* Emotion summary */}
          {emotionMeta && (
            <div className={`flex items-center gap-3 p-4 mb-4 rounded-xl ${emotionMeta.bg} border-2 ${emotionMeta.border}`}>
              <span className="text-2xl">{emotionMeta.emoji}</span>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Detected Mood</p>
                <p className={`font-bold text-lg capitalize ${emotionMeta.color}`}>{emotion}</p>
              </div>
              {weather && (
                <div className="ml-auto flex items-center gap-2">
                  <img src={weather.icon_url} alt="" className="w-8 h-8" />
                  <span className="text-sm text-gray-500">{weather.condition}</span>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleGetRecommendations}
            disabled={!emotion}
            className="btn-primary w-full flex items-center justify-center gap-3 text-lg py-4"
          >
            <Music size={20} />
            Get My Music Recommendations
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs text-gray-400 animate-fade-in">
          Powered by DeepFace · HuggingFace · YouTube · OpenWeather
        </p>
      </div>
    </div>
  )
}
