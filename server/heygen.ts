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
      // Use the hardcoded token provided by the user
      const fixedToken = "YzEwZmEyOWJmYjdlNGI0ZWE3MzFiMjUzZWUzMzZiNTQtMTc0NjU4NDc4Nw==";
      
      console.log(`Providing fixed HeyGen token (length: ${fixedToken.length})`);
      
      // Skip token validation since we're using a known working token

      // Return the token
      return res.status(200).json({
        token: fixedToken
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