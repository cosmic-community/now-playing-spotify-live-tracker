import type { SiteConfig } from '@/types'

interface FooterProps {
  config: SiteConfig | null
}

export default function Footer({ config }: FooterProps) {
  return (
    <footer className="w-full p-6 text-center">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
          <a
            href="https://open.spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-spotify-lightgray hover:text-spotify-green transition-colors flex items-center gap-2"
          >
            <SpotifyIcon />
            Powered by Spotify
          </a>
          
          {config?.metadata?.social_links?.instagram && (
            <a
              href={config.metadata.social_links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-spotify-lightgray hover:text-white transition-colors flex items-center gap-2"
            >
              <InstagramIcon />
              Instagram
            </a>
          )}
          
          <a
            href="https://developer.spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-spotify-gray hover:text-spotify-lightgray transition-colors"
          >
            API Documentation
          </a>
        </div>
        
        <div className="text-xs text-spotify-gray">
          <p>
            Real-time music tracking • Updates every {config?.metadata?.update_interval ? Math.floor((config.metadata.update_interval as number) / 1000) : 30} seconds
          </p>
          <p className="mt-1">
            Data provided by Spotify Web API • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}

function SpotifyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.66 0-.479.359-.78.779-.899 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02v.12zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.48.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
}