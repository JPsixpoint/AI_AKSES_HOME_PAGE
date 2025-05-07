import { useEffect, useRef, useState } from 'react';

// Using the API key provided by the user
const HEYGEN_API_KEY = 'YzEwZmEyOWJmYjdlNGI0ZWE3MzFiMjUzZWUzMzZiNTQtMTc0NjU4NDc4Nw==';
const AVATAR_ID = 'Sophie_public';
const VOICE_ID = 'c8e176c17f814004885fd590e03ff99f';

// Fallback speech synthesis
const useFallbackSpeech = true; // Set to true to use browser speech synthesis when HeyGen fails

interface HeyGenSession {
  session_id: string;
  token: string;
  ws_url: string;
}

interface HeyGenAvatarProps {
  text: string | null;
  isVisible: boolean;
}

export function HeyGenAvatar({ text, isVisible }: HeyGenAvatarProps) {
  const [session, setSession] = useState<HeyGenSession | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Create HeyGen session
  const createHeyGenSession = async (): Promise<HeyGenSession> => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Creating HeyGen session with API key:', HEYGEN_API_KEY.substring(0, 5) + '...');
      
      const res = await fetch('https://api.heygen.com/v1/streaming.new', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HEYGEN_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quality: 'high',
          avatar_id: AVATAR_ID,
          voice: {
            voice_id: VOICE_ID,
            rate: 1.0,
            emotion: 'Friendly'
          },
          disable_idle_timeout: true
        })
      });
      
      // Log the raw response for debugging
      const responseText = await res.text();
      console.log('HeyGen API response:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse HeyGen API response:', e);
        setError('Invalid response from HeyGen API');
        setIsLoading(false);
        throw new Error('Invalid response from HeyGen API');
      }
      
      setIsLoading(false);
      
      if (data.data && data.data.session_id && data.data.token && data.data.ws_url) {
        console.log('HeyGen session created successfully:', data.data.session_id);
        return data.data;
      } else {
        const errorMsg = data.error?.message || 'Failed to create HeyGen session';
        console.error('HeyGen API error:', errorMsg);
        setError(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      setIsLoading(false);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error creating HeyGen session';
      console.error('Error creating HeyGen session:', errorMsg);
      setError(errorMsg);
      throw error;
    }
  };

  // Send text to avatar to speak
  const speakWithHeyGen = async (session_id: string, token: string, speakText: string) => {
    try {
      await fetch('https://api.heygen.com/v1/streaming.task', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id,
          text: speakText,
          task_type: 'repeat',
          task_mode: 'sync'
        })
      });
    } catch (error) {
      console.error('Error speaking with HeyGen:', error);
    }
  };

  // Initialize session and attach video stream
  useEffect(() => {
    if (isVisible && !isInitialized) {
      const init = async () => {
        try {
          const newSession = await createHeyGenSession();
          setSession(newSession);
          setIsInitialized(true);
          setError(null);
          
          // Attach WebSocket
          if (newSession.ws_url) {
            const socket = new WebSocket(newSession.ws_url);
            socketRef.current = socket;
            
            socket.onmessage = (event) => {
              try {
                const msg = JSON.parse(event.data);
                if (msg.event === 'stream' && videoRef.current) {
                  const streamUrl = msg.data?.url;
                  if (streamUrl) {
                    videoRef.current.src = streamUrl;
                    videoRef.current.play().catch(e => {
                      console.error('Video play error:', e);
                      setError(`Could not play video: ${e.message}`);
                    });
                  }
                } else if (msg.event === 'error') {
                  console.error('WebSocket stream error:', msg.data);
                  setError(`Stream error: ${msg.data?.message || 'Unknown error'}`);
                }
              } catch (e) {
                console.error('Error parsing WebSocket message:', e);
              }
            };
            
            socket.onopen = () => {
              console.log('WebSocket connected');
            };
            
            socket.onerror = (error) => {
              console.error('WebSocket error:', error);
              setError('Connection to avatar stream failed');
            };
            
            socket.onclose = (event) => {
              console.log('WebSocket closed with code:', event.code);
              // Don't set error on normal closure (code 1000)
              if (event.code !== 1000) {
                setError(`Connection closed: ${event.reason || 'Unknown reason'}`);
              }
            };
          } else {
            setError('No WebSocket URL provided by HeyGen API');
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error initializing avatar';
          console.error('Error initializing HeyGen:', errorMsg);
          setError(errorMsg);
          setIsInitialized(false); // Allow retrying
        }
      };
      
      init();
    }
    
    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [isVisible, isInitialized]);

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
    utterance.onstart = () => console.log('Browser speech started');
    utterance.onend = () => console.log('Browser speech ended');
    utterance.onerror = (e) => console.error('Browser speech error:', e);
    
    // Start speaking
    window.speechSynthesis.speak(utterance);
  };
  
  // Mute/unmute browser speech
  useEffect(() => {
    if (isMuted) {
      // Cancel any ongoing speech when muted
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isMuted]);

  // When text changes, speak with the avatar or fallback to browser speech
  // Track if we're using fallback speech
  const [usingFallback, setUsingFallback] = useState<boolean>(false);
  
  // Apply mute setting to video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);
  
  useEffect(() => {
    if (!text || text.trim() === '') return;
    
    // Don't speak if muted
    if (isMuted) {
      console.log('Audio is muted, not speaking');
      return;
    }

    if (session && !error) {
      // Use HeyGen if session is available and no errors
      setUsingFallback(false);
      speakWithHeyGen(session.session_id, session.token, text);
    } else if (useFallbackSpeech) {
      // Fallback to browser's speech synthesis
      setUsingFallback(true);
      console.log('Using browser speech synthesis fallback');
      speakWithBrowser(text);
    }
  }, [text, session, error, isMuted]);

  // Function to retry connection
  const handleRetry = () => {
    setIsInitialized(false);
    setError(null);
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
          <video 
            ref={videoRef}
            autoPlay
            muted={isMuted}
            className="w-[300px] h-[300px] rounded-xl bg-black/30"
            poster="/assets/avatar-placeholder.svg"
          />
          
          {/* Animated overlay for fallback speech */}
          {usingFallback && text && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/50 rounded-xl"></div>
              <div className="z-10 flex flex-col items-center justify-center">
                <div className="flex space-x-1 mb-3">
                  <div className="w-2 h-8 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-8 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '200ms'}}></div>
                  <div className="w-2 h-8 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '400ms'}}></div>
                  <div className="w-2 h-8 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '600ms'}}></div>
                  <div className="w-2 h-8 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '800ms'}}></div>
                </div>
                <p className="text-white text-xs">Browser Speech Synthesis</p>
              </div>
            </div>
          )}
          
          {/* Audio controls */}
          <div className="absolute top-2 right-2">
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
          <div className="absolute bottom-2 right-2 bg-black/70 rounded-md px-2 py-1">
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