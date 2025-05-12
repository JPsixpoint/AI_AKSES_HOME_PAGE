import React, { useEffect, useState } from 'react';

interface SpeechRecognitionHandlerProps {
  onResult: (transcript: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
  enabled: boolean;
}

/**
 * Component to handle speech recognition functionality
 */
export function SpeechRecognitionHandler({
  onResult,
  onStart,
  onEnd,
  onError,
  enabled
}: SpeechRecognitionHandlerProps) {
  const [recognition, setRecognition] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);

  // Initialize speech recognition
  useEffect(() => {
    if (!enabled) return;

    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported in this browser');
      if (onError) onError('Speech recognition not supported');
      
      // Attempt to detect browser
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
      const isEdge = navigator.userAgent.indexOf("Edg") > -1;
      
      // Provide more specific error message
      let browserMessage = 'Your browser does not support speech recognition. ';
      if (isSafari) {
        browserMessage += 'Safari has limited support for speech recognition.';
      } else if (isFirefox) {
        browserMessage += 'Firefox requires enabling speech recognition in settings.';
      } else if (isEdge) {
        browserMessage += 'Some versions of Edge may not fully support this feature.';
      } else {
        browserMessage += 'Please try using Chrome for best compatibility.';
      }
      
      if (onError) onError(browserMessage);
      return;
    }

    // Create recognition instance
    const recognitionInstance = new SpeechRecognition();
    
    // Configure recognition
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';
    
    // Set up event handlers
    recognitionInstance.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
      if (onStart) onStart();
    };
    
    recognitionInstance.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      
      console.log('Speech recognition result:', transcript);
      onResult(transcript);
    };
    
    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (onError) onError(event.error);
      
      // Auto-restart on some errors
      if (event.error === 'network' || event.error === 'no-speech') {
        try {
          restartListening();
        } catch (e) {
          console.error('Failed to restart speech recognition after error:', e);
        }
      }
    };
    
    recognitionInstance.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
      if (onEnd) onEnd();
      
      // Auto-restart if still enabled
      if (enabled) {
        try {
          restartListening();
        } catch (e) {
          console.error('Failed to restart speech recognition:', e);
        }
      }
    };
    
    setRecognition(recognitionInstance);
    
    // Start listening initially
    try {
      recognitionInstance.start();
      console.log('Started speech recognition');
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      if (onError) onError(error);
    }
    
    return () => {
      // Clean up
      try {
        if (recognitionInstance) {
          recognitionInstance.stop();
          console.log('Stopped speech recognition');
        }
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    };
  }, [enabled, onResult, onStart, onEnd, onError]);
  
  // Function to restart listening
  const restartListening = () => {
    if (!recognition) return;
    
    try {
      if (isListening) {
        recognition.stop();
      }
      
      setTimeout(() => {
        recognition.start();
      }, 200);
    } catch (error) {
      console.error('Error restarting speech recognition:', error);
      if (onError) onError(error);
    }
  };
  
  // Handle enabled state changes
  useEffect(() => {
    if (!recognition) return;
    
    if (enabled && !isListening) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        if (onError) onError(error);
      }
    } else if (!enabled && isListening) {
      try {
        recognition.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  }, [enabled, recognition, isListening, onError]);

  // This component doesn't render anything
  return null;
}

// Add types for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}