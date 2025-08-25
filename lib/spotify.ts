import type { CurrentlyPlayingResponse, SpotifyError } from '@/types'

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'
const SPOTIFY_NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing'

// Get access token using refresh token
async function getAccessToken(): Promise<string> {
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN

  if (!refresh_token) {
    throw new Error('Spotify refresh token not configured')
  }

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to refresh Spotify token')
  }

  const data = await response.json()
  return data.access_token
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