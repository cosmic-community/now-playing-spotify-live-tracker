import Link from 'next/link'
import type { SpotifyTrack } from '@/types'

interface TrackInfoProps {
  track: SpotifyTrack
  isPlaying: boolean
}

export default function TrackInfo({ track, isPlaying }: TrackInfoProps) {
  const artistNames = track.artists.map(artist => artist.name).join(', ')

  return (
    <div className="space-y-2">
      <div>
        <Link
          href={track.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-2xl font-bold text-white hover:text-spotify-green transition-colors duration-200 ${
            isPlaying ? 'animate-pulse' : ''
          }`}
        >
          {track.name}
        </Link>
      </div>
      
      <div>
        <p className="text-spotify-lightgray text-lg">
          by{' '}
          {track.artists.map((artist, index) => (
            <span key={artist.id}>
              <Link
                href={artist.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-200"
              >
                {artist.name}
              </Link>
              {index < track.artists.length - 1 && ', '}
            </span>
          ))}
        </p>
      </div>
      
      <div>
        <Link
          href={track.album.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="text-spotify-gray hover:text-spotify-lightgray transition-colors duration-200"
        >
          {track.album.name}
        </Link>
      </div>
    </div>
  )
}