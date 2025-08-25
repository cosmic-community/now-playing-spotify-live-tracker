import type { SiteConfig } from '@/types'
import LogoutButton from './LogoutButton'

interface HeaderProps {
  config: SiteConfig | null
}

export default function Header({ config }: HeaderProps) {
  return (
    <header className="border-b border-gray-800 bg-spotify-black/50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {config?.metadata?.logo && (
            <img 
              src={config.metadata.logo.imgix_url ? 
                `${config.metadata.logo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress` : 
                config.metadata.logo.url
              }
              alt={config.title}
              className="w-10 h-10 rounded-lg"
            />
          )}
          <div>
            <h1 className="text-xl font-bold text-white">
              {config?.title || 'Spotify Now Playing'}
            </h1>
            {config?.metadata?.description && (
              <p className="text-sm text-spotify-gray">
                {config.metadata.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-spotify-green rounded-full animate-pulse" />
            <span className="text-sm text-spotify-lightgray">Live</span>
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}