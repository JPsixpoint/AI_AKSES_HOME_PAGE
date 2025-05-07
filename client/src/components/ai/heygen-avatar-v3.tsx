import React, { useEffect, useRef } from 'react';
import { useStreamingAvatar, StreamingAvatarSessionState, StreamingAvatarProvider } from './heygen-avatar-context';
import { useStreamingAvatarSession } from '@/hooks/use-streaming-avatar';

// Interface for component props
interface HeyGenAvatarV3Props {
  text: string | null;
  isVisible: boolean;
}

/**
 * HeyGen streaming avatar component using official SDK pattern
 */
function HeyGenAvatarInternal({ text, isVisible }: HeyGenAvatarV3Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    sessionState,
    stream,
    startAvatar,
    stopAvatar,
    speakWithAvatar
  } = useStreamingAvatarSession();
  const {
    isAvatarTalking,
    isMuted,
    setIsMuted,
    error,
    setError
  } = useStreamingAvatar();
  
  // Initialize speech synthesis for fallback
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Connect video element to stream when ready
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      console.log('Connected stream to video element');
    }
  }, [stream]);
  
  // Start session when component becomes visible
  useEffect(() => {
    if (isVisible && sessionState === StreamingAvatarSessionState.INACTIVE) {
      console.log('Starting avatar session...');
      startAvatar().catch(err => {
        console.error('Failed to start avatar session:', err);
        setError('Failed to start avatar session: ' + (err.message || ''));
      });
    } else if (!isVisible && sessionState !== StreamingAvatarSessionState.INACTIVE) {
      console.log('Stopping avatar session due to visibility change');
      stopAvatar();
    }
  }, [isVisible, sessionState, startAvatar, stopAvatar, setError]);
  
  // Handle text changes to make avatar speak
  useEffect(() => {
    if (!text || text.trim() === '' || !isVisible) return;
    
    // Cancel any ongoing speech
    if (speechSynthesisRef.current && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    // Don't speak if muted
    if (isMuted) {
      console.log('Audio is muted, not speaking');
      return;
    }

    const speak = async () => {
      const success = await speakWithAvatar(text);
      
      if (!success) {
        // Fallback to browser speech synthesis
        console.log('Using fallback speech synthesis');
        if (window.speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance(text);
          speechSynthesisRef.current = utterance;
          
          // Try to find a good female voice
          const voices = window.speechSynthesis.getVoices();
          console.log('Available voices:', voices.length);
          
          const preferredVoices = [
            'Samantha', // English US female (Apple)
            'Google UK English Female',
            'Microsoft Zira',
            'Karen', // Australian English
          ];
          
          const voice = voices.find(v => 
            preferredVoices.some(name => v.name.includes(name)) || 
            (v.name.toLowerCase().includes('female') && v.lang.startsWith('en'))
          ) || voices.find(v => v.lang.startsWith('en'));
          
          if (voice) {
            utterance.voice = voice;
            console.log('Using voice:', voice.name, voice.lang);
          }
          
          window.speechSynthesis.speak(utterance);
        }
      }
    };
    
    speak();
  }, [text, isVisible, isMuted, speakWithAvatar]);
  
  // Apply mute status when it changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
    
    if (isMuted && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [isMuted]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  // Render component based on state
  return (
    <div className="flex flex-col items-center justify-center">
      {error ? (
        <div className="w-[300px] h-[300px] rounded-xl bg-black/30 flex flex-col items-center justify-center p-4 text-center">
          <div className="text-red-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-xs text-white/80 mb-2">Could not load AI avatar</p>
          <p className="text-[10px] text-white/60 mb-4">{error}</p>
          
          <button 
            onClick={() => {
              setError(null);
              startAvatar();
            }}
            className="text-xs bg-primary-light hover:bg-primary-lighter text-white px-3 py-1 rounded-md transition-colors"
          >
            Retry Connection
          </button>
          
          <p className="text-[10px] text-white/40 mt-2">
            Using fallback voice synthesis
          </p>
        </div>
      ) : sessionState === StreamingAvatarSessionState.CONNECTING ? (
        <div className="w-[300px] h-[300px] rounded-xl bg-black/30 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mb-2"></div>
          <p className="text-xs text-white/80">Loading AI Avatar...</p>
          <p className="text-[10px] text-white/60 mt-1">Connecting to HeyGen API</p>
        </div>
      ) : sessionState === StreamingAvatarSessionState.CONNECTED ? (
        <div className="relative">
          <video 
            id="heygen-video"
            ref={videoRef}
            autoPlay
            playsInline
            muted={isMuted}
            className="w-[300px] h-[300px] rounded-xl bg-black/30"
          />
          
          {/* Animated overlay for speech */}
          {isAvatarTalking && !isMuted && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute inset-0 bg-black/20 rounded-xl"></div>
              <div className="z-10 flex flex-col items-center justify-center">
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
          
          {/* Audio controls */}
          <div className="absolute top-2 right-2 z-20">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="bg-black/70 hover:bg-black/90 rounded-full p-2 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
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
          
          {/* Status indicator */}
          <div className="absolute bottom-2 right-2 bg-black/70 rounded-md px-2 py-1 z-20">
            <p className="text-[10px] text-white/80">
              HeyGen AI {isMuted && ' (Muted)'}
            </p>
          </div>
        </div>
      ) : (
        // Fallback / inactive state
        <div className="w-[300px] h-[300px] rounded-xl bg-black/30 flex items-center justify-center">
          <svg width="250" height="250" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#111827" stopOpacity="1" />
                <stop offset="100%" stopColor="#1F2937" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            
            {/* Background Circle */}
            <circle cx="150" cy="150" r="150" fill="url(#grad1)" />
            
            {/* Hexagon Grid Pattern */}
            <g opacity="0.2">
              <circle cx="150" cy="150" r="120" fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 6" />
              <circle cx="150" cy="150" r="80" fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 6" />
              <circle cx="150" cy="150" r="40" fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 6" />
            </g>
            
            {/* Profile Silhouette */}
            <g fill="#3B82F6" opacity="0.6">
              <circle cx="150" cy="115" r="45" />
              <path d="M95,220 C95,180 205,180 205,220 L205,240 C205,245 200,250 195,250 L105,250 C100,250 95,245 95,240 Z" />
            </g>
            
            {/* AI Label */}
            <text x="150" y="285" fontSize="12" fill="#fff" textAnchor="middle">AI Assistant</text>
          </svg>
        </div>
      )}
    </div>
  );
}

/**
 * Main HeyGen Avatar component with context provider
 */
export function HeyGenAvatarV3(props: HeyGenAvatarV3Props) {
  return (
    <StreamingAvatarProvider>
      <HeyGenAvatarInternal {...props} />
    </StreamingAvatarProvider>
  );
}