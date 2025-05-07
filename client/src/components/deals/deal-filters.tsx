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
        variant={selectedStatus === "Due Diligence & U/W" ? "default" : "outline"}
        className={`px-4 py-2 ${selectedStatus === "Due Diligence & U/W" ? "bg-primary text-white" : "bg-dark-surface text-muted-foreground"} rounded-lg text-sm hover:bg-dark-lighter transition-colors`}
        onClick={() => onStatusChange("Due Diligence & U/W")}
      >
        Due Diligence ({dueDiligenceCount})
      </Button>
      
      <Button
        variant={selectedStatus === "Pre-Screening" ? "default" : "outline"}
        className={`px-4 py-2 ${selectedStatus === "Pre-Screening" ? "bg-primary text-white" : "bg-dark-surface text-muted-foreground"} rounded-lg text-sm hover:bg-dark-lighter transition-colors`}
        onClick={() => onStatusChange("Pre-Screening")}
      >
        Pre-Screening ({prescreeningCount})
      </Button>
      
      <Button
        variant={selectedStatus === "Term Sheet Negotiation" ? "default" : "outline"}
        className={`px-4 py-2 ${selectedStatus === "Term Sheet Negotiation" ? "bg-primary text-white" : "bg-dark-surface text-muted-foreground"} rounded-lg text-sm hover:bg-dark-lighter transition-colors`}
        onClick={() => onStatusChange("Term Sheet Negotiation")}
      >
        Term Sheet ({indicativeProposalCount})
      </Button>
    </div>
  );
}
