import type { CurrentlyPlayingResponse, SpotifyError } from '@/types'

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