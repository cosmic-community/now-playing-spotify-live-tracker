import { cookies } from 'next/headers'
import type { CurrentlyPlayingResponse, SpotifyError } from '@/types'

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'
const SPOTIFY_NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing'

// Get access token using refresh token from cookies or environment
async function getAccessToken(): Promise<string> {
  const cookieStore = await cookies()
  let refreshToken = cookieStore.get('spotify_refresh_token')?.value
  
  // Fall back to environment variable if no cookie
  if (!refreshToken) {
    refreshToken = process.env.SPOTIFY_REFRESH_TOKEN
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not configured. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in your environment variables.')
  }

  if (!refreshToken) {
    throw new Error('No Spotify refresh token available. Please authenticate with Spotify first.')
  }

  // Check if we have a valid cached access token first
  const cachedToken = cookieStore.get('spotify_access_token')?.value
  if (cachedToken) {
    // Try to use the cached token first
    try {
      const testResponse = await fetch(SPOTIFY_NOW_PLAYING_URL, {
        headers: {
          'Authorization': `Bearer ${cachedToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })
      
      // If the token works, return it
      if (testResponse.ok || testResponse.status === 204) {
        return cachedToken
      }
    } catch (error) {
      // Token doesn't work, continue to refresh
    }
  }

  // Refresh the access token
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('Token refresh failed:', errorData)
    throw new Error(`Failed to refresh Spotify token: ${response.status}. Please re-authenticate.`)
  }

  const data = await response.json()
  
  // Update the access token cookie
  const cookieStoreUpdate = await cookies()
  cookieStoreUpdate.set('spotify_access_token', data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: data.expires_in || 3600, // Usually 1 hour
    path: '/',
  })

  return data.access_token
}

// Check if user is authenticated (has refresh token)
export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('spotify_refresh_token')?.value
    return !!(refreshToken || process.env.SPOTIFY_REFRESH_TOKEN)
  } catch {
    return false
  }
}

// Get currently playing track
export async function getCurrentlyPlaying(): Promise<CurrentlyPlayingResponse | null> {
  try {
    const access_token = await getAccessToken()

    const response = await fetch(SPOTIFY_NOW_PLAYING_URL, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    // 204 means no track is currently playing
    if (response.status === 204) {
      return null
    }

    // 401 means token is expired or invalid
    if (response.status === 401) {
      throw new Error('Spotify authentication failed. Please re-authenticate.')
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.error('Spotify API error:', errorData)
      
      // Provide helpful error messages
      if (response.status === 403) {
        throw new Error('Spotify access forbidden. Make sure your account has the correct scopes (user-read-currently-playing, user-read-playback-state).')
      }
      
      const error: SpotifyError = new Error(`Spotify API error: ${response.status}`)
      error.status = response.status
      throw error
    }

    const data = await response.json()
    
    return {
      is_playing: data.is_playing || false,
      progress_ms: data.progress_ms || 0,
      item: data.item || null,
      device: data.device || null,
    }
  } catch (error) {
    console.error('Error fetching currently playing:', error)
    
    // Return null instead of throwing for a more graceful experience
    // This allows the app to show the offline state instead of crashing
    return null
  }
}