import { useEffect, useRef, useState } from 'react';
import StreamingAvatar, { AvatarQuality } from '@heygen/streaming-avatar';

// HeyGen API key and avatar configuration
const HEYGEN_API_KEY = 'YzEwZmEyOWJmYjdlNGI0ZWE3MzFiMjUzZWUzMzZiNTQtMTc0NjU4NDc4Nw==';
const AVATAR_NAME = 'Sophie_A1';  // Standard avatar from HeyGen
const VOICE_ID = 'c8e176c17f814004885fd590e03ff99f';  // English female voice

// Interface for component props
interface HeyGenAvatarProps {
  text: string | null;
  isVisible: boolean;
}

export function HeyGenAvatar({ text, isVisible }: HeyGenAvatarProps) {
  // References
  const videoRef = useRef<HTMLVideoElement>(null);
  const avatarRef = useRef<StreamingAvatar | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  
  // States
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Initialize the avatar when component mounts
  useEffect(() => {
    if (!isVisible) return;
    
    const initializeAvatar = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!avatarRef.current) {
          console.log('Initializing StreamingAvatar with API key');
          avatarRef.current = new StreamingAvatar({
            token: HEYGEN_API_KEY,
            el: videoRef.current || undefined, // Use 'el' instead of 'videoElement'
            onError: (err) => {
              console.error('StreamingAvatar error:', err);
              setError(`HeyGen error: ${err.message || 'Unknown error'}`);
              setUsingFallback(true);
            },
            onStatusChange: (status) => {
              console.log('Avatar status changed:', status);
              if (status === 'connected') {
                setIsLoading(false);
              }
            }
          });
        }

        if (!sessionIdRef.current && avatarRef.current) {
          console.log('Starting HeyGen avatar session with', AVATAR_NAME);
          const session = await avatarRef.current.startAvatar({
            avatar_name: AVATAR_NAME,  // Use snake_case for parameter names
            quality: 'high' as AvatarQuality,  // Type assertion to match AvatarQuality
            voice_id: VOICE_ID,
          });
          
          if (session?.session_id) {
            console.log('HeyGen session started successfully:', session.session_id);
            sessionIdRef.current = session.session_id;
            setUsingFallback(false);
            setIsLoading(false);
          } else {
            throw new Error('No session ID returned');
          }
        }
      } catch (err: any) { // Type assertion for error
        console.error('Failed to initialize avatar:', err);
        setError(`Failed to initialize avatar: ${err.message || 'Unknown error'}`);
        setUsingFallback(true);
        setIsLoading(false);
      }
    };
    
    initializeAvatar();
    
    // Cleanup on unmount
    return () => {
      if (sessionIdRef.current && avatarRef.current) {
        console.log('Stopping HeyGen session:', sessionIdRef.current);
        avatarRef.current.stopAvatar(sessionIdRef.current)
          .catch(err => console.error('Error stopping avatar:', err));
        sessionIdRef.current = null;
      }
    };
  }, [isVisible]);
  
  // Function to speak using HeyGen
  const speakWithHeyGen = async (text: string) => {
    if (!sessionIdRef.current || !avatarRef.current) {
      console.error('No active HeyGen session');
      setUsingFallback(true);
      speakWithBrowser(text);
      return;
    }
    
    try {
      setIsSpeaking(true);
      await avatarRef.current.talk({
        session_id: sessionIdRef.current,
        text: text,
      });
      setIsSpeaking(false);
    } catch (err: any) {
      console.error('HeyGen talk error:', err);
      setError(`Failed to talk: ${err.message || 'Unknown error'}`);
      setUsingFallback(true);
      speakWithBrowser(text);
    }
  };
  
  // Text-to-speech fallback using browser's Speech Synthesis API
  const speakWithBrowser = (text: string) => {
    if (!window.speechSynthesis) {
      console.error('Browser speech synthesis not supported');
      return;
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Don't speak if muted
    if (isMuted) {
      console.log('Speech is muted, not speaking');
      return;
    }
    
    try {
      setIsSpeaking(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Try to find a good English female voice
      const voices = window.speechSynthesis.getVoices();
      console.log('Available voices:', voices);
      
      const preferredVoices = [
        'Samantha', // English US female (Apple)
        'Google UK English Female',
        'Microsoft Zira',
        'Karen', // Australian English
        'en-US-female' // Generic
      ];
      
      // Find the first preferred voice that's available
      let selectedVoice = null;
      for (const voiceName of preferredVoices) {
        const voice = voices.find(v => 
          v.name.includes(voiceName) || 
          (v.name.toLowerCase().includes('female') && v.lang.startsWith('en'))
        );
        if (voice) {
          selectedVoice = voice;
          break;
        }
      }
      
      // If no preferred voice found, try any English female voice
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith('en'));
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('Using voice:', selectedVoice.name);
      }
      
      // Set speech parameters
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Log when speech starts and ends
      utterance.onstart = () => {
        console.log('Browser speech started');
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        console.log('Browser speech ended');
        setIsSpeaking(false);
      };
      
      utterance.onerror = (e) => {
        console.error('Browser speech error:', e);
        setIsSpeaking(false);
      };
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Error with browser speech:', err);
      setIsSpeaking(false);
    }
  };
  
  // Apply mute setting to video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
    
    if (isMuted && window.speechSynthesis) {
      // Cancel any ongoing speech when muted
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isMuted]);
  
  // Calculate speech time based on text length
  const calculateSpeechTime = (text: string): number => {
    // Average speaking rate is about 150 words per minute or 2.5 words per second
    const words = text.trim().split(/\s+/).length;
    // Add a buffer for natural pauses and minimum time
    const timeInMs = Math.max(1500, words * 400); 
    
    console.log(`Speaking time: ${timeInMs}ms for ${words} words`);
    return timeInMs;
  };

  // When text changes, speak with the avatar
  useEffect(() => {
    if (!text || text.trim() === '' || !isVisible) return;
    
    // Don't speak if muted
    if (isMuted) {
      console.log('Audio is muted, not speaking');
      return;
    }

    // Calculate speech time
    const speechTime = calculateSpeechTime(text);

    if (!usingFallback && sessionIdRef.current && avatarRef.current) {
      console.log('Using HeyGen avatar for speech');
      speakWithHeyGen(text);
    } else {
      console.log('Using browser speech synthesis fallback');
      setUsingFallback(true);
      speakWithBrowser(text);
    }
  }, [text, isMuted, isVisible]);

  // Function to retry connection
  const handleRetry = () => {
    setError(null);
    setUsingFallback(false);
    sessionIdRef.current = null;
    
    // Force reinitialization
    if (avatarRef.current) {
      avatarRef.current = null;
    }
    
    // Reinitialize
    setIsLoading(true);
  };

  if (!isVisible) {
    return null;
  }

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
            onClick={handleRetry}
            className="text-xs bg-primary-light hover:bg-primary-lighter text-white px-3 py-1 rounded-md transition-colors"
          >
            Retry Connection
          </button>
          
          <p className="text-[10px] text-white/40 mt-2">
            Using fallback voice synthesis
          </p>
        </div>
      ) : isLoading ? (
        <div className="w-[300px] h-[300px] rounded-xl bg-black/30 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mb-2"></div>
          <p className="text-xs text-white/80">Loading AI Avatar...</p>
          <p className="text-[10px] text-white/60 mt-1">Connecting to HeyGen API</p>
        </div>
      ) : (
        <div className="relative">
          {!usingFallback ? (
            <video 
              ref={videoRef}
              autoPlay
              playsInline
              muted={isMuted}
              className="w-[300px] h-[300px] rounded-xl bg-black/30"
              poster="/assets/avatar-placeholder.svg"
            />
          ) : (
            <img 
              src="/assets/avatar-placeholder.svg"
              alt="AI Assistant"
              className="w-[300px] h-[300px] rounded-xl bg-black/30"
            />
          )}
          
          {/* Animated overlay for speech */}
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
          
          {/* Status label */}
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