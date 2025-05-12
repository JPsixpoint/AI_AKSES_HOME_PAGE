import { useState, useEffect, useCallback, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Button } from "../ui/button";
import { Mic, MicOff, Volume2, VolumeX, BookOpen } from "lucide-react";
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
  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null);
  const lastTranscriptRef = useRef("");
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Check if browser supports speech synthesis and load voices
  useEffect(() => {
    if (window.speechSynthesis) {
      setSpeechSynthesisAvailable(true);
      
      // Load voices - most browsers load them asynchronously
      let voices = window.speechSynthesis.getVoices();
      
      if (voices.length === 0) {
        // If no voices loaded yet, set up event listener for when they're loaded
        const voicesChanged = () => {
          voices = window.speechSynthesis.getVoices();
          console.log("Voices loaded:", voices.length);
          console.log("Available voices:", voices.map(v => `${v.name} (${v.lang})`));
        };
        
        window.speechSynthesis.addEventListener('voiceschanged', voicesChanged);
        
        // Cleanup
        return () => {
          window.speechSynthesis.removeEventListener('voiceschanged', voicesChanged);
        };
      } else {
        console.log("Voices already loaded:", voices.length);
        console.log("Available voices:", voices.map(v => `${v.name} (${v.lang})`));
      }
    } else {
      setSpeechSynthesisAvailable(false);
    }
  }, []);

  // Speech recognition state tracking
  useEffect(() => {
    setIsListening(listening);
  }, [listening]);
  
  // Auto-send on silence detection
  useEffect(() => {
    // Only process when actively listening
    if (!listening) return;
    
    // If transcript changed
    if (transcript !== lastTranscriptRef.current) {
      // Update last transcript
      lastTranscriptRef.current = transcript;
      
      // Clear any existing silence timer
      if (silenceTimer) {
        clearTimeout(silenceTimer);
        setSilenceTimer(null);
      }
      
      // Set new silence timer - if transcript doesn't change for 1.5 seconds, send it
      if (transcript.trim()) {
        const timer = setTimeout(() => {
          console.log("Silence detected, sending transcript:", transcript);
          onVoiceInput(transcript);
          SpeechRecognition.stopListening();
          resetTranscript();
          setSilenceTimer(null);
        }, 1500); // 1.5 seconds of silence
        
        setSilenceTimer(timer);
      }
    }
    
    // Cleanup
    return () => {
      if (silenceTimer) {
        clearTimeout(silenceTimer);
      }
    };
  }, [transcript, listening, silenceTimer, onVoiceInput, resetTranscript]);

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
    
    // Try to find a good American English voice
    const voices = window.speechSynthesis.getVoices();
    
    // List of preferred American voice names in order of preference
    const americanVoiceNames = [
      'Google US English', 'Google English US', 
      'Microsoft David - English (United States)', 'Microsoft Guy - English (United States)',
      'Microsoft Mark - English (United States)', 'Microsoft Zira - English (United States)',
      'Alex', 'Samantha', 'Karen'
    ];
    
    // First try: exact match from our priority list
    let americanVoice = null;
    for (const name of americanVoiceNames) {
      const match = voices.find(voice => voice.name === name);
      if (match) {
        americanVoice = match;
        break;
      }
    }
    
    // Second try: any en-US voice with natural/premium keywords
    if (!americanVoice) {
      americanVoice = voices.find(
        voice => (voice.lang === 'en-US' || voice.lang === 'en_US') && 
                (voice.name.includes('Google') || 
                 voice.name.includes('Natural') || 
                 voice.name.includes('Premium'))
      );
    }
    
    // Third try: any en-US voice
    if (!americanVoice) {
      americanVoice = voices.find(voice => voice.lang === 'en-US' || voice.lang === 'en_US');
    }
    
    // Fourth try: any English voice
    if (!americanVoice) {
      americanVoice = voices.find(voice => voice.lang.startsWith('en'));
    }
    
    // Last resort: any available voice
    if (!americanVoice && voices.length > 0) {
      americanVoice = voices[0];
    }
    
    // Set the selected voice
    if (americanVoice) {
      console.log("Using voice:", americanVoice.name, americanVoice.lang);
      utterance.voice = americanVoice;
      // Explicitly set language to US English
      utterance.lang = 'en-US';
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

  // Open AKSES Architecture tab
  const openArchitectureTab = useCallback(() => {
    if ((window as any).openArchitectureTab) {
      (window as any).openArchitectureTab();
    } else {
      toast({
        title: "Tab Navigation Failed",
        description: "Unable to open the AKSES Architecture tab.",
        variant: "destructive"
      });
    }
  }, []);

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
        
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full text-blue-400 hover:text-blue-300"
          onClick={openArchitectureTab}
          title="Open AKSES Architecture"
        >
          <BookOpen className="h-5 w-5" />
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