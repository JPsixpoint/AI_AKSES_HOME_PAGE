import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, ChevronLeftIcon, ChevronRightIcon, RefreshCwIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
// Import the PipelineDeal interface from deals-pipeline
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
import { formatTimeAgo } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface DealsTableProps {
  deals: PipelineDeal[];
  isLoading: boolean;
  selectedDealId?: string | null;
  onRowClick?: (dealId: string) => void;
  onRefresh?: () => void;
}

export function DealsTable({ deals, isLoading, selectedDealId, onRowClick, onRefresh }: DealsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const dealsPerPage = 6;
  
  // Calculate pagination
  const indexOfLastDeal = currentPage * dealsPerPage;
  const indexOfFirstDeal = indexOfLastDeal - dealsPerPage;
  const currentDeals = deals.slice(indexOfFirstDeal, indexOfLastDeal);
  const totalPages = Math.ceil(deals.length / dealsPerPage);
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const getStageStyles = (stage: string) => {
    switch (stage) {
      case "Due Diligence & U/W":
        return "bg-info/20 text-info";
      case "Pre-Screening":
        return "bg-primary-lighter/20 text-primary-lighter";
      case "Term Sheet Negotiation":
        return "bg-warning/20 text-warning";
      case "Closed - Won":
        return "bg-success/20 text-success";
      case "Closed - Lost":
        return "bg-danger/20 text-danger";
      case "Pass":
        return "bg-danger/20 text-danger";
      case "Re-Engage":
        return "bg-muted/20 text-muted-foreground";
      case "Lead":
        return "bg-warning/20 text-warning";
      default:
        return "bg-muted/20 text-muted-foreground";
    }
  };
  
  return (
    <div className="gradient-border bg-dark-lighter rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-dark-surface border-b border-dark text-left">
            <TableRow>
              <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Company</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-2 p-1 h-6 w-6" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRefresh && onRefresh();
                    }}
                    disabled={isLoading}
                    title="Refresh deals data"
                  >
                    <RefreshCwIcon className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground">Country</TableHead>
              <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground">Credit Hub</TableHead>
              <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground">Lead</TableHead>
              <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground">Stage</TableHead>
              <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground"></TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody className="divide-y divide-dark">
            {isLoading ? (
              // Loading skeletons
              [...Array(6)].map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {[...Array(6)].map((_, cellIndex) => (
                    <TableCell key={`cell-${index}-${cellIndex}`} className="px-4 py-3">
                      <Skeleton className={`h-4 ${cellIndex === 0 ? 'w-32' : 'w-16'}`} />
                      {cellIndex === 0 && <Skeleton className="h-3 w-24 mt-1" />}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <AnimatePresence>
                {currentDeals.map((deal) => (
                  <motion.tr
                    key={deal.id}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.3 }}
                    className={`hover:bg-dark-surface cursor-pointer ${
                      selectedDealId === deal.id ? "bg-primary bg-opacity-10 border-l-2 border-primary" : ""
                    }`}
                    onClick={() => onRowClick && onRowClick(deal.id)}
                  >
                    <TableCell className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{deal.name || 'Unnamed Deal'}</p>
                        <p className="text-xs text-muted-foreground">{deal.priority || 'No Priority'}</p>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm">{deal.country || 'N/A'}</TableCell>
                    <TableCell className="px-4 py-3 text-sm">{deal.credit_hub || 'N/A'}</TableCell>
                    <TableCell className="px-4 py-3 text-sm">{deal.lead || 'N/A'}</TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge variant="outline" className={`px-2 py-1 rounded text-xs ${getStageStyles(deal.stage)}`}>
                        {deal.stage}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground transition-colors">
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="bg-dark-surface px-4 py-3 flex items-center justify-between border-t border-dark">
        <div className="text-xs text-muted-foreground">
          Showing {deals.length > 0 ? indexOfFirstDeal + 1 : 0} to {Math.min(indexOfLastDeal, deals.length)} of {deals.length} deals
        </div>
        
        <div className="flex space-x-1">
          <Button
            variant={currentPage === 1 ? "outline" : "secondary"}
            size="sm"
            className="text-xs"
            disabled={currentPage === 1}
            onClick={handlePrevPage}
          >
            <ChevronLeftIcon className="h-3 w-3 mr-1" /> Previous
          </Button>
          
          {/* Show limited number of pages */}
          {(() => {
            // Always show first page, last page, current page, and one page before and after current
            const pagesToShow = new Set<number>();
            
            // Always show first page and last page
            pagesToShow.add(1);
            pagesToShow.add(totalPages);
            
            // Show current page and one page before and after
            const range = [-1, 0, 1];
            range.forEach(offset => {
              const pageNum = currentPage + offset;
              if (pageNum >= 1 && pageNum <= totalPages) {
                pagesToShow.add(pageNum);
              }
            });
            
            // Convert to array and sort
            const pageArray = Array.from(pagesToShow).sort((a, b) => a - b);
            
            // Create buttons with ellipses where needed
            const paginationItems: React.ReactNode[] = [];
            
            // Add page buttons with ellipses
            pageArray.forEach((pageNum, index) => {
              // Add ellipsis if there's a gap
              if (index > 0 && pageNum > pageArray[index - 1] + 1) {
                paginationItems.push(
                  <span key={`ellipsis-${index}`} className="mx-1 text-xs text-muted-foreground">...</span>
                );
              }
              
              // Add page button
              paginationItems.push(
                <Button
                  key={`page-${pageNum}`}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  className="text-xs px-3"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            });
            
            return paginationItems;
          })()}
          
          <Button
            variant={currentPage === totalPages ? "outline" : "secondary"}
            size="sm"
            className="text-xs"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={handleNextPage}
          >
            Next <ChevronRightIcon className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
