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
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  
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
          console.log('Avatar configuration obtained successfully:', {
            token: config.token ? `${config.token.substring(0, 5)}...${config.token.slice(-5)} (length: ${config.token.length})` : 'Missing',
            basePath: config.basePath || 'default'
          });
          
          // Create a new avatar instance with configuration from server
          avatarInstance = new StreamingAvatar(config);
          console.log('StreamingAvatar instance created successfully');
          
          // Log avatar configuration and continue with initialization
          console.log('StreamingAvatar instance created with configuration.');
          
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
    if (!text || !isVisible || isMuted) return;
    
    // Since we're having issues with the HeyGen API, let's directly use the fallback speech synthesis
    setUsingFallback(true);
    speakWithFallback(text);
    
    // This commented code is the original attempt to use HeyGen Avatar
    /*
    // Only attempt HeyGen speaking if we have an avatar reference
    if (avatarRef.current) {
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
    } else {
      setUsingFallback(true);
      speakWithFallback(text);
    }
    */
  }, [text, isVisible, isMuted]);
  
  // Fallback speech synthesis
  const speakWithFallback = (text: string) => {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported by this browser');
      return;
    }
    
    try {
      // Cancel any existing speech
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.error('Error canceling previous speech:', e);
      }
      
      console.log('Using fallback speech synthesis for text:', text);
      
      // First attempt - standard speech synthesis
      const trySpeechSynthesis = () => {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice properties for better audio
        utterance.rate = 1.0; // Normal speed
        utterance.pitch = 1.0; // Normal pitch
        utterance.volume = 1.0; // Full volume
        
        // Find a good voice
        const voices = window.speechSynthesis.getVoices();
        console.log('Available voices for fallback:', voices.length);
        
        // List of preferred female voice names in order of preference
        const preferredVoiceNames = [
          'Samantha', 'Google US English Female', 'Microsoft Zira',
          'Karen', 'Victoria', 'Ellen', 'Tessa', 'Moira', 'Samantha', 'Veena'
        ];
        
        // First try: exact match from our priority list
        let selectedVoice = null;
        for (const name of preferredVoiceNames) {
          const match = voices.find(voice => voice.name === name);
          if (match) {
            selectedVoice = match;
            break;
          }
        }
        
        // Second try: any voice containing "female" or "woman"
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('female') || 
            voice.name.toLowerCase().includes('woman')
          );
        }
        
        // Third try: any US English voice (likely to be default female on many systems)
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.lang === 'en-US' || voice.lang === 'en_US'
          );
        }
        
        // Last resort: any available voice
        if (!selectedVoice && voices.length > 0) {
          selectedVoice = voices[0];
        }
        
        // Set the selected voice
        if (selectedVoice) {
          console.log('Using fallback voice:', selectedVoice.name, selectedVoice.lang);
          utterance.voice = selectedVoice;
          utterance.lang = 'en-US'; // Ensure US English pronunciation
        } else {
          console.warn('No voices available for speech synthesis');
        }
        
        // Set event handlers for proper UI updates
        utterance.onstart = () => {
          console.log('Fallback speech started');
          setIsSpeaking(true);
        };
        
        utterance.onend = () => {
          console.log('Fallback speech ended');
          setIsSpeaking(false);
        };
        
        utterance.onerror = (event) => {
          console.error('Fallback speech error:', event);
          setIsSpeaking(false);
          
          // If there's an error, try our manual approach for chunking
          try {
            speakInChunks(text);
          } catch (chunkedError) {
            console.error('Even chunked speech failed:', chunkedError);
          }
        };
        
        // Speak the text
        window.speechSynthesis.speak(utterance);
        
        // On some browsers, speech can get cut off, so we'll keep the synthesis active
        const keepAlive = () => {
          try {
            if (window.speechSynthesis.speaking) {
              console.log('Speech still in progress, keeping alive...');
              window.speechSynthesis.pause();
              window.speechSynthesis.resume();
              setTimeout(keepAlive, 5000);
            }
          } catch (e) {
            console.error('Error in speech synthesis keepAlive:', e);
          }
        };
        
        // Start the keepAlive timer regardless - if there's no speech it will just not continue
        setTimeout(keepAlive, 2000);
      };
      
      // Alternative method - break text into chunks for more reliable playback
      const speakInChunks = (fullText: string) => {
        console.log('Using chunked speech synthesis approach');
        setIsSpeaking(true);
        
        // Split text into sentences or smaller chunks
        const chunks = fullText.match(/[^.!?]+[.!?]+|\s+/g) || [fullText];
        let currentChunk = 0;
        
        const speakNextChunk = () => {
          if (currentChunk < chunks.length) {
            const chunk = chunks[currentChunk];
            console.log(`Speaking chunk ${currentChunk + 1}/${chunks.length}: ${chunk}`);
            
            const chunkUtterance = new SpeechSynthesisUtterance(chunk);
            
            // Use default voice settings for simplicity
            chunkUtterance.onend = () => {
              currentChunk++;
              speakNextChunk();
            };
            
            chunkUtterance.onerror = () => {
              console.error(`Error speaking chunk ${currentChunk + 1}`);
              currentChunk++;
              speakNextChunk();
            };
            
            window.speechSynthesis.speak(chunkUtterance);
          } else {
            console.log('Finished speaking all chunks');
            setIsSpeaking(false);
          }
        };
        
        speakNextChunk();
      };
      
      // Try the standard method first
      trySpeechSynthesis();
      
    } catch (err) {
      console.error('Fallback speech error:', err);
      setIsSpeaking(false);
      
      // Set up animation anyway to show that we're processing
      setTimeout(() => {
        setIsSpeaking(false);
      }, text.length * 100); // Rough estimate of reading time
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
  
  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-[300px] h-[300px] rounded-xl overflow-hidden">
        {/* Background Video - Always present across all states */}
        <video 
          ref={backgroundVideoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="https://sixpoint-web-assets.s3.us-east-1.amazonaws.com/summit2025/SQUARE.mp4"
        />
        
        {/* HeyGen Avatar Video - Only shown when active and not using fallback */}
        {!isLoading && !error && !usingFallback && (
          <video 
            ref={videoRef}
            id="heygen-video"
            autoPlay
            playsInline
            muted={isMuted}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        {/* Error state - Only show retry button on hover */}
        {error && (
          <div className="absolute bottom-2 right-2 opacity-0 hover:opacity-100 transition-opacity duration-300 z-10">
            <button 
              onClick={() => {
                setError(null);
                setIsLoading(true);
                if (avatarRef.current) {
                  try {
                    avatarRef.current.stopAvatar();
                  } catch (e) {
                    console.error('Error stopping avatar during retry:', e);
                  }
                  avatarRef.current = null;
                }
              }}
              className="text-[10px] bg-black/50 hover:bg-black/70 text-white px-2 py-1 rounded-sm transition-colors"
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Loading state - Just a subtle indicator */}
        {isLoading && (
          <div className="absolute bottom-2 left-2 z-10">
            <div className="animate-pulse w-3 h-3 rounded-full bg-blue-500/30"></div>
          </div>
        )}
        
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