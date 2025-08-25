'use client'

import { useState, useEffect } from 'react'
import type { SpotifyTrack, SpotifyDevice, AppSettings } from '@/types'
import TrackInfo from '@/components/TrackInfo'
import AlbumArt from '@/components/AlbumArt'
import ProgressBar from '@/components/ProgressBar'
import DeviceInfo from '@/components/DeviceInfo'
import OfflineState from '@/components/OfflineState'

interface NowPlayingProps {
  track: SpotifyTrack | null
  isPlaying: boolean
  progress: number
  device: SpotifyDevice | null
  settings: AppSettings | null
}

export default function NowPlaying({ 
  track: initialTrack, 
  isPlaying: initialIsPlaying, 
  progress: initialProgress,
  device: initialDevice,
  settings 
}: NowPlayingProps) {
  const [track, setTrack] = useState(initialTrack)
  const [isPlaying, setIsPlaying] = useState(initialIsPlaying)
  const [progress, setProgress] = useState(initialProgress)
  const [device, setDevice] = useState(initialDevice)
  const [lastUpdated, setLastUpdated] = useState(Date.now())

  const updateInterval = settings?.metadata?.update_interval || 30000 // Default 30 seconds

  // Update data periodically
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/currently-playing')
        const data = await response.json()
        
        if (data.track) {
          setTrack(data.track)
          setIsPlaying(data.isPlaying)
          setProgress(data.progress)
          setDevice(data.device)
        } else {
          setTrack(null)
          setIsPlaying(false)
          setProgress(0)
          setDevice(null)
        }
        
        setLastUpdated(Date.now())
      } catch (error) {
        console.error('Failed to update track data:', error)
      }
    }, updateInterval)

    return () => clearInterval(interval)
  }, [updateInterval])

  // Update progress locally for smooth animation
  useEffect(() => {
    if (!track || !isPlaying) return

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1000
        return newProgress >= track.duration_ms ? track.duration_ms : newProgress
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [track, isPlaying])

  if (!track) {
    return <OfflineState settings={settings} />
  }

  return (
    <div className="glass-effect rounded-2xl p-8 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-lg font-medium text-spotify-lightgray mb-2">
          {isPlaying ? 'Now Playing' : 'Last Played'}
        </h2>
        <div className="flex items-center justify-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-spotify-green animate-pulse' : 'bg-gray-500'}`} />
          <span className="text-sm text-spotify-gray">
            {isPlaying ? 'Live' : 'Paused'}
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        {(settings?.metadata?.show_album_art !== false) && (
          <div className="flex-shrink-0">
            <AlbumArt 
              album={track.album} 
              isPlaying={isPlaying}
              trackName={track.name}
            />
          </div>
        )}
        
        <div className="flex-1 space-y-4 text-center md:text-left">
          <TrackInfo track={track} isPlaying={isPlaying} />
          
          {(settings?.metadata?.show_progress !== false) && (
            <ProgressBar 
              progress={progress}
              duration={track.duration_ms}
              isPlaying={isPlaying}
            />
          )}
          
          {(settings?.metadata?.show_device !== false) && device && (
            <DeviceInfo device={device} />
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-spotify-gray">
          Last updated: {new Date(lastUpdated).toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}