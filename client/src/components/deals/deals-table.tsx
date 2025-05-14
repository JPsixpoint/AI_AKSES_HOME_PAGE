import React, { useState, useMemo, useEffect } from "react";
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
import { 
  MoreHorizontalIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  RefreshCwIcon, 
  FileTextIcon,
  SearchIcon,
  FilterXIcon,
  SlidersHorizontal,
  XIcon,
  RefreshCcw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DealDataView } from "./deal-data-view";
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
  ai_screening?: any[] | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  created_by?: number | null;
}
import { formatTimeAgo } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Deal } from "@shared/schema";

// Function to convert PipelineDeal to Deal type for the data view
const convertToDealType = (deal: PipelineDeal | null): Deal | null => {
  if (!deal) return null;
  return {
    id: deal.id,
    name: deal.name || '',
    lead: deal.lead,
    country: deal.country,
    creditHub: deal.credit_hub,
    stage: deal.stage,
    priority: deal.priority,
    updates: deal.updates,
    preScreening: deal.pre_screening,
    members: deal.members,
    aiScreening: deal.ai_screening,
    createdAt: deal.created_at,
    updatedAt: deal.updated_at
  } as Deal;
};

interface DealsTableProps {
  deals: PipelineDeal[];
  isLoading: boolean;
  selectedDealId?: string | null;
  onRowClick?: (dealId: string) => void;
  onRefresh?: () => void;
}

