import { NextResponse } from 'next/server'
import { logout } from '@/lib/spotify-server'

export async function POST() {
  try {
    await logout()
    
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