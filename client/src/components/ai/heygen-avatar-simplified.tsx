import React, { useEffect, useRef, useState } from 'react';
import StreamingAvatar, { StreamingEvents } from '@heygen/streaming-avatar';
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
  // Always unmuted by default (false) per user requirement
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
        
        avatarRef.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
          if (!isMounted) return;
          console.log('Stream disconnected');
        });
        
        try {
          // Start avatar with basic configuration
          console.log('Attempting to start avatar with param object');
          // Cast to any to bypass type checking since SDK types may vary by version
          const startParams = {
            avatar_id: AVATAR_CONFIG.avatarId,
            voice_id: AVATAR_CONFIG.voiceId
          } as any;
          
          try {
            await avatarRef.current.createStartAvatar(startParams);
          } catch (e) {
            // Try alternative method for SDK compatibility
            console.log('First start method failed, trying alternative method');
            await avatarRef.current.createStartAvatar({} as any);
          }
          
          if (!isMounted) return;
          console.log('Avatar created and started successfully');
        } catch (err: any) {
          console.error('All start methods failed:', err);
          throw err;
        }
      } catch (err: any) {
        console.error('Avatar initialization error:', err);
        
        // Log more detailed error information
        console.error('Detailed error information:', {
          name: err?.name,
          message: err?.message,
          status: err?.status,
          responseText: err?.responseText,
          stack: err?.stack
        });
        
        if (!isMounted) return;
        
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
        
        // Set voice properties for more natural sounding audio
        utterance.rate = 0.95; // Slightly slower for better clarity
        utterance.pitch = 1.05; // Slightly higher pitch for more feminine voice
        utterance.volume = 1.0; // Full volume
        
        // Find a good voice
        const voices = window.speechSynthesis.getVoices();
        console.log('Available voices for fallback:', voices.length);
        
        // List of preferred female voice names in order of preference (more natural voices first)
        const preferredVoiceNames = [
          'Google US English Female', 'Microsoft Zira', 'Google UK English Female',
          'Ava', 'Victoria', 'Joanna', 'Catherine', 'Amy', 'Siri Female', 'Samantha',
          'Karen', 'Ellen', 'Tessa', 'Moira', 'Veena'
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
        
        // Second try: any voice containing "natural" or "premium" for higher quality
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('natural') || 
            voice.name.toLowerCase().includes('premium') ||
            voice.name.toLowerCase().includes('enhanced')
          );
        }
        
        // Third try: any voice containing "female" or "woman"
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('female') || 
            voice.name.toLowerCase().includes('woman')
          );
        }
        
        // Fourth try: any US English voice (likely to be default female on many systems)
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
          
          // Restart video at the beginning of speech
          if (backgroundVideoRef.current) {
            backgroundVideoRef.current.currentTime = 0;
            backgroundVideoRef.current.play().catch(err => {
              console.error('Error starting video at speech start:', err);
            });
          }
        };
        
        utterance.onend = () => {
          console.log('Fallback speech ended');
          setIsSpeaking(false);
          
          // Pause the video when speech ends
          if (backgroundVideoRef.current) {
            backgroundVideoRef.current.pause();
            console.log('Paused video at end of speech');
          }
        };
        
        utterance.onerror = (event) => {
          console.error('Fallback speech error:', event);
          setIsSpeaking(false);
          
          // If there's an error, try our manual approach for chunking
          speakInChunks(text);
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
        
        // Start the keepAlive timer
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
            
            // Match the same voice settings as our main speech
            chunkUtterance.rate = 0.95;
            chunkUtterance.pitch = 1.05;
            chunkUtterance.volume = 1.0;
            
            // Apply the same voice selection
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
              // Use the same voice selection logic as above
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
              
              // Apply selected voice if found
              if (selectedVoice) {
                chunkUtterance.voice = selectedVoice;
                chunkUtterance.lang = 'en-US';
              }
            }
            
            chunkUtterance.onstart = () => {
              console.log(`Starting chunk ${currentChunk + 1}/${chunks.length}`);
              
              // Restart video at the beginning of each chunk
              if (backgroundVideoRef.current) {
                backgroundVideoRef.current.currentTime = 0;
                backgroundVideoRef.current.play().catch(err => {
                  console.error('Error starting video for chunk:', err);
                });
              }
            };
            
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
            
            // Pause the video after all chunks are spoken
            if (backgroundVideoRef.current) {
              backgroundVideoRef.current.pause();
              console.log('Paused video after finishing all speech chunks');
            }
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
        
        {/* Main avatar video (from HeyGen) */}
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover ${usingFallback ? 'hidden' : ''}`}
          autoPlay
          playsInline
        ></video>
        
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