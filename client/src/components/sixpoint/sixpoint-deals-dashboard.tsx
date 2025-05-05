import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SixpointDeal } from "@shared/schema";
import { SixpointDealsTable } from "./sixpoint-deals-table";
import { SixpointDealFilters } from "./sixpoint-deal-filters";
import { SixpointDealStatistics } from "./sixpoint-deal-statistics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export function SixpointDealsDashboard() {
  // State for selected deal and filters
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [selectedCreditHub, setSelectedCreditHub] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  
  // Fetch deal details when a deal is selected
  const { data: selectedDeal, isLoading: isLoadingDeal } = useQuery<SixpointDeal>({
    queryKey: ['/api/sixpoint-deals', selectedDealId],
    enabled: !!selectedDealId,
  });
  
  // Function to handle deal row click
  const handleDealClick = (dealId: string) => {
    setSelectedDealId(dealId);
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">SixPoint Deals Dashboard</h2>
        <p className="text-muted-foreground">
          View and manage all SixPoint deals in one place.
        </p>
      </div>

      <Tabs defaultValue="table" className="space-y-6">
        <TabsList>
          <TabsTrigger value="table">Deals Table</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table" className="space-y-6">
          <SixpointDealFilters
            selectedStage={selectedStage}
            selectedCreditHub={selectedCreditHub}
            selectedLead={selectedLead}
            onStageChange={setSelectedStage}
            onCreditHubChange={setSelectedCreditHub}
            onLeadChange={setSelectedLead}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <SixpointDealsTable
                selectedDealId={selectedDealId}
                onRowClick={handleDealClick}
              />
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Deal Details</CardTitle>
                  <CardDescription>
                    {selectedDealId ? "View detailed information about the selected deal" : "Select a deal to view details"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDealId ? (
                    isLoadingDeal ? (
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ) : selectedDeal ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold">Name</h3>
                          <p>{selectedDeal.name || "Unnamed Deal"}</p>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold">Lead</h3>
                          <p>{selectedDeal.lead || "Unassigned"}</p>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold">Location</h3>
                          <p>{selectedDeal.country || "Unknown"} ({selectedDeal.creditHub || "Unknown Region"})</p>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold">Stage</h3>
                          <p>{selectedDeal.stage || "Unknown"}</p>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold">Priority</h3>
                          <p>{selectedDeal.priority || "Not set"}</p>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold">Members</h3>
                          <p>
                            {selectedDeal.members && selectedDeal.members.length > 0
                              ? selectedDeal.members.join(", ")
                              : "No members assigned"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Deal not found</p>
                    )
                  ) : (
                    <p className="text-muted-foreground">Select a deal from the table to view details</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="statistics">
          <SixpointDealStatistics />
        </TabsContent>
      </Tabs>
    </div>
  );
}