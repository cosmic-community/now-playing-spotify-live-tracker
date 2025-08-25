'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'

function LoginContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      switch (errorParam) {
        case 'access_denied':
          setError('Access denied. You need to authorize the application to continue.')
          break
        case 'no_code':
          setError('No authorization code received from Spotify.')
          break
        case 'server_config':
          setError('Server configuration error. Please contact support.')
          break
        case 'callback_failed':
          setError('Authentication failed. Please try again.')
          break
        default:
          setError('An error occurred during authentication.')
      }
    }
  }, [searchParams])

  const handleLogin = () => {
    setIsLoading(true)
    setError('')

    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
    const redirectUri = `${window.location.origin}/auth/callback`
    
    // Required scopes for reading user's currently playing track
    const scopes = [
      'user-read-currently-playing',
      'user-read-playback-state',
      'user-read-recently-played'
    ].join(' ')

    // Generate a random state for security
    const state = Math.random().toString(36).substring(7)
    
    // Store state in sessionStorage to verify later
    sessionStorage.setItem('spotify_auth_state', state)

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId as string,
      scope: scopes,
      redirect_uri: redirectUri,
      state: state,
      show_dialog: 'true', // Force the user to approve the app again
    })

    // Redirect to Spotify authorization
    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-spotify-black to-gray-900 p-4">
      <div className="glass-effect rounded-2xl p-8 max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-spotify-green flex items-center justify-center">
            <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Connect to Spotify</h1>
          <p className="text-spotify-lightgray">
            Authorize this app to access your Spotify playback information
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-spotify-green hover:bg-spotify-green/90 disabled:bg-spotify-green/50 text-black font-semibold py-3 px-6 rounded-full transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Login with Spotify
              </>
            )}
          </button>

          <div className="text-xs text-spotify-gray">
            <p className="mb-2">This app requires the following permissions:</p>
            <ul className="space-y-1">
              <li>• Read your currently playing track</li>
              <li>• Read your playback state</li>
              <li>• Read your recently played tracks</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-xs text-spotify-gray">
            Don't have a Spotify account?{' '}
            <Link
              href="https://www.spotify.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-spotify-green hover:underline"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-spotify-green"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}