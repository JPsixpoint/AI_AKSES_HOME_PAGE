/**
 * Client service for HeyGen integration
 * This service handles communication with our server for HeyGen API token
 */
import { getAccessToken, HEYGEN_DEFAULTS } from './heygen-api';

// Export avatar configuration for component use
export const AVATAR_CONFIG = HEYGEN_DEFAULTS;

/**
 * Get HeyGen API token from our server
 * This protects our API key by not exposing it directly in the client
 */
export async function getHeyGenToken(): Promise<string> {
  try {
    return await getAccessToken();
  } catch (error) {
    console.error('Error fetching HeyGen token:', error);
    throw error;
  }
}

/**
 * Get avatar configuration with API token
 * Used to initialize the streaming avatar
 */
export async function getAvatarConfig() {
  try {
    // Get token from secure server endpoint
    const token = await getHeyGenToken();
    
    return {
      token,
      // No base path needed as we're using the default HeyGen API
      basePath: undefined,
    };
  } catch (error) {
    console.error('Failed to get avatar configuration:', error);
    throw error;
  }
}