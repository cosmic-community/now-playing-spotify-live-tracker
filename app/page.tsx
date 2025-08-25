import NowPlaying from '@/components/NowPlaying'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getCurrentlyPlaying } from '@/lib/spotify-server'
import { getSiteConfig, getAppSettings } from '@/lib/cosmic'

export const revalidate = 30 // Revalidate every 30 seconds

export default async function HomePage() {
  // Fetch data in parallel - no authentication check needed
  const [currentlyPlaying, siteConfig, appSettings] = await Promise.all([
    getCurrentlyPlaying(),
    getSiteConfig(),
    getAppSettings(),
  ])

  const track = currentlyPlaying?.item || null
  const isPlaying = currentlyPlaying?.is_playing || false
  const progress = currentlyPlaying?.progress_ms || 0
  const device = currentlyPlaying?.device || null

  return (
    <div className="min-h-screen flex flex-col">
      <Header config={siteConfig} />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <NowPlaying
            track={track}
            isPlaying={isPlaying}
            progress={progress}
            device={device}
            settings={appSettings}
          />
        </div>
      </div>
      
      <Footer config={siteConfig} settings={appSettings} />
    </div>
  )
}