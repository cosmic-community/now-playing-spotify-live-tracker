import { createBucketClient } from '@cosmicjs/sdk'
import type { SiteConfig, AppSettings } from '@/types'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Helper function for error handling
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Get site configuration
export async function getSiteConfig(): Promise<SiteConfig | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'site-configs',
      slug: 'main-config'
    }).props(['id', 'title', 'metadata']).depth(1);
    
    return response.object as SiteConfig;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch site configuration');
  }
}

// Get app settings
export async function getAppSettings(): Promise<AppSettings | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'app-settings',
      slug: 'main-settings'
    }).props(['id', 'title', 'metadata']).depth(1);
    
    return response.object as AppSettings;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch app settings');
  }
}