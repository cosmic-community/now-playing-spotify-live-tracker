'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const code = searchParams.get('code')
    const errorParam = searchParams.get('error')

    if (errorParam) {
      setStatus('error')
      setError('User denied authorization or an error occurred')
      return
    }

    if (!code) {
      setStatus('error')
      setError('No authorization code received')
      return
    }

    // Exchange code for tokens
    fetch('/api/auth/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setStatus('success')
          setTimeout(() => {
            router.push('/')
          }, 2000)
        } else {
          setStatus('error')
          setError(data.error || 'Authentication failed')
        }
      })
      .catch(err => {
        setStatus('error')
        setError('Network error occurred')
        console.error('Callback error:', err)
      })
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-spotify-black via-gray-900 to-spotify-darkgray">
      <div className="glass-effect rounded-2xl p-8 max-w-md mx-4 text-center">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 border-4 border-spotify-green border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h1 className="text-xl font-semibold text-white mb-2">
              Connecting to Spotify...
            </h1>
            <p className="text-spotify-lightgray">
              Please wait while we set up your account
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-spotify-green rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-white mb-2">
              Successfully Connected!
            </h1>
            <p className="text-spotify-lightgray">
              Redirecting you to your Now Playing dashboard...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-white mb-2">
              Connection Failed
            </h1>
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="bg-spotify-green hover:bg-spotify-green/90 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-spotify-black via-gray-900 to-spotify-darkgray">
      <div className="glass-effect rounded-2xl p-8 max-w-md mx-4 text-center">
        <div className="w-16 h-16 border-4 border-spotify-green border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h1 className="text-xl font-semibold text-white mb-2">
          Loading...
        </h1>
        <p className="text-spotify-lightgray">
          Setting up your authentication
        </p>
      </div>
    </div>
  )
}

export default function SpotifyCallback() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CallbackContent />
    </Suspense>
  )
}

export const metadata = {
  title: 'Spotify Authentication - Now Playing Tracker',
  description: 'Completing Spotify authentication for your Now Playing tracker',
}

export const viewport = {
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#1DB954',
}