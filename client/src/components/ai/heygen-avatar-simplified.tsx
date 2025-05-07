import React, { useEffect, useRef, useState } from 'react';
import { getAccessToken } from '@/lib/heygen-api';
import { AVATAR_CONFIG } from '@/lib/heygen-client';

// Interface for component props
interface HeyGenAvatarSimplifiedProps {
  text: string | null;
  isVisible: boolean;
  isMuted?: boolean;
  onMuteToggle?: () => void;
}

/**
 * Simplified Avatar component with HeyGen API for voice and local video
 */
export function HeyGenAvatarSimplified({ text, isVisible, isMuted: externalMuted, onMuteToggle }: HeyGenAvatarSimplifiedProps) {
  // States - default to unmuted always
  const [internalMuted, setInternalMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isHeyGenFailed, setIsHeyGenFailed] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  // Use external mute state if provided, otherwise use internal state
  // Always make sure it's not muted by default
  const isMuted = externalMuted !== undefined ? externalMuted : internalMuted;
  
  // Refs
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Log mute state for debugging
  useEffect(() => {
    console.log("HeyGenAvatarSimplified mute state:", { 
      externalMuted, 
      internalMuted, 
      effectiveMuted: isMuted 
    });
  }, [externalMuted, internalMuted, isMuted]);
  
  // Control the background video to only play once
  useEffect(() => {
    const videoElement = backgroundVideoRef.current;
    if (!videoElement) return;
    
    videoElement.addEventListener('loadeddata', () => {
      // Ensure video starts from the beginning
      videoElement.currentTime = 0;
      
      // Ensure it's muted for autoplay compatibility
      videoElement.muted = true;
      
      // Set to only play once
      videoElement.loop = false;
      
      // Start playing
      videoElement.play().catch(err => {
        console.error('Error playing background video:', err);
      });
    });
    
    // Play/pause the video based on visibility
    if (isVisible) {
      videoElement.play().catch(err => {
        console.error('Error playing background video:', err);
      });
    } else {
      videoElement.pause();
    }
    
    // Handle video ended event
    const handleEnded = () => {
      console.log('Background video playback completed');
    };
    
    videoElement.addEventListener('ended', handleEnded);
    
    return () => {
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, [isVisible]);
  
  // Function to get voice from HeyGen API
  const getHeyGenVoice = async (textToSpeak: string): Promise<string | null> => {
    try {
      console.log('Requesting HeyGen voice for:', textToSpeak);
      
      // Get access token from server
      const token = await getAccessToken();
      
      // Make direct call to HeyGen API to synthesize voice
      const response = await fetch('https://api.heygen.com/v1/audio/generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          voice_id: AVATAR_CONFIG.voiceId,
          text: textToSpeak,
          output_format: "mp3",
          speed: 1.0
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HeyGen voice API error: ${response.status} ${errorText}`);
        throw new Error(`HeyGen voice API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('HeyGen voice generated successfully:', data);
      
      if (data.data && data.data.audio_url) {
        return data.data.audio_url;
      } else {
        throw new Error('No audio URL in HeyGen response');
      }
    } catch (error) {
      console.error('Error getting HeyGen voice:', error);
      setIsHeyGenFailed(true);
      return null;
    }
  };
  
  // Function to handle speaking with HeyGen or fallback
  const speakText = async (textToSpeak: string) => {
    if (!textToSpeak || !isVisible || isMuted) return;
    
    // Mark as speaking immediately for UI feedback
    setIsSpeaking(true);
    
    // Play the video regardless of voice source
    if (backgroundVideoRef.current) {
      backgroundVideoRef.current.currentTime = 0;
      backgroundVideoRef.current.play().catch(err => {
        console.error('Error replaying background video on speech start:', err);
      });
    }
    
    // Try HeyGen voice API first if not failed previously
    if (!isHeyGenFailed) {
      try {
        const audioUrl = await getHeyGenVoice(textToSpeak);
        
        if (audioUrl) {
          // Clean up any previous audio
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.removeAttribute('src');
          }
          
          // Create audio element for HeyGen voice
          const audio = new Audio(audioUrl);
          audioRef.current = audio;
          
          // Set up event handlers
          audio.onplay = () => {
            console.log('HeyGen audio started playing');
          };
          
          audio.onended = () => {
            console.log('HeyGen audio finished playing');
            setIsSpeaking(false);
            setAudioUrl(null);
          };
          
          audio.onerror = (err) => {
            console.error('HeyGen audio error:', err);
            setIsSpeaking(false);
            setAudioUrl(null);
            setIsHeyGenFailed(true);
            // Fall back to Web Speech API
            useWebSpeechFallback(textToSpeak);
          };
          
          // Store URL for debugging
          setAudioUrl(audioUrl);
          
          // Play the audio
          audio.play().catch(err => {
            console.error('Error playing HeyGen audio:', err);
            setIsSpeaking(false);
            setIsHeyGenFailed(true);
            // Fall back to Web Speech API
            useWebSpeechFallback(textToSpeak);
          });
          
          return;
        }
      } catch (error) {
        console.error('Error with HeyGen voice API:', error);
        setIsHeyGenFailed(true);
      }
    }
    
    // If we got here, HeyGen failed or is not available
    useWebSpeechFallback(textToSpeak);
  };
  
  // Fallback to Web Speech API
  const useWebSpeechFallback = (textToSpeak: string) => {
    try {
      console.log('Using Web Speech API fallback for:', textToSpeak);
      
      // Cancel any existing speech
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utteranceRef.current = utterance;
      
      // Load voices if needed
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        // This is needed for some browsers that load voices asynchronously
        window.speechSynthesis.onvoiceschanged = () => {
          const updatedVoices = window.speechSynthesis.getVoices();
          setVoice(utterance, updatedVoices);
        };
      } else {
        setVoice(utterance, voices);
      }
      
      // Event listeners
      utterance.onstart = () => {
        console.log('Web Speech started');
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        console.log('Web Speech ended');
        setIsSpeaking(false);
        utteranceRef.current = null;
      };
      
      utterance.onerror = (event) => {
        console.error('Web Speech error:', event);
        setIsSpeaking(false);
        utteranceRef.current = null;
      };
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Web Speech synthesis error:', err);
      setIsSpeaking(false);
    }
  };
  
  // Speak welcome message when component first mounts
  useEffect(() => {
    if (!isVisible || isMuted) return;
    
    // Welcome message to speak on startup
    const welcomeMessage = "Welcome to AKSES. I can help you manage your investment deals. What would you like to do today?";
    
    // Wait a short time for everything to initialize
    const welcomeMessageTimer = setTimeout(() => {
      console.log('Speaking welcome message');
      speakText(welcomeMessage);
    }, 2000);
    
    return () => {
      clearTimeout(welcomeMessageTimer);
    };
  }, [isVisible, isMuted]);
  
  // Process text changes to make avatar speak
  useEffect(() => {
    if (!text || !isVisible || isMuted) return;
    
    // Speak the new text
    speakText(text);
    
    // Cleanup function
    return () => {
      if (window.speechSynthesis && utteranceRef.current) {
        window.speechSynthesis.cancel();
        utteranceRef.current = null;
      }
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
        audioRef.current = null;
      }
    };
  }, [text, isVisible, isMuted]);
  
  // Helper function to set a good voice for Web Speech API
  const setVoice = (utterance: SpeechSynthesisUtterance, voices: SpeechSynthesisVoice[]) => {
    if (!voices || voices.length === 0) return;
    
    // Log available voices for debugging
    console.log('Voices loaded:', voices.length);
    
    // Find a good female voice - these are common high-quality voices
    const preferredVoices = [
      "Samantha", // iOS/macOS
      "Google US English Female", // Chrome
      "Microsoft Zira", // Windows
      "Karen", // macOS/iOS Australian
      "Victoria" // macOS/iOS UK
    ];
    
    // Try to find preferred voices first
    for (const voiceName of preferredVoices) {
      const voice = voices.find(v => v.name.includes(voiceName));
      if (voice) {
        console.log('Using preferred voice:', voice.name);
        utterance.voice = voice;
        return;
      }
    }
    
    // If no preferred voice found, use any English female voice
    const femaleVoice = voices.find(voice => 
      (voice.name.toLowerCase().includes('female') && voice.lang.startsWith('en')) ||
      voice.name === 'Samantha' ||
      voice.name === 'Victoria'
    );
    
    if (femaleVoice) {
      console.log('Using female voice:', femaleVoice.name);
      utterance.voice = femaleVoice;
      return;
    }
    
    // Last resort - any English voice
    const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
    if (englishVoice) {
      console.log('Using English voice:', englishVoice.name);
      utterance.voice = englishVoice;
    }
  };
  
  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-[300px] h-[300px] rounded-xl overflow-hidden">
        {/* Background Video - Always present */}
        <video 
          ref={backgroundVideoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="https://sixpoint-web-assets.s3.us-east-1.amazonaws.com/summit2025/SQUARE.mp4"
        />
        
        {/* Speech Animation Overlay */}
        {isSpeaking && !isMuted && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="absolute inset-0 bg-black/20 rounded-xl"></div>
            <div className="flex flex-col items-center justify-center">
              <div className="flex space-x-1 mb-3">
                <div className="w-2 h-8 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-8 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '200ms'}}></div>
                <div className="w-2 h-8 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '400ms'}}></div>
                <div className="w-2 h-8 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '600ms'}}></div>
                <div className="w-2 h-8 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '800ms'}}></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Audio source indicator */}
        <div className="absolute bottom-2 right-2 bg-black/50 rounded-md px-2 py-1 z-20 text-[10px] text-white/60">
          {isMuted ? 'Muted' : isSpeaking ? 
            (audioUrl ? 'HeyGen Voice' : 'Web Speech') : 
            (isHeyGenFailed ? 'Ready (Web Speech)' : 'Ready (HeyGen)')}
        </div>
      </div>
    </div>
  );
}