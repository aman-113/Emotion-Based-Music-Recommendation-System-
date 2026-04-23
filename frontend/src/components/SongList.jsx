/**
 * components/SongList.jsx
 * Displays a grid of SongCard components with next/prev pagination.
 */

import { ChevronLeft, ChevronRight, Music2 } from 'lucide-react'
import SongCard from './SongCard'
import Loader from './Loader'
import { SpinnerIcon } from './Loader'

export default function SongList({
  songs,
  loading,
  nextPageToken,
  prevPageToken,
  onNextPage,
  onPrevPage,
  searchQuery,
  emotion,
  weather,
}) {
  if (loading) {
    return <Loader message="Finding the perfect songs for your mood..." size="lg" />
  }

  if (!songs || songs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
          <Music2 size={28} className="text-accent/50" />
        </div>
        <div>
          <p className="font-semibold text-gray-700 dark:text-gray-300">No songs found</p>
          <p className="text-sm text-gray-400 mt-1">Try a different emotion or city</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Context Header */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-gray-500 dark:text-gray-400">Showing results for:</span>
        <span className="px-3 py-1 bg-accent/10 text-accent rounded-full font-medium capitalize">
          {emotion}
        </span>
        {weather && (
          <>
            <span className="text-gray-400">+</span>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-medium capitalize">
              {weather}
            </span>
          </>
        )}
        {searchQuery && (
          <span className="text-xs text-gray-400 font-mono ml-2 hidden sm:inline">
            "{searchQuery}"
          </span>
        )}
      </div>

      {/* Song Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {songs.map((song, index) => (
          <SongCard key={song.video_id} song={song} index={index} />
        ))}
      </div>

      {/* Pagination */}
      {(prevPageToken || nextPageToken) && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={onPrevPage}
            disabled={!prevPageToken || loading}
            className="btn-ghost flex items-center gap-2 disabled:opacity-40"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div className="w-2 h-2 rounded-full bg-accent/40" />

          <button
            onClick={onNextPage}
            disabled={!nextPageToken || loading}
            className="btn-primary flex items-center gap-2 disabled:opacity-40"
          >
            {loading ? <SpinnerIcon size={14} /> : null}
            Next Page
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
