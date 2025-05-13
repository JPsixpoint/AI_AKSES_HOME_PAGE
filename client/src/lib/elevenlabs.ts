import { Voice, VoiceSettings } from 'elevenlabs';

/**
 * ElevenLabs API client
 * This module handles communication with ElevenLabs for text-to-speech
 */

// Premium voices for natural sound
export const PREMIUM_VOICES = {
  BELLA: 'EXAVITQu4vr4xnSDxMaL', // Female, American, Speaks with a soft tone
  RACHEL: '21m00Tcm4TlvDq8ikWAM', // Female, American, Professional and neutral
  DOMI: 'AZnzlk1XvdvUeBnXmlld', // Female, American, Deep and clear
  ELLI: 'MF3mGyEYCl7XYWbV9V6O', // Female, American, Soft and breathy
  GRACE: 'oWAxZDx7w5VEj9dCyTzz', // Female, British, Calm and sophisticated
  JESSIE: 'ZQe5CZNOzWyzPSCn5a3c' // Male, American, Young & bright
};

// Default voice and settings
export const DEFAULT_VOICE_ID = PREMIUM_VOICES.BELLA;
export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.5,
  use_speaker_boost: true
};

// Cache for audio elements to avoid repeated API calls
const audioCache: Record<string, HTMLAudioElement> = {};

/**
 * Generate speech from text using ElevenLabs API
 * @param text - The text to convert to speech
 * @param voiceId - Optional voice ID to use (defaults to BELLA)
 * @returns Promise with audio element
 */
export async function generateSpeech(
  text: string,
  voiceId = DEFAULT_VOICE_ID
): Promise<HTMLAudioElement> {
  if (!text) {
    throw new Error('No text provided for speech generation');
  }

  // Create a cache key based on text + voice
  const cacheKey = `${voiceId}:${text}`;
  
  // Return cached audio if available
  if (audioCache[cacheKey]) {
    console.log('Using cached audio for:', text.substring(0, 30) + '...');
    return audioCache[cacheKey];
  }

  try {
    console.log('Generating speech with ElevenLabs for text:', text.substring(0, 30) + '...');
    
    // ElevenLabs API endpoint
    const apiUrl = 'https://api.elevenlabs.io/v1/text-to-speech/' + voiceId;
    
    // Make the API request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY || ''
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
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
    }

    // Get the audio blob
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Create and configure audio element
    const audio = new Audio(audioUrl);
    audio.onloadeddata = () => {
      console.log('ElevenLabs audio loaded successfully');
    };
    
    // Cache the audio for future use
    audioCache[cacheKey] = audio;
    
    return audio;
  } catch (error) {
    console.error('Error generating speech with ElevenLabs:', error);
    throw error;
  }
}

/**
 * Get list of available ElevenLabs voices
 * Useful for allowing users to select a voice
 */
export async function getAvailableVoices(): Promise<Voice[]> {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'Accept': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY || ''
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get voices: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.voices || [];
  } catch (error) {
    console.error('Error fetching ElevenLabs voices:', error);
    return [];
  }
}

/**
 * Stream audio from ElevenLabs for immediate playback
 * @param text Text to convert to speech
 * @param voiceId Voice ID to use
 * @param onStarted Callback when speech starts
 * @param onEnded Callback when speech ends
 * @param onError Callback when an error occurs
 */
export async function streamSpeech(
  text: string,
  voiceId = DEFAULT_VOICE_ID,
  onStarted?: () => void,
  onEnded?: () => void,
  onError?: (error: Error) => void
): Promise<void> {
  if (!text) {
    onError?.(new Error('No text provided for speech generation'));
    return;
  }

  try {
    // Get the audio element
    const audio = await generateSpeech(text, voiceId);
    
    // Set up event handlers
    audio.onplay = () => {
      onStarted?.();
    };
    
    audio.onended = () => {
      onEnded?.();
    };
    
    audio.onerror = (e) => {
      console.error('Audio playback error:', e);
      onError?.(new Error('Audio playback error'));
    };
    
    // Start playing
    await audio.play();
  } catch (error) {
    console.error('ElevenLabs streaming error:', error);
    onError?.(error instanceof Error ? error : new Error(String(error)));
  }
}