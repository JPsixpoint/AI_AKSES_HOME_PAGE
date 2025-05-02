import { useState, useEffect, useCallback } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Button } from "../ui/button";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { toast } from "@/hooks/use-toast";

interface VoiceControlToolbarProps {
  onVoiceInput: (text: string) => void;
  aiMessage: string | null;
  isProcessing: boolean;
}

export function VoiceControlToolbar({ 
  onVoiceInput, 
  aiMessage, 
  isProcessing 
}: VoiceControlToolbarProps) {
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSynthesisAvailable, setSpeechSynthesisAvailable] = useState(false);
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Check if browser supports speech synthesis
  useEffect(() => {
    setSpeechSynthesisAvailable(!!window.speechSynthesis);
  }, []);

  // Speech recognition state tracking
  useEffect(() => {
    setIsListening(listening);
  }, [listening]);

  // Handle speech output when AI responds
  useEffect(() => {
    if (isSpeechEnabled && aiMessage && !isProcessing && speechSynthesisAvailable) {
      speakText(aiMessage);
    }
    // Clean up any ongoing speech when unmounting
    return () => {
      if (speechSynthesisAvailable) {
        window.speechSynthesis.cancel();
      }
    };
  }, [aiMessage, isSpeechEnabled, isProcessing, speechSynthesisAvailable]);

  // Function to convert text to speech
  const speakText = useCallback((text: string) => {
    if (!speechSynthesisAvailable) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create a new speech utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice properties
    utterance.rate = 1.0; // Normal speed
    utterance.pitch = 1.0; // Normal pitch
    utterance.volume = 1.0; // Full volume
    
    // Try to find a more natural-sounding voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      voice => voice.name.includes("Google") || voice.name.includes("Natural") || voice.name.includes("Premium")
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
  }, [speechSynthesisAvailable]);

  // Handle start/stop listening
  const toggleListening = useCallback(() => {
    if (!browserSupportsSpeechRecognition) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive"
      });
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
      // Only send non-empty transcripts
      if (transcript.trim()) {
        onVoiceInput(transcript);
      }
      resetTranscript();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  }, [listening, transcript, onVoiceInput, resetTranscript, browserSupportsSpeechRecognition]);

  // Handle speech output toggle
  const toggleSpeech = useCallback(() => {
    if (!speechSynthesisAvailable && !isSpeechEnabled) {
      toast({
        title: "Speech Synthesis Not Supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive"
      });
      return;
    }
    
    // If turning off, cancel any ongoing speech
    if (isSpeechEnabled && speechSynthesisAvailable) {
      window.speechSynthesis.cancel();
    }
    
    setIsSpeechEnabled(!isSpeechEnabled);
  }, [isSpeechEnabled, speechSynthesisAvailable]);

  return (
    <div className="flex items-center justify-between p-2 border-b border-dark-surface">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-full ${isListening ? 'bg-primary/20 text-primary-lighter' : ''}`}
          onClick={toggleListening}
          disabled={isProcessing}
          title={isListening ? "Stop listening" : "Start voice input"}
        >
          {isListening ? (
            <Mic className="h-5 w-5 animate-pulse" />
          ) : (
            <MicOff className="h-5 w-5" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-full ${isSpeechEnabled ? 'bg-primary/20 text-primary-lighter' : 'opacity-70'}`}
          onClick={toggleSpeech}
          title={isSpeechEnabled ? "Disable voice output" : "Enable voice output"}
        >
          {isSpeechEnabled ? (
            <Volume2 className="h-5 w-5" />
          ) : (
            <VolumeX className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      {isListening && (
        <div className="text-xs text-primary-lighter animate-pulse">
          Listening...
        </div>
      )}
      
      {transcript && isListening && (
        <div className="text-xs max-w-[250px] truncate">
          {transcript}
        </div>
      )}
    </div>
  );
}