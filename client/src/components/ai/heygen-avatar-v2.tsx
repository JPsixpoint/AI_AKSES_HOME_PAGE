import React, { useEffect, useRef, useState } from 'react';
import {
  Room,
  RoomEvent,
  RemoteParticipant,
  RemoteTrackPublication,
  RemoteTrack,
  Track,
  ConnectionState,
  RoomOptions,
  VideoPresets,
  RemoteVideoTrack,
  createLocalVideoTrack,
  RemoteAudioTrack,
} from 'livekit-client';

// Interface for component props
interface HeyGenAvatarV2Props {
  text: string | null;
  isVisible: boolean;
}

// HeyGen API configuration
const HEYGEN_API_KEY = 'YzEwZmEyOWJmYjdlNGI0ZWE3MzFiMjUzZWUzMzZiNTQtMTc0NjU4NDc4Nw==';
const AVATAR_ID = 'Sophie_A1';
const VOICE_ID = 'c8e176c17f814004885fd590e03ff99f';

export function HeyGenAvatarV2({ text, isVisible }: HeyGenAvatarV2Props) {
  // References
  const videoRef = useRef<HTMLVideoElement>(null);
  const roomRef = useRef<Room | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  
  // States for UI rendering
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [usingFallback, setUsingFallback] = useState(true);
  
  // Initialize LiveKit room and connect to HeyGen streaming
  useEffect(() => {
    if (!isVisible) return;
    
    const initializeAvatar = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const apiUrl = 'https://api.heygen.com/v1/streaming/room';
        
        // Step 1: Create a session via API
        console.log('Creating HeyGen streaming session...');
        const sessionResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': HEYGEN_API_KEY,
          },
          body: JSON.stringify({
            avatar_id: AVATAR_ID,
            voice_id: VOICE_ID,
          }),
        });
        
        if (!sessionResponse.ok) {
          const errorData = await sessionResponse.json();
          throw new Error(`Failed to create session: ${errorData.message || sessionResponse.statusText}`);
        }
        
        const sessionData = await sessionResponse.json();
        console.log('Session created:', sessionData);
        
        if (!sessionData.data || !sessionData.data.session_id || !sessionData.data.room_token) {
          throw new Error('Invalid session data returned from HeyGen API');
        }
        
        // Store session ID for later use
        sessionIdRef.current = sessionData.data.session_id;
        
        // Step 2: Connect to LiveKit room with the token
        const roomOptions: RoomOptions = {
          adaptiveStream: true,
          dynacast: true,
          videoCaptureDefaults: {
            resolution: VideoPresets.h720.resolution,
          },
        };
        
        // Create and configure room
        const room = new Room(roomOptions);
        roomRef.current = room;
        
        // Set up room event handlers
        room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
        room.on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);
        room.on(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
        
        // Connect to LiveKit room
        console.log('Connecting to LiveKit room...');
        await room.connect('wss://streaming.heygen.com', sessionData.data.room_token);
        console.log('Connected to LiveKit room');
        
        setIsConnected(true);
        setIsLoading(false);
        setUsingFallback(false);
      } catch (err: any) {
        console.error('Failed to initialize avatar:', err);
        const errorMessage = err.message || "Unknown error occurred";
        setError(`Failed to initialize HeyGen avatar: ${errorMessage}`);
        setUsingFallback(true);
        setIsLoading(false);
      }
    };
    
    initializeAvatar();
    
    // Cleanup on unmount
    return () => {
      if (roomRef.current) {
        console.log('Disconnecting from LiveKit room');
        roomRef.current.disconnect();
        roomRef.current = null;
      }
      
      if (sessionIdRef.current) {
        // Clean up session (can be done via API if needed)
        console.log('Cleaning up HeyGen session');
        sessionIdRef.current = null;
      }
    };
  }, [isVisible]);
  
  // Handle LiveKit room events
  const handleTrackSubscribed = (
    track: RemoteTrack,
    publication: RemoteTrackPublication,
    participant: RemoteParticipant
  ) => {
    console.log('Track subscribed:', track.kind);
    
    if (track.kind === Track.Kind.Video && videoRef.current) {
      const videoTrack = track as RemoteVideoTrack;
      videoTrack.attach(videoRef.current);
      console.log('Video track attached to element');
    }
    
    if (track.kind === Track.Kind.Audio) {
      const audioTrack = track as RemoteAudioTrack;
      audioTrack.attach();
      console.log('Audio track attached');
    }
  };
  
  const handleTrackUnsubscribed = (
    track: RemoteTrack,
    publication: RemoteTrackPublication,
    participant: RemoteParticipant
  ) => {
    console.log('Track unsubscribed:', track.kind);
    
    if (track.kind === Track.Kind.Video) {
      track.detach();
    }
    
    if (track.kind === Track.Kind.Audio) {
      track.detach();
    }
  };
  
  const handleConnectionStateChanged = (state: ConnectionState) => {
    console.log('Connection state changed:', state);
    
    if (state === ConnectionState.Connected) {
      setIsConnected(true);
      setIsLoading(false);
    } else if (state === ConnectionState.Disconnected) {
      setIsConnected(false);
    }
  };
  
  // Function to make avatar speak using HeyGen API
  const speakWithHeyGen = async (text: string) => {
    if (!sessionIdRef.current || !isConnected) {
      console.error('No active HeyGen session or not connected');
      setUsingFallback(true);
      speakWithBrowser(text);
      return;
    }
    
    try {
      setIsSpeaking(true);
      
      const talkResponse = await fetch('https://api.heygen.com/v1/streaming/talk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': HEYGEN_API_KEY,
        },
        body: JSON.stringify({
          session_id: sessionIdRef.current,
          text: text,
          mode: 'sync'  // Use sync mode to wait for completion
        }),
      });
      
      if (!talkResponse.ok) {
        const errorData = await talkResponse.json();
        throw new Error(`Failed to talk: ${errorData.message || talkResponse.statusText}`);
      }
      
      const talkData = await talkResponse.json();
      console.log('Talk response:', talkData);
      
      // Wait for animation to complete
      setTimeout(() => {
        setIsSpeaking(false);
      }, calculateSpeechTime(text));
      
    } catch (err: any) {
      console.error('Failed to speak with HeyGen:', err);
      const errorMessage = err.message || "Unknown error occurred";
      setError(`Failed to speak: ${errorMessage}`);
      setUsingFallback(true);
      speakWithBrowser(text);
    }
  };
  
  // Fallback speech synthesis using browser API
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
      console.log('Available voices:', voices.length);
      
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
        console.log('Using voice:', selectedVoice.name, selectedVoice.lang);
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
  
  // Apply mute/unmute to video element
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
  
  // Calculate speech duration based on text length
  const calculateSpeechTime = (text: string): number => {
    // Average speaking rate is about 150 words per minute or 2.5 words per second
    const words = text.trim().split(/\s+/).length;
    // Add a buffer for natural pauses and minimum time
    const timeInMs = Math.max(1500, words * 400); 
    
    console.log(`Speaking time: ${timeInMs}ms for ${words} words`);
    return timeInMs;
  };

  // When text changes, make the avatar speak
  useEffect(() => {
    if (!text || text.trim() === '' || !isVisible) return;
    
    // Don't speak if muted
    if (isMuted) {
      console.log('Audio is muted, not speaking');
      return;
    }

    if (!usingFallback && isConnected && sessionIdRef.current) {
      console.log('Using HeyGen avatar for speech');
      speakWithHeyGen(text);
    } else {
      console.log('Using browser speech synthesis fallback');
      setUsingFallback(true);
      speakWithBrowser(text);
    }
  }, [text, isMuted, isVisible, isConnected, usingFallback]);

  // Function to retry connection
  const handleRetry = () => {
    setError(null);
    setUsingFallback(false);
    setIsConnected(false);
    sessionIdRef.current = null;
    
    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
    }
    
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
          {!usingFallback && isConnected ? (
            <video 
              ref={videoRef}
              autoPlay
              playsInline
              muted={isMuted}
              className="w-[300px] h-[300px] rounded-xl bg-black/30"
            />
          ) : (
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