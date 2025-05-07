/**
 * HeyGen API helper functions for authentication and token generation
 */

const HEYGEN_API_KEY = 'YzEwZmEyOWJmYjdlNGI0ZWE3MzFiMjUzZWUzMzZiNTQtMTc0NjU4NDc4Nw==';
const AVATAR_ID = 'Sophie_A1';
const VOICE_ID = 'c8e176c17f814004885fd590e03ff99f';

/**
 * Get a temporary access token for the HeyGen streaming avatar API
 * @returns Access token string
 */
export async function getAccessToken(): Promise<string> {
  try {
    // In a production app, this should call your backend which would securely generate a token
    // For this demo, we're directly using the API key (not recommended for production)
    return HEYGEN_API_KEY;
  } catch (error) {
    console.error('Failed to get access token:', error);
    throw new Error('Failed to get HeyGen access token');
  }
}

/**
 * Get default avatar configuration
 * @returns Avatar config object
 */
export function getDefaultAvatarConfig() {
  return {
    avatarId: AVATAR_ID,
    voiceId: VOICE_ID,
    videoElId: 'heygen-video',
    debug: true
  };
}