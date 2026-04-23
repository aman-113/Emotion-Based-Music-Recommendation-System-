/**
 * components/EmotionDetector.jsx
 * Webcam-based emotion detection using DeepFace (via backend).
 */

import { useState } from 'react'
import Webcam from 'react-webcam'
import { AlertCircle } from 'lucide-react'
import { getEmotionMeta } from '../utils/emotions'

const WEBCAM_CONSTRAINTS = {
  width:       960,
  height:      720,
  facingMode:  'user',
}

export default function EmotionDetector({
  result,
  loading,
  error,
  webcamRef,
  onCameraReady,
  setError,
}) {
  const [camReady, setCamReady] = useState(false)

  const handleUserMedia = () => {
    setCamReady(true)
    onCameraReady?.()
  }

  const meta = result ? getEmotionMeta(result.emotion) : null

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Position your face in the camera. Emotion will be detected automatically:
      </p>

      {/* Webcam Feed */}
      <div className="webcam-container max-w-md mx-auto aspect-video group">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          screenshotQuality={0.95}
          videoConstraints={WEBCAM_CONSTRAINTS}
          onUserMedia={handleUserMedia}
          onUserMediaError={() => setError('Camera access denied. Please allow camera permissions.')}
          className="w-full h-full object-cover"
          mirrored
        />

        {/* Premium Overlays */}
        <div className="webcam-overlay" />
        {camReady && !loading && !result && <div className="webcam-scanner" />}

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-30 transition-all duration-500">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              </div>
            </div>
            <p className="text-white text-xs font-black uppercase tracking-widest animate-pulse">Analyzing vibe...</p>
          </div>
        )}

        {/* Corner indicator */}
        {camReady && !loading && (
          <div className="absolute top-4 left-4 flex items-center gap-2 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 z-30">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-white font-black uppercase tracking-tighter">Live Feed</span>
          </div>
        )}
      </div>


      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Result */}
      {result && meta && (
        <div className={`flex items-center gap-3 p-4 rounded-xl ${meta.bg} border-2 ${meta.border} animate-slide-up`}>
          <span className="text-3xl">{meta.emoji}</span>
          <div className="flex-1">
            <p className={`font-bold text-lg ${meta.color}`}>{meta.label}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Detected from your face</p>
          </div>

          {/* Top 3 emotion scores */}
          {result.scores && (
            <div className="text-right space-y-0.5">
              {Object.entries(result.scores)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([emotion, score]) => (
                  <p key={emotion} className="text-[10px] text-gray-500 dark:text-gray-400 capitalize">
                    {emotion}: {score.toFixed(1)}%
                  </p>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
