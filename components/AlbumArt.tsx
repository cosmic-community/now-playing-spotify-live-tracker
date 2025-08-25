import type { SpotifyAlbum } from '@/types'

interface AlbumArtProps {
  album: SpotifyAlbum
  isPlaying: boolean
  trackName: string
}

export default function AlbumArt({ album, isPlaying, trackName }: AlbumArtProps) {
  // Get the best quality image (usually the first one is highest resolution)
  const image = album.images[0]

  if (!image) {
    return (
      <div className="w-48 h-48 bg-gray-700 rounded-lg flex items-center justify-center">
        <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    )
  }

  return (
    <div className="relative">
      <img
        src={image.url}
        alt={`${album.name} - ${trackName}`}
        className={`w-48 h-48 rounded-lg shadow-lg transition-transform duration-300 ${
          isPlaying ? 'scale-105 shadow-spotify-green/20' : ''
        }`}
        width={image.width}
        height={image.height}
      />
      {isPlaying && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-spotify-green/20 to-transparent" />
      )}
    </div>
  )
}