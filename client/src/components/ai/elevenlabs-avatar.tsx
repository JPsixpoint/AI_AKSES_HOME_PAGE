import React, { useEffect, useRef, useState } from 'react';
import { generateSpeech, streamSpeech, PREMIUM_VOICES } from '@/lib/elevenlabs';

// Interface for component props
interface ElevenLabsAvatarProps {
  text: string | null;
  isVisible: boolean;
}

/**
 * ElevenLabs Avatar component with enhanced voice synthesis
 */
export function ElevenLabsAvatar({ text, isVisible }: ElevenLabsAvatarProps) {
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Refs
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Handle text changes - generate speech when text changes
  useEffect(() => {
    if (!text || !isVisible || isMuted) return;
    
    let isMounted = true;
    
    const speakText = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Starting ElevenLabs speech for text:', text.substring(0, 30) + '...');
        
        // Use BELLA voice by default for a natural female voice
        await streamSpeech(
          text,
          PREMIUM_VOICES.BELLA,
          // On started
          () => {
            if (!isMounted) return;
            setIsSpeaking(true);
            setIsLoading(false);
            
            // Restart video at the beginning of speech
            if (backgroundVideoRef.current) {
              backgroundVideoRef.current.currentTime = 0;
              backgroundVideoRef.current.play().catch(err => {
                console.error('Error starting video at speech start:', err);
              });
            }
          },
          // On ended
          () => {
            if (!isMounted) return;
            setIsSpeaking(false);
            
            // Pause the video when speech ends
            if (backgroundVideoRef.current) {
              backgroundVideoRef.current.pause();
              console.log('Paused video at end of speech');
            }
          },
          // On error
          (error) => {
            if (!isMounted) return;
            console.error('ElevenLabs speech error:', error);
            setError(error.message);
            setIsSpeaking(false);
            setIsLoading(false);
            
            // Fall back to browser speech synthesis
            fallbackToWebSpeech(text);
          }
        );
      } catch (err) {
        if (!isMounted) return;
        console.error('Error generating speech with ElevenLabs:', err);
        setError(err instanceof Error ? err.message : String(err));
        setIsLoading(false);
        
        // Fall back to browser speech synthesis
        fallbackToWebSpeech(text);
      }
    };
    
    // Start speaking
    speakText();
    
    // Cleanup function
    return () => {
      isMounted = false;
      
      // Cancel any ongoing speech
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current = null;
        } catch (e) {
          console.error('Error stopping audio:', e);
        }
      }
      
      // Stop any ongoing speech synthesis
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text, isVisible, isMuted]);
  
  // Fallback to browser's speech synthesis if ElevenLabs fails
  const fallbackToWebSpeech = (text: string) => {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported by this browser');
      return;
    }
    
    try {
      console.log('Falling back to browser speech synthesis');
      
      // Cancel any existing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice properties for more natural sounding audio
      utterance.rate = 0.95; // Slightly slower for better clarity
      utterance.pitch = 1.05; // Slightly higher pitch for more feminine voice
      utterance.volume = 1.0; // Full volume
      
      // Find a good voice
      const voices = window.speechSynthesis.getVoices();
      
      // List of preferred female voice names in order of preference
      const preferredVoiceNames = [
        'Google US English Female', 'Microsoft Zira', 'Google UK English Female',
        'Ava', 'Victoria', 'Joanna', 'Catherine', 'Amy', 'Siri Female', 'Samantha'
      ];
      
      // Try to find a preferred voice
      let selectedVoice = null;
      for (const name of preferredVoiceNames) {
        const match = voices.find(voice => voice.name === name);
        if (match) {
          selectedVoice = match;
          break;
        }
      }
      
      // If no preferred voice found, try other methods
      if (!selectedVoice) {
        // Try natural or premium voices
        selectedVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('natural') || 
          voice.name.toLowerCase().includes('premium')
        );
      }
      
      if (!selectedVoice) {
        // Try female voices
        selectedVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('female') || 
          voice.name.toLowerCase().includes('woman')
        );
      }
      
      if (!selectedVoice) {
        // Try US English voices
        selectedVoice = voices.find(voice => 
          voice.lang === 'en-US' || voice.lang === 'en_US'
        );
      }
      
      // Set the selected voice
      if (selectedVoice) {
        console.log('Using fallback voice:', selectedVoice.name, selectedVoice.lang);
        utterance.voice = selectedVoice;
        utterance.lang = 'en-US';
      }
      
      // Set event handlers
      utterance.onstart = () => {
        setIsSpeaking(true);
        
        // Restart video at the beginning of speech
        if (backgroundVideoRef.current) {
          backgroundVideoRef.current.currentTime = 0;
          backgroundVideoRef.current.play().catch(err => {
            console.error('Error starting video at speech start:', err);
          });
        }
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        
        // Pause the video when speech ends
        if (backgroundVideoRef.current) {
          backgroundVideoRef.current.pause();
        }
      };
      
      utterance.onerror = (event) => {
        console.error('Web speech synthesis error:', event);
        setIsSpeaking(false);
      };
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
      
      // Keep speech synthesis alive in some browsers
      const keepAlive = () => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
          setTimeout(keepAlive, 5000);
        }
      };
      
      setTimeout(keepAlive, 2000);
      
    } catch (err) {
      console.error('Error with fallback speech:', err);
      setIsSpeaking(false);
    }
  };
  
  // Apply mute changes
  useEffect(() => {
    if (isMuted) {
      // Cancel any ongoing speech
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      // Cancel any ongoing Web Speech API synthesis
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      
      setIsSpeaking(false);
    }
  }, [isMuted]);
  
  // Control the background video
  useEffect(() => {
    const videoElement = backgroundVideoRef.current;
    if (!videoElement) return;
    
    const handleEnded = () => {
      console.log('Background video playback completed');
    };
    
    videoElement.addEventListener('ended', handleEnded);
    
    // Clean up
    return () => {
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, []);
  
  return (
    <div className={`relative flex items-center justify-center ${isVisible ? '' : 'hidden'}`}>
      <div className="relative w-48 h-48 md:w-56 md:h-56 overflow-hidden rounded-full">
        {/* Background video for simulating talking avatar */}
        <video
          ref={backgroundVideoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="https://sixpoint-web-assets.s3.us-east-1.amazonaws.com/summit2025/SQUARE.mp4"
          muted
          playsInline
        ></video>
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        {/* Error message */}
        {error && !isLoading && (
          <div className="absolute bottom-2 left-2 right-2 bg-red-500/70 text-white text-xs p-1 rounded">
            Error: {error}
          </div>
        )}
        
        {/* Mute/unmute button */}
        <div className="absolute bottom-2 left-2 z-20">
          <button
            className="bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/80">
                <line x1="1" y1="1" x2="23" y2="23"></line>
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/80">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            )}
          </button>
        </div>
        
        {/* Voice status label */}
        <div className="absolute bottom-2 right-2 bg-black/50 rounded-md px-2 py-1 z-20 text-[10px] text-white/70">
          {isMuted ? 'Muted' : (isSpeaking ? 'Speaking' : 'Ready')}
        </div>
      </div>
    </div>
  );
}