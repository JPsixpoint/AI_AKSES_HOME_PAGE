/**
 * HeyGen API helper functions for authentication and token generation
 */

/**
 * Default avatar and voice configuration values
 */
export const HEYGEN_DEFAULTS = {
  avatarId: 'Sophie_A1',
  voiceId: 'c8e176c17f814004885fd590e03ff99f',
  // Other options:
  // male_voice: '1bd001e71248fb81f13d1247ad65f631'
};

/**
 * Get a temporary access token for the HeyGen streaming avatar API
 * @returns Access token string
 */
export async function getAccessToken(): Promise<string> {
  try {
    console.log('Requesting HeyGen token from server...');
    const response = await fetch('/api/heygen/token');
    
    if (!response.ok) {
      console.error(`HeyGen token request failed with status: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to get HeyGen token: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Successfully received HeyGen token');
    return data.token;
  } catch (error) {
    console.error('Error in getAccessToken:', error);
    throw error;
  }
}

/**
 * Get default avatar configuration
 * @returns Avatar config object
 */
export function getDefaultAvatarConfig() {
  return {
    avatarId: HEYGEN_DEFAULTS.avatarId,
    voiceId: HEYGEN_DEFAULTS.voiceId,
  };
}