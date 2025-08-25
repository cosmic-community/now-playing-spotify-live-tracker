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
  })

  if (!response.ok) {
    throw new Error('Failed to refresh Spotify token')
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
      },
      // Cache for 30 seconds to avoid rate limiting
      next: { revalidate: 30 },
    })

    // 204 means no track is currently playing
    if (response.status === 204) {
      return null
    }

    if (!response.ok) {
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
    return null
  }
}

// Format duration from milliseconds to MM:SS
export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Calculate progress percentage
export function calculateProgress(progress_ms: number, duration_ms: number): number {
  if (!duration_ms) return 0
  return Math.min((progress_ms / duration_ms) * 100, 100)
}

// Logout function to clear tokens
export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('spotify_refresh_token')
  cookieStore.delete('spotify_access_token')
}