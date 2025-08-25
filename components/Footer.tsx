import type { SiteConfig } from '@/types'

interface FooterProps {
  config: SiteConfig | null
}

export default function Footer({ config }: FooterProps) {
  return (
    <footer className="w-full p-6 mt-auto">
      <div className="max-w-4xl mx-auto text-center">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-6">
            {config?.metadata?.social_links?.spotify && (
              <a
                href={config.metadata.social_links.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="text-spotify-lightgray hover:text-spotify-green transition-colors duration-200 flex items-center gap-2"
              >
                <SpotifyIcon />
                <span className="text-sm">Follow on Spotify</span>
              </a>
            )}
            
            {config?.metadata?.social_links?.twitter && (
              <a
                href={config.metadata.social_links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-spotify-lightgray hover:text-white transition-colors duration-200 flex items-center gap-2"
              >
                <TwitterIcon />
                <span className="text-sm">Follow on Twitter</span>
              </a>
            )}
          </div>
          
          <div className="border-t border-gray-800 pt-4">
            <p className="text-spotify-gray text-sm">
              Powered by{' '}
              <a
                href="https://developer.spotify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-spotify-green hover:text-green-400 transition-colors duration-200"
              >
                Spotify Web API
              </a>
              {' '}&{' '}
              <a
                href="https://www.cosmicjs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-spotify-green hover:text-green-400 transition-colors duration-200"
              >
                Cosmic
              </a>
            </p>
            <p className="text-spotify-gray text-xs mt-2">
              © {new Date().getFullYear()} Now Playing Tracker. Updates every 30 seconds.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SpotifyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  )
}