export function DealsTable({ deals, isLoading, selectedDealId, onRowClick, onRefresh }: DealsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAllResults, setShowAllResults] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [detailModal, setDetailModal] = useState<{ isOpen: boolean; dealId: string | null }>({
    isOpen: false,
    dealId: null
  });
  const [filters, setFilters] = useState({
    country: 'all',
    stage: 'all',
    creditHub: 'all'
  });
  const dealsPerPage = 10;
  
  const handleRefresh = async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
  };
  
  const openDetailModal = (dealId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDetailModal({ isOpen: true, dealId });
  };
  
  const closeDetailModal = () => {
    setDetailModal({ isOpen: false, dealId: null });
  };
  
  // Filter deals based on criteria
  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      // Apply country filter
      if (filters.country !== 'all' && (deal.country !== filters.country || !deal.country)) {
        return false;
      }
      
      // Apply stage filter
      if (filters.stage !== 'all' && (deal.stage !== filters.stage || !deal.stage)) {
        return false;
      }
      
      // Apply credit hub filter
      if (filters.creditHub !== 'all' && (deal.credit_hub !== filters.creditHub || !deal.credit_hub)) {
        return false;
      }
      
      return true;
    });
  }, [deals, filters]);
  
  // Calculate pagination
  const indexOfLastDeal = currentPage * dealsPerPage;
  const indexOfFirstDeal = indexOfLastDeal - dealsPerPage;
  const currentDeals = showAllResults ? filteredDeals : filteredDeals.slice(indexOfFirstDeal, indexOfLastDeal);
  const totalPages = Math.ceil(filteredDeals.length / dealsPerPage);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);
  
  // Function to reset all filters to default
  const resetFilters = () => {
    setFilters({
      country: 'all',
      stage: 'all',
      creditHub: 'all'
    });
  };
  
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
  
  // Extract unique countries and stages for filters
  const uniqueCountries = useMemo(() => {
    const countries = Array.from(
      new Set(
        deals
          .map(deal => deal.country)
          .filter((country): country is string => typeof country === 'string' && country !== null)
      )
    );
    return countries.sort();
  }, [deals]);
  
  const uniqueStages = useMemo(() => {
    const stages = Array.from(
      new Set(
        deals
          .map(deal => deal.stage)
          .filter((stage): stage is string => typeof stage === 'string' && stage !== null)
      )
    );
    return stages.sort();
  }, [deals]);
  
  const uniqueCreditHubs = useMemo(() => {
    const creditHubs = Array.from(
      new Set(
        deals
          .map(deal => deal.credit_hub)
          .filter((hub): hub is string => typeof hub === 'string' && hub !== null)
      )
    );
    return creditHubs.sort();
  }, [deals]);
  
  const handleFilterChange = (type: 'country' | 'stage' | 'creditHub', value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  return (
    <div className="gradient-border bg-dark-lighter rounded-lg overflow-hidden">
      {/* Filters section - inspired by Linear.app and Notion */}
      <div className="bg-dark-surface border-b border-dark">
        {/* Top row: Stats and Actions */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-white font-semibold flex items-center">
              <span className="text-md">
                {filteredDeals.length} deals
              </span>
              {filteredDeals.length !== deals.length && (
                <span className="text-xs text-muted-foreground hidden sm:inline ml-2">
                  (filtered from {deals.length} total)
                </span>
              )}
            </div>
            
            {/* Mobile filter toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden text-white hover:bg-dark-lighter"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              {showMobileFilters ? 
                <XIcon className="h-4 w-4" /> : 
                <SlidersHorizontal className="h-4 w-4" />
              }
              <span className="ml-1 text-xs">Filters</span>
            </Button>
          </div>
          
          {/* Action buttons - right aligned */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-purple-300 hover:bg-purple-900/20 hover:text-purple-200 flex items-center"
              onClick={resetFilters}
            >
              <FilterXIcon className="h-3 w-3 mr-1.5" />
              Reset Filters
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={`text-xs text-white ${showAllResults ? 'bg-primary/30' : ''} hover:bg-primary/20`}
              onClick={() => setShowAllResults(!showAllResults)}
            >
              <span>Show {showAllResults ? 'Paged' : 'All'} Results</span>
            </Button>
            
            {onRefresh && (
              <Button 
                variant="ghost" 
                size="sm" 
                className={`text-xs text-white hover:bg-dark-lighter ${isRefreshing ? 'opacity-70' : ''}`}
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCwIcon className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>
        </div>
        
        {/* Desktop Filters - horizontal layout on medium+ screens */}
        <div className="hidden md:flex p-3 flex-wrap border-t border-purple-950/40 gap-2">
          <div className="flex-1 min-w-[160px]">
            <div className="text-xs text-gray-300 mb-1 font-medium">Country</div>
            <div className="relative">
              <select 
                className="w-full text-white text-sm appearance-none focus:ring-1 focus:ring-purple-400 p-2 rounded border border-white/30 bg-transparent"
                value={filters.country}
                onChange={(e) => handleFilterChange('country', e.target.value)}
              >
                <option value="all" style={{color: 'white', backgroundColor: 'transparent'}}>All Countries</option>
                {uniqueCountries.map(country => (
                  <option key={country as string} value={country as string} style={{color: 'white', backgroundColor: 'transparent'}}>{country}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-white pr-3">
                <ChevronLeftIcon className="h-4 w-4 -rotate-90" />
              </div>
            </div>
          </div>
          
          <div className="flex-1 min-w-[160px]">
            <div className="text-xs text-gray-300 mb-1 font-medium">Stage</div>
            <div className="relative">
              <select 
                className="w-full text-white text-sm appearance-none focus:ring-1 focus:ring-purple-400 p-2 rounded border border-white/30 bg-transparent"
                value={filters.stage}
                onChange={(e) => handleFilterChange('stage', e.target.value)}
              >
                <option value="all" style={{color: 'white', backgroundColor: 'transparent'}}>All Stages</option>
                {uniqueStages.map(stage => (
                  <option key={stage} value={stage} style={{color: 'white', backgroundColor: 'transparent'}}>{stage}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-white pr-3">
                <ChevronLeftIcon className="h-4 w-4 -rotate-90" />
              </div>
            </div>
          </div>
          
          <div className="flex-1 min-w-[160px]">
            <div className="text-xs text-gray-300 mb-1 font-medium">Credit Hub</div>
            <div className="relative">
              <select 
                className="w-full text-white text-sm appearance-none focus:ring-1 focus:ring-purple-400 p-2 rounded border border-white/30 bg-transparent"
                value={filters.creditHub}
                onChange={(e) => handleFilterChange('creditHub', e.target.value)}
              >
                <option value="all" style={{color: 'white', backgroundColor: 'transparent'}}>All Credit Hubs</option>
                {uniqueCreditHubs.map(hub => (
                  <option key={hub} value={hub} style={{color: 'white', backgroundColor: 'transparent'}}>{hub}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-white pr-3">
                <ChevronLeftIcon className="h-4 w-4 -rotate-90" />
              </div>
            </div>
          </div>
          
          {/* Reset filters button and match counter */}
          <div className="flex items-center gap-4 self-end">
            <button
              onClick={resetFilters}
              className="px-3 py-2 text-sm rounded bg-purple-600/20 text-white hover:bg-purple-600/30 transition-colors border border-purple-600/30 flex items-center gap-1"
            >
              <RefreshCcw className="h-3 w-3" />
              Reset Filters
            </button>
            <div className="text-xs text-gray-300">
              {filteredDeals.length} matching results
            </div>
          </div>
        </div>
        
        {/* Mobile Filters - vertical accordion style */}
        {showMobileFilters && (
          <div className="md:hidden p-3 flex flex-col border-t border-purple-950/40 gap-3 animate-in slide-in-from-top duration-300">
            <div className="w-full">
              <div className="text-xs text-gray-300 mb-1 font-medium">Country</div>
              <div className="relative">
                <select 
                  className="w-full text-white text-sm appearance-none focus:ring-1 focus:ring-purple-400 p-2 rounded border border-white/30 bg-transparent"
                  value={filters.country}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                >
                  <option value="all" style={{color: 'white', backgroundColor: 'transparent'}}>All Countries</option>
                  {uniqueCountries.map(country => (
                    <option key={country as string} value={country as string} style={{color: 'white', backgroundColor: 'transparent'}}>{country}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-white pr-3">
                  <ChevronLeftIcon className="h-4 w-4 -rotate-90" />
                </div>
              </div>
            </div>
            
            <div className="w-full">
              <div className="text-xs text-gray-300 mb-1 font-medium">Stage</div>
              <div className="relative">
                <select 
                  className="w-full text-white text-sm appearance-none focus:ring-1 focus:ring-purple-400 p-2 rounded border border-white/30 bg-transparent"
                  value={filters.stage}
                  onChange={(e) => handleFilterChange('stage', e.target.value)}
                >
                  <option value="all" style={{color: 'white', backgroundColor: 'transparent'}}>All Stages</option>
                  {uniqueStages.map(stage => (
                    <option key={stage} value={stage} style={{color: 'white', backgroundColor: 'transparent'}}>{stage}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-white pr-3">
                  <ChevronLeftIcon className="h-4 w-4 -rotate-90" />
                </div>
              </div>
            </div>
            
            <div className="w-full">
              <div className="text-xs text-gray-300 mb-1 font-medium">Credit Hub</div>
              <div className="relative">
                <select 
                  className="w-full text-white text-sm appearance-none focus:ring-1 focus:ring-purple-400 p-2 rounded border border-white/30 bg-transparent"
                  value={filters.creditHub}
                  onChange={(e) => handleFilterChange('creditHub', e.target.value)}
                >
                  <option value="all" style={{color: 'white', backgroundColor: 'transparent'}}>All Credit Hubs</option>
                  {uniqueCreditHubs.map(hub => (
                    <option key={hub} value={hub} style={{color: 'white', backgroundColor: 'transparent'}}>{hub}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-white pr-3">
                  <ChevronLeftIcon className="h-4 w-4 -rotate-90" />
                </div>
              </div>
            </div>
            
            {/* Reset Filters button (mobile) */}
            <div className="flex items-center justify-between mt-2">
              <button
                onClick={resetFilters}
                className="px-3 py-2 text-sm rounded bg-purple-600/20 text-white hover:bg-purple-600/30 transition-colors border border-purple-600/30 flex items-center gap-1"
              >
                <RefreshCcw className="h-3 w-3" />
                Reset Filters
              </button>
              
              <div className="text-xs text-gray-300">
                {filteredDeals.length} matching results
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-dark-surface border-b border-dark text-left">
            <TableRow>
              <TableHead className="px-4 py-3 text-xs font-medium text-muted-foreground">
                <span>Company</span>
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground transition-colors">
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={(e) => openDetailModal(deal.id, e)}
                            className="flex items-center gap-2"
                          >
                            <FileTextIcon className="h-4 w-4" /> View All Data
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
          {showAllResults ? (
            <>Showing all {filteredDeals.length} deals</>
          ) : (
            <>Showing {filteredDeals.length > 0 ? indexOfFirstDeal + 1 : 0} to {Math.min(indexOfLastDeal, filteredDeals.length)} of {filteredDeals.length} deals</>
          )}
          {filteredDeals.length !== deals.length && (
            <span className="ml-1">
              (filtered from {deals.length} total)
            </span>
          )}
        </div>
        
        <div className={`flex space-x-1 ${showAllResults ? 'opacity-50' : ''}`}>
          <Button
            variant={currentPage === 1 ? "outline" : "secondary"}
            size="sm"
            className="text-xs"
            disabled={currentPage === 1 || showAllResults}
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
                  disabled={showAllResults}
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
            disabled={currentPage === totalPages || totalPages === 0 || showAllResults}
            onClick={handleNextPage}
          >
            Next <ChevronRightIcon className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
      
      {/* Full-screen Data View */}
      <DealDataView
        deal={detailModal.dealId ? convertToDealType(deals.find(d => d.id === detailModal.dealId) || null) : null}
        isOpen={detailModal.isOpen}
        onClose={closeDetailModal}
      />
    </div>
  );
}
