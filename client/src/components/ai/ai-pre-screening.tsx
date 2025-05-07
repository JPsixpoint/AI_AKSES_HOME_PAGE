import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Activity,
  AlertCircle,
  Send,
  RefreshCw,
  CheckSquare,
  Eye,
  EyeOff,
  Database,
  CheckCircle,
  ArrowUp,
  Mail,
  MessageCircle,
  Play,
  X
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Deal } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ConcentricPattern } from "@/components/ui/concentric-pattern";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// Schema for the form data
const preScreeningSchema = z.object({
  dealId: z.string().min(1, { message: "Please select a deal" }),
  recipientEmails: z.string().min(1, { message: "Please add at least one recipient email" }),
  additionalContext: z.string().optional(),
});

type PreScreeningForm = z.infer<typeof preScreeningSchema>;

// Extend Window interface for external communication
declare global {
  interface Window {
    setPreScreeningEmails?: (emails: string) => void;
    openPrescreeningTab?: (dealId?: string) => void;
  }
}

interface AIPreScreeningProps {
  initialDealId?: string;
}

export function AIPreScreening({ initialDealId }: AIPreScreeningProps) {
  // Ref for external access to component methods
  const prescreeningRef = useRef<{
    setEmails: (emails: string) => void;
  }>({ setEmails: () => {} });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [emailPreview, setEmailPreview] = useState<string>("");
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  
  // State for deal details modal
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [selectedScreening, setSelectedScreening] = useState<ScreeningData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState({
    open: false,
    showTimeline: false // Timeline collapsed by default
  });

  // Form handling
  const form = useForm<PreScreeningForm>({
    resolver: zodResolver(preScreeningSchema),
    defaultValues: {
      dealId: initialDealId || "",
      recipientEmails: "",
      additionalContext: "",
    },
  });

  // Fetch deals for dropdown
  const { data: deals = [] } = useQuery<Deal[]>({
    queryKey: ["/api/deals"],
  });
  
  // Define types for the screening data
  // Define tracking event types
  type TrackingEventType = "sent" | "opened" | "started" | "progress" | "submitted" | "done" | "error";
  
  // Define tracking event
  interface TrackingEvent {
    type: TrackingEventType;
    timestamp: string;
    metadata: Record<string, any>;
  }
  
  // ScreeningData with the updated trackingData structure
  interface ScreeningData {
    timestamp: string;
    initiatingUser: string;
    recipientEmails: string[];
    emailContent: string;
    additionalContext: string;
    status: "sent" | "not_sent" | "error" | "viewing";
    resendCount?: number; // Track how many times this email has been resent
    error?: string; // Track email sending errors
    trackingData: TrackingEvent[];
  }

  // Helper function to handle both aiScreening and ai_screening properties
  const getScreeningData = (deal: any): ScreeningData[] => {
    // TypeScript workaround for dealing with both camelCase and snake_case properties
    const data = deal.aiScreening || (deal as any).ai_screening;
    
    // Make sure we always return an array
    if (!data) return [];
    
    // Handle case where it's a single object instead of an array
    if (!Array.isArray(data)) {
      return [data];
    }
    
    return data;
  };
  
  // Helper function to get the latest tracking event of a certain type
  const getLatestTrackingEvent = (screeningData: ScreeningData, type: TrackingEventType | TrackingEventType[]): TrackingEvent | undefined => {
    if (!screeningData.trackingData) {
      return undefined;
    }
    
    // Handle old format (where trackingData might be an object with properties)
    if (!Array.isArray(screeningData.trackingData)) {
      // For backward compatibility with the old format
      const typesToFind = Array.isArray(type) ? type : [type];
      const oldStatus = (screeningData.trackingData as any).status;
      
      // Only handle specific key mappings from old format
      if (typesToFind.includes("sent" as TrackingEventType) && oldStatus === "sent") {
        return {
          type: "sent" as TrackingEventType,
          timestamp: (screeningData.trackingData as any).lastInteraction || new Date().toISOString(),
          metadata: {}
        };
      } else if (typesToFind.includes("opened" as TrackingEventType) && oldStatus === "opened") {
        return {
          type: "opened" as TrackingEventType,
          timestamp: (screeningData.trackingData as any).lastInteraction || new Date().toISOString(),
          metadata: {}
        };
      } else if (typesToFind.includes("progress" as TrackingEventType)) {
        return {
          type: "progress" as TrackingEventType,
          timestamp: (screeningData.trackingData as any).lastInteraction || new Date().toISOString(),
          metadata: {
            completionPercent: (screeningData.trackingData as any).progress || 0
          }
        };
      } else if (typesToFind.includes("submitted" as TrackingEventType) && oldStatus === "completed") {
        return {
          type: "submitted" as TrackingEventType,
          timestamp: (screeningData.trackingData as any).lastInteraction || new Date().toISOString(),
          metadata: {}
        };
      }
      
      return undefined;
    }
    
    // New format with array of tracking events
    if (screeningData.trackingData.length === 0) {
      return undefined;
    }
    
    // Filter events by type(s)
    let filteredEvents = screeningData.trackingData;
    if (Array.isArray(type)) {
      filteredEvents = screeningData.trackingData.filter(event => type.includes(event.type));
    } else {
      filteredEvents = screeningData.trackingData.filter(event => event.type === type);
    }
    
    // Sort by timestamp descending to get the most recent first
    if (filteredEvents.length === 0) {
      return undefined;
    }
    
    return filteredEvents.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
  };
  
  // Helper to safely access tracking data, handling both old and new formats
  const matchesTrackingType = (screening: any, type: string | string[]): boolean => {
    // If trackingData doesn't exist or is not properly formatted, return false
    if (!screening || !screening.trackingData) return false;
    
    // Handle old format (object with status property)
    if (!Array.isArray(screening.trackingData) && typeof screening.trackingData === 'object') {
      const oldStatus = screening.trackingData.status;
      if (Array.isArray(type)) {
        return type.includes(oldStatus);
      }
      return oldStatus === type;
    }
    
    // Handle new format (array of tracking events)
    if (Array.isArray(screening.trackingData)) {
      if (Array.isArray(type)) {
        return type.some(t => screening.trackingData.some((event: any) => event.type === t));
      }
      return screening.trackingData.some((event: any) => event.type === type);
    }
    
    return false;
  };

  // Helper to check if a deal has screening data matching a specific status
  const hasScreeningWithStatus = (deal: any, status: string | string[]): boolean => {
    const screeningData = getScreeningData(deal);
    if (!screeningData || screeningData.length === 0) return false;
    
    return screeningData.some(screening => matchesTrackingType(screening, status));
  };
  
  // Helper to get screening items with specific statuses
  const getScreeningWithStatus = (deal: any, status: string | string[]): ScreeningData[] => {
    const screeningData = getScreeningData(deal);
    if (!screeningData || screeningData.length === 0) return [];
    
    return screeningData.filter(screening => matchesTrackingType(screening, status));
  };
  
  // Function to generate default email template when no deal is selected
  const generateDefaultEmailTemplate = () => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://sixpoint-web-assets.s3.us-east-1.amazonaws.com/purple+logo+new+2025.png" alt="SixPoint Logo" style="width: 150px;">
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
          <h2 style="color: #4a2b87; margin-bottom: 15px;">Pre-Screening for [Deal]</h2>
          <p style="margin-bottom: 20px;">Akses welcomes you to our AI AVATAR Pre-Screening. We will guide you through the entire process. Click the link below to start your deal with us.</p>
          <div style="text-align: center;">
            <a href="https://originator.akses.ai/prescreening/deal-id" style="display: inline-block; background-color: #4a2b87; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Start Pre-Screening Process</a>
          </div>
          <p style="margin-top: 20px; font-size: 14px; color: #666;">If you have any questions, please don't hesitate to contact us at support@sixpoint.com</p>
        </div>
        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
          <p>© 2025 SixPoint Partners. All rights reserved.</p>
        </div>
      </div>
    `;
  };

  // Function to generate email template for a specific deal
  const generateDealEmailTemplate = (deal: Deal) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://sixpoint-web-assets.s3.us-east-1.amazonaws.com/purple+logo+new+2025.png" alt="SixPoint Logo" style="width: 150px;">
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
          <h2 style="color: #4a2b87; margin-bottom: 15px;">Pre-Screening for ${deal.name || 'Your Deal'}</h2>
          <p style="margin-bottom: 20px;">Akses welcomes you to our AI AVATAR Pre-Screening. We will guide you through the entire process. Click the link below to start your deal with us.</p>
          <div style="text-align: center;">
            <a href="https://originator.akses.ai/prescreening/${deal.id}" style="display: inline-block; background-color: #4a2b87; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Start Pre-Screening Process</a>
          </div>
          <p style="margin-top: 20px; font-size: 14px; color: #666;">If you have any questions, please don't hesitate to contact us at support@sixpoint.com</p>
        </div>
        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
          <p>© 2025 SixPoint Partners. All rights reserved.</p>
        </div>
      </div>
    `;
  };
  
  // Set emails method for external access (from AI Command Center)
  prescreeningRef.current.setEmails = (emails: string) => {
    console.log('Pre-screening emails set via ref:', emails);
    
    // Extract just the email addresses from the text
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const extractedEmails = emails.match(emailRegex);
    
    if (extractedEmails && extractedEmails.length > 0) {
      // Join multiple emails with commas
      const cleanedEmails = extractedEmails.join(',');
      console.log("Extracted clean emails:", extractedEmails);
      
      // Set the form value with cleaned emails
      form.setValue('recipientEmails', cleanedEmails);
      
      // Set showModal to true so the form appears
      setShowModal(true);
      
      // Optional: Automatically submit the form if a deal is selected
      if (form.getValues('dealId')) {
        // We have both a deal and emails, let's submit automatically
        const currentFormValues = form.getValues();
        if (currentFormValues.dealId && cleanedEmails) {
          const requestData = {
            dealId: currentFormValues.dealId,
            // Convert the cleaned emails string to an array
            recipientEmails: cleanedEmails.split(',').map(email => email.trim()),
            additionalContext: currentFormValues.additionalContext || '',
            emailContent: emailPreview
          };
          
          // Small delay to ensure state updates have been processed
          setTimeout(() => {
            // Make direct API request instead of using the mutation to bypass recipientEmails processing
            apiRequest("POST", "/api/prescreening/send", requestData)
              .then(data => {
                toast({
                  title: "Pre-Screening Email Sent",
                  description: `The pre-screening email has been sent to the specified recipients.`,
                });
                queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
                setShowModal(false);
              })
              .catch(error => {
                toast({
                  title: "Error",
                  description: `Failed to send pre-screening email: ${error.toString()}`,
                  variant: "destructive",
                });
              });
          }, 500);
        }
      }
    } else {
      console.log("No valid emails found in input:", emails);
      toast({
        title: "Invalid Email Format",
        description: "Please provide a valid email address.",
        variant: "destructive"
      });
    }
  };

  // Expose the setEmails method to the window object for external components
  useEffect(() => {
    window.setPreScreeningEmails = (emails: string) => {
      prescreeningRef.current.setEmails(emails);
    };

    // Cleanup
    return () => {
      window.setPreScreeningEmails = undefined;
    };
  }, []);
  
  // Initialize email preview with default or deal-specific template
  useEffect(() => {
    if (deals.length > 0) {
      // If we have an initialDealId, try to find that deal
      if (initialDealId) {
        const selectedDeal = deals.find(d => d.id === initialDealId);
        if (selectedDeal) {
          setEmailPreview(generateDealEmailTemplate(selectedDeal));
          form.setValue('dealId', initialDealId); // Set the form's dealId
          return;
        }
      }
    }
    
    // If no match or no initialDealId, use default template
    setEmailPreview(generateDefaultEmailTemplate());
  }, [initialDealId, deals, form]);
  
  // Update email template when deal selection changes
  const handleDealChange = (dealId: string) => {
    form.setValue("dealId", dealId);
    const selectedDeal = deals.find(d => d.id === dealId);
    if (selectedDeal) {
      setEmailPreview(generateDealEmailTemplate(selectedDeal));
    } else {
      setEmailPreview(generateDefaultEmailTemplate());
    }
  };

  // Submit handler
  const sendPreScreeningMutation = useMutation({
    mutationFn: async (data: PreScreeningForm) => {
      const requestData = {
        dealId: data.dealId,
        recipientEmails: data.recipientEmails.split(",").map(email => email.trim()),
        additionalContext: data.additionalContext,
        emailContent: emailPreview
      };
      
      return await apiRequest("POST", "/api/prescreening/send", requestData);
    },
    onSuccess: (data) => {
      toast({
        title: "Pre-Screening Email Sent",
        description: `The pre-screening email has been sent to the specified recipients using info@rsvp.emfintechconference.com as the sender.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
      form.reset();
      setShowModal(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to send pre-screening email: ${error.toString()}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PreScreeningForm) => {
    sendPreScreeningMutation.mutate(data);
  };
  
  // Function to handle opening the deal details modal
  const handleDealClick = (deal: any, screening: ScreeningData) => {
    setSelectedDeal(deal);
    setSelectedScreening(screening);
    setShowDetailModal({ open: true, showTimeline: false });
  };

  return (
    <div className="flex flex-col h-full">
      <ConcentricPattern />
      <div className="flex-1 z-10 overflow-auto">
        <div className="max-w-5xl mx-auto p-4">
          <Card className="bg-dark-surface">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>AI-Driven Pre-Screening</CardTitle>
                  <CardDescription>
                    Visual overview of all pre-screening processes and their current status
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                  <Select defaultValue="all" onValueChange={(value) => setStatusFilter(value)}>
                    <SelectTrigger className="w-full sm:w-[180px] text-white bg-dark-surface border-gray-700">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121220] text-white border border-gray-700 shadow-lg" style={{ backgroundColor: '#121220', backdropFilter: 'none' }}>
                      <SelectItem value="all" className="text-white hover:bg-purple-700 focus:bg-purple-700">All Statuses</SelectItem>
                      <SelectItem value="sent" className="text-white hover:bg-purple-700 focus:bg-purple-700">Email Sent</SelectItem>
                      <SelectItem value="opened" className="text-white hover:bg-purple-700 focus:bg-purple-700">Email Opened</SelectItem>
                      <SelectItem value="interacting" className="text-white hover:bg-purple-700 focus:bg-purple-700">In Progress</SelectItem>
                      <SelectItem value="completed" className="text-white hover:bg-purple-700 focus:bg-purple-700">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={() => setShowModal(true)} 
                    className="w-full sm:w-auto"
                    size="sm"
                  >
                    <Send className="h-4 w-4 mr-2" /> New Pre-Screening
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Debug info to see data structure */}
              <div className="text-xs text-white/50 mb-4">
                Total deals: {deals.length}, 
                Deals with screening data: {deals.filter(d => getScreeningData(d).length > 0).length} 
              </div>
              {deals.some(deal => getScreeningData(deal).length > 0) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Status Column: Email Sent */}
                  <div className="flex flex-col">
                    <div className="bg-purple-900/20 rounded-t-lg p-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        <h3 className="font-semibold">Email Sent</h3>
                        <Badge variant="outline" className="ml-auto">
                          {deals.filter(deal => hasScreeningWithStatus(deal, "sent")).length}
                        </Badge>
                      </div>
                    </div>
                    <div className="bg-purple-900/10 rounded-b-lg p-3 min-h-[300px] space-y-3">
                      {deals
                        .filter(deal => hasScreeningWithStatus(deal, "sent"))
                        .map(deal => (
                          <div 
                            key={deal.id} 
                            className="bg-dark-surface p-3 rounded-lg border border-white/10 hover:border-purple-500 transition-colors cursor-pointer"
                            onClick={() => {
                              const screenings = getScreeningWithStatus(deal, "sent");
                              if (screenings.length > 0) {
                                handleDealClick(deal, screenings[0]);
                              }
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-sm truncate">{deal.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {getScreeningWithStatus(deal, "sent")
                                    .sort((a, b) => {
                                      const aEvent = getLatestTrackingEvent(a, "sent");
                                      const bEvent = getLatestTrackingEvent(b, "sent");
                                      return new Date(bEvent?.timestamp || "").getTime() - 
                                             new Date(aEvent?.timestamp || "").getTime();
                                    })
                                    .map(item => {
                                      const event = getLatestTrackingEvent(item, "sent");
                                      return event ? new Date(event.timestamp).toLocaleDateString() : "";
                                    })[0]
                                }
                              </Badge>
                            </div>
                            <div className="mt-2 space-y-2">
                              {getScreeningWithStatus(deal, "sent")
                                .map((screening, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-xs text-white/70">
                                    <Mail className="h-3 w-3" />
                                    <span className="truncate">{screening.recipientEmails[0]}</span>
                                    {typeof screening.resendCount === 'number' && screening.resendCount > 0 && (
                                      <Badge variant="outline" className="ml-auto text-xs py-0 h-4">
                                        Resent {screening.resendCount}x
                                      </Badge>
                                    )}
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                        ))
                      }
                      {!deals.some(deal => hasScreeningWithStatus(deal, "sent")) && (
                        <div className="flex flex-col items-center justify-center h-full text-white/50">
                          <Send className="h-8 w-8 mb-2 opacity-30" />
                          <p className="text-sm">No emails sent</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Status Column: Lead Enrichment */}
                  <div className="flex flex-col">
                    <div className="bg-blue-900/20 rounded-t-lg p-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        <h3 className="font-semibold">Lead Enrichment</h3>
                        <Badge variant="outline" className="ml-auto">
                          {deals.filter(deal => hasScreeningWithStatus(deal, ["opened", "interacting"])).length}
                        </Badge>
                      </div>
                    </div>
                    <div className="bg-blue-900/10 rounded-b-lg p-3 min-h-[300px] space-y-3">
                      {deals
                        .filter(deal => hasScreeningWithStatus(deal, ["opened", "interacting"]))
                        .map(deal => (
                          <div 
                            key={deal.id} 
                            className="bg-dark-surface p-3 rounded-lg border border-white/10 hover:border-blue-500 transition-colors cursor-pointer"
                            onClick={() => {
                              const screenings = getScreeningWithStatus(deal, ["opened", "interacting"]);
                              if (screenings.length > 0) {
                                handleDealClick(deal, screenings[0]);
                              }
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-sm truncate">{deal.name}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {(() => {
                                  const screenings = getScreeningWithStatus(deal, ["opened", "interacting"]);
                                  const progressValues = screenings.map(s => {
                                    const latestProgress = getLatestTrackingEvent(s, "progress");
                                    return latestProgress?.metadata?.completionPercent || 0;
                                  });
                                  return progressValues.length > 0 ? Math.max(...progressValues) : 0;
                                })()}%
                              </Badge>
                            </div>
                            <div className="mt-2 space-y-2">
                              {getScreeningWithStatus(deal, ["opened", "interacting"])
                                .map((screening, idx) => (
                                  <div key={idx} className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-white/70 truncate">{screening.recipientEmails[0]}</span>
                                      <span className="text-white/70">
                                        {(() => {
                                          // Show the latest status based on tracking events
                                          const events = ["progress", "started", "opened"];
                                          for (const eventType of events) {
                                            const event = getLatestTrackingEvent(screening, eventType as TrackingEventType);
                                            if (event) return eventType;
                                          }
                                          return "in progress";
                                        })()}
                                      </span>
                                    </div>
                                    <Progress 
                                      value={(() => {
                                        const progressEvent = getLatestTrackingEvent(screening, "progress");
                                        return progressEvent?.metadata?.completionPercent || 0;
                                      })()} 
                                      className="h-1" 
                                    />
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                        ))
                      }
                      {!deals.some(deal => hasScreeningWithStatus(deal, ["opened", "interacting"])) && (
                        <div className="flex flex-col items-center justify-center h-full text-white/50">
                          <Database className="h-8 w-8 mb-2 opacity-30" />
                          <p className="text-sm">No leads in progress</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Status Column: Completed */}
                  <div className="flex flex-col">
                    <div className="bg-green-900/20 rounded-t-lg p-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <h3 className="font-semibold">Completed</h3>
                        <Badge variant="outline" className="ml-auto">
                          {deals.filter(deal => hasScreeningWithStatus(deal, "completed")).length}
                        </Badge>
                      </div>
                    </div>
                    <div className="bg-green-900/10 rounded-b-lg p-3 min-h-[300px] space-y-3">
                      {deals
                        .filter(deal => hasScreeningWithStatus(deal, "completed"))
                        .map(deal => (
                          <div 
                            key={deal.id} 
                            className="bg-dark-surface p-3 rounded-lg border border-white/10 hover:border-green-500 transition-colors cursor-pointer"
                            onClick={() => {
                              const screenings = getScreeningWithStatus(deal, "completed");
                              if (screenings.length > 0) {
                                handleDealClick(deal, screenings[0]);
                              }
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-sm truncate">{deal.name}</h4>
                              <Badge variant="default" className="text-xs bg-green-600 hover:bg-green-700">100%</Badge>
                            </div>
                            <div className="mt-2 space-y-2">
                              {getScreeningWithStatus(deal, "completed")
                                .map((screening, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-xs text-white/70">
                                    <CheckSquare className="h-3 w-3 text-green-400" />
                                    <span className="truncate">{screening.recipientEmails[0]}</span>
                                    <span className="text-xs ml-auto">
                                      {(() => {
                                        const submittedEvent = getLatestTrackingEvent(screening, "submitted");
                                        return submittedEvent ? new Date(submittedEvent.timestamp).toLocaleDateString() : "";
                                      })()}
                                    </span>
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                        ))
                      }
                      {!deals.some(deal => hasScreeningWithStatus(deal, "completed")) && (
                        <div className="flex flex-col items-center justify-center h-full text-white/50">
                          <CheckCircle className="h-8 w-8 mb-2 opacity-30" />
                          <p className="text-sm">No completed screenings</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-white/60">
                  <CheckSquare className="h-16 w-16 mb-4 opacity-20" />
                  <h3 className="text-lg font-medium mb-2">No Pre-Screening Processes Found</h3>
                  <p className="max-w-md text-center mb-6">Start a new pre-screening process by selecting a deal and entering recipient emails.</p>
                  <Button variant="outline" size="sm" onClick={() => setShowModal(true)}>
                    <Send className="h-4 w-4 mr-2" />
                    Create Pre-Screening
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Details Modal */}
      <Dialog open={showDetailModal.open} onOpenChange={(open) => setShowDetailModal(prev => ({ ...prev, open }))}>
        <DialogContent className="bg-dark-surface border-gray-700 text-white max-w-5xl dialog-content-bg overflow-y-auto max-h-[95vh]">
          <div className="flex justify-end absolute top-2 right-2">
            <Button 
              variant="ghost" 
              className="h-6 w-6 p-0 rounded-full" 
              onClick={() => setShowDetailModal(prev => ({ ...prev, open: false }))}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Pre-Screening Timeline</DialogTitle>
            <DialogDescription className="text-center text-gray-400">
              {selectedDeal?.name || "Deal"} - Detailed progress tracking
            </DialogDescription>
          </DialogHeader>
          
          {selectedDeal && selectedScreening && (
            <div className="space-y-8 mt-6">
              {/* Deal Info Card */}
              <div>
                <h2 className="text-2xl font-semibold mb-2">{selectedDeal.name}</h2>
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span>Recipients: {selectedScreening.recipientEmails.join(", ")}</span>
                </div>
                {selectedScreening.additionalContext && (
                  <div className="flex items-start gap-2 text-gray-400 mt-1">
                    <MessageCircle className="h-4 w-4 mt-0.5" />
                    <span>Context: {selectedScreening.additionalContext}</span>
                  </div>
                )}
                
                {/* Send Follow-up Email Button */}
                <div className="flex justify-end mt-4">
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => {
                      // Pre-fill the form with the deal ID
                      form.setValue("dealId", selectedDeal.id);
                      form.setValue("recipientEmails", selectedScreening.recipientEmails.join(", "));
                      
                      // Close the details modal and show the new screening modal
                      setShowDetailModal(prev => ({ ...prev, open: false }));
                      setShowModal(true);
                    }}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Follow-up Email
                  </Button>
                </div>
              </div>
              
              {/* Current Status */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Current Status</h3>
                
                {/* Status Cards */}
                <div className="grid grid-cols-5 gap-4">
                  {/* Email Sent */}
                  <div className="bg-gray-900/60 rounded-lg p-4">
                    <div className="flex flex-col items-center">
                      <div className="bg-purple-900/20 rounded-full p-3 mb-2">
                        <Send className="h-5 w-5 text-purple-400" />
                      </div>
                      <h4 className="font-medium text-center">Email Sent</h4>
                      <p className="text-sm text-gray-400 mt-1 text-center">
                        {(() => {
                          const event = getLatestTrackingEvent(selectedScreening, "sent");
                          if (!event) return "Not sent";
                          const date = new Date(event.timestamp);
                          return `${date.toLocaleDateString()}, ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                        })()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Email Viewed */}
                  <div className="bg-gray-900/60 rounded-lg p-4">
                    <div className="flex flex-col items-center">
                      <div className="bg-blue-900/20 rounded-full p-3 mb-2">
                        <Eye className="h-5 w-5 text-blue-400" />
                      </div>
                      <h4 className="font-medium text-center">Email Viewed</h4>
                      <p className="text-sm text-gray-400 mt-1 text-center">
                        {(() => {
                          const event = getLatestTrackingEvent(selectedScreening, "opened");
                          if (!event) return "Not viewed";
                          const date = new Date(event.timestamp);
                          return `${date.toLocaleDateString()}, ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                        })()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Process Started */}
                  <div className="bg-gray-900/60 rounded-lg p-4">
                    <div className="flex flex-col items-center">
                      <div className="bg-yellow-900/20 rounded-full p-3 mb-2">
                        <Play className="h-5 w-5 text-yellow-400" />
                      </div>
                      <h4 className="font-medium text-center">Process Started</h4>
                      <p className="text-sm text-gray-400 mt-1 text-center">
                        {(() => {
                          const event = getLatestTrackingEvent(selectedScreening, "started");
                          if (!event) return "Not started";
                          const date = new Date(event.timestamp);
                          return `${date.toLocaleDateString()}, ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                        })()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress */}
                  <div className="bg-gray-900/60 rounded-lg p-4">
                    <div className="flex flex-col items-center">
                      <div className="bg-orange-900/20 rounded-full p-3 mb-2">
                        <Activity className="h-5 w-5 text-orange-400" />
                      </div>
                      <h4 className="font-medium text-center">Progress</h4>
                      <div className="w-full mt-2">
                        <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-orange-700 to-orange-500"
                            style={{ 
                              width: `${(() => {
                                const event = getLatestTrackingEvent(selectedScreening, "progress");
                                return event?.metadata?.completionPercent || 0;
                              })()}%` 
                            }}
                          ></div>
                        </div>
                        <p className="text-sm text-center mt-1">
                          {(() => {
                            const event = getLatestTrackingEvent(selectedScreening, "progress");
                            return event?.metadata?.completionPercent || 0;
                          })()}%
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Completed */}
                  <div className="bg-gray-900/60 rounded-lg p-4">
                    <div className="flex flex-col items-center">
                      <div className="bg-green-900/20 rounded-full p-3 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                      <h4 className="font-medium text-center">Completed</h4>
                      <p className="text-sm text-gray-400 mt-1 text-center">
                        {(() => {
                          const event = getLatestTrackingEvent(selectedScreening, "submitted");
                          if (!event) return "Not completed";
                          const date = new Date(event.timestamp);
                          return `${date.toLocaleDateString()}, ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Event Timeline - Collapsible */}
              <div className="mt-8">
                {/* Timeline Toggle Button */}
                <div 
                  className="flex justify-between items-center cursor-pointer mb-2" 
                  onClick={() => setShowDetailModal(prev => ({ ...prev, showTimeline: !prev.showTimeline }))}
                >
                  <h3 className="text-lg font-medium">Event Timeline</h3>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                    {showDetailModal.showTimeline ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <div className="rotate-180">
                        <ArrowUp className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </div>
                
                {/* Timeline Content - Only shown when expanded */}
                {showDetailModal.showTimeline && (
                  <div className="rounded-lg overflow-hidden">
                    {(() => {
                      // Get all events sorted by timestamp
                      let events: TrackingEvent[] = [];
                      
                      // Handle old format (object with properties)
                      if (!Array.isArray(selectedScreening.trackingData)) {
                        // Convert old format to events array
                        const oldData = selectedScreening.trackingData as any;
                        if (oldData.status === "sent") {
                          events.push({
                            type: "sent",
                            timestamp: oldData.timestamp || oldData.lastInteraction || selectedScreening.timestamp,
                            metadata: { status: "sent" }
                          });
                        }
                        if (oldData.status === "opened" || oldData.status === "viewing") {
                          events.push({
                            type: "opened",
                            timestamp: oldData.openedAt || oldData.lastInteraction || new Date().toISOString(),
                            metadata: { status: oldData.status }
                          });
                        }
                        if (oldData.progress && oldData.progress > 0) {
                          events.push({
                            type: "progress",
                            timestamp: oldData.lastInteraction || new Date().toISOString(),
                            metadata: { completionPercent: oldData.progress }
                          });
                        }
                        if (oldData.status === "completed") {
                          events.push({
                            type: "submitted",
                            timestamp: oldData.completedAt || oldData.lastInteraction || new Date().toISOString(),
                            metadata: { status: "completed" }
                          });
                        }
                      } else {
                        // New format
                        events = [...selectedScreening.trackingData];
                      }
                      
                      // Sort events chronologically (oldest first)
                      events.sort((a, b) => 
                        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                      );
                      
                      return events.map((event, idx) => {
                        const date = new Date(event.timestamp);
                        const formattedDate = `${date.toLocaleDateString()}, ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}`;
                        
                        return (
                          <div 
                            key={idx} 
                            className={`flex p-4 ${idx % 2 === 0 ? 'bg-gray-800/20' : 'bg-gray-800/40'}`}
                          >
                            <div className="w-44 text-sm text-gray-400 shrink-0">
                              {formattedDate}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {event.type === "sent" && (
                                <>
                                  <div className="text-purple-500 bg-purple-900/20 p-1 rounded-full">
                                    <Send className="h-4 w-4" />
                                  </div>
                                  <span className="font-medium">Email Sent</span>
                                </>
                              )}
                              {event.type === "opened" && (
                                <>
                                  <div className="text-blue-500 bg-blue-900/20 p-1 rounded-full">
                                    <Eye className="h-4 w-4" />
                                  </div>
                                  <span className="font-medium">Email Opened</span>
                                </>
                              )}
                              {event.type === "started" && (
                                <>
                                  <div className="text-yellow-500 bg-yellow-900/20 p-1 rounded-full">
                                    <Play className="h-4 w-4" />
                                  </div>
                                  <span className="font-medium">Pre-Screening Started</span>
                                </>
                              )}
                              {event.type === "progress" && (
                                <>
                                  <div className="text-orange-500 bg-orange-900/20 p-1 rounded-full">
                                    <Activity className="h-4 w-4" />
                                  </div>
                                  <span className="font-medium">Progress Update: {event.metadata?.completionPercent || 0}%</span>
                                  <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden ml-2">
                                    <div 
                                      className="h-full bg-gradient-to-r from-orange-700 to-orange-500"
                                      style={{ width: `${event.metadata?.completionPercent || 0}%` }}
                                    ></div>
                                  </div>
                                </>
                              )}
                              {event.type === "submitted" && (
                                <>
                                  <div className="text-green-500 bg-green-900/20 p-1 rounded-full">
                                    <CheckCircle className="h-4 w-4" />
                                  </div>
                                  <span className="font-medium">Pre-Screening Completed</span>
                                </>
                              )}
                              {event.type === "done" && (
                                <>
                                  <div className="text-green-500 bg-green-900/20 p-1 rounded-full">
                                    <CheckSquare className="h-4 w-4" />
                                  </div>
                                  <span className="font-medium">Process Finalized</span>
                                </>
                              )}
                              {event.type === "error" && (
                                <>
                                  <div className="text-red-500 bg-red-900/20 p-1 rounded-full">
                                    <AlertCircle className="h-4 w-4" />
                                  </div>
                                  <span className="font-medium">Error Occurred</span>
                                  {event.metadata && event.metadata.error && (
                                    <span className="text-sm text-red-400 ml-2">{event.metadata.error}</span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
            
      {/* New Pre-Screening Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-dark-surface border-gray-700 text-white max-w-md dialog-content-bg">
          <DialogHeader>
            <DialogTitle className="text-center">AI-Driven Pre-Screening</DialogTitle>
            <DialogDescription className="text-center text-gray-400">
              Create a new pre-screening process to evaluate deals
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dealId">Company</Label>
              <Select 
                onValueChange={(value) => handleDealChange(value)}
                defaultValue={form.getValues("dealId")}
              >
                <SelectTrigger className="w-full text-white bg-dark-surface border-gray-700">
                  <SelectValue placeholder="Select a company" className="text-white" />
                </SelectTrigger>
                <SelectContent className="bg-[#121220] text-white border border-gray-700 shadow-lg" style={{ backgroundColor: '#121220', backdropFilter: 'none' }}>
                  {deals.map((deal) => (
                    <SelectItem key={deal.id} value={deal.id} className="text-white hover:bg-purple-700 focus:bg-purple-700">
                      {deal.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.dealId && (
                <p className="text-sm text-red-500">{form.formState.errors.dealId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientEmails">Emails</Label>
              <Input
                placeholder="Enter emails separated by commas"
                className="text-white bg-dark-surface border-gray-700"
                {...form.register("recipientEmails")}
              />
              {form.formState.errors.recipientEmails && (
                <p className="text-sm text-red-500">{form.formState.errors.recipientEmails.message}</p>
              )}
            </div>

            <div className="pt-2 flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowEmailPreview(!showEmailPreview)}
              >
                {showEmailPreview ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Show Preview
                  </>
                )}
              </Button>

              <Button
                type="submit"
                size="sm"
                disabled={sendPreScreeningMutation.isPending}
              >
                {sendPreScreeningMutation.isPending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : "Send"}
              </Button>
            </div>

            {showEmailPreview && (
              <div className="border border-gray-700 rounded p-2 mt-4 bg-white text-black h-[300px] overflow-auto">
                <div dangerouslySetInnerHTML={{ __html: emailPreview }} />
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
