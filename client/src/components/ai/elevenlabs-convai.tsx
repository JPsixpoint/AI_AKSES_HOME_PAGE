import React, { useEffect } from 'react';

// Declare the custom element to TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        'agent-id'?: string;
      }, HTMLElement>;
    }
  }
}

interface ElevenLabsConvaiProps {
  agentId?: string;
  position?: 'right' | 'left';
}

export const ElevenLabsConvai: React.FC<ElevenLabsConvaiProps> = ({ 
  agentId = "IwxkjUwQIUEukahjdlXH", 
  position = 'right' 
}) => {
  
  useEffect(() => {
    // Add the script to the document if it doesn't exist
    if (!document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://elevenlabs.io/convai-widget/index.js';
      script.async = true;
      script.type = 'text/javascript';
      document.body.appendChild(script);
    }
    
    // Cleanup on unmount
    return () => {
      // We don't remove the script since other components might use it
    };
  }, []);

  return (
    <div className={`elevenlabs-convai-container fixed bottom-20 ${position === 'right' ? 'right-10' : 'left-10'} z-50`}>
      <elevenlabs-convai agent-id={agentId}></elevenlabs-convai>
    </div>
  );
};

export default ElevenLabsConvai;