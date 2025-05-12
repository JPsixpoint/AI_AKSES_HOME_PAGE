import { useState, useRef, useEffect } from "react";
import { SpeechRecognitionHandler } from "./speech-recognition-handler";
import { CommandLineInterface } from "./command-line-interface";
import { ConcentricPattern } from "../ui/concentric-pattern";
import { getAIResponse, parseAIResponse } from "@/lib/openai";
import { useToast } from "@/hooks/use-toast";
import { Deal } from "@shared/schema";
import { fetchDeals, createDeal, updateDeal } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Message {
  role: "user" | "assistant";
  content: string;
  data?: any;
  pendingAction?: {
    type: "create_deal" | "update_deal" | "delete_deal" | "start_prescreening";
    data: any;
    confirmationMessage: string;
  };
}

type AIStatus = "listening" | "processing" | "speaking" | "error";

interface AICommandCenterProps {
  onDealSelect?: (dealId: string | number) => void;
}

// Extend the Window interface to include our custom properties
declare global {
  interface Window {
    openPrescreeningTab?: (dealId?: string) => void;
    setPreScreeningEmails?: (emails: string) => void;
    prescreeningDealInfo?: {
      dealId: string;
      dealName?: string;
    };
  }
}

export function AICommandCenter({ onDealSelect }: AICommandCenterProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to AKSES. I can help you manage your investment deals. What would you like to do today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [aiStatus, setAIStatus] = useState<AIStatus>("listening");
  const [lastAIMessage, setLastAIMessage] = useState<string | null>(null);
  const [voiceListening, setVoiceListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Reference to store the auto-submit timer
  const autoSubmitTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clear auto-submit timer
  const clearAutoSubmitTimer = () => {
    if (autoSubmitTimerRef.current) {
      clearTimeout(autoSubmitTimerRef.current);
      autoSubmitTimerRef.current = null;
    }
  };
  
  // Auto-submit after a pause in speech
  const setupAutoSubmitTimer = (text: string) => {
    // Clear any existing timer
    clearAutoSubmitTimer();
    
    // Only setup timer if we have text and we're not processing
    if (text.trim() && voiceListening && aiStatus !== "processing") {
      // Set a new timer to auto-submit after 1.5 seconds of no new speech
      autoSubmitTimerRef.current = setTimeout(() => {
        console.log('Auto-submitting voice input after pause:', text);
        setInput(text);
        handleSendMessage();
        setTranscript("");
      }, 1500); // 1.5 seconds pause
    }
  };
  
  // Handle speech recognition results
  const handleSpeechResult = (text: string) => {
    console.log('Speech transcript:', text);
    setTranscript(text);
    
    // Only set input if we're actively listening
    if (voiceListening) {
      setInput(text);
      
      // Setup auto-submit timer
      setupAutoSubmitTimer(text);
    }
  };
  
  // Handle speech recognition starting
  const handleSpeechStart = () => {
    console.log('Speech recognition started');
    setVoiceListening(true);
    toast({
      title: "Voice Recognition Active",
      description: "I'm listening to your voice now. Speak clearly.",
      variant: "default",
    });
  };
  
  // Handle speech recognition ending
  const handleSpeechEnd = () => {
    console.log('Speech recognition ended');
    
    // Clear any auto-submit timer
    clearAutoSubmitTimer();
    
    // If we have transcript and we're listening, send the message
    if (transcript && voiceListening && aiStatus !== "processing") {
      setInput(transcript);
      handleSendMessage();
      setTranscript("");
    }
    
    setVoiceListening(false);
  };
  
  // Handle speech recognition errors
  const handleSpeechError = (error: any) => {
    console.error('Speech recognition error:', error);
    setVoiceListening(false);
    
    toast({
      title: "Voice Recognition Error",
      description: "There was a problem with voice recognition. Please try again or type your message.",
      variant: "destructive",
    });
  };

  const { data: deals = [] } = useQuery<Deal[]>({
    queryKey: ["/api/deals"],
    staleTime: 5000,
  });

  const createDealMutation = useMutation({
    mutationFn: createDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/deals/statistics"] });
    },
  });

  const updateDealMutation = useMutation({
    mutationFn: ({ id, deal }: { id: number; deal: Partial<Deal> }) =>
      updateDeal(id, deal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/deals/statistics"] });
    },
  });

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    
    // Update lastAIMessage when a new assistant message is added
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "assistant") {
      setLastAIMessage(lastMessage.content);
      // Also set speech status
      setAIStatus("speaking");
      
      // Calculate a reasonable speaking time based on message length
      // Average human speaking rate is about 150 words per minute, or 2.5 words per second
      const words = lastMessage.content.split(/\s+/).length;
      const speakingTimeMs = Math.max(4000, words * 400); // Min 4 seconds, then 400ms per word
      
      console.log(`Speaking time: ${speakingTimeMs}ms for ${words} words`);
      
      // Reset to listening after the calculated delay
      const timer = setTimeout(() => {
        setAIStatus("listening");
        // Clear the lastAIMessage after speaking is complete
        setLastAIMessage(null);
      }, speakingTimeMs);
      
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Check if the previous assistant message was about prescreening emails
    const prevMessage = messages[messages.length - 1];
    if (prevMessage && 
        prevMessage.role === 'assistant' && 
        prevMessage.data?.type === 'prescreening_started' &&
        input.includes('@')) {
          
      // User has provided emails after being prompted for prescreening
      const dealId = prevMessage.data.dealId;
      const dealName = prevMessage.data.dealName;
      const emails = input.split(',').map(email => email.trim());
      
      setMessages(prev => [
        ...prev,
        { role: 'user', content: input },
        { 
          role: 'assistant', 
          content: `Thank you! I'll send the pre-screening emails to ${emails.join(', ')}. You can follow the progress in the AI Pre-Screening tab.` 
        }
      ]);
      
      setInput('');
      
      // Now, let's update the form in the AI Pre-Screening tab with these emails
      try {
        // First ensure the pre-screening tab is open
        if (window.openPrescreeningTab) {
          window.openPrescreeningTab(dealId);
        }
        
        // Set the emails in the form (window method will be added to AIPreScreening)
        if (window.setPreScreeningEmails) {
          window.setPreScreeningEmails(emails.join(', '));
        }
        
        console.log('Set pre-screening emails:', emails);
      } catch (error) {
        console.error('Error setting pre-screening emails:', error);
      }
      
      return;
    }
    
    try {
      // Add user message
      const userMessage = { role: "user" as const, content: input };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setAIStatus("processing");

      // Prepare message history for AI
      const messageHistory = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Create a simplified list of deals to avoid token limit issues
      // We only need names and IDs for most operations
      const dealsSummary = deals.slice(0, 100).map(deal => ({ 
        id: deal.id,
        name: deal.name,
        stage: deal.stage
      }));

      // Add system message at the beginning
      const systemMessage = {
        role: "system" as const,
        content: `You are AKSES AI, a highly sophisticated AI assistant for managing investment deals for a fintech platform. 
        You can create, update, and analyze investment deals.
        When creating or updating deals, always respond in JSON format with the structure: { "type": "action_type", "data": {}, "message": "message to user", "followUpQuestions": [] }
        For example, to create a deal: { "type": "create_deal", "data": { company, value, region, sector, status }, "message": "Successfully created deal", "followUpQuestions": ["Would you like to view the deal details?", "Should I update any information?"] }
        For simple responses, use: { "type": "message", "message": "your response", "followUpQuestions": [] }
        
        Current deals summary (limited to 100): ${JSON.stringify(dealsSummary)}
        
        For pre-screening requests, look for a deal by name in the deals summary. If found, respond with:
        { "type": "start_prescreening", "data": { "dealId": [deal_id], "dealName": [deal_name] } }
        
        Always format currency values as numbers (e.g., 2500000 for $2.5M).
        Valid deal statuses are: "Prescreening", "Indicative Proposal", "Due Diligence", "Committed", "Closed", "Declined".
        Do not refer to yourself as an AI or assistant, just respond naturally.
        When showing deal information, format values nicely (e.g., $2,500,000 instead of 2500000).
        When dealing with deal IDs, make sure to extract the numeric value only.`,
      };

      const aiResponse = await getAIResponse([
        systemMessage,
        ...messageHistory,
        userMessage,
      ]);

      // Debug logging to help troubleshoot any issues with AI responses
      console.log("Raw AI response:", aiResponse);

      // Parse structured responses from AI
      const parsedResponse = await parseAIResponse(aiResponse);

      // Log the parsed response structure for debugging
      console.log("Parsed AI response:", {
        type: parsedResponse.type,
        hasMessage: !!parsedResponse.message,
        messagePreview: parsedResponse.message
          ? parsedResponse.message.substring(0, 50) + "..."
          : "none",
        hasData: !!parsedResponse.data,
        hasFollowUpQuestions: !!(
          parsedResponse.followUpQuestions &&
          parsedResponse.followUpQuestions.length > 0
        ),
      });

      console.log("AI Response:", parsedResponse.message);

      // Handle different AI response types
      if (parsedResponse.type === "create_deal" && parsedResponse.data) {
        // Ask for confirmation instead of executing immediately
        const confirmationMessage = `Do you confirm that you want to create a new deal for ${parsedResponse.data.company}?`;
        
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I need your confirmation before creating this deal.",
            pendingAction: {
              type: "create_deal",
              data: parsedResponse.data,
              confirmationMessage
            }
          }
        ]);
        
        setAIStatus("listening");
        return;
      } else if (parsedResponse.type === "update_deal" && parsedResponse.data) {
        // Ask for confirmation before updating a deal
        const { id, ...dealData } = parsedResponse.data;
        const dealId = parseInt(id.toString().replace("#", ""));
        const confirmationMessage = `Do you confirm that you want to update deal #${dealId}?`;
        
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I need your confirmation before updating this deal.",
            pendingAction: {
              type: "update_deal",
              data: { id: dealId, ...dealData },
              confirmationMessage
            }
          }
        ]);
        
        setAIStatus("listening");
        return;
      } else if (parsedResponse.type === "start_prescreening" && parsedResponse.data) {
        // Handle starting prescreening process
        const { dealId, dealName } = parsedResponse.data;
        
        // Store the deal info in window for potential follow-up emails
        if (window.prescreeningDealInfo) {
          window.prescreeningDealInfo = {
            dealId: dealId.toString(),
            dealName: dealName
          };
        }
        
        // Check if a deal ID was found
        if (dealId) {
          // First open the pre-screening tab with this deal
          try {
            if (window.openPrescreeningTab) {
              window.openPrescreeningTab(dealId.toString());
            }
            
            // Return a message asking for emails
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: `I've selected ${dealName} for pre-screening. Please enter the email address(es) of the person or people you want to send the pre-screening invitation to. You can enter multiple emails separated by commas.`,
                data: {
                  type: 'prescreening_started',
                  dealId: dealId.toString(),
                  dealName
                }
              }
            ]);
          } catch (error) {
            console.error('Error opening pre-screening tab:', error);
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: "I couldn't open the AI Pre-Screening tab. Please try opening it manually and selecting the deal from there.",
              }
            ]);
          }
        } else {
          // No deal ID was found
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "I couldn't find a deal with that name. Please check the spelling or provide a different deal name.",
            }
          ]);
        }
        
        setAIStatus("listening");
        return;
      } else if (parsedResponse.type === "select_deal" && parsedResponse.data?.id && onDealSelect) {
        // Handle deal selection for viewing
        const dealId = parsedResponse.data.id.toString().replace("#", "");
        onDealSelect(dealId);
        
        // Also add a response message
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: parsedResponse.message || `I've selected deal #${dealId} for viewing.`
          }
        ]);
        
        setAIStatus("listening");
        return;
      }
      
      // For all other response types, just add the message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: parsedResponse.message || aiResponse,
          data: parsedResponse.type !== "message" ? { type: parsedResponse.type, ...parsedResponse.data } : undefined
        },
      ]);

      setAIStatus("speaking");
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm sorry, I encountered an error processing your request. Please try again.",
        },
      ]);
      setAIStatus("error");
      
      // Reset to listening after a delay
      setTimeout(() => {
        setAIStatus("listening");
      }, 3000);
    }
  };
  
  // Handle command buttons
  const handleQuickCommand = (command: string) => {
    setInput(command);
    handleSendMessage();
  };

  // Handle confirmation of create deal action
  const handleConfirmCreateDeal = async (dealData: any) => {
    try {
      setAIStatus("processing");
      const result = await createDealMutation.mutateAsync(dealData);
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Success! I've created a new deal for ${dealData.company}. The deal ID is #${result.id}.`,
        },
      ]);
      
      setAIStatus("speaking");
    } catch (error) {
      console.error("Error creating deal:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I encountered an error while trying to create the deal. Please try again.",
        },
      ]);
      setAIStatus("error");
      
      // Reset to listening after a delay
      setTimeout(() => {
        setAIStatus("listening");
      }, 3000);
    }
  };

  // Handle confirmation of update deal action
  const handleConfirmUpdateDeal = async (updateData: any) => {
    try {
      setAIStatus("processing");
      const { id, ...dealData } = updateData;
      await updateDealMutation.mutateAsync({ id, deal: dealData });
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Success! I've updated deal #${id} with the new information.`,
        },
      ]);
      
      setAIStatus("speaking");
    } catch (error) {
      console.error("Error updating deal:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I encountered an error while trying to update the deal. Please try again.",
        },
      ]);
      setAIStatus("error");
      
      // Reset to listening after a delay
      setTimeout(() => {
        setAIStatus("listening");
      }, 3000);
    }
  };

  // Handle start prescreening action
  const handleStartPrescreening = async (data: any) => {
    try {
      const { dealId, dealName } = data;
      
      // Store the deal info in window for potential follow-up emails
      if (window.prescreeningDealInfo) {
        window.prescreeningDealInfo = {
          dealId: dealId.toString(),
          dealName: dealName
        };
      }
      
      // Check if a deal ID was found
      if (dealId) {
        // First open the pre-screening tab with this deal
        if (window.openPrescreeningTab) {
          window.openPrescreeningTab(dealId.toString());
        }
        
        // Add a response message
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `I've selected ${dealName} for pre-screening. Please enter the email address(es) of the person or people you want to send the pre-screening invitation to. You can enter multiple emails separated by commas.`,
            data: {
              type: 'prescreening_started',
              dealId: dealId.toString(),
              dealName
            }
          }
        ]);
      } else {
        // No deal ID was found
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I couldn't find a deal with that name. Please check the spelling or provide a different deal name.",
          }
        ]);
      }
    } catch (error) {
      console.error("Error starting prescreening:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I encountered an error while trying to start the pre-screening process. Please try again.",
        },
      ]);
    }
  };
  
  // Function to handle manually sending a voice input
  const handleVoiceInput = (text: string) => {
    setInput(text);
    handleSendMessage();
  };
  
  // Function to reset/end current chat
  const handleEndChat = () => {
    // Reset messages to just the initial greeting
    setMessages([
      {
        role: "assistant",
        content: "Welcome to AKSES. I can help you manage your investment deals. What would you like to do today?",
      },
    ]);
    setInput("");
    setTranscript("");
    setLastAIMessage(null);
    setAIStatus("listening");
    
    toast({
      title: "Chat Reset",
      description: "The conversation has been reset.",
    });
  };

  // Toggle speech recognition on/off
  const toggleVoiceInput = () => {
    const newState = !voiceListening;
    setVoiceListening(newState);
    
    if (newState) {
      // Turning on voice recognition
      toast({
        title: "Voice Recognition Activated",
        description: "I'm listening for your voice commands now. Speak clearly.",
      });
    } else {
      // Turning off voice recognition
      clearAutoSubmitTimer(); // Clean up any pending auto-submit
      
      // If we have transcript when turning off, use it
      if (transcript && aiStatus !== "processing") {
        setInput(transcript);
      }
      
      setTranscript(""); // Clear the transcript
      
      toast({
        title: "Voice Recognition Deactivated",
        description: "Returning to text-only input mode.",
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative">
      <ConcentricPattern />
      
      {/* Speech recognition handler */}
      <SpeechRecognitionHandler
        onResult={handleSpeechResult}
        onStart={handleSpeechStart}
        onEnd={handleSpeechEnd}
        onError={handleSpeechError}
        enabled={voiceListening}
      />

      <div className="z-10 flex-grow">
        <h2 className="text-xl font-semibold mb-4">AI Command Center</h2>
        
        {/* Command Line Interface */}
        <CommandLineInterface 
          messages={messages}
          onSendMessage={handleSendMessage}
          onEndChat={handleEndChat}
          isListening={voiceListening}
          toggleListening={toggleVoiceInput}
          isSpeaking={aiStatus === "speaking"}
        />
      </div>
    </div>
  );
}