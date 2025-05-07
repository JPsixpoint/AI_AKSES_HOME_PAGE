import { useEffect, useRef, useState } from 'react';

// Interface for component props
interface HeyGenAvatarProps {
  text: string | null;
  isVisible: boolean;
}

export function HeyGenAvatar({ text, isVisible }: HeyGenAvatarProps) {
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Text-to-speech using browser's Speech Synthesis API
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
  
  // Mute/unmute browser speech
  useEffect(() => {
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

  // When text changes, speak with browser speech
  useEffect(() => {
    if (!text || text.trim() === '') return;
    
    // Don't speak if muted
    if (isMuted) {
      console.log('Audio is muted, not speaking');
      return;
    }

    // Calculate speech time
    const speechTime = calculateSpeechTime(text);

    // Use browser speech synthesis
    console.log('Using browser speech synthesis');
    speakWithBrowser(text);
    setIsSpeaking(true);
  }, [text, isMuted]);

  if (!isVisible) {
    return null;
  }

  // Calculate speech time based on text length for animation
  const speechTimeSeconds = text ? Math.max(3, Math.ceil(text.split(' ').length * 0.4)) : 0;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
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
        
        {/* Animated overlay for speech */}
        {isSpeaking && !isMuted && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 rounded-xl"></div>
            <div className="z-10 flex flex-col items-center justify-center">
              <div className="flex space-x-1 mb-3">
                <div className="w-2 h-8 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-8 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '200ms'}}></div>
                <div className="w-2 h-8 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '400ms'}}></div>
                <div className="w-2 h-8 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '600ms'}}></div>
                <div className="w-2 h-8 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '800ms'}}></div>
              </div>
              <p className="text-white text-xs">AI Speech Synthesis</p>
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
            AI Speech Synthesis
            {isMuted && ' (Muted)'}
          </p>
        </div>
      </div>
    </div>
  );
}