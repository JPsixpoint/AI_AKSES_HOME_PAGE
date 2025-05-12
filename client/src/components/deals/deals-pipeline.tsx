import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DealsTable } from "./deals-table";
import { DealFilters } from "./deal-filters";
import { DealStatistics } from "./deal-statistics";

// Define the pipeline deal type to match the pipeline table structure
interface PipelineDeal {
  id: string;
  name: string | null;
  priority: string | null;
  country: string | null;
  lead: string | null;
  credit_hub: string | null;
  stage: string;
  updates: any[] | null;
  members: string[] | null;
  pre_screening: Record<string, any> | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  created_by?: number | null;
}
import { Button } from "../ui/button";
import { PlusIcon, SearchIcon, RefreshCwIcon } from "lucide-react";
import { Input } from "../ui/input";

interface DealsPipelineProps {
  selectedDealId?: string | null;
  onSelectedDealChange: (dealId: string | null) => void;
}

export function DealsPipeline({ selectedDealId, onSelectedDealChange }: DealsPipelineProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState<string | null>(null);
  const queryClient = useQueryClient();
  
  // Define sample deals for when the API fails
  const sampleDeals: PipelineDeal[] = [
    {
      id: "1",
      name: "Fintech Solutions Inc.",
      priority: "High",
      country: "United States",
      lead: "Sarah Johnson",
      credit_hub: "North America",
      stage: "Due Diligence & U/W",
      updates: null,
      members: ["team@akses.com"],
      pre_screening: null
    },
    {
      id: "2",
      name: "Global Payments Ltd.",
      priority: "Medium",
      country: "United Kingdom",
      lead: "Michael Chang",
      credit_hub: "Europe",
      stage: "Pre-Screening",
      updates: null,
      members: ["team@akses.com"],
      pre_screening: null
    },
    {
      id: "3",
      name: "Summit Credit Solutions",
      priority: "High",
      country: "Canada",
      lead: "Jessica Miller",
      credit_hub: "North America",
      stage: "Term Sheet Negotiation",
      updates: null,
      members: ["team@akses.com"],
      pre_screening: null
    },
    {
      id: "4",
      name: "Emerging Markets Finance",
      priority: "Low",
      country: "Brazil",
      lead: "Carlos Rodriguez",
      credit_hub: "Latin America",
      stage: "Lead",
      updates: null,
      members: ["team@akses.com"],
      pre_screening: null
    },
    {
      id: "5",
      name: "Asia Pacific Lenders",
      priority: "Medium",
      country: "Singapore",
      lead: "Li Wei",
      credit_hub: "Asia",
      stage: "Due Diligence & U/W",
      updates: null,
      members: ["team@akses.com"],
      pre_screening: null
    },
    {
      id: "6",
      name: "African Development Capital",
      priority: "High",
      country: "Kenya",
      lead: "David Okafor",
      credit_hub: "Africa",
      stage: "Pre-Screening",
      updates: null,
      members: ["team@akses.com"],
      pre_screening: null
    },
    {
      id: "7",
      name: "European Credit Partners",
      priority: "Medium",
      country: "Germany",
      lead: "Anna Schmidt",
      credit_hub: "Europe",
      stage: "Closed - Won",
      updates: null,
      members: ["team@akses.com"],
      pre_screening: null
    },
    {
      id: "8",
      name: "Nordic Fintech Group",
      priority: "Low",
      country: "Sweden",
      lead: "Erik Johansson",
      credit_hub: "Europe",
      stage: "Closed - Lost",
      updates: null,
      members: ["team@akses.com"],
      pre_screening: null
    }
  ];
  
  const { data: apiDeals = [], isLoading: isApiLoading, refetch } = useQuery<PipelineDeal[]>({
    queryKey: ['/api/deals'],
    retry: 1, // Limit retries to reduce unnecessary network requests
  });
  
  // Combine API data with sample data if API fails
  const deals = apiDeals.length > 0 ? apiDeals : sampleDeals;
  const isLoading = isApiLoading && apiDeals.length === 0;
  
  // Function to refresh deals data
  const handleRefresh = async () => {
    await refetch();
  };
  
  // Filter deals based on search term and stage
  const filteredDeals = deals.filter((deal: PipelineDeal) => {
    const matchesSearch = searchTerm === "" ||
      (deal.name && deal.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (deal.country && deal.country.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (deal.credit_hub && deal.credit_hub.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesStage = stageFilter === null || deal.stage === stageFilter;
    
    return matchesSearch && matchesStage;
  });
  
  // Get deal counts by stage
  const getDealCountByStage = (stage: string | null) => {
    if (stage === null) {
      return deals.length;
    }
    return deals.filter((deal: PipelineDeal) => deal.stage === stage).length;
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Deals Pipeline</h2>
        
        <div className="flex space-x-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-dark-surface rounded-lg pl-9 pr-4 py-2 text-sm"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          </div>
          
          <Button className="bg-primary hover:bg-primary-light transition-colors text-white rounded-lg px-4 py-2 text-sm flex items-center">
            <PlusIcon className="h-4 w-4 mr-1" /> New Deal
          </Button>
        </div>
      </div>
      
      <DealFilters
        selectedStatus={stageFilter}
        onStatusChange={setStageFilter}
        totalCount={getDealCountByStage(null)}
        dueDiligenceCount={getDealCountByStage("Due Diligence & U/W")}
        prescreeningCount={getDealCountByStage("Pre-Screening")}
        indicativeProposalCount={getDealCountByStage("Term Sheet Negotiation")}
      />
      
      <DealsTable 
        deals={filteredDeals} 
        isLoading={isLoading}
        selectedDealId={selectedDealId}
        onRowClick={onSelectedDealChange}
        onRefresh={handleRefresh}
      />
      
      <DealStatistics />
    </div>
  );
}
