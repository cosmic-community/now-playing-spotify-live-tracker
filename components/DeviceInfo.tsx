import type { SpotifyDevice } from '@/types'

interface DeviceInfoProps {
  device: SpotifyDevice
}

export default function DeviceInfo({ device }: DeviceInfoProps) {
  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'computer':
        return <ComputerIcon />
      case 'smartphone':
        return <PhoneIcon />
      case 'speaker':
        return <SpeakerIcon />
      default:
        return <SpeakerIcon />
    }
  }

  return (
    <div className="flex items-center gap-2 text-spotify-lightgray">
      <div className="flex items-center gap-2">
        {getDeviceIcon(device.type)}
        <span className="text-sm">
          Playing on <span className="text-white font-medium">{device.name}</span>
        </span>
      </div>
      
      {device.is_active && (
        <div className="w-2 h-2 bg-spotify-green rounded-full animate-pulse" />
      )}
    </div>
  )
}

function ComputerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h3l-1 1v2h12v-2l-1-1h3c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H4V5h16v11z"/>
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
    </svg>
  )
}

function SpeakerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    </svg>
  )
}