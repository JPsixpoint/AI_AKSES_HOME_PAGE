import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DealsTable } from "./deals-table";
import { DealFilters } from "./deal-filters";
import { DealStatistics } from "./deal-statistics";
import { Deal } from "@shared/schema";
import { Button } from "../ui/button";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Input } from "../ui/input";

interface DealsPipelineProps {
  selectedDealId?: number | null;
  onSelectedDealChange: (dealId: number | null) => void;
}

export function DealsPipeline({ selectedDealId, onSelectedDealChange }: DealsPipelineProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['/api/deals'],
  });
  
  // Filter deals based on search term and status
  const filteredDeals = deals.filter((deal: Deal) => {
    const matchesSearch = searchTerm === "" ||
      deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.region.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === null || deal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Get deal counts by status
  const getDealCountByStatus = (status: string | null) => {
    if (status === null) {
      return deals.length;
    }
    return deals.filter((deal: Deal) => deal.status === status).length;
  };
  
  return (
    <div className="w-full pl-6">
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
        selectedStatus={statusFilter}
        onStatusChange={setStatusFilter}
        totalCount={getDealCountByStatus(null)}
        dueDiligenceCount={getDealCountByStatus("Due Diligence")}
        prescreeningCount={getDealCountByStatus("Prescreening")}
        indicativeProposalCount={getDealCountByStatus("Indicative Proposal")}
      />
      
      <DealsTable 
        deals={filteredDeals} 
        isLoading={isLoading}
        selectedDealId={selectedDealId}
        onRowClick={onSelectedDealChange}
      />
      
      <DealStatistics />
    </div>
  );
}
