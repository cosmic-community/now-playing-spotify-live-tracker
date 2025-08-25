import { NextResponse } from 'next/server'
import { getCurrentlyPlaying } from '@/lib/spotify-server'

export async function GET() {
  try {
    const currentlyPlaying = await getCurrentlyPlaying()
    
    if (!currentlyPlaying || !currentlyPlaying.item) {
      return NextResponse.json({
        track: null,
        isPlaying: false,
        progress: 0,
        device: null
      })
    }
    
    return NextResponse.json({
      track: currentlyPlaying.item,
      isPlaying: currentlyPlaying.is_playing,
      progress: currentlyPlaying.progress_ms,
      device: currentlyPlaying.device
    })
  } catch (error) {
    console.error('Error fetching currently playing:', error)
    return NextResponse.json(
      { error: 'Failed to fetch currently playing track' },
      { status: 500 }
    )
  }
}