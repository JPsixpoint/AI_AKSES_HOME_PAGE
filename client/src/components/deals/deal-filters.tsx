import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface DealFiltersProps {
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
  totalCount: number;
  dueDiligenceCount: number;
  prescreeningCount: number;
  indicativeProposalCount: number;
}

export function DealFilters({
  selectedStatus,
  onStatusChange,
  totalCount,
  dueDiligenceCount,
  prescreeningCount,
  indicativeProposalCount
}: DealFiltersProps) {
  return (
    <div className="flex space-x-2 mb-4 overflow-x-auto">
      <Button
        variant={selectedStatus === null ? "default" : "outline"}
        className={`px-4 py-2 ${selectedStatus === null ? "bg-primary text-white" : "bg-dark-surface text-muted-foreground"} rounded-lg text-sm hover:bg-dark-lighter transition-colors`}
        onClick={() => onStatusChange(null)}
      >
        All Deals ({totalCount})
      </Button>
      
      <Button
        variant={selectedStatus === "Due Diligence" ? "default" : "outline"}
        className={`px-4 py-2 ${selectedStatus === "Due Diligence" ? "bg-primary text-white" : "bg-dark-surface text-muted-foreground"} rounded-lg text-sm hover:bg-dark-lighter transition-colors`}
        onClick={() => onStatusChange("Due Diligence")}
      >
        Due Diligence ({dueDiligenceCount})
      </Button>
      
      <Button
        variant={selectedStatus === "Prescreening" ? "default" : "outline"}
        className={`px-4 py-2 ${selectedStatus === "Prescreening" ? "bg-primary text-white" : "bg-dark-surface text-muted-foreground"} rounded-lg text-sm hover:bg-dark-lighter transition-colors`}
        onClick={() => onStatusChange("Prescreening")}
      >
        Prescreening ({prescreeningCount})
      </Button>
      
      <Button
        variant={selectedStatus === "Indicative Proposal" ? "default" : "outline"}
        className={`px-4 py-2 ${selectedStatus === "Indicative Proposal" ? "bg-primary text-white" : "bg-dark-surface text-muted-foreground"} rounded-lg text-sm hover:bg-dark-lighter transition-colors`}
        onClick={() => onStatusChange("Indicative Proposal")}
      >
        Indicative Proposal ({indicativeProposalCount})
      </Button>
    </div>
  );
}
