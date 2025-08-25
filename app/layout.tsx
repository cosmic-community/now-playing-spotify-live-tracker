import type { Metadata, Viewport } from 'next'
import './globals.css'
import { getSiteConfig } from '@/lib/cosmic'
import CosmicBadge from '@/components/CosmicBadge'

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig()
  
  return {
    title: config?.title || 'Now Playing - Spotify Live Tracker',
    description: config?.metadata?.description || 'See what music I\'m currently listening to on Spotify in real-time',
    keywords: 'spotify, now playing, music, live, tracker, currently playing',
    authors: [{ name: 'Spotify Music Tracker' }],
    openGraph: {
      title: config?.title || 'Now Playing - Spotify Live Tracker',
      description: config?.metadata?.description || 'See what music I\'m currently listening to on Spotify in real-time',
      type: 'website',
      images: config?.metadata?.logo ? [config.metadata.logo.imgix_url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: config?.title || 'Now Playing - Spotify Live Tracker',
      description: config?.metadata?.description || 'See what music I\'m currently listening to on Spotify in real-time',
      images: config?.metadata?.logo ? [config.metadata.logo.imgix_url] : [],
    },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1DB954',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string
  
  return (
    <html lang="en">
      <head>
        {/* Console capture script for dashboard debugging */}
        <script src="/dashboard-console-capture.js" />
      </head>
      <body className="antialiased">
        <main className="min-h-screen">
          {children}
        </main>
        <CosmicBadge bucketSlug={bucketSlug} />
      </body>
    </html>
  )
}