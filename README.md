# Now Playing - Spotify Live Tracker

![App Preview](https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=300&fit=crop&auto=format)

A modern, real-time website that connects to the Spotify API to display your currently playing track to anyone who visits. Features a beautiful, music-focused design with live updates and rich track information.

## Features

- 🎵 **Real-time Spotify Integration** - Live display of currently playing tracks
- 🎨 **Rich Track Information** - Song title, artist, album, and playback progress
- 📱 **Responsive Design** - Optimized for all devices
- 🔄 **Live Updates** - Automatic refresh every 30 seconds
- 🎧 **Visual Music Experience** - Dynamic album artwork and progress bars
- 🌙 **Dark Theme** - Modern Spotify-inspired aesthetic
- ⚡ **Fast Performance** - Built with Next.js 15 and optimized for speed

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=68aca6a9f01fd26965584637&clone_repository=68aca846f01fd2696558463f)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "I want to build a website that uses the spotify api to show what I'm currently listening to. Anyone that goes to the website can see what I'm listening to. Can we build that?"

### Code Generation Prompt

> "Build a modern, well designed, website that uses the Spotify API and shows anyone that visits the website what I'm listening to at the moment"

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Spotify Web API** - Real-time music data
- **Cosmic CMS** - Content management and configuration
- **Vercel** - Deployment platform

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Spotify Premium account (required for currently playing API)
- Spotify Developer App credentials
- Cosmic account for content management

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables (see Environment Variables section below)

4. Run the development server:
   ```bash
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Variables

You'll need to set up the following environment variables:

- `SPOTIFY_CLIENT_ID` - Your Spotify app client ID
- `SPOTIFY_CLIENT_SECRET` - Your Spotify app client secret
- `SPOTIFY_REFRESH_TOKEN` - Your Spotify refresh token
- `COSMIC_BUCKET_SLUG` - Your Cosmic bucket slug (automatically configured)
- `COSMIC_READ_KEY` - Your Cosmic read key (automatically configured)

## Cosmic SDK Examples

```typescript
// Fetch site configuration
const response = await cosmic.objects.findOne({
  type: 'site-configs',
  slug: 'main-config'
}).props(['title', 'metadata'])

// Get app settings
const settings = await cosmic.objects.find({
  type: 'app-settings'
}).props(['title', 'metadata'])
```

## Cosmic CMS Integration

This application uses Cosmic CMS to manage:

- **Site Configuration** - App title, description, and branding
- **Display Settings** - Update intervals and UI preferences
- **About Content** - Information about the music listener
- **Social Links** - Connect visitor to your music profiles

## Spotify API Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add `http://localhost:3000` to redirect URIs
4. Get your Client ID and Client Secret
5. Generate a refresh token using the authorization flow

## Deployment Options

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Add environment variables in the Vercel dashboard
3. Deploy automatically

### Netlify

1. Connect your repository to Netlify
2. Set build command: `bun run build`
3. Set publish directory: `.next`
4. Add environment variables

Remember to update your Spotify app's redirect URIs to include your production domain.

<!-- README_END -->