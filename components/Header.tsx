import type { SiteConfig } from '@/types'
import LogoutButton from '@/components/LogoutButton'

interface HeaderProps {
  config: SiteConfig | null
}

export default function Header({ config }: HeaderProps) {
  return (
    <header className="w-full p-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {config?.metadata?.logo && (
            <img
              src={`${config.metadata.logo.imgix_url}?w=120&h=120&fit=crop&auto=format,compress`}
              alt="Logo"
              width={48}
              height={48}
              className="w-12 h-12 rounded-lg"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">
              {config?.title || 'Now Playing'}
            </h1>
            <p className="text-spotify-lightgray text-sm">
              {config?.metadata?.description || 'Live music tracking'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {config?.metadata?.social_links?.spotify && (
            <a
              href={config.metadata.social_links.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="text-spotify-green hover:text-green-400 transition-colors"
              title="My Spotify Profile"
            >
              <SpotifyIcon />
            </a>
          )}
          
          {config?.metadata?.social_links?.twitter && (
            <a
              href={config.metadata.social_links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-spotify-lightgray hover:text-white transition-colors"
              title="Follow on Twitter"
            >
              <TwitterIcon />
            </a>
          )}
          
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}

function SpotifyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.66 0-.479.359-.78.779-.899 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02v.12zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.48.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}