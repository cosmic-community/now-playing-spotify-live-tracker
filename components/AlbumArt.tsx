import type { SpotifyAlbum } from '@/types'

interface AlbumArtProps {
  album: SpotifyAlbum
  isPlaying: boolean
  trackName: string
}

export default function AlbumArt({ album, isPlaying, trackName }: AlbumArtProps) {
  const albumImage = album.images[0]
  
  if (!albumImage) {
    return (
      <div className="w-64 h-64 bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-4xl">🎵</div>
      </div>
    )
  }

  return (
    <div className="relative group">
      <div className={`relative overflow-hidden rounded-lg ${isPlaying ? 'album-glow' : ''}`}>
        <img
          src={`${albumImage.url}?w=512&h=512&fit=crop&auto=format,compress`}
          alt={`${album.name} album cover`}
          width={256}
          height={256}
          className={`w-64 h-64 object-cover transition-transform duration-300 group-hover:scale-105 ${
            isPlaying ? 'animate-spin-slow animation-running' : 'animation-pause'
          }`}
        />
        
        {/* Vinyl record effect */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-20 rounded-lg" />
        
        {/* Play state overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-lg">
          <div className={`w-16 h-16 rounded-full bg-spotify-green flex items-center justify-center ${isPlaying ? 'animate-pulse-slow' : ''}`}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </div>
        </div>
      </div>
      
      {/* Floating music notes animation */}
      {isPlaying && (
        <div className="absolute -top-2 -right-2 text-spotify-green animate-bounce-gentle">
          <MusicNoteIcon />
        </div>
      )}
    </div>
  )
}

function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-spotify-black">
      <path d="M8 5v14l11-7z"/>
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-spotify-black">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
    </svg>
  )
}

function MusicNoteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
    </svg>
  )
}