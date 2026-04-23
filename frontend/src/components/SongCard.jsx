/**
 * components/SongCard.jsx
 * Displays a single YouTube video recommendation card.
 */

import { ExternalLink, Music, Youtube } from 'lucide-react'

export default function SongCard({ song, index }) {
  const handleWatch = () => {
    window.open(song.youtube_url, '_blank', 'noopener,noreferrer')
  }

  const publishYear = song.published_at
    ? new Date(song.published_at).getFullYear()
    : null

  return (
    <div
      className="glass-card overflow-hidden group hover:-translate-y-2 transition-all duration-500 
                 hover:shadow-[0_20px_50px_rgba(124,58,237,0.15)] animate-slide-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {song.thumbnail ? (
          <img
            src={song.thumbnail}
            alt={song.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent/20 to-blue-500/20 flex items-center justify-center">
            <Music size={40} className="text-accent/40 animate-pulse" />
          </div>
        )}

        {/* Premium Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        
        {/* Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
          <button 
            onClick={handleWatch}
            className="w-14 h-14 rounded-2xl bg-white text-accent flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-all duration-500 hover:scale-110 hover:bg-accent hover:text-white"
          >
            <div className="w-0 h-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-current ml-1" />
          </button>
        </div>

        {/* Metadata Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">
            {song.channel?.split(' ')[0] || 'Music'}
          </div>
        </div>
        
        {publishYear && (
          <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-md text-white/80 text-[10px] font-mono px-2 py-1 rounded-lg">
            {publishYear}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 space-y-4">
        <div className="space-y-1">
          <h3 className="font-black text-base leading-tight line-clamp-2 text-gray-900 dark:text-gray-100 
                         group-hover:text-accent transition-colors duration-300" title={song.title}>
            {song.title}
          </h3>
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
            {song.channel}
          </p>
        </div>

        {song.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed font-medium">
            {song.description}
          </p>
        )}

        {/* Premium Action Button */}
        <button
          onClick={handleWatch}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl
                     bg-gray-900 dark:bg-white/10 hover:bg-accent dark:hover:bg-accent 
                     text-white text-xs font-black uppercase tracking-widest
                     transition-all duration-300 active:scale-95 group/btn"
        >
          <Youtube size={16} className="text-red-500 group-hover/btn:text-white transition-colors" />
          Listen Now
          <ExternalLink size={12} className="opacity-40 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
        </button>
      </div>
    </div>
  )
}

