/**
 * components/SongCard.jsx
 * Displays a single YouTube video recommendation card.
 */

import { ExternalLink, Music, Youtube } from 'lucide-react'

export default function SongCard({ song, index }) {
  const handleWatch = () => {
    window.open(song.youtube_url, '_blank', 'noopener,noreferrer')
  }

  // Format publish date
  const publishYear = song.published_at
    ? new Date(song.published_at).getFullYear()
    : null

  return (
    <div
      className="glass-card overflow-hidden group hover:scale-[1.02] transition-all duration-300 
                 hover:shadow-2xl hover:shadow-accent/10 animate-slide-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden bg-gray-900 aspect-video">
        {song.thumbnail ? (
          <img
            src={song.thumbnail}
            alt={song.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music size={32} className="text-gray-600" />
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300
                        flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center
                          transform scale-50 group-hover:scale-100 transition-transform duration-300">
            <div className="w-0 h-0 border-y-[8px] border-y-transparent border-l-[14px] border-l-gray-900 ml-1" />
          </div>
        </div>

        {/* YouTube badge */}
        <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold 
                        px-2 py-0.5 rounded flex items-center gap-1">
          <Youtube size={10} />
          YT
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-gray-900 dark:text-gray-100 
                       group-hover:text-accent transition-colors duration-200" title={song.title}>
          {song.title}
        </h3>

        {/* Channel + Year */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
              <Music size={10} className="text-accent" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[140px]">
              {song.channel}
            </p>
          </div>
          {publishYear && (
            <span className="text-[10px] text-gray-400 font-mono">{publishYear}</span>
          )}
        </div>

        {/* Watch Button */}
        <button
          onClick={handleWatch}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl
                     bg-red-600 hover:bg-red-700 text-white text-sm font-semibold
                     transition-all duration-200 active:scale-95 group/btn"
        >
          <Youtube size={15} />
          Watch on YouTube
          <ExternalLink size={12} className="opacity-60 group-hover/btn:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  )
}
