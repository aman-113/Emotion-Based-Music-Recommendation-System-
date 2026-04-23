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
      <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video max-h-64 flex items-center justify-center webcam-ring border-2 border-accent/30">
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

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-accent/30 border-t-accent animate-spin" />
            <p className="text-white text-sm font-medium">Analyzing face...</p>
          </div>
        )}

        {/* Corner indicator */}
        {camReady && !loading && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-medium">Live</span>
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
