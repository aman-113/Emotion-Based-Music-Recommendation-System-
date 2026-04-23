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
  const [searchQuery,    setSearchQuery]    = useState('')

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
      setSearchQuery(data.search_query || '')

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
    <div className="min-h-screen relative">
      {/* Background Orbs */}
      <div className="bg-orb w-80 h-80 bg-accent top-[-80px] right-[-60px]" />
      <div className="bg-orb w-64 h-64 bg-blue-400 bottom-[20%] left-[-50px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-2 rounded-xl border border-gray-300 dark:border-gray-600 
                         hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-3xl font-black" style={{ fontFamily: 'Syne, sans-serif' }}>
                Your Playlist
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Curated for your current mood
              </p>
            </div>
          </div>

          <button
            onClick={() => fetchSongs()}
            disabled={loading}
            className="btn-ghost flex items-center gap-2 self-start sm:self-auto"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Mood Summary Bar */}
        <div className="flex flex-wrap items-center gap-3 animate-slide-up">
          {emotionMeta && (
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${emotionMeta.bg} border-2 ${emotionMeta.border}`}>
              <span className="text-xl">{emotionMeta.emoji}</span>
              <div>
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Mood</p>
                <p className={`font-bold text-sm capitalize ${emotionMeta.color}`}>{emotion}</p>
              </div>
            </div>
          )}

          <div className="ml-auto flex items-center gap-1.5 text-gray-400">
            <Music size={14} />
            <span className="text-sm">{songs.length} songs</span>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="glass-card p-6 text-center space-y-3 border-red-200 dark:border-red-800/50 animate-slide-up">
            <p className="text-red-500 font-medium">{error}</p>
            <button onClick={() => fetchSongs()} className="btn-primary">
              Try Again
            </button>
          </div>
        )}

        {/* Song List */}
        {!error && (
          <SongList
            songs={songs}
            loading={loading}
            nextPageToken={nextPageToken}
            prevPageToken={prevPageToken}
            onNextPage={() => fetchSongs(nextPageToken)}
            onPrevPage={() => fetchSongs(prevPageToken)}
            searchQuery={searchQuery}
            emotion={emotion}
          />
        )}

        {/* Back CTA */}
        <div className="text-center pt-4 animate-fade-in">
          <Link to="/" className="text-sm text-gray-400 hover:text-accent transition-colors">
            ← Change my mood detection
          </Link>
        </div>
      </div>
    </div>
  )
}
