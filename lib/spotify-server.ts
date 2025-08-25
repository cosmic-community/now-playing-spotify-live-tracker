import { cookies } from 'next/headers'
import type { CurrentlyPlayingResponse, SpotifyError } from '@/types'

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'
const SPOTIFY_NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing'

// Get access token using refresh token from cookies or environment
async function getAccessToken(): Promise<string> {
  const cookieStore = await cookies()
  
  // First try to get existing access token from cookie
  const existingToken = cookieStore.get('spotify_access_token')?.value
  if (existingToken) {
    return existingToken
  }

  // Get refresh token from cookie or environment
  let refreshToken = cookieStore.get('spotify_refresh_token')?.value
  if (!refreshToken) {
    refreshToken = process.env.SPOTIFY_REFRESH_TOKEN
  }

  if (!refreshToken) {
    throw new Error('No Spotify refresh token available. Please authenticate first.')
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not configured')
  }

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
    throw new Error(`Failed to refresh Spotify token: ${response.status}`)
  }

  const data = await response.json()
  
  // Store new access token in cookie
  const newCookieStore = await cookies()
  newCookieStore.set('spotify_access_token', data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: data.expires_in || 3600, // Usually 1 hour
  })

  return data.access_token
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('spotify_refresh_token')?.value || process.env.SPOTIFY_REFRESH_TOKEN
    return !!refreshToken
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
      // Clear invalid tokens
      const cookieStore = await cookies()
      cookieStore.delete('spotify_access_token')
      throw new Error('Spotify authentication expired')
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.error('Spotify API error:', errorData)
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
    
    // Re-throw authentication errors so they can be handled properly
    if (error instanceof Error && error.message.includes('authentication')) {
      throw error
    }
    
    return null
  }
}

// Logout function to clear tokens
export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('spotify_refresh_token')
  cookieStore.delete('spotify_access_token')
}