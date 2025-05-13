import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import useSpeechRecognition from '@/hooks/use-speech-recognition';

interface SpeechRecognitionControlProps {
  onTranscript: (text: string) => void;
}

export const SpeechRecognitionControl: React.FC<SpeechRecognitionControlProps> = ({
  onTranscript,
}) => {
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    hasRecognitionSupport
  } = useSpeechRecognition();

  const [isProcessing, setIsProcessing] = useState(false);

  // Process the transcript when speech recognition stops
  useEffect(() => {
    if (!isListening && transcript && !isProcessing) {
      setIsProcessing(true);
      
      // Process the transcript
      onTranscript(transcript);
      
      // Reset after processing
      setTimeout(() => {
        resetTranscript();
        setIsProcessing(false);
      }, 500);
    }
  }, [isListening, transcript, onTranscript, resetTranscript]);

  // If speech recognition is not supported, return null
  if (!hasRecognitionSupport) {
    return (
      <Button 
        variant="outline" 
        size="icon" 
        className="bg-muted/50 hover:bg-muted cursor-not-allowed" 
        disabled={true}
        title="Speech recognition is not supported in your browser"
      >
        <MicOff className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className={isListening ? "bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50" : "bg-muted/50 hover:bg-muted"}
      onClick={isListening ? stopListening : startListening}
      title={isListening ? "Stop listening" : "Start listening"}
    >
      {isListening ? (
        <Mic className="h-4 w-4 text-red-500" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};

export default SpeechRecognitionControl;