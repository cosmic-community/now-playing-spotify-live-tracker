'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

function CallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const error = searchParams.get('error')
      const state = searchParams.get('state')

      // Check if there was an error from Spotify
      if (error) {
        setStatus('error')
        setMessage(`Authorization failed: ${error}`)
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
        return
      }

      // Check if we have an authorization code
      if (!code) {
        setStatus('error')
        setMessage('No authorization code received')
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
        return
      }

      // Verify state parameter for security
      const storedState = sessionStorage.getItem('spotify_auth_state')
      if (state !== storedState) {
        setStatus('error')
        setMessage('Invalid state parameter')
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
        return
      }

      // Get the stored verifier
      const verifier = localStorage.getItem('verifier')
      if (!verifier) {
        setStatus('error')
        setMessage('Missing verification code')
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
        return
      }

      try {
        // Exchange the authorization code for tokens
        const response = await fetch('/api/auth/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-code-verifier': verifier,
          },
          body: JSON.stringify({ code, state }),
        })

        const result = await response.json()

        if (result.success) {
          setStatus('success')
          setMessage('Successfully authenticated! Redirecting...')
          
          // Clean up stored data
          sessionStorage.removeItem('spotify_auth_state')
          localStorage.removeItem('verifier')
          
          // Redirect to home page
          setTimeout(() => {
            router.push('/')
          }, 2000)
        } else {
          throw new Error(result.error || 'Authentication failed')
        }
      } catch (error) {
        console.error('Callback error:', error)
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'Authentication failed')
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-spotify-black to-gray-900 p-4">
      <div className="glass-effect rounded-2xl p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-spotify-green/30 border-t-spotify-green rounded-full animate-spin"></div>
            <h1 className="text-xl font-bold text-white mb-2">Connecting...</h1>
            <p className="text-spotify-lightgray">Setting up your Spotify connection</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-spotify-green rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Success!</h1>
            <p className="text-spotify-lightgray">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Error</h1>
            <p className="text-red-400 mb-4">{message}</p>
            <p className="text-spotify-gray text-sm">Redirecting to login...</p>
          </>
        )}
      </div>
    </div>
  )
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-spotify-green"></div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}