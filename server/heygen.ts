import { Request, Response } from 'express';

/**
 * HeyGen API Authentication and Token Handling
 */

// Get HeyGen API key from environment variables
const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;

/**
 * Error handler for HeyGen API requests
 */
interface HeyGenError {
  status: number;
  message: string;
  details?: any;
}

/**
 * Authentication Controller for HeyGen API
 */
export const heygenController = {
  /**
   * Get authentication token for HeyGen API
   * This endpoint will either return the API key directly or generate a temporary token
   * depending on the HeyGen API requirements
   */
  getToken: async (req: Request, res: Response) => {
    try {
      // HeyGen's API uses the API key directly, so we're just passing it through
      // If in the future they implement temporary token generation, we would call their API here
      if (!HEYGEN_API_KEY) {
        console.error('HeyGen API key is missing from environment variables');
        return res.status(500).json({
          error: 'HeyGen API key not configured'
        });
      }

      console.log(`Providing HeyGen token: ${HEYGEN_API_KEY.substring(0, 5)}...${HEYGEN_API_KEY.slice(-5)} (length: ${HEYGEN_API_KEY.length})`);
      
      // Make a test request to validate the token (optional validation step)
      try {
        const testResponse = await fetch('https://api.heygen.com/v1/status', {
          headers: {
            'Authorization': `Bearer ${HEYGEN_API_KEY}`
          }
        });
        
        if (testResponse.ok) {
          console.log('HeyGen API key validated successfully');
        } else {
          const errorText = await testResponse.text();
          console.warn(`HeyGen API key validation failed: ${testResponse.status} ${errorText}`);
        }
      } catch (validationError) {
        console.warn('Could not validate HeyGen API key:', validationError);
      }

      // Return the token
      return res.status(200).json({
        token: HEYGEN_API_KEY
      });
    } catch (error) {
      console.error('Error getting HeyGen token:', error);
      return res.status(500).json({
        error: 'Failed to get HeyGen token',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  },
};