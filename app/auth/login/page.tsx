'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function SpotifyLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  useEffect(() => {
    // If there's an error, we might want to handle it
    if (error) {
      console.error('Spotify auth error:', error)
    }
  }, [error])

  const handleSpotifyLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
    const redirectUri = `${window.location.origin}/auth/callback`
    const scopes = 'user-read-currently-playing user-read-playback-state'
    
    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `show_dialog=true`
    
    window.location.href = spotifyAuthUrl
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-spotify-black via-gray-900 to-spotify-darkgray">
      <div className="glass-effect rounded-2xl p-8 max-w-md mx-4 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-spotify-green rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.66 0-.479.359-.78.779-.899 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02v.12zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.48.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Connect to Spotify</h1>
          <p className="text-spotify-lightgray">
            Connect your Spotify account to share what you're listening to
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-300 text-sm">
              Authentication failed. Please try again.
            </p>
          </div>
        )}

        <button
          onClick={handleSpotifyLogin}
          className="w-full bg-spotify-green hover:bg-spotify-green/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.66 0-.479.359-.78.779-.899 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02v.12zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.48.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          Connect with Spotify
        </button>

        <p className="text-xs text-spotify-gray mt-6">
          We'll only access your currently playing track information. 
          You can revoke access at any time in your Spotify settings.
        </p>
      </div>
    </div>
  )
}

export default function SpotifyLogin() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-spotify-black via-gray-900 to-spotify-darkgray">
        <div className="glass-effect rounded-2xl p-8 max-w-md mx-4 text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-spotify-green rounded-full mx-auto mb-4"></div>
            <div className="h-6 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <SpotifyLoginContent />
    </Suspense>
  )
}