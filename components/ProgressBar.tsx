import { formatDuration, calculateProgress } from '@/lib/spotify'

interface ProgressBarProps {
  progress: number
  duration: number
  isPlaying: boolean
}

export default function ProgressBar({ progress, duration, isPlaying }: ProgressBarProps) {
  const progressPercentage = calculateProgress(progress, duration)
  
  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full spotify-gradient rounded-full transition-all duration-1000 ${
              isPlaying ? 'animate-pulse-slow' : ''
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {/* Progress indicator dot */}
        <div 
          className={`absolute top-0 w-4 h-4 bg-spotify-green rounded-full transform -translate-y-1 -translate-x-2 transition-all duration-1000 ${
            isPlaying ? 'shadow-lg shadow-spotify-green/50' : ''
          }`}
          style={{ left: `${progressPercentage}%` }}
        />
      </div>
      
      <div className="flex justify-between text-sm text-spotify-gray">
        <span>{formatDuration(progress)}</span>
        <span>{formatDuration(duration)}</span>
      </div>
    </div>
  )
}