import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    
    // Clear all Spotify-related cookies
    cookieStore.delete('spotify_refresh_token')
    cookieStore.delete('spotify_access_token')
    
    return NextResponse.json({ 
      success: true,
      message: 'Successfully logged out'
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to logout' },
      { status: 500 }
    )
  }
}