import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SendIcon,
  PlusCircleIcon,
  EditIcon,
  SearchIcon,
  BarChartIcon,
} from "lucide-react";
import { AIAvatar } from "./ai-avatar";
import { AIMessage } from "./ai-message";
import { UserMessage } from "./user-message";
import { ConfirmationButtons } from "./confirmation-buttons";
import { VoiceControlToolbar } from "./voice-control-toolbar";
import { HeyGenAvatar } from "./heygen-avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
      } else if (parsedResponse.type === "send_additional_email") {
        // Handle request to send additional email
        const additionalEmail = parsedResponse.data?.email;
        
        if (additionalEmail) {
          console.log("Sending additional email to:", additionalEmail);
          
          // Extract just the email addresses from the text to avoid including previous emails
          const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
          const extractedEmails = additionalEmail.match(emailRegex);
          
          // Make sure we have extracted email addresses
          if (extractedEmails && extractedEmails.length > 0) {
            // Check if we have deal info stored in window
            if (window.prescreeningDealInfo?.dealId) {
              const dealId = window.prescreeningDealInfo.dealId;
              const dealName = window.prescreeningDealInfo.dealName;
              
              // Open pre-screening tab and set email
              try {
                if (window.openPrescreeningTab) {
                  window.openPrescreeningTab(dealId);
                  // Set the email after a short delay to ensure the tab is open
                  setTimeout(() => {
                    if (window.setPreScreeningEmails) {
                      // Send just the new email(s), not combined with previous ones
                      const newEmailsString = extractedEmails.join(',');
                      console.log("Raw additional email string being sent:", newEmailsString);
                      window.setPreScreeningEmails(newEmailsString);
                      console.log("Set additional pre-screening email:", newEmailsString);
                    }
                  }, 500);
                }
                
                // Add message to confirm
                setMessages((prev) => [
                  ...prev,
                  {
                    role: "assistant",
                    content: parsedResponse.message || `I'm sending the pre-screening email to ${extractedEmails.join(', ')}. You can track this in the AI Pre-Screening tab.`,
                  },
                ]);
              } catch (error) {
                console.error("Error setting additional email:", error);
                setMessages((prev) => [
                  ...prev,
                  {
                    role: "assistant",
                    content: "I couldn't send the additional email. Please try opening the AI Pre-Screening tab manually and entering the email address there.",
                  },
                ]);
              }
            }
          } else {
            // No deal info stored
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: "I need to know which deal you want to send the pre-screening email for. Please start by saying 'Start AI Pre-Screening on [Deal Name]'.",
              },
            ]);
          }
          
          setAIStatus("listening");
          return;
        }
      } else if (parsedResponse.type === "start_prescreening") {
        console.log("Handling start_prescreening request:", parsedResponse.data);
        
        // Check if we have a dealId or dealName in the parsed response
        let deal;
        
        if (parsedResponse.data?.dealId) {
          // Try to find by ID first
          const dealId = parsedResponse.data.dealId.toString().replace("#", "");
          deal = deals.find(d => d.id === dealId);
          console.log("Looking for deal by ID:", dealId, deal ? "found" : "not found");
        } 
        
        // If no deal found by ID and we have a name, try to find by name
        if (!deal && parsedResponse.data?.dealName) {
          const dealName = parsedResponse.data.dealName.toLowerCase();
          deal = deals.find(d => d.name?.toLowerCase().includes(dealName));
          console.log("Looking for deal by name:", parsedResponse.data.dealName, deal ? "found" : "not found");
        }
        
        // Try to find deal containing 'monet' in the name if all else fails
        if (!deal && (parsedResponse.data?.dealName || '').toLowerCase().includes('monet')) {
          deal = deals.find(d => d.name?.toLowerCase().includes('monet'));
          console.log("Fallback search for 'monet':", deal ? "found" : "not found");
        }
        
        if (deal) {
          console.log("Found deal for pre-screening:", deal.id, deal.name);
          const confirmationMessage = `Do you want to start the Pre-Screening process for ${deal.name || 'this deal'}?`;
          
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "I need your confirmation before starting the Pre-Screening process.",
              pendingAction: {
                type: "start_prescreening",
                data: { dealId: deal.id, dealName: deal.name },
                confirmationMessage
              }
            }
          ]);
        } else {
          // If we have a search term but couldn't find a match
          const searchTerm = parsedResponse.data?.dealName || parsedResponse.data?.dealId || "the specified deal";
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `I couldn't find a deal with the name ${searchTerm}. Please check the name and try again, or create a new deal first.`,
            }
          ]);
        }
        
        setAIStatus("listening");
        return;
      } else if (
        parsedResponse.type === "show_deal" &&
        parsedResponse.data?.dealId
      ) {
        // Handle showing deal details (highlight in table)
        const dealId = parseInt(
          parsedResponse.data.dealId.toString().replace("#", ""),
        );
        if (onDealSelect) {
          onDealSelect(dealId);
        }

        // Extract the human-readable message or create a fallback
        const humanReadableMessage =
          parsedResponse.message ||
          "I found that deal and highlighted it in the table for you. Is there anything specific you'd like to know about it?";

        // Add assistant message
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: humanReadableMessage,
            data: parsedResponse.data,
          },
        ]);
      } else {
        // Create a human-readable message even if parsing failed
        let humanReadableMessage = parsedResponse.message;

        // If no message was extracted but we have raw content, create a friendly response
        if (!humanReadableMessage) {
          // Clean any JSON-like or code-block content to present a clean message
          let cleanedResponse = aiResponse
            .replace(/```json[\s\S]*?```/g, "")
            .replace(/```[\s\S]*?```/g, "")
            .trim();

          // If it's a JSON string that wasn't properly parsed, don't show it to the user
          if (
            cleanedResponse.startsWith("{") &&
            cleanedResponse.endsWith("}")
          ) {
            humanReadableMessage =
              "I understand your request. Is there anything specific you'd like me to help you with?";
          } else {
            humanReadableMessage =
              cleanedResponse ||
              "I understand your request. Is there anything specific you'd like me to help you with?";
          }
        }

        // Add regular assistant message
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: humanReadableMessage,
            data: {
              followUpQuestions: parsedResponse.followUpQuestions || [],
            },
          },
        ]);
      }

      setAIStatus("listening");
    } catch (error) {
      console.error("Error processing AI request:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm sorry, I encountered an error processing your request. Please try again.",
        },
      ]);
      setAIStatus("error");
    }
  };

  const handleQuickCommand = (command: string) => {
    setInput(command);
  };
  
  // Handle voice input from the toolbar
  const handleVoiceInput = (text: string) => {
    if (text.trim()) {
      setInput(text);
      // Optional: Automatically send the message after a brief delay
      // to give user time to see what was transcribed
      setTimeout(() => {
        handleSendMessage();
      }, 300);
    }
  };
  
  // Handle confirmation of actions like creating or updating deals
  const handleActionConfirmation = async (actionType: string, actionData: any) => {
    setAIStatus("processing");
    
    try {
      if (actionType === "create_deal") {
        // Clean up deal data to ensure it matches schema requirements
        const dealData = {
          name: actionData.company || actionData.name,
          priority: actionData.priority || "medium",
          country: actionData.country || actionData.region,
          lead: actionData.lead || actionData.leadInvestor,
          creditHub: actionData.creditHub || "LATAM", // Use valid value from schema
          stage: actionData.stage || actionData.status || "Pre-Screening",
          updates: [], // JSON array of updates
          members: [], // JSON array of member strings
          preScreening: {}, // Empty object for pre-screening data
          aiScreening: [], // Empty array for AI screening data
          createdBy: null // Set createdBy to null instead of undefined
        };
        
        console.log("Submitting deal data:", dealData);
        const newDeal = await createDealMutation.mutateAsync(dealData);
        
        // Add confirmation message
        setMessages((prev) => [
          ...prev.filter(m => !m.pendingAction), // Remove the confirmation message
          {
            role: "assistant",
            content: `Deal for ${newDeal.name} has been created successfully.`,
            data: {
              type: "deal_details",
              deal: newDeal,
              followUpQuestions: ["Would you like to update any information?", "Do you want to view all deals?"]
            }
          }
        ]);
        
        toast({
          title: "Deal Created",
          description: `${newDeal.name} deal has been created.`,
        });
      } 
      else if (actionType === "update_deal") {
        // Execute the update deal action
        const { id, ...dealData } = actionData;
        const updatedDeal = await updateDealMutation.mutateAsync({
          id,
          deal: dealData
        });
        
        // Add confirmation message
        setMessages((prev) => [
          ...prev.filter(m => !m.pendingAction), // Remove the confirmation message
          {
            role: "assistant",
            content: `Deal #${id} has been updated successfully.`,
            data: {
              type: "deal_details",
              deal: updatedDeal,
              followUpQuestions: ["Would you like to make other changes?", "Do you want to view all deals?"]
            }
          }
        ]);
        
        toast({
          title: "Deal Updated",
          description: `${updatedDeal.name} deal has been updated.`,
        });
      }
      else if (actionType === "start_prescreening") {
        // Show AI Pre-Screening in a new tab
        const { dealId, dealName } = actionData;
        
        console.log("Confirming pre-screening action for deal:", dealId, dealName);
        console.log("Window openPrescreeningTab function exists:", !!window.openPrescreeningTab);
        
        // Here we would typically communicate with the TabsSystem to open a new tab
        setMessages((prev) => [
          ...prev.filter(m => !m.pendingAction), // Remove the confirmation message
          {
            role: "assistant",
            content: `I've started the Pre-Screening process for ${dealName || 'the selected deal'}. Please provide the email addresses for the recipients (separated by commas).`,
            data: {
              type: "prescreening_started",
              dealId,
              dealName
            }
          }
        ]);
        
        toast({
          title: "Pre-Screening Started",
          description: `Pre-Screening process initiated for ${dealName || 'selected deal'}.`,
        });
        
        // Store deal info globally for access by future email commands
        try {
          window.prescreeningDealInfo = {
            dealId,
            dealName
          };
          console.log("Stored prescreening deal info in window object:", { dealId, dealName });
        } catch (error) {
          console.error("Error storing deal info on window:", error);
        }
        
        // Try to open the AI Pre-Screening tab via the exposed window method
        try {
          // This is a global method exposed by the TabsSystem component
          console.log("Attempting to open pre-screening tab for deal:", dealId);
          if (window.openPrescreeningTab) {
            window.openPrescreeningTab(dealId);
            console.log("Called openPrescreeningTab successfully");
          } else {
            console.error("openPrescreeningTab method not found on window object");
            // Fallback to just selecting the deal if the tab function isn't available
            if (onDealSelect) {
              onDealSelect(dealId);
              console.log("Used onDealSelect fallback");
            }
          }
        } catch (error) {
          console.error("Error opening prescreening tab:", error);
        }
      }
      
      setAIStatus("listening");
    } catch (error) {
      console.error(`Error executing ${actionType}:`, error);
      
      // Provide more helpful error messages depending on the action type
      let errorMessage = `I couldn't complete the requested action. Please try again or check your information.`;
      
      if (actionType === "start_prescreening") {
        errorMessage = "I couldn't start the pre-screening process. Please make sure you've selected a valid deal and try again with a command like 'Start pre-screening for [deal name]'.";
      } else if (actionType === "create_deal") {
        errorMessage = "I couldn't create the deal. Please check that all required information is provided and try again.";
      } else if (actionType === "update_deal") {
        errorMessage = "I couldn't update the deal. Please check that you're specifying a valid deal ID and try again.";
      }
      
      setMessages((prev) => [
        ...prev.filter(m => !m.pendingAction), // Remove the confirmation message
        {
          role: "assistant",
          content: errorMessage,
        }
      ]);
      
      setAIStatus("error");
    }
  };
  
  // Handle cancellation of pending actions
  const handleActionCancellation = () => {
    // Remove the message with the pending action and add a cancellation message
    setMessages((prev) => [
      ...prev.filter(m => !m.pendingAction), // Remove the confirmation message
      {
        role: "assistant",
        content: "Action cancelled. Is there anything else you'd like to do?",
      }
    ]);
  };

  return (
    <div className="w-full h-full pr-6 flex flex-col relative">
      <ConcentricPattern />

      <div className="z-10">
        <h2 className="text-xl font-semibold mb-4">AI Command Center</h2>
        
        {/* HeyGen Avatar integration */}
        <div className="w-full mb-4">
          <HeyGenAvatar 
            text={lastAIMessage}
            isVisible={aiStatus === "speaking"}
          />
        </div>
        
        {/* Keep the AIAvatar as a fallback/loading indicator */}
        <AIAvatar status={aiStatus} />
      </div>

      <div className="gradient-border bg-dark-lighter flex-1 overflow-hidden flex flex-col mb-4 z-10">
        <VoiceControlToolbar 
          onVoiceInput={handleVoiceInput}
          aiMessage={lastAIMessage}
          isProcessing={aiStatus === "processing"}
        />
        <div className="p-4 overflow-y-auto flex-1">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                {message.role === "assistant" ? (
                  <AIMessage
                    content={message.content}
                    data={message.data}
                    pendingAction={message.pendingAction}
                    onSelect={handleQuickCommand}
                    onConfirm={handleActionConfirmation}
                    onCancel={handleActionCancellation}
                  />
                ) : (
                  <UserMessage content={message.content} />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 border-t border-dark-surface">
          <div className="relative">
            <textarea
              placeholder="Type your command or question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="w-full bg-dark rounded-lg pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary-light resize-y min-h-[50px] max-h-[150px] text-black"
              style={{ overflow: "auto" }}
            />
            <div className="absolute right-3 bottom-3">
              <Button
                variant="ghost"
                className="text-primary-light hover:text-primary-lighter transition-colors"
                onClick={handleSendMessage}
                disabled={aiStatus === "processing"}
              >
                <SendIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex mt-2 space-x-2 overflow-x-auto py-1">
            <Button
              variant="outline"
              size="sm"
              className="px-3 py-1 bg-dark-surface rounded-full text-xs text-muted-foreground whitespace-nowrap hover:bg-primary hover:bg-opacity-20 hover:text-white transition-colors"
              onClick={() => handleQuickCommand("Create new deal")}
            >
              Create new deal
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="px-3 py-1 bg-dark-surface rounded-full text-xs text-muted-foreground whitespace-nowrap hover:bg-primary hover:bg-opacity-20 hover:text-white transition-colors"
              onClick={() => handleQuickCommand("Update deal status")}
            >
              Update deal status
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="px-3 py-1 bg-dark-surface rounded-full text-xs text-muted-foreground whitespace-nowrap hover:bg-primary hover:bg-opacity-20 hover:text-white transition-colors"
              onClick={() => handleQuickCommand("Generate report")}
            >
              Generate report
            </Button>
          </div>
        </div>
      </div>

      <div className="z-10">
        <h3 className="text-sm font-medium mb-2 text-muted-foreground">
          AI Assistant Capabilities
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-dark-surface p-3 rounded-lg flex items-center">
            <PlusCircleIcon className="h-4 w-4 text-primary-light mr-2" />
            <span className="text-xs">Create Deals</span>
          </div>
          <div className="bg-dark-surface p-3 rounded-lg flex items-center">
            <EditIcon className="h-4 w-4 text-primary-light mr-2" />
            <span className="text-xs">Update Info</span>
          </div>
          <div className="bg-dark-surface p-3 rounded-lg flex items-center">
            <SearchIcon className="h-4 w-4 text-primary-light mr-2" />
            <span className="text-xs">Search Deals</span>
          </div>
          <div className="bg-dark-surface p-3 rounded-lg flex items-center">
            <BarChartIcon className="h-4 w-4 text-primary-light mr-2" />
            <span className="text-xs">Analytics</span>
          </div>
        </div>
      </div>
    </div>
  );
}
