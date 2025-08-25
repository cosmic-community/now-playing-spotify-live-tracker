import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Authorization code is required' },
        { status: 400 }
      )
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
    const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/callback`

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { success: false, error: 'Spotify credentials not configured' },
        { status: 500 }
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
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Spotify token exchange failed:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to exchange authorization code' },
        { status: response.status }
      )
    }

    const tokens = await response.json()

    // Store the refresh token in an HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set('spotify_refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    // Also store access token temporarily
    cookieStore.set('spotify_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in || 3600, // Usually 1 hour
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