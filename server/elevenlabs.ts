import { Request, Response } from 'express';

// Define types for ElevenLabs API
interface Voice {
  voice_id: string;
  name: string;
  category: string;
}

/**
 * Server-side controller for ElevenLabs API
 * This provides secure access to ElevenLabs services without exposing API keys in the client
 */

// Preset voice IDs
const PREMIUM_VOICES = {
  BELLA: 'EXAVITQu4vr4xnSDxMaL', // Female, American, Speaks with a soft tone
  RACHEL: '21m00Tcm4TlvDq8ikWAM', // Female, American, Professional and neutral
  DOMI: 'AZnzlk1XvdvUeBnXmlld', // Female, American, Deep and clear
  ELLI: 'MF3mGyEYCl7XYWbV9V6O', // Female, American, Soft and breathy
  GRACE: 'oWAxZDx7w5VEj9dCyTzz', // Female, British, Calm and sophisticated
  JESSIE: 'ZQe5CZNOzWyzPSCn5a3c' // Male, American, Young & bright
};

// Default voice settings
const DEFAULT_VOICE_SETTINGS = {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.5,
  use_speaker_boost: true
};

/**
 * ElevenLabs controller for server-side API requests
 */
export const elevenLabsController = {
  /**
   * Generate speech from text and return the audio stream
   */
  generateSpeech: async (req: Request, res: Response) => {
    try {
      // Validate the API key
      const apiKey = process.env.ELEVENLABS_API_KEY;
      if (!apiKey) {
        console.error('ElevenLabs API key not found in environment variables');
        return res.status(500).json({ error: 'API key not configured' });
      }

      // Get parameters from request
      const { text, voiceId = PREMIUM_VOICES.BELLA } = req.body;

      if (!text) {
        return res.status(400).json({ error: 'No text provided' });
      }

      console.log(`Generating speech for text: "${text.substring(0, 30)}..."`);

      // Make the API request to ElevenLabs
      const apiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: DEFAULT_VOICE_SETTINGS
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('ElevenLabs API error:', errorData || response.statusText);
        return res.status(response.status).json({ 
          error: `ElevenLabs API error: ${response.status} ${response.statusText}`,
          details: errorData
        });
      }

      // Get audio data
      const audioBuffer = await response.arrayBuffer();
      
      // Set appropriate headers
      res.set('Content-Type', 'audio/mpeg');
      res.set('Content-Length', audioBuffer.byteLength.toString());
      
      // Send the audio data
      res.send(Buffer.from(audioBuffer));
    } catch (error) {
      console.error('Error in ElevenLabs generateSpeech:', error);
      res.status(500).json({ error: 'Failed to generate speech', details: String(error) });
    }
  },

  /**
   * Get list of available voices from ElevenLabs
   */
  getVoices: async (_req: Request, res: Response) => {
    try {
      const apiKey = process.env.ELEVENLABS_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
      }

      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'Accept': 'application/json',
          'xi-api-key': apiKey
        }
      });

      if (!response.ok) {
        return res.status(response.status).json({ 
          error: `Failed to get voices: ${response.status} ${response.statusText}` 
        });
      }

      const data = await response.json();
      res.json(data.voices || []);
    } catch (error) {
      console.error('Error fetching ElevenLabs voices:', error);
      res.status(500).json({ error: 'Failed to fetch voices', details: String(error) });
    }
  }
};