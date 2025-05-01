import { useState } from "react";
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
import { MoreHorizontalIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Deal } from "@shared/schema";
import { formatCurrency, formatTimeAgo } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface DealsTableProps {
  deals: Deal[];
  isLoading: boolean;
  selectedDealId?: number | null;
  onRowClick?: (dealId: number) => void;
}

export function DealsTable({ deals, isLoading, selectedDealId, onRowClick }: DealsTableProps) {
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
  
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Due Diligence":
        return "bg-info/20 text-info";
      case "Prescreening":
        return "bg-primary-lighter/20 text-primary-lighter";
      case "Indicative Proposal":
        return "bg-warning/20 text-warning";
      case "Committed":
        return "bg-success/20 text-success";
      case "Closed":
        return "bg-success/20 text-success";
      case "Declined":
        return "bg-danger/20 text-danger";
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
              <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground">ID</TableHead>
              <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground">Company</TableHead>
              <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground">Value</TableHead>
              <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground">Region</TableHead>
              <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground">Sector</TableHead>
              <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground">Status</TableHead>
              <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground">Updated</TableHead>
              <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground"></TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody className="divide-y divide-dark">
            {isLoading ? (
              // Loading skeletons
              Array(6).fill(0).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {Array(8).fill(0).map((_, cellIndex) => (
                    <TableCell key={`cell-${index}-${cellIndex}`} className="px-4 py-3">
                      <Skeleton className={`h-4 ${cellIndex === 1 ? 'w-32' : 'w-16'}`} />
                      {cellIndex === 1 && <Skeleton className="h-3 w-24 mt-1" />}
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
                    <TableCell className="px-4 py-3 text-sm">#{deal.id}</TableCell>
                    <TableCell className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{deal.company}</p>
                        <p className="text-xs text-muted-foreground">{deal.subSector}</p>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm">{formatCurrency(deal.value)}</TableCell>
                    <TableCell className="px-4 py-3 text-sm">{deal.region}</TableCell>
                    <TableCell className="px-4 py-3 text-sm">{deal.sector}</TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge variant="outline" className={`px-2 py-1 rounded text-xs ${getStatusStyles(deal.status)}`}>
                        {deal.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                      {formatTimeAgo(deal.updatedAt)}
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
          
          {[...Array(totalPages)].map((_, index) => (
            <Button
              key={index + 1}
              variant={currentPage === index + 1 ? "default" : "outline"}
              size="sm"
              className="text-xs px-3"
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
          
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
