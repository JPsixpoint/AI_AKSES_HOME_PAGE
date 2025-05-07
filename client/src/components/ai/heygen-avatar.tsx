import { useEffect, useRef, useState } from 'react';

// Using the API key provided by the user
const HEYGEN_API_KEY = 'YzEwZmEyOWJmYjdlNGI0ZWE3MzFiMjUzZWUzMzZiNTQtMTc0NjU4NDc4Nw==';
const AVATAR_ID = 'Sophie_public';
const VOICE_ID = 'c8e176c17f814004885fd590e03ff99f';

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

  // Create HeyGen session
  const createHeyGenSession = async (): Promise<HeyGenSession> => {
    try {
      setIsLoading(true);
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
      
      const data = await res.json();
      setIsLoading(false);
      
      if (data.data) {
        return data.data;
      } else {
        throw new Error('Failed to create HeyGen session');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error creating HeyGen session:', error);
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
          
          // Attach WebSocket
          if (newSession.ws_url) {
            const socket = new WebSocket(newSession.ws_url);
            socketRef.current = socket;
            
            socket.onmessage = (event) => {
              const msg = JSON.parse(event.data);
              if (msg.event === 'stream' && videoRef.current) {
                const streamUrl = msg.data?.url;
                if (streamUrl) {
                  videoRef.current.src = streamUrl;
                  videoRef.current.play().catch(e => console.error('Video play error:', e));
                }
              }
            };
            
            socket.onopen = () => {
              console.log('WebSocket connected');
            };
            
            socket.onerror = (error) => {
              console.error('WebSocket error:', error);
            };
            
            socket.onclose = () => {
              console.log('WebSocket closed');
            };
          }
        } catch (error) {
          console.error('Error initializing HeyGen:', error);
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

  // When text changes, speak with the avatar
  useEffect(() => {
    if (session && text && text.trim() !== '') {
      speakWithHeyGen(session.session_id, session.token, text);
    }
  }, [text, session]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {isLoading ? (
        <div className="w-[300px] h-[300px] rounded-xl bg-black/30 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
        </div>
      ) : (
        <video 
          ref={videoRef}
          autoPlay
          muted={false}
          className="w-[300px] h-[300px] rounded-xl bg-black/30"
        />
      )}
    </div>
  );
}