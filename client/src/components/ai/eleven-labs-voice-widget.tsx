import React, { useEffect, useRef, useState } from 'react';
import './voice-widget.css';

interface ElevenLabsVoiceWidgetProps {
  text: string | null;
  isVisible: boolean;
}

/**
 * Integrates the Eleven Labs voice widget using their recommended approach
 * Based on: https://elevenlabs.io/docs/conversational-ai/libraries/react
 */
export function ElevenLabsVoiceWidget({ text, isVisible }: ElevenLabsVoiceWidgetProps) {
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<HTMLDivElement>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Ensure the script is loaded
  useEffect(() => {
    if (!isVisible) return;
    
    // Add the Eleven Labs script if it doesn't exist
    if (!document.getElementById('elevenlabs-widget-script')) {
      const script = document.createElement('script');
      script.src = 'https://widget.elevenlabs.io/widget.js';
      script.id = 'elevenlabs-widget-script';
      script.async = true;
      
      script.onload = () => {
        console.log('Eleven Labs widget script loaded');
        setWidgetLoaded(true);
        
        // Initialize the widget once the script is loaded
        if (window.ElevenLabsWidget) {
          try {
            window.ElevenLabsWidget.init({
              voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel voice
              elementId: 'elevenlabs-voice-widget',
              autoPlay: false,
              visemePlayback: true
            });
            console.log('Eleven Labs widget initialized');
          } catch (error) {
            console.error('Error initializing Eleven Labs widget:', error);
          }
        } else {
          console.error('ElevenLabsWidget not found on window');
        }
      };
      
      script.onerror = (error) => {
        console.error('Error loading Eleven Labs widget script:', error);
      };
      
      document.body.appendChild(script);
    }
    
    return () => {
      // No need to remove the script on component unmount
    };
  }, [isVisible]);
  
  // Handle speaking when text changes
  useEffect(() => {
    if (!text || !isVisible || !widgetLoaded) return;
    
    // Speak the text using Eleven Labs
    try {
      console.log('Speaking with Eleven Labs:', text);
      setIsSpeaking(true);
      
      if (window.ElevenLabsWidget) {
        window.ElevenLabsWidget.playText(text);
        
        // Listen for voice events
        const handleStart = () => {
          console.log('Eleven Labs voice started');
          setIsSpeaking(true);
          
          // Animate the visualization
          if (animationRef.current) {
            animationRef.current.classList.add('speaking');
          }
        };
        
        const handleEnd = () => {
          console.log('Eleven Labs voice ended');
          setIsSpeaking(false);
          
          // Stop animation
          if (animationRef.current) {
            animationRef.current.classList.remove('speaking');
          }
        };
        
        window.ElevenLabsWidget.addEventListener('onPlayStart', handleStart);
        window.ElevenLabsWidget.addEventListener('onPlayEnd', handleEnd);
        
        return () => {
          if (window.ElevenLabsWidget) {
            window.ElevenLabsWidget.removeEventListener('onPlayStart', handleStart);
            window.ElevenLabsWidget.removeEventListener('onPlayEnd', handleEnd);
          }
        };
      } else {
        console.error('ElevenLabsWidget not available');
        
        // Fallback: Use animation with timing based on text length
        setIsSpeaking(true);
        const words = text.split(/\s+/).length;
        const speakingTimeMs = Math.max(2000, words * 200);
        
        const timer = setTimeout(() => {
          setIsSpeaking(false);
        }, speakingTimeMs);
        
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Error using Eleven Labs voice:', error);
      setIsSpeaking(false);
    }
  }, [text, isVisible, widgetLoaded]);
  
  if (!isVisible) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Voice Widget - This will be connected to the Eleven Labs API */}
      <div className="w-full min-h-[180px] relative">
        {/* Container for the Eleven Labs widget */}
        <div
          id="elevenlabs-voice-widget"
          ref={containerRef}
          className="w-full rounded-xl overflow-hidden bg-gradient-to-b from-gray-800 to-gray-950 flex items-center justify-center relative"
          style={{ height: '200px' }}
        >
          {/* Custom voice visualization */}
          <div 
            ref={animationRef}
            className={`voice-visualization ${isSpeaking ? 'speaking' : ''}`}
          >
            <div className="w-[200px] h-[100px] flex items-center justify-center">
              <div className="flex items-end space-x-1">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className={`voice-bar bg-primary w-[6px] rounded-t-full transition-all duration-100`}
                    style={{
                      height: isSpeaking ? `${Math.random() * 60 + 10}px` : '10px',
                      animationDelay: `${i * 0.05}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Display the text below */}
      {text && (
        <div className="mt-2 p-3 bg-gray-900 rounded-lg w-full">
          <p className="text-sm text-gray-200 text-center">{text}</p>
        </div>
      )}
      
      <style jsx>{`
        @keyframes voice-animation {
          0% { height: 10px; }
          50% { height: var(--random-height); }
          100% { height: 10px; }
        }
        
        .voice-bar {
          --random-height: 10px;
          transition: height 0.2s ease;
        }
        
        .speaking .voice-bar {
          animation: voice-animation 0.8s infinite;
        }
      `}</style>
    </div>
  );
}

// Add window.ElevenLabsWidget type definition
declare global {
  interface Window {
    ElevenLabsWidget?: {
      init: (options: {
        voiceId: string;
        elementId: string;
        autoPlay?: boolean;
        visemePlayback?: boolean;
      }) => void;
      playText: (text: string) => void;
      addEventListener: (event: string, handler: () => void) => void;
      removeEventListener: (event: string, handler: () => void) => void;
    };
  }
}