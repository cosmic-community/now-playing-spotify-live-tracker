import type { CurrentlyPlayingResponse, SpotifyError } from '@/types'

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'
const SPOTIFY_NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing'

let cachedAccessToken: string | null = null
let tokenExpiryTime: number = 0

// Get access token using client credentials or refresh token from environment
async function getAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedAccessToken && Date.now() < tokenExpiryTime) {
    return cachedAccessToken
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not configured. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in your environment variables.')
  }

  let response: Response

  // Try refresh token first if available
  if (refreshToken) {
    response = await fetch(SPOTIFY_TOKEN_URL, {
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
  } else {
    // Fall back to client credentials flow (won't work for user data, but kept for reference)
    response = await fetch(SPOTIFY_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }),
      cache: 'no-store',
    })
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('Token request failed:', errorData)
    throw new Error(`Failed to get Spotify token: ${response.status}`)
  }

  const data = await response.json()
  
  // Cache the token
  cachedAccessToken = data.access_token
  tokenExpiryTime = Date.now() + (data.expires_in * 1000) - 60000 // Subtract 1 minute for safety

  return data.access_token
}

// Get currently playing track - no authentication check needed
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
      // Clear cached token and retry once
      cachedAccessToken = null
      tokenExpiryTime = 0
      
      // Try to get a new token and retry the request once
      try {
        const newToken = await getAccessToken()
        const retryResponse = await fetch(SPOTIFY_NOW_PLAYING_URL, {
          headers: {
            'Authorization': `Bearer ${newToken}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        })
        
        if (retryResponse.status === 204) {
          return null
        }
        
        if (!retryResponse.ok) {
          throw new Error(`Spotify API error after retry: ${retryResponse.status}`)
        }
        
        const retryData = await retryResponse.json()
        return {
          is_playing: retryData.is_playing || false,
          progress_ms: retryData.progress_ms || 0,
          item: retryData.item || null,
          device: retryData.device || null,
        }
      } catch (retryError) {
        console.error('Retry failed:', retryError)
        throw new Error('Spotify authentication failed. Please check your refresh token.')
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.error('Spotify API error:', errorData)
      
      // Provide helpful error messages
      if (response.status === 403) {
        throw new Error('Spotify access forbidden. Make sure your refresh token has the correct scopes (user-read-currently-playing, user-read-playback-state).')
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

// Remove the isAuthenticated function as it's no longer needed
// Remove the logout function as it's no longer needed