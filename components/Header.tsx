import type { SiteConfig } from '@/types'
import LogoutButton from '@/components/LogoutButton'

interface HeaderProps {
  config: SiteConfig | null
}

export default function Header({ config }: HeaderProps) {
  const title = config?.title || 'Now Playing'
  const description = config?.metadata?.description || 'Live Spotify tracker'

  return (
    <header className="border-b border-spotify-darkgray/20 bg-spotify-black/50 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {config?.metadata?.logo && (
            <img 
              src={`${config.metadata.logo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
              alt={`${title} logo`}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <h1 className="text-xl font-bold text-white">{title}</h1>
            <p className="text-sm text-spotify-lightgray">{description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {config?.metadata?.social_links?.spotify && (
            <a
              href={config.metadata.social_links.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="text-spotify-lightgray hover:text-spotify-green transition-colors"
              aria-label="Spotify Profile"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.66 0-.479.359-.78.779-.899 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02v.12zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.48.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </a>
          )}
          
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}