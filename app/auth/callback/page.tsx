'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

function CallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [message, setMessage] = useState('Processing authentication...')

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const error = searchParams.get('error')
      const state = searchParams.get('state')

      if (error) {
        setStatus('error')
        setMessage(`Authentication failed: ${error}`)
        return
      }

      if (!code) {
        setStatus('error')
        setMessage('No authorization code received')
        return
      }

      try {
        // Get the stored verifier from localStorage
        const verifier = localStorage.getItem('verifier')
        const storedState = sessionStorage.getItem('spotify_auth_state')

        if (!verifier) {
          throw new Error('No code verifier found')
        }

        if (state && storedState && state !== storedState) {
          throw new Error('Invalid state parameter')
        }

        // Exchange the code for tokens
        const response = await fetch('/api/auth/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-code-verifier': verifier,
          },
          body: JSON.stringify({ code, state }),
        })

        const data = await response.json()

        if (data.success) {
          setStatus('success')
          setMessage('Authentication successful! Redirecting...')
          
          // Clean up stored values
          localStorage.removeItem('verifier')
          sessionStorage.removeItem('spotify_auth_state')
          
          // Redirect to home page
          setTimeout(() => {
            router.push('/')
          }, 2000)
        } else {
          throw new Error(data.error || 'Authentication failed')
        }
      } catch (error) {
        console.error('Authentication error:', error)
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'Authentication failed')
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-spotify-black to-gray-900 p-4">
      <div className="glass-effect rounded-2xl p-8 max-w-md w-full text-center">
        <div className="mb-8">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
            status === 'processing' ? 'bg-yellow-500' :
            status === 'success' ? 'bg-spotify-green' :
            'bg-red-500'
          }`}>
            {status === 'processing' && (
              <div className="w-8 h-8 border-4 border-black/30 border-t-black rounded-full animate-spin" />
            )}
            {status === 'success' && (
              <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {status === 'error' && (
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {status === 'processing' && 'Processing...'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Error'}
          </h1>
          <p className="text-spotify-lightgray">{message}</p>
        </div>

        {status === 'error' && (
          <div className="space-y-4">
            <button
              onClick={() => router.push('/auth/login')}
              className="w-full bg-spotify-green hover:bg-spotify-green/90 text-black font-semibold py-3 px-6 rounded-full transition-colors duration-200"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200"
            >
              Go Home
            </button>
          </div>
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