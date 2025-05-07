import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define the statistics response type
interface SixpointDealStatisticsResponse {
  totalDeals: number;
  stageStats: Record<string, number>;
  creditHubStats: Record<string, number>;
  countryStats: Record<string, number>;
  priorityStats: Record<string, number>;
  leadStats: Record<string, number>;
}

interface SixpointDealFiltersProps {
  selectedStage: string | null;
  selectedCreditHub: string | null;
  selectedLead: string | null;
  onStageChange: (stage: string | null) => void;
  onCreditHubChange: (creditHub: string | null) => void;
  onLeadChange: (lead: string | null) => void;
}

export function SixpointDealFilters({
  selectedStage,
  selectedCreditHub,
  selectedLead,
  onStageChange,
  onCreditHubChange,
  onLeadChange,
}: SixpointDealFiltersProps) {
  const { data: statistics } = useQuery<SixpointDealStatisticsResponse>({
    queryKey: ['/api/sixpoint-deals/statistics'],
  });

  // Create arrays of unique values for the filters
  const stages = statistics?.stageStats ? Object.keys(statistics.stageStats).sort() : [];
  const creditHubs = statistics?.creditHubStats ? Object.keys(statistics.creditHubStats).sort() : [];
  const leads = statistics?.leadStats ? Object.keys(statistics.leadStats).sort() : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Deals</CardTitle>
        <CardDescription>
          Filter the list of deals to find what you're looking for.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="stage-filter" className="text-sm font-medium">
              Stage
            </label>
            <Select
              value={selectedStage || "all_stages"}
              onValueChange={(value) => 
                onStageChange(value === "all_stages" ? null : value)
              }
            >
              <SelectTrigger id="stage-filter">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_stages">All Stages</SelectItem>
                {stages.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage} ({statistics?.stageStats?.[stage] || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="credit-hub-filter" className="text-sm font-medium">
              Credit Hub
            </label>
            <Select
              value={selectedCreditHub || "all_hubs"}
              onValueChange={(value) => 
                onCreditHubChange(value === "all_hubs" ? null : value)
              }
            >
              <SelectTrigger id="credit-hub-filter">
                <SelectValue placeholder="Select credit hub" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_hubs">All Credit Hubs</SelectItem>
                {creditHubs.map((hub) => (
                  <SelectItem key={hub} value={hub}>
                    {hub} ({statistics?.creditHubStats?.[hub] || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="lead-filter" className="text-sm font-medium">
              Lead
            </label>
            <Select
              value={selectedLead || "all_leads"}
              onValueChange={(value) => 
                onLeadChange(value === "all_leads" ? null : value)
              }
            >
              <SelectTrigger id="lead-filter">
                <SelectValue placeholder="Select lead" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_leads">All Leads</SelectItem>
                {leads.map((lead) => (
                  <SelectItem key={lead} value={lead}>
                    {lead.split('@')[0]} ({statistics?.leadStats?.[lead] || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}