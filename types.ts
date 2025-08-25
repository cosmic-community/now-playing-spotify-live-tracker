// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Site configuration
interface SiteConfig extends CosmicObject {
  type: 'site-configs';
  metadata: {
    description?: string;
    logo?: {
      url: string;
      imgix_url: string;
    };
    theme_color?: string;
    social_links?: {
      spotify?: string;
      twitter?: string;
      instagram?: string;
    };
  };
}

// App settings
interface AppSettings extends CosmicObject {
  type: 'app-settings';
  metadata: {
    update_interval?: number;
    show_progress?: boolean;
    show_album_art?: boolean;
    show_device?: boolean;
    offline_message?: string;
  };
}

// Spotify API types
interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
}

interface SpotifyArtist {
  id: string;
  name: string;
  external_urls: {
    spotify: string;
  };
}

interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  external_urls: {
    spotify: string;
  };
}

interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyDevice {
  id: string;
  name: string;
  type: string;
  is_active: boolean;
}

interface CurrentlyPlayingResponse {
  is_playing: boolean;
  progress_ms: number;
  item: SpotifyTrack | null;
  device: SpotifyDevice | null;
}

// Component props
interface NowPlayingProps {
  track: SpotifyTrack | null;
  isPlaying: boolean;
  progress: number;
  device: SpotifyDevice | null;
}

interface TrackInfoProps {
  track: SpotifyTrack;
  isPlaying: boolean;
}

interface ProgressBarProps {
  progress: number;
  duration: number;
  isPlaying: boolean;
}

// API response types
interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Utility types
type OptionalMetadata<T> = Partial<T['metadata']>;

// Error types
interface SpotifyError extends Error {
  status?: number;
  message: string;
}

// Export all types
export type {
  CosmicObject,
  SiteConfig,
  AppSettings,
  SpotifyTrack,
  SpotifyArtist,
  SpotifyAlbum,
  SpotifyImage,
  SpotifyDevice,
  CurrentlyPlayingResponse,
  NowPlayingProps,
  TrackInfoProps,
  ProgressBarProps,
  CosmicResponse,
  OptionalMetadata,
  SpotifyError,
};