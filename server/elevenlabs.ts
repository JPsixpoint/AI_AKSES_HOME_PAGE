import { Request, Response } from 'express';
import fetch from 'node-fetch';

interface Voice {
  voice_id: string;
  name: string;
  category: string;
}

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
}

/**
 * ElevenLabs controller for server-side API requests
 */
export const elevenLabsController = {
  /**
   * Generate speech from text and return the audio stream
   */
  generateSpeech: async (req: Request, res: Response) => {
    try {
      const { text, voiceId, modelId, voiceSettings } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Missing text parameter" });
      }
      
      // Get API key from environment variables
      const apiKey = process.env.ELEVENLABS_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ message: "ElevenLabs API key not configured" });
      }
      
      // ElevenLabs API endpoint
      const apiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId || 'bella'}`;
      
      // Make the API request
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text,
          model_id: modelId || 'eleven_monolingual_v1',
          voice_settings: voiceSettings || {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('ElevenLabs API error:', response.status, errorData);
        return res.status(response.status).json({
          message: `ElevenLabs API error: ${response.status} ${response.statusText}`,
          details: errorData
        });
      }
      
      // Get the binary audio data
      const audioBuffer = await response.arrayBuffer();
      
      // Set appropriate headers for audio streaming
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', audioBuffer.byteLength);
      
      // Send the audio data to the client
      res.end(Buffer.from(audioBuffer));
      
    } catch (error) {
      console.error('Error generating speech with ElevenLabs:', error);
      res.status(500).json({
        message: 'Failed to generate speech',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  },
  
  /**
   * Get list of available voices from ElevenLabs
   */
  getVoices: async (_req: Request, res: Response) => {
    try {
      // Get API key from environment variables
      const apiKey = process.env.ELEVENLABS_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ message: "ElevenLabs API key not configured" });
      }
      
      // Make the API request
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'Accept': 'application/json',
          'xi-api-key': apiKey
        }
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('ElevenLabs API error:', response.status, errorData);
        return res.status(response.status).json({
          message: `ElevenLabs API error: ${response.status} ${response.statusText}`,
          details: errorData
        });
      }
      
      // Parse and return the voices data
      const data = await response.json();
      res.json(data);
      
    } catch (error) {
      console.error('Error fetching ElevenLabs voices:', error);
      res.status(500).json({
        message: 'Failed to fetch voices',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
};