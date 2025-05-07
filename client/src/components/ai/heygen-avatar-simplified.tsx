import React, { useEffect, useRef, useState } from 'react';

// Interface for component props
interface HeyGenAvatarSimplifiedProps {
  text: string | null;
  isVisible: boolean;
}

/**
 * Simplified Avatar component without HeyGen integration
 * Uses a background video and speech visualization for audio feedback
 */
export function HeyGenAvatarSimplified({ text, isVisible }: HeyGenAvatarSimplifiedProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  
  // Update speaking state based on text prop
  useEffect(() => {
    if (text && isVisible) {
      setIsSpeaking(true);
      
      // Estimate speech duration based on text length
      const wordCount = text.split(' ').length;
      const estimatedDuration = Math.max(2000, wordCount * 200); // ~200ms per word, minimum 2s
      
      // Auto-reset speaking state after estimated duration
      const timer = setTimeout(() => {
        setIsSpeaking(false);
      }, estimatedDuration);
      
      return () => clearTimeout(timer);
    } else {
      setIsSpeaking(false);
    }
  }, [text, isVisible]);
  
  // Handle background video
  useEffect(() => {
    const videoElement = backgroundVideoRef.current;
    if (!videoElement) return;
    
    // Set video properties
    videoElement.muted = true;
    videoElement.loop = true;
    videoElement.playsInline = true;
    
    // Play/pause based on visibility
    if (isVisible) {
      videoElement.play().catch(err => {
        console.error('Error playing background video:', err);
      });
    } else {
      videoElement.pause();
    }
    
    return () => {
      videoElement.pause();
    };
  }, [isVisible]);
  
  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div className="w-full h-[120px] relative rounded-xl overflow-hidden bg-gradient-to-b from-dark-surface to-dark-surface-2">
      {/* Background Video */}
      <video 
        ref={backgroundVideoRef}
        className="w-full h-full object-cover opacity-60"
        src="https://sixpoint-web-assets.s3.us-east-1.amazonaws.com/summit2025/SQUARE.mp4"
      />
      
      {/* Visual Speaking Feedback */}
      {isSpeaking && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center space-x-1 mb-2">
            <div className="w-1 h-8 bg-primary-light rounded-full animate-pulse" style={{animationDelay: '0ms'}}></div>
            <div className="w-1 h-10 bg-primary-light rounded-full animate-pulse" style={{animationDelay: '200ms'}}></div>
            <div className="w-1 h-12 bg-primary-light rounded-full animate-pulse" style={{animationDelay: '300ms'}}></div>
            <div className="w-1 h-16 bg-primary-light rounded-full animate-pulse" style={{animationDelay: '100ms'}}></div>
            <div className="w-1 h-12 bg-primary-light rounded-full animate-pulse" style={{animationDelay: '300ms'}}></div>
            <div className="w-1 h-10 bg-primary-light rounded-full animate-pulse" style={{animationDelay: '200ms'}}></div>
            <div className="w-1 h-8 bg-primary-light rounded-full animate-pulse" style={{animationDelay: '0ms'}}></div>
          </div>
        </div>
      )}
      
      {/* Display current text being spoken */}
      {text && (
        <div className="absolute bottom-2 left-2 right-2 bg-dark-surface bg-opacity-80 p-2 rounded text-xs">
          <div className="flex items-center mb-1">
            {isSpeaking && (
              <div className="w-2 h-2 rounded-full bg-primary-light mr-2 animate-pulse"></div>
            )}
            <span className="font-medium text-primary-light text-[10px]">
              {isSpeaking ? "Speaking..." : "Message"}
            </span>
          </div>
          <p className="text-white text-opacity-90 line-clamp-2">{text}</p>
        </div>
      )}
    </div>
  );
}