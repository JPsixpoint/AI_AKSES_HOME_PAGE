import React, { useEffect, useState } from 'react';

/**
 * A component that adds the ElevenLabs Convai widget directly to the document
 * This ensures it's always visible regardless of the component hierarchy
 */
export function ConvaiWidget() {
  useEffect(() => {
    // Remove any existing widgets to avoid duplicates
    const existingWidgets = document.querySelectorAll('elevenlabs-convai');
    existingWidgets.forEach(widget => {
      if (widget.parentNode) {
        widget.parentNode.removeChild(widget);
      }
    });

    // Remove any existing scripts to avoid duplicates
    const existingScripts = document.querySelectorAll('script[src="https://elevenlabs.io/convai-widget/index.js"]');
    existingScripts.forEach(script => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });
    
    // Create the widget element with the exact structure provided
    const widget = document.createElement('elevenlabs-convai');
    widget.setAttribute('agent-id', 'IwxkjUwQIUEukahjdlXH');
    
    // Add some styling to position the widget
    widget.style.position = 'fixed';
    widget.style.right = '20px';
    widget.style.bottom = '20px';
    widget.style.zIndex = '9999';
    
    // Add the widget to the body
    document.body.appendChild(widget);
    
    // Create the script element - exact code as provided
    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    script.type = 'text/javascript';
    
    // Add the script to the document
    document.body.appendChild(script);
    
    // Clean up on unmount
    return () => {
      // We don't remove these on unmount since this is an app-level component
      // that should persist throughout the app lifecycle
    };
  }, []);

  return null; // This component doesn't render anything visibly
}

export default ConvaiWidget;