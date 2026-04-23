/**
 * pages/Recommendations.jsx
 * Fetches and displays song recommendations based on emotion.
 */

import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, RefreshCw, Music } from 'lucide-react'
import { recommendSongs } from '../utils/api'
import SongList from '../components/SongList'
import { getEmotionMeta } from '../utils/emotions'

export default function Recommendations() {
  const location = useLocation()
  const navigate  = useNavigate()
  const { emotion } = location.state || {}

  const [songs,          setSongs]          = useState([])
  const [loading,        setLoading]        = useState(false)
  const [error,          setError]          = useState(null)
  const [nextPageToken,  setNextPageToken]  = useState(null)
  const [prevPageToken,  setPrevPageToken]  = useState(null)

  const emotionMeta = emotion ? getEmotionMeta(emotion) : null

  // Redirect home if no emotion was passed
  useEffect(() => {
    if (!emotion) navigate('/', { replace: true })
  }, [emotion, navigate])

  // Fetch songs on mount and whenever page token changes
  const fetchSongs = useCallback(async (pageToken = null) => {
    if (!emotion) return
    setLoading(true)
    setError(null)

    try {
      const data = await recommendSongs({
        emotion,
        page_token:        pageToken,
      })

      setSongs(data.songs || [])
      setNextPageToken(data.next_page_token || null)
      setPrevPageToken(data.prev_page_token || null)

      // Scroll to top on page change
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [emotion])

  useEffect(() => {
    fetchSongs()
  }, [fetchSongs])

  if (!emotion) return null

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 space-y-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in">
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-accent transition-colors group"
            >
              <div className="p-2 rounded-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 group-hover:scale-110 transition-transform">
                <ArrowLeft size={16} />
              </div>
              Back to vibe check
            </Link>
            
            <div className="space-y-1">
              <h1 className="text-5xl font-black tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
                Your Sonic <span className="text-accent underline decoration-accent/20 decoration-8 underline-offset-8">Universe</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                We\'ve handpicked these tracks based on your <span className="text-accent font-bold capitalize">{emotion}</span> energy.
              </p>
            </div>
          </div>

          <button
            onClick={() => fetchSongs()}
            disabled={loading}
            className="btn-ghost flex items-center gap-3 self-start md:self-auto bg-white/50 backdrop-blur-xl"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
            <span className="uppercase tracking-widest text-xs font-black">Refresh Vibes</span>
          </button>
        </div>

        {/* Mood Summary Bar */}
        <div className="flex flex-wrap items-center gap-4 animate-slide-up">
          {emotionMeta && (
            <div className={`flex items-center gap-4 px-6 py-3 rounded-2xl ${emotionMeta.bg} border-2 ${emotionMeta.border} shadow-lg shadow-current/5`}>
              <span className="text-3xl animate-bounce-slow">{emotionMeta.emoji}</span>
              <div>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-400 uppercase tracking-widest leading-none mb-1">Active Mood</p>
                <p className={`font-black text-lg capitalize ${emotionMeta.color} leading-none`}>{emotion}</p>
              </div>
            </div>
          )}

          <div className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-white/40 dark:bg-white/5 text-gray-400 border border-white/40 dark:border-white/10 shadow-sm">
            <Music size={14} className="text-accent" />
            <span className="text-xs font-black tracking-widest uppercase">{songs.length} curated tracks</span>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="glass-card p-12 text-center space-y-6 border-red-200 dark:border-red-800/50 animate-slide-up max-w-lg mx-auto">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
              <RefreshCw size={24} className="text-red-500" />
            </div>
            <div className="space-y-2">
              <h3 className="font-black text-xl text-gray-900 dark:text-gray-100">Something hit a sour note</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{error}</p>
            </div>
            <button onClick={() => fetchSongs()} className="btn-primary w-full">
              Try Again
            </button>
          </div>
        )}

        {/* Song List */}
        {!error && (
          <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            <SongList
              songs={songs}
              loading={loading}
              nextPageToken={nextPageToken}
              prevPageToken={prevPageToken}
              onNextPage={() => fetchSongs(nextPageToken)}
              onPrevPage={() => fetchSongs(prevPageToken)}
              emotion={emotion}
            />
          </div>
        )}

        {/* Footer Polish */}
        <div className="text-center py-12 animate-fade-in">
          <p className="text-xs font-bold text-gray-300 dark:text-gray-600 uppercase tracking-[0.2em] mb-4">You are tuned into MoodTunes AI</p>
          <div className="h-0.5 w-12 bg-accent/20 mx-auto rounded-full" />
        </div>
      </div>
    </div>
  )
}

