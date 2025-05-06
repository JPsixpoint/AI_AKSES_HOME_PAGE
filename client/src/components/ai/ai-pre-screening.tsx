import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Send,
  Upload,
  Check,
  X,
  FileText,
  Clock,
  RefreshCw,
  Activity,
  CheckSquare
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Deal } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ConcentricPattern } from "@/components/ui/concentric-pattern";

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
  const { data: deals = [] } = useQuery({
    queryKey: ["/api/deals"],
  });
  
  // Update email preview when deal changes
  useEffect(() => {
    const dealId = form.watch("dealId");
    if (dealId) {
      const selectedDeal = deals.find((d: Deal) => d.id === dealId);
      if (selectedDeal) {
        generateEmailPreview(selectedDeal);
      }
    }
  }, [form.watch("dealId"), deals]);

  // Generate HTML email preview
  const generateEmailPreview = (deal: Deal) => {
    const emailHtml = `
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
    setEmailPreview(emailHtml);
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
      
      return await apiRequest("/api/prescreening/send", {
        method: "POST",
        data: requestData
      });
    },
    onSuccess: () => {
      toast({
        title: "Pre-Screening Email Sent",
        description: "The pre-screening email has been sent successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
      form.reset();
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
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 p-4">
          <div className="col-span-1 lg:col-span-2">
            <Card className="bg-dark-surface">
              <CardHeader>
                <CardTitle>AI Pre-Screening</CardTitle>
                <CardDescription>
                  Start the AI AVATAR Pre-Screening process for a deal.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="dealId">Select Deal</Label>
                    <Select 
                      onValueChange={(value) => form.setValue("dealId", value)}
                      defaultValue={form.getValues("dealId")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a deal" />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-lighter">
                        {deals.map((deal: Deal) => (
                          <SelectItem key={deal.id} value={deal.id}>
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
                    <Label htmlFor="recipientEmails">Recipient Emails</Label>
                    <Input
                      placeholder="Enter emails separated by commas"
                      {...form.register("recipientEmails")}
                    />
                    {form.formState.errors.recipientEmails && (
                      <p className="text-sm text-red-500">{form.formState.errors.recipientEmails.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Enter multiple emails separated by commas</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalContext">Additional Context (Optional)</Label>
                    <Textarea
                      placeholder="Add any additional information or context for the recipient..."
                      {...form.register("additionalContext")}
                      rows={4}
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={sendPreScreeningMutation.isPending}
                    >
                      {sendPreScreeningMutation.isPending ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Pre-Screening Email
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-1 lg:col-span-3">
            <Card className="bg-dark-surface">
              <CardHeader>
                <CardTitle>Email Preview</CardTitle>
                <CardDescription>
                  Preview of the pre-screening email that will be sent
                </CardDescription>
              </CardHeader>
              <CardContent className="border border-white/10 rounded-md p-4 bg-white text-black h-[600px] overflow-auto">
                {emailPreview ? (
                  <div dangerouslySetInnerHTML={{ __html: emailPreview }} />
                ) : (
                  <div className="flex items-center justify-center h-full text-dark">
                    <div className="text-center">
                      <AlertCircle className="mx-auto h-12 w-12 mb-2 opacity-30" />
                      <p>Select a deal to preview the email</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Active Pre-Screening Processes */}
        <div className="max-w-4xl mx-auto mt-8 p-4">
          <Card className="bg-dark-surface">
            <CardHeader>
              <CardTitle>Active Pre-Screening Processes</CardTitle>
              <CardDescription>
                Monitor the progress of ongoing pre-screening processes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deals
                  .filter((deal: any) => deal.aiScreening && deal.aiScreening.length > 0)
                  .map((deal: any) => (
                    <div key={deal.id} className="border border-white/10 rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{deal.name}</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {deal.aiScreening.map((screening: any, index: number) => {
                              let badgeVariant: "default" | "secondary" | "outline" | "destructive" = "outline";
                              let icon = <Clock className="h-3 w-3 mr-1" />;
                              
                              if (screening.trackingData.status === "sent") {
                                badgeVariant = "outline";
                                icon = <Clock className="h-3 w-3 mr-1" />;
                              } else if (screening.trackingData.status === "opened") {
                                badgeVariant = "secondary";
                                icon = <Activity className="h-3 w-3 mr-1" />;
                              } else if (screening.trackingData.status === "interacting") {
                                badgeVariant = "default";
                                icon = <RefreshCw className="h-3 w-3 mr-1" />;
                              } else if (screening.trackingData.status === "completed") {
                                badgeVariant = "default";
                                icon = <CheckSquare className="h-3 w-3 mr-1" />;
                              }
                              
                              return (
                                <Badge key={index} variant={badgeVariant} className="flex items-center">
                                  {icon}
                                  {screening.recipientEmails[0]}
                                  <span className="ml-1 text-xs">({screening.trackingData.status})</span>
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4 mr-1" /> View Details
                        </Button>
                      </div>
                      
                      {/* Progress bars for each screening */}
                      <div className="mt-4 space-y-3">
                        {deal.aiScreening.map((screening: any, index: number) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{screening.recipientEmails[0]}</span>
                              <span>{screening.trackingData.progress}% complete</span>
                            </div>
                            <Progress value={screening.trackingData.progress} className="h-2" />
                            <div className="text-xs text-muted-foreground">
                              Last activity: {new Date(screening.trackingData.lastInteraction).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                {(!deals.some((deal: any) => deal.aiScreening && deal.aiScreening.length > 0)) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="mx-auto h-12 w-12 mb-2 opacity-30" />
                    <p>No active pre-screening processes found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
