import { formatDuration } from '@/lib/spotify'

interface ProgressBarProps {
  progress: number
  duration: number
  isPlaying: boolean
}

export default function ProgressBar({ progress, duration, isPlaying }: ProgressBarProps) {
  const progressPercentage = duration > 0 ? Math.min((progress / duration) * 100, 100) : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-spotify-gray">
        <span>{formatDuration(progress)}</span>
        <span>{formatDuration(duration)}</span>
      </div>
      
      <div className="relative">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              isPlaying ? 'bg-spotify-green' : 'bg-gray-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {isPlaying && (
          <div
            className="absolute top-0 h-2 w-1 bg-white rounded-full shadow-lg transition-all duration-1000"
            style={{ left: `${progressPercentage}%`, transform: 'translateX(-50%)' }}
          />
        )}
      </div>
    </div>
  )
}