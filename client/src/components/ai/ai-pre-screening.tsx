import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
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

interface AIPreScreeningProps {
  initialDealId?: string;
}

export function AIPreScreening({ initialDealId }: AIPreScreeningProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [emailPreview, setEmailPreview] = useState<string>("");
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

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
  interface ScreeningData {
    timestamp: string;
    initiatingUser: string;
    recipientEmails: string[];
    emailContent: string;
    additionalContext: string;
    status: "sent" | "not_sent";
    trackingData: {
      status: "sent" | "opened" | "interacting" | "completed" | "abandoned";
      progress: number;
      lastInteraction: string;
    };
  }

  // Helper function to handle both aiScreening and ai_screening properties
  const getScreeningData = (deal: any): ScreeningData[] => {
    // TypeScript workaround for dealing with both camelCase and snake_case properties
    return deal.aiScreening || (deal as any).ai_screening || [];
  };
  
  // Helper to check if a deal has screening data matching a specific status
  const hasScreeningWithStatus = (deal: any, status: string | string[]): boolean => {
    const screeningData = getScreeningData(deal);
    if (!screeningData || screeningData.length === 0) return false;
    
    if (Array.isArray(status)) {
      return screeningData.some((s: ScreeningData) => status.includes(s.trackingData.status));
    }
    return screeningData.some((s: ScreeningData) => s.trackingData.status === status);
  };
  
  // Helper to get screening items with specific statuses
  const getScreeningWithStatus = (deal: any, status: string | string[]): ScreeningData[] => {
    const screeningData = getScreeningData(deal);
    if (!screeningData || screeningData.length === 0) return [];
    
    if (Array.isArray(status)) {
      return screeningData.filter((s: ScreeningData) => status.includes(s.trackingData.status));
    }
    return screeningData.filter((s: ScreeningData) => s.trackingData.status === status);
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
  
  // Initialize email preview with default or deal-specific template
  useEffect(() => {
    if (deals.length > 0) {
      // If we have an initialDealId, try to find that deal
      if (initialDealId) {
        const selectedDeal = deals.find(d => d.id === initialDealId);
        if (selectedDeal) {
          setEmailPreview(generateDealEmailTemplate(selectedDeal));
          return;
        }
      }
    }
    
    // If no match or no initialDealId, use default template
    setEmailPreview(generateDefaultEmailTemplate());
  }, [initialDealId, deals]);
  
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
                          <div key={deal.id} className="bg-dark-surface p-3 rounded-lg border border-white/10 hover:border-purple-500 transition-colors">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-sm truncate">{deal.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {getScreeningWithStatus(deal, "sent")
                                    .sort((a, b) => new Date(b.trackingData.lastInteraction).getTime() - new Date(a.trackingData.lastInteraction).getTime())
                                    .map(item => new Date(item.trackingData.lastInteraction).toLocaleDateString())[0]
                                }
                              </Badge>
                            </div>
                            <div className="mt-2 space-y-2">
                              {getScreeningWithStatus(deal, "sent")
                                .map((screening, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-xs text-white/70">
                                    <Mail className="h-3 w-3" />
                                    <span className="truncate">{screening.recipientEmails[0]}</span>
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
                          <div key={deal.id} className="bg-dark-surface p-3 rounded-lg border border-white/10 hover:border-blue-500 transition-colors">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-sm truncate">{deal.name}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {getScreeningWithStatus(deal, ["opened", "interacting"])
                                    .map(s => s.trackingData.progress)
                                    .length > 0 ? 
                                      Math.max(
                                        ...getScreeningWithStatus(deal, ["opened", "interacting"])
                                          .map(s => s.trackingData.progress)
                                      ) : 0
                                }%
                              </Badge>
                            </div>
                            <div className="mt-2 space-y-2">
                              {getScreeningWithStatus(deal, ["opened", "interacting"])
                                .map((screening, idx) => (
                                  <div key={idx} className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-white/70 truncate">{screening.recipientEmails[0]}</span>
                                      <span className="text-white/70">{screening.trackingData.status}</span>
                                    </div>
                                    <Progress value={screening.trackingData.progress} className="h-1" />
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
                          <div key={deal.id} className="bg-dark-surface p-3 rounded-lg border border-white/10 hover:border-green-500 transition-colors">
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
                                    <span className="text-xs ml-auto">{new Date(screening.trackingData.lastInteraction).toLocaleDateString()}</span>
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
