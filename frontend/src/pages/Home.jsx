/**
 * pages/Home.jsx
 * Main page: user selects detection method and gets recommendations.
 */

import { useCallback, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Type, Hand, Music, ArrowRight, Sparkles } from 'lucide-react'
import EmotionDetector from '../components/EmotionDetector'
import ManualEmotionInput from '../components/ManualEmotionInput'
import TextEmotionInput from '../components/TextEmotionInput'
import { getEmotionMeta } from '../utils/emotions'
import { detectFaceEmotion } from '../utils/api'

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
  const [result,   setResult]   = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const [webcamReady, setWebcamReady] = useState(false)
  const webcamRef = useRef(null)
  const autoCaptureDoneRef = useRef(false)

  const emotionMeta = emotion ? getEmotionMeta(emotion) : null

  const handleGetRecommendations = () => {
    if (!emotion) return
    // Pass state via router navigation
    navigate('/recommendations', {
      state: {
        emotion,
      },
    })
  }

  const capture = useCallback(async () => {
    if (!webcamRef.current) return
    setError(null)
    setLoading(true)
    setResult(null)

    try {
      // Some browsers fire "camera ready" before first frame is drawable.
      // Retry for a short window until screenshot is available.
      let imageSrc = null
      for (let attempt = 0; attempt < 8; attempt += 1) {
        imageSrc = webcamRef.current?.getScreenshot({ width: 960, height: 720 })
        if (imageSrc) break
        await new Promise((resolve) => setTimeout(resolve, 250))
      }
      if (!imageSrc) throw new Error('Could not capture image from webcam.')

      const data = await detectFaceEmotion(imageSrc)
      setResult(data)
      setEmotion(data.emotion) // Bubble up
    } catch (err) {
      setError(err.message || 'Face detection failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (method === 'webcam' && webcamReady && !autoCaptureDoneRef.current) {
      autoCaptureDoneRef.current = true
      const timer = setTimeout(() => {
        capture()
      }, 900)
      return () => clearTimeout(timer)
    }
  }, [method, webcamReady, capture])

  return (
    <div className="min-h-screen relative">
      {/* Background Orbs */}
      <div className="bg-orb w-96 h-96 bg-accent top-[-100px] left-[-100px]" />
      <div className="bg-orb w-80 h-80 bg-blue-500 bottom-[10%] right-[-80px]" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12 space-y-8">
        {/* Hero Header */}
        <div className="text-center space-y-3 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">
            <Sparkles size={14} />
            Let your mood pick the music
          </div>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            Mood
            <span className="text-accent">Tunes</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-lg mx-auto leading-relaxed">
            Tell us how you feel, and we will build a playlist that matches your moment.
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
                onClick={() => {
                  setMethod(id)
                  setEmotion(null)
                  setError(null)
                  setResult(null)
                  autoCaptureDoneRef.current = false
                  if (id !== 'webcam') setWebcamReady(false)
                }}
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
              <EmotionDetector
                result={result}
                loading={loading}
                error={error}
                webcamRef={webcamRef}
                onCameraReady={() => setWebcamReady(true)}
                setError={setError}
              />
            )}
            {method === 'manual' && (
              <ManualEmotionInput selected={emotion} onSelect={setEmotion} />
            )}
            {method === 'text' && (
              <TextEmotionInput onDetected={setEmotion} />
            )}
          </div>
        </div>

        {/* Step 2 — Get Recommendations CTA */}
        <div className={`animate-slide-up transition-all duration-300 ${emotion ? 'opacity-100' : 'opacity-30'}`}
          style={{ animationDelay: '200ms' }}>

          {/* Emotion summary */}
          {emotionMeta && (
            <div className={`flex items-center gap-3 p-4 mb-4 rounded-xl ${emotionMeta.bg} border-2 ${emotionMeta.border}`}>
              <span className="text-2xl">{emotionMeta.emoji}</span>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Your current mood</p>
                <p className={`font-bold text-lg capitalize ${emotionMeta.color}`}>{emotion}</p>
              </div>
              <span className="ml-auto text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                Looks good - ready for recommendations
              </span>
            </div>
          )}

          <button
            onClick={handleGetRecommendations}
            disabled={!emotion}
            className="btn-primary w-full flex items-center justify-center gap-3 text-lg py-4"
          >
            <Music size={20} />
            Create My Playlist
            <ArrowRight size={20} />
          </button>
          {!emotion && (
            <p className="text-center mt-3 text-xs text-gray-400">
              Pick or detect a mood to continue.
            </p>
          )}
        </div>

        {/* Footer hint */}
       
      </div>
    </div>
  )
}
