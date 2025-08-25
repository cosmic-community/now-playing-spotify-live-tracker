import type { AppSettings } from '@/types'

interface OfflineStateProps {
  settings: AppSettings | null
}

export default function OfflineState({ settings }: OfflineStateProps) {
  const offlineMessage = settings?.metadata?.offline_message || "No music is currently playing"

  return (
    <div className="glass-effect rounded-2xl p-8 max-w-2xl mx-auto text-center">
      <div className="space-y-6">
        <div className="w-32 h-32 mx-auto bg-gray-800 rounded-full flex items-center justify-center">
          <div className="text-6xl opacity-50">🎵</div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Nothing Playing</h2>
          <p className="text-spotify-lightgray">{offlineMessage}</p>
          <p className="text-sm text-spotify-gray">
            Start playing music on Spotify to see it here in real-time
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500" />
          <span className="text-sm text-spotify-gray">Waiting for music...</span>
        </div>
        
        <div className="pt-4">
          <a
            href="https://open.spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-spotify-green text-spotify-black font-semibold rounded-full hover:bg-green-400 transition-colors duration-200"
          >
            <SpotifyIcon />
            Open Spotify
          </a>
        </div>
      </div>
    </div>
  )
}

function SpotifyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  )
}