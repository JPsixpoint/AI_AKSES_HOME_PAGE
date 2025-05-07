import React, { useEffect, useRef, useState } from 'react';
import StreamingAvatar, { StreamingEvents, StartAvatarRequest } from '@heygen/streaming-avatar';
import { getAvatarConfig, AVATAR_CONFIG } from '@/lib/heygen-client';

// Interface for component props
interface HeyGenAvatarSimplifiedProps {
  text: string | null;
  isVisible: boolean;
}

/**
 * Simplified HeyGen Avatar component with minimal dependencies
 */
export function HeyGenAvatarSimplified({ text, isVisible }: HeyGenAvatarSimplifiedProps) {
  // States
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  
  // Refs
  const avatarRef = useRef<StreamingAvatar | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Initialize avatar when component becomes visible
  useEffect(() => {
    if (!isVisible) return;
    
    let isMounted = true;
    let sessionId: string | null = null;
    
    const initializeAvatar = async () => {
      try {
        if (avatarRef.current) {
          // Clean up existing avatar if any
          try {
            avatarRef.current.stopAvatar();
            avatarRef.current = null;
          } catch (e) {
            console.log('Error stopping previous avatar session:', e);
          }
        }
        
        setIsLoading(true);
        setError(null);
        setUsingFallback(false);
        
        // Get token from server
        console.log('Initializing avatar using secure token...');
        let avatarInstance: StreamingAvatar;
        
        try {
          const config = await getAvatarConfig();
          console.log('Avatar configuration obtained successfully');
          
          // Create a new avatar instance with configuration from server
          avatarInstance = new StreamingAvatar(config);
          console.log('StreamingAvatar instance created successfully');
          
          if (!isMounted) return;
          avatarRef.current = avatarInstance;
        } catch (tokenError: any) {
          console.error('Failed to initialize avatar with token:', tokenError);
          throw new Error('Could not initialize avatar: ' + (tokenError?.message || String(tokenError)));
        }
        
        if (!isMounted || !avatarRef.current) return;
        
        // Set up event listeners
        avatarRef.current.on(StreamingEvents.STREAM_READY, (event: any) => {
          if (!isMounted) return;
          console.log('Stream ready:', event.detail);
          
          // Set video source when stream is ready
          if (videoRef.current && event.detail) {
            videoRef.current.srcObject = event.detail;
            videoRef.current.muted = isMuted;
            videoRef.current.play().catch(e => {
              console.error('Error playing video:', e);
            });
          }
          
          setIsLoading(false);
        });
        
        avatarRef.current.on(StreamingEvents.AVATAR_START_TALKING, () => {
          if (!isMounted) return;
          console.log('Avatar started talking');
          setIsSpeaking(true);
        });
        
        avatarRef.current.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
          if (!isMounted) return;
          console.log('Avatar stopped talking');
          setIsSpeaking(false);
        });
        
        // Listen for session events (the actual event name may vary by SDK version)
        try {
          avatarRef.current.on('session_created' as any, (event: any) => {
            if (!isMounted) return;
            console.log('Session created:', event.detail);
            sessionId = event.detail?.session_id;
          });
        } catch (e) {
          console.log('Session created event not supported in this SDK version');
        }
        
        avatarRef.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
          if (!isMounted) return;
          console.log('Stream disconnected');
        });
        
        try {
          // Start avatar with basic configuration - trying compatible approaches
          try {
            // Start with various methods - SDK compatibility varies by version
            try {
              // Method 1: Try createStartAvatar with params
              console.log('Attempting to start avatar with param object');
              // Cast to any to bypass type checking since SDK types may vary by version
              const startParams = {
                avatar_id: AVATAR_CONFIG.avatarId,
                voice_id: AVATAR_CONFIG.voiceId
              } as any;
              await avatarRef.current.createStartAvatar(startParams);
            } catch (e) {
              // Method 2: Try createStartAvatar with empty object for SDK compatibility
              console.log('First start method failed, trying alternative method');
              await avatarRef.current.createStartAvatar({} as any);
            }
          } catch (error) {
            console.error('All start methods failed:', error);
            throw error;
          }
          
          if (!isMounted) return;
          console.log('Avatar created and started successfully');
        } catch (err: any) {
          console.error('Failed to create/start avatar:', err);
          if (!isMounted) return;
          throw err;
        }
      } catch (err: any) {
        console.error('Avatar initialization error:', err);
        
        // Log more detailed error information
        const errorDetails = {
          name: err?.name,
          message: err?.message,
          status: err?.status,
          responseText: err?.responseText,
          stack: err?.stack
        };
        console.error('Detailed error information:', errorDetails);
        
        if (!isMounted) {
          return;
        }
        
        // Create a more descriptive error message
        let errorMessage = 'Failed to initialize avatar';
        
        if (err?.status === 401) {
          errorMessage += ': Authentication failed. The API key might be invalid or expired.';
        } else if (err?.message) {
          errorMessage += `: ${err.message}`;
        } else if (err?.responseText) {
          try {
            const responseData = JSON.parse(err.responseText);
            errorMessage += `: ${responseData.message || responseData.error || String(err)}`;
          } catch (e) {
            errorMessage += `: ${err.responseText || String(err)}`;
          }
        } else {
          errorMessage += `: ${String(err)}`;
        }
        
        setError(errorMessage);
        setUsingFallback(true);
        setIsLoading(false);
      }
    };
    
    initializeAvatar();
    
    // Cleanup function
    return () => {
      isMounted = false;
      
      if (avatarRef.current) {
        console.log('Cleaning up avatar on unmount');
        try {
          avatarRef.current.stopAvatar();
        } catch (e) {
          console.error('Error stopping avatar:', e);
        }
        avatarRef.current = null;
      }
    };
  }, [isVisible, isMuted]);
  
  // Handle text changes
  useEffect(() => {
    if (!text || !isVisible || isMuted || !avatarRef.current) return;
    
    const speakWithAvatar = async () => {
      try {
        console.log('Making avatar speak:', text);
        
        // Try to use avatar to speak
        await avatarRef.current!.speak({
          text
        });
        
        return true;
      } catch (err) {
        console.error('Error making avatar speak:', err);
        
        // Log detailed error information
        if (err instanceof Error) {
          console.error('Error details:', {
            name: err.name,
            message: err.message,
            stack: err.stack,
            ...(err as any) // Capture any additional properties
          });
        }
        
        setUsingFallback(true);
        speakWithFallback(text);
        return false;
      }
    };
    
    speakWithAvatar();
  }, [text, isVisible, isMuted]);
  
  // Fallback speech synthesis
  const speakWithFallback = (text: string) => {
    if (!window.speechSynthesis) return;
    
    try {
      // Cancel any existing speech
      window.speechSynthesis.cancel();
      
      console.log('Using fallback speech synthesis');
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Find a good voice
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.includes('Samantha') || 
        voice.name.includes('Female') ||
        (voice.name.toLowerCase().includes('female') && voice.lang.startsWith('en'))
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
        console.log('Using voice:', femaleVoice.name);
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Fallback speech error:', err);
      setIsSpeaking(false);
    }
  };
  
  // Apply mute changes to video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
    
    if (isMuted && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [isMuted]);
  
  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {error ? (
        // Error State with video background
        <div className="w-[300px] h-[300px] rounded-xl overflow-hidden relative">
          {/* Background Video */}
          <video 
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src="https://sixpoint-web-assets.s3.us-east-1.amazonaws.com/summit2025/SQUARE.mp4"
          />
          
          {/* Overlay with error information */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
            <div className="text-red-400 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="text-xs text-white/90 mb-1 font-medium">AI Avatar Unavailable</p>
            <p className="text-[10px] text-white/70 mb-4 max-w-[200px] overflow-hidden text-ellipsis">Using fallback speech synthesis</p>
            
            <button 
              onClick={() => {
                setError(null);
                setIsLoading(true);
                // Force re-mount of the component by toggling a key
                if (avatarRef.current) {
                  try {
                    avatarRef.current.stopAvatar();
                  } catch (e) {
                    console.error('Error stopping avatar during retry:', e);
                  }
                  avatarRef.current = null;
                }
              }}
              className="text-xs bg-blue-500/70 hover:bg-blue-500/90 text-white px-3 py-1 rounded-md transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      ) : isLoading ? (
        // Loading State with video background
        <div className="w-[300px] h-[300px] rounded-xl overflow-hidden relative">
          {/* Background Video */}
          <video 
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src="https://sixpoint-web-assets.s3.us-east-1.amazonaws.com/summit2025/SQUARE.mp4"
          />
          
          {/* Loading overlay */}
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400 mb-3"></div>
            <p className="text-sm text-white/90 font-medium">Loading AI Avatar</p>
            <p className="text-[10px] text-white/70 mt-1">Establishing connection...</p>
          </div>
        </div>
      ) : (
        // Active Avatar State
        <div className="relative">
          {!usingFallback ? (
            <video 
              ref={videoRef}
              id="heygen-video"
              autoPlay
              playsInline
              muted={isMuted}
              className="w-[300px] h-[300px] rounded-xl bg-black/30"
            />
          ) : (
            // Custom video background from S3 bucket when using fallback
            <div className="w-[300px] h-[300px] rounded-xl bg-black/30 overflow-hidden relative">
              <video 
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                src="https://sixpoint-web-assets.s3.us-east-1.amazonaws.com/summit2025/SQUARE.mp4"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                {/* Overlay content for fallback */}
                <div className="w-20 h-20 rounded-full bg-blue-500/40 border-2 border-blue-300/60 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" x2="12" y1="19" y2="22"></line>
                  </svg>
                </div>
              </div>
            </div>
          )}
          
          {/* Speech Animation Overlay */}
          {isSpeaking && !isMuted && (
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
          
          {/* Mute Control */}
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
          
          {/* Status Indicator */}
          <div className="absolute bottom-2 right-2 bg-black/70 rounded-md px-2 py-1 z-20">
            <p className="text-[10px] text-white/80">
              {usingFallback ? 'Speech Synthesis' : 'HeyGen AI'} 
              {isMuted && ' (Muted)'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}