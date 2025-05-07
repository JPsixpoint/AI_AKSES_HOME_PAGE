import React, { useEffect } from 'react';

// Interface for component props
interface ElevenLabsAvatarProps {
  text: string | null;
  isVisible: boolean;
}

/**
 * Eleven Labs Convai Widget component
 * This component directly embeds the widget HTML rather than trying to manipulate the DOM
 */
export function ElevenLabsAvatar({ text, isVisible }: ElevenLabsAvatarProps) {
  // Function to send text to the widget
  useEffect(() => {
    if (text) {
      console.log('New text to be spoken:', text);
    }
  }, [text]);

  // Ensure the Eleven Labs script is loaded
  useEffect(() => {
    if (!document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://elevenlabs.io/convai-widget/index.js';
      script.async = true;
      script.type = 'text/javascript';
      document.body.appendChild(script);
    }
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative w-full flex justify-center items-center">
      {/* Static HTML for the Eleven Labs Convai widget */}
      <div className="w-full min-h-[300px] flex items-center justify-center">
        <elevenlabs-convai agent-id="Kkab2NMZwTt5LOb4ZIZL"></elevenlabs-convai>
      </div>
      
      {/* Display the text being spoken (optional) */}
      {text && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-sm text-white text-center">
          {text}
        </div>
      )}
    </div>
  );
}