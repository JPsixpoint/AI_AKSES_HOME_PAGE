import React, { useEffect, useRef, useState } from 'react';

// Interface for component props
interface HeyGenAvatarSimplifiedProps {
  text: string | null;
  isVisible: boolean;
  isMuted?: boolean;
  onMuteToggle?: () => void;
}

/**
 * Simplified Avatar component with Web Speech API fallback
 */
export function HeyGenAvatarSimplified({ text, isVisible, isMuted: externalMuted, onMuteToggle }: HeyGenAvatarSimplifiedProps) {
  // States
  const [internalMuted, setInternalMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Use external mute state if provided, otherwise use internal state
  const isMuted = externalMuted !== undefined ? externalMuted : internalMuted;
  
  // Refs
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
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
  
  // Speech synthesis with Web Speech API
  useEffect(() => {
    if (!text || !isVisible || isMuted) return;
    
    try {
      // Cancel any existing speech
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      
      console.log('Using speech synthesis for text:', text);
      const utterance = new SpeechSynthesisUtterance(text);
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
        console.log('Speech started');
        setIsSpeaking(true);
        
        // Play the video when speech starts
        if (backgroundVideoRef.current) {
          backgroundVideoRef.current.currentTime = 0;
          backgroundVideoRef.current.play().catch(err => {
            console.error('Error replaying background video on speech start:', err);
          });
        }
      };
      
      utterance.onend = () => {
        console.log('Speech ended');
        setIsSpeaking(false);
        utteranceRef.current = null;
      };
      
      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        setIsSpeaking(false);
        utteranceRef.current = null;
      };
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Speech synthesis error:', err);
      setIsSpeaking(false);
    }
    
    // Cleanup function
    return () => {
      if (window.speechSynthesis && utteranceRef.current) {
        window.speechSynthesis.cancel();
        utteranceRef.current = null;
      }
    };
  }, [text, isVisible, isMuted]);
  
  // Helper function to set a good voice
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
        
        {/* Mute Control removed to simplify UI */}
        
        {/* Only show muted status when needed */}
        {isMuted && (
          <div className="absolute bottom-2 right-2 bg-black/50 rounded-md px-2 py-1 z-20 text-[10px] text-white/60">
            Muted
          </div>
        )}
      </div>
    </div>
  );
}