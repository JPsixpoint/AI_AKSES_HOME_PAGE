import React, { useEffect, useState } from 'react';

/**
 * A component that adds the ElevenLabs Convai widget directly to the document
 * This ensures it's always visible regardless of the component hierarchy
 */
export function ConvaiWidget() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Check if script is already loaded
    if (document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]')) {
      setIsLoaded(true);
      return;
    }
    
    // Create the script element
    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    script.type = 'text/javascript';
    
    // Set loaded state when script is loaded
    script.onload = () => {
      setIsLoaded(true);
    };
    
    // Add the script to the document
    document.body.appendChild(script);
    
    // Create the widget element
    const widget = document.createElement('elevenlabs-convai');
    widget.setAttribute('agent-id', 'aydRlzkSkaigNV8cpr6z');
    
    // Add some styling to position the widget
    widget.style.position = 'fixed';
    widget.style.right = '20px';
    widget.style.bottom = '20px';
    widget.style.zIndex = '9999';
    
    // Add the widget to the body
    document.body.appendChild(widget);
    
    // Clean up on unmount
    return () => {
      // Remove the script if we added it
      const scriptElement = document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]');
      if (scriptElement && scriptElement === script) {
        document.body.removeChild(script);
      }
      
      // Remove the widget
      const widgetElement = document.querySelector('elevenlabs-convai');
      if (widgetElement) {
        document.body.removeChild(widgetElement);
      }
    };
  }, []);

  return null; // This component doesn't render anything visibly
}

export default ConvaiWidget;