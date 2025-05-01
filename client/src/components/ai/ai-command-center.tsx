import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SendIcon, PlusCircleIcon, EditIcon, SearchIcon, BarChartIcon } from "lucide-react";
import { AIAvatar } from "./ai-avatar";
import { AIMessage } from "./ai-message";
import { UserMessage } from "./user-message";
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
}

type AIStatus = "listening" | "processing" | "speaking" | "error";

interface AICommandCenterProps {
  onDealSelect?: (dealId: number) => void;
}

export function AICommandCenter({ onDealSelect }: AICommandCenterProps) {
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: "Welcome to AKSES. I can help you manage your investment deals. What would you like to do today?"
  }]);
  const [input, setInput] = useState("");
  const [aiStatus, setAIStatus] = useState<AIStatus>("listening");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: deals = [] } = useQuery({
    queryKey: ['/api/deals'],
    staleTime: 5000,
  });
  
  const createDealMutation = useMutation({
    mutationFn: createDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
      queryClient.invalidateQueries({ queryKey: ['/api/deals/statistics'] });
    }
  });
  
  const updateDealMutation = useMutation({
    mutationFn: ({ id, deal }: { id: number, deal: Partial<Deal> }) => updateDeal(id, deal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
      queryClient.invalidateQueries({ queryKey: ['/api/deals/statistics'] });
    }
  });
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    try {
      // Add user message
      const userMessage = { role: "user" as const, content: input };
      setMessages(prev => [...prev, userMessage]);
      setInput("");
      setAIStatus("processing");
      
      // Prepare message history for AI
      const messageHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));
      
      // Add system message at the beginning
      const systemMessage = {
        role: "system" as const,
        content: `You are AKSES AI, a highly sophisticated AI assistant for managing investment deals for a fintech platform. 
        You can create, update, and analyze investment deals.
        When creating or updating deals, always respond in JSON format with the structure: { "type": "action_type", "data": {}, "message": "message to user", "followUpQuestions": [] }
        For example, to create a deal: { "type": "create_deal", "data": { company, value, region, sector, status }, "message": "Successfully created deal", "followUpQuestions": ["Would you like to view the deal details?", "Should I update any information?"] }
        For simple responses, use: { "type": "message", "message": "your response", "followUpQuestions": [] }
        Current deals: ${JSON.stringify(deals)}
        For any deal-related queries, refer to this deal data.
        Always format currency values as numbers (e.g., 2500000 for $2.5M).
        Valid deal statuses are: "Prescreening", "Indicative Proposal", "Due Diligence", "Committed", "Closed", "Declined".
        Do not refer to yourself as an AI or assistant, just respond naturally.
        When showing deal information, format values nicely (e.g., $2,500,000 instead of 2500000).
        When dealing with deal IDs, make sure to extract the numeric value only.`
      };
      
      const aiResponse = await getAIResponse([systemMessage, ...messageHistory, userMessage]);
      
      // Parse structured responses from AI
      const parsedResponse = await parseAIResponse(aiResponse);
      
      // Handle different AI response types
      if (parsedResponse.type === "create_deal" && parsedResponse.data) {
        try {
          const newDeal = await createDealMutation.mutateAsync(parsedResponse.data);
          
          setMessages(prev => [...prev, { 
            role: "assistant", 
            content: parsedResponse.message || "Deal created successfully.", 
            data: { 
              type: "deal_details",
              deal: newDeal,
              followUpQuestions: parsedResponse.followUpQuestions || []
            } 
          }]);
          
          toast({
            title: "Deal Created",
            description: `${newDeal.company} deal has been created.`,
          });
        } catch (error) {
          console.error("Error creating deal:", error);
          setMessages(prev => [...prev, { 
            role: "assistant", 
            content: "I couldn't create that deal. Please try again or check your information."
          }]);
          setAIStatus("error");
          return;
        }
      } else if (parsedResponse.type === "update_deal" && parsedResponse.data) {
        try {
          const { id, ...dealData } = parsedResponse.data;
          const updatedDeal = await updateDealMutation.mutateAsync({ 
            id: parseInt(id.toString().replace('#', '')), 
            deal: dealData 
          });
          
          setMessages(prev => [...prev, { 
            role: "assistant", 
            content: parsedResponse.message || "Deal updated successfully.", 
            data: { 
              type: "deal_details",
              deal: updatedDeal,
              followUpQuestions: parsedResponse.followUpQuestions || []
            } 
          }]);
          
          toast({
            title: "Deal Updated",
            description: `${updatedDeal.company} deal has been updated.`,
          });
        } catch (error) {
          console.error("Error updating deal:", error);
          setMessages(prev => [...prev, { 
            role: "assistant", 
            content: "I couldn't update that deal. Please try again or check your information."
          }]);
          setAIStatus("error");
          return;
        }
      } else if (parsedResponse.type === "show_deal" && parsedResponse.data?.dealId) {
        // Handle showing deal details (highlight in table)
        const dealId = parseInt(parsedResponse.data.dealId.toString().replace('#', ''));
        if (onDealSelect) {
          onDealSelect(dealId);
        }
        
        // Add assistant message
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: parsedResponse.message || aiResponse,
          data: parsedResponse.data
        }]);
      } else {
        // Add regular assistant message
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: parsedResponse.message || aiResponse,
          data: {
            followUpQuestions: parsedResponse.followUpQuestions || []
          }
        }]);
      }
      
      setAIStatus("listening");
    } catch (error) {
      console.error("Error processing AI request:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm sorry, I encountered an error processing your request. Please try again."
      }]);
      setAIStatus("error");
    }
  };
  
  const handleQuickCommand = (command: string) => {
    setInput(command);
  };
  
  return (
    <div className="w-full h-full pr-6 flex flex-col relative">
      <ConcentricPattern />
      
      <div className="z-10">
        <h2 className="text-xl font-semibold mb-4">AI Command Center</h2>
        <AIAvatar status={aiStatus} />
      </div>
      
      <div className="gradient-border bg-dark-lighter flex-1 overflow-hidden flex flex-col mb-4 z-10">
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
                  <AIMessage content={message.content} data={message.data} onSelect={handleQuickCommand} />
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
            <Input
              type="text"
              placeholder="Type your command or question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="w-full bg-dark rounded-lg pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary-light"
            />
            <Button
              variant="ghost"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-light hover:text-primary-lighter transition-colors"
              onClick={handleSendMessage}
              disabled={aiStatus === "processing"}
            >
              <SendIcon className="h-5 w-5" />
            </Button>
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
        <h3 className="text-sm font-medium mb-2 text-muted-foreground">AI Assistant Capabilities</h3>
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
