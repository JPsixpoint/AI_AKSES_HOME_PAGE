import React, { useEffect, useState } from 'react';
import './animation.css';

// Interface for component props
interface TextOnlyAvatarProps {
  text: string | null;
  isVisible: boolean;
}

/**
 * Simple text-only avatar component without video or external API integration
 */
export function TextOnlyAvatar({ text, isVisible }: TextOnlyAvatarProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Handle text changes for speech animation
  useEffect(() => {
    if (!text || !isVisible) return;
    
    // Mark as speaking when there's text
    setIsSpeaking(true);
    
    // Reset after a delay based on text length
    const words = text.split(/\s+/).length;
    const speakingTimeMs = Math.max(4000, words * 400); // Min 4 seconds, then 400ms per word
    
    const timer = setTimeout(() => {
      setIsSpeaking(false);
    }, speakingTimeMs);
    
    return () => clearTimeout(timer);
  }, [text, isVisible]);

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-[300px] h-[180px] rounded-xl overflow-hidden bg-gradient-to-b from-gray-800 to-gray-950 flex items-center justify-center">
        {/* Simple animated avatar placeholder */}
        <div className={`h-20 w-20 rounded-full bg-primary ${isSpeaking ? 'animate-pulse' : ''} flex items-center justify-center`}>
          <div className="relative h-6 w-10">
            {isSpeaking ? (
              <>
                <div className="absolute inset-0 flex justify-between">
                  <div className="w-[3px] h-full bg-white animate-sound-wave"></div>
                  <div className="w-[3px] h-full bg-white animate-sound-wave delay-75"></div>
                  <div className="w-[3px] h-full bg-white animate-sound-wave delay-100"></div>
                  <div className="w-[3px] h-full bg-white animate-sound-wave delay-150"></div>
                  <div className="w-[3px] h-full bg-white animate-sound-wave delay-75"></div>
                </div>
              </>
            ) : (
              <div className="h-[3px] w-full bg-white"></div>
            )}
          </div>
        </div>
      </div>
      
      {/* Display the text below */}
      {text && (
        <div className="mt-2 p-3 bg-gray-900 rounded-lg w-full">
          <p className="text-sm text-gray-200 text-center">{text}</p>
        </div>
      )}
    </div>
  );
}