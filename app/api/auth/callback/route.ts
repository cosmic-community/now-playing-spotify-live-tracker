import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'

export async function POST(request: NextRequest) {
  try {
    const { code, state } = await request.json()

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Authorization code is required' },
        { status: 400 }
      )
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
    const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { success: false, error: 'Spotify credentials not configured' },
        { status: 500 }
      )
    }

    // Get the verifier from the request (it should be sent from the client)
    const verifier = request.headers.get('x-code-verifier')

    if (!verifier) {
      return NextResponse.json(
        { success: false, error: 'Code verifier is required' },
        { status: 400 }
      )
    }

    // Exchange authorization code for access and refresh tokens
    const response = await fetch(SPOTIFY_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: verifier,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.error('Spotify token exchange failed:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to exchange authorization code' },
        { status: response.status }
      )
    }

    const tokens = await response.json()

    if (!tokens.refresh_token) {
      return NextResponse.json(
        { success: false, error: 'No refresh token received from Spotify' },
        { status: 400 }
      )
    }

    // Store the refresh token in an HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set('spotify_refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

    // Also store access token temporarily
    cookieStore.set('spotify_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in || 3600, // Usually 1 hour
      path: '/',
    })

    return NextResponse.json({ 
      success: true,
      message: 'Successfully authenticated with Spotify'
    })

  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle GET requests for OAuth callback (when user is redirected from Spotify)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const state = searchParams.get('state')

  if (error) {
    console.error('Spotify OAuth error:', error)
    return NextResponse.redirect(new URL(`/auth/login?error=${encodeURIComponent(error)}`, request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/auth/login?error=no_code', request.url))
  }

  // For the GET callback, we'll redirect to a client-side page that handles the token exchange
  // This is because we need the code_verifier that was stored in localStorage
  const callbackUrl = new URL('/auth/callback', request.url)
  callbackUrl.searchParams.set('code', code)
  if (state) callbackUrl.searchParams.set('state', state)

  return NextResponse.redirect(callbackUrl)
}