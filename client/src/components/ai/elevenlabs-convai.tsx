import React, { useEffect, useRef } from 'react';

interface ElevenLabsConvaiProps {
  agentId: string;
}

export const ElevenLabsConvai: React.FC<ElevenLabsConvaiProps> = ({ agentId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Create the script element
    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    script.type = 'text/javascript';
    
    // Add the script to the document
    document.body.appendChild(script);
    
    // Create the custom element once the script is loaded
    script.onload = () => {
      if (containerRef.current) {
        // Clear the container first
        containerRef.current.innerHTML = '';
        
        // Create the custom element using DOM methods instead of JSX
        const convaiElement = document.createElement('elevenlabs-convai');
        convaiElement.setAttribute('agent-id', agentId);
        
        // Append to our container
        containerRef.current.appendChild(convaiElement);
      }
    };
    
    // Clean up on component unmount
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      
      // Clear the container
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [agentId]);

  return (
    <div className="elevenlabs-convai-container" ref={containerRef}>
      {/* The elevenlabs-convai element will be created dynamically */}
      <div className="p-4 text-center text-sm text-gray-500">
        Loading ElevenLabs Convai...
      </div>
    </div>
  );
};

export default ElevenLabsConvai;