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
  { id: 'webcam',  label: 'Scan My Vibe',  icon: Camera, desc: 'Use your camera' },
  { id: 'text',    label: 'Tell Me More',  icon: Type,   desc: 'Type how you feel' },
  { id: 'manual',  label: 'I\'ll Pick',    icon: Hand,   desc: 'Choose from a list' },
]

export default function Home() {
  const navigate = useNavigate()

  const [method,   setMethod]   = useState('webcam') // Default to the coolest one
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
    navigate('/recommendations', {
      state: { emotion },
    })
  }

  const capture = useCallback(async () => {
    if (!webcamRef.current) return
    setError(null)
    setLoading(true)
    setResult(null)

    try {
      let imageSrc = null
      for (let attempt = 0; attempt < 8; attempt += 1) {
        imageSrc = webcamRef.current?.getScreenshot({ width: 960, height: 720 })
        if (imageSrc) break
        await new Promise((resolve) => setTimeout(resolve, 250))
      }
      if (!imageSrc) throw new Error('Could not capture image from webcam.')

      const data = await detectFaceEmotion(imageSrc)
      setResult(data)
      setEmotion(data.emotion) 
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
      }, 1200) // Slightly longer to feel more "intentional"
      return () => clearTimeout(timer)
    }
  }, [method, webcamReady, capture])

  const handleCameraReady = useCallback(() => {
    setWebcamReady(true)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 space-y-12">
        
        {/* Hero Header */}
        <div className="text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-bold border border-accent/20">
            <Sparkles size={16} className="animate-pulse" />
            Hey there! Let's find your perfect beats.
          </div>
          <h1 className="text-6xl sm:text-7xl font-black tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            How's your <span className="text-accent underline decoration-accent/20 decoration-8 underline-offset-8">vibe</span> today?
          </h1>
         
        </div>

        {/* Step 1 — Detection Method */}
        <div className="glass-card p-8 space-y-8 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-2xl bg-accent text-white text-sm font-black flex items-center justify-center shadow-lg shadow-accent/20">1</span>
              <div>
                <h2 className="font-black text-xl">Choose your way</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Detection Method</p>
              </div>
            </div>
          </div>

          {/* Method Tabs */}
          <div className="grid grid-cols-3 gap-4">
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
                className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 group
                  ${method === id
                    ? 'border-accent bg-accent/5 text-accent shadow-inner'
                    : 'border-transparent bg-gray-50 dark:bg-white/5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
              >
                <div className={`p-3 rounded-xl transition-colors duration-300 ${method === id ? 'bg-accent text-white' : 'bg-white dark:bg-white/5 group-hover:bg-gray-200 dark:group-hover:bg-white/20'}`}>
                  <Icon size={24} />
                </div>
                <div className="text-center">
                  <span className="text-sm font-black block">{label}</span>
                  <span className="text-[10px] opacity-60 hidden sm:block font-medium">{desc}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Method Content */}
          <div className="pt-4 min-h-[300px] flex flex-col items-center justify-center border-t border-gray-100 dark:border-white/5">
            {method === 'webcam' && (
              <div className="w-full max-w-lg mx-auto">
                <EmotionDetector
                  result={result}
                  loading={loading}
                  error={error}
                  webcamRef={webcamRef}
                  onCameraReady={handleCameraReady}
                  setError={setError}
                />
              </div>
            )}
            {method === 'manual' && (
              <ManualEmotionInput selected={emotion} onSelect={setEmotion} />
            )}
            {method === 'text' && (
              <div className="w-full max-w-lg mx-auto p-4">
                <TextEmotionInput onDetected={setEmotion} />
              </div>
            )}
          </div>
        </div>

        {/* Step 2 — Get Recommendations CTA */}
        <div className={`animate-slide-up transition-all duration-500 transform ${emotion ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4'}`}
          style={{ animationDelay: '200ms' }}>

          {/* Emotion summary */}
          {emotionMeta && (
            <div className={`flex items-center gap-6 p-6 mb-6 rounded-3xl ${emotionMeta.bg} border-2 ${emotionMeta.border} shadow-xl shadow-${emotionMeta.color}/10 animate-fade-in`}>
              <div className="text-5xl animate-bounce-slow">{emotionMeta.emoji}</div>
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Your Vibe Right Now</p>
                <h3 className={`font-black text-3xl capitalize ${emotionMeta.color} leading-none`}>{emotion}</h3>
              </div>
              <div className="ml-auto hidden md:block text-right">
                <p className="text-xs font-bold opacity-60">Ready to go?</p>
                <p className="text-[10px] font-medium opacity-40">Just click the button below</p>
              </div>
            </div>
          )}

          <button
            onClick={handleGetRecommendations}
            disabled={!emotion}
            className="btn-primary w-full group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out skew-x-12" />
            <Music size={24} />
            <span className="text-xl px-2">Discover My Soundtrack</span>
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </button>
          
          {!emotion && (
            <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 font-medium italic animate-pulse-soft">
              <Sparkles size={14} />
              <span>Patiently waiting for your mood...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
