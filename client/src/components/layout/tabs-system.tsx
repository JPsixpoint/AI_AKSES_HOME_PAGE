import React, { useState, useRef, useEffect } from "react";
import { Search, Plus, X, PanelLeft, MoveRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DealsPipeline } from "@/components/deals/deals-pipeline";

// Define the tab types
type TabType = 
  | "Pipeline"
  | "AI PreScreening"
  | "Deal Information"
  | "Pricer"
  | "Due Diligence"
  | "Org Settings"
  | "Rag Databases";

interface Tab {
  id: string;
  type: TabType;
  title: string;
  data?: any;
}

interface TabsSystemProps {
  selectedDealId?: string | null;
  onSelectedDealChange: (dealId: string | null) => void;
}

export function TabsSystem({ selectedDealId, onSelectedDealChange }: TabsSystemProps) {
  // Track open tabs
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "default-pipeline", type: "Pipeline", title: "Pipeline" }
  ]);
  
  // Track active tab
  const [activeTabId, setActiveTabId] = useState<string>("default-pipeline");
  
  // State for new tab dialog
  const [isNewTabDialogOpen, setIsNewTabDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Tab options for the new tab dialog
  const tabOptions: Array<{type: TabType, title: string, description: string}> = [
    { type: "Pipeline", title: "Pipeline", description: "View and manage the deal pipeline" },
    { type: "AI PreScreening", title: "AI PreScreening", description: "AI-assisted pre-screening of potential deals" },
    { type: "Deal Information", title: "Deal Information", description: "View and edit detailed deal information" },
    { type: "Pricer", title: "Pricer", description: "Deal pricing and financial modeling tools" },
    { type: "Due Diligence", title: "Due Diligence", description: "Manage due diligence process and documents" },
    { type: "Org Settings", title: "Org Settings", description: "Organization settings and configuration" },
    { type: "Rag Databases", title: "Rag Databases", description: "Manage and explore RAG knowledge databases" },
  ];
  
  // Handle tab switching
  const switchToTab = (tabId: string) => {
    setActiveTabId(tabId);
  };

  // Add a new tab
  const addNewTab = (tabType: TabType, title: string) => {
    const newTab: Tab = {
      id: `${tabType}-${Date.now()}`,
      type: tabType,
      title: title,
    };
    
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
    setIsNewTabDialogOpen(false);
    setSearchTerm("");
  };

  // Close a tab
  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    if (tabIndex === -1) return;
    
    // Create a new array without the closed tab
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    
    // If we're closing the active tab, switch to another tab
    if (tabId === activeTabId) {
      // If possible, select the tab to the left
      if (tabIndex > 0) {
        setActiveTabId(newTabs[tabIndex - 1].id);
      } else if (newTabs.length > 0) {
        // Otherwise select the first tab
        setActiveTabId(newTabs[0].id);
      }
    }
    
    setTabs(newTabs);
  };

  // Filter tab options based on search term
  const filteredTabOptions = tabOptions.filter(option =>
    option.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Tabs bar - more prominent and separated from content */}
      <div className="sticky top-0 z-10 flex items-center bg-dark-lighter border-b border-dark overflow-x-auto shadow-sm mb-4">
        {tabs.map((tab) => (
          <div 
            key={tab.id}
            className={cn(
              "flex items-center min-w-fit px-4 py-2.5 text-sm border-r border-dark cursor-pointer relative",
              activeTabId === tab.id 
                ? "bg-dark text-foreground before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-primary" 
                : "text-muted-foreground hover:bg-dark/60"
            )}
            onClick={() => switchToTab(tab.id)}
          >
            <span className="truncate max-w-[150px] mr-2">{tab.title}</span>
            
            {/* Always show close button */}
            <button 
              className="ml-1 p-0.5 rounded-sm opacity-70 hover:opacity-100 hover:bg-dark-surface"
              onClick={(e) => closeTab(tab.id, e)}
              aria-label={`Close ${tab.title} tab`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {/* New tab button */}
        <button 
          className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-dark/60 flex items-center"
          onClick={() => setIsNewTabDialogOpen(true)}
          aria-label="Add new tab"
        >
          <Plus size={16} className="mr-1" />
          <span className="text-xs font-medium">New Tab</span>
        </button>
      </div>
      
      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        {tabs.map((tab) => (
          <div 
            key={tab.id} 
            className={cn("h-full", activeTabId === tab.id ? "block" : "hidden")}
          >
            {tab.type === "Pipeline" && (
              <DealsPipeline 
                selectedDealId={selectedDealId} 
                onSelectedDealChange={onSelectedDealChange} 
              />
            )}
            {tab.type !== "Pipeline" && (
              <div className="h-full flex items-center justify-center p-6">
                <div className="text-center max-w-md mx-auto">
                  <h2 className="text-2xl font-semibold mb-3">{tab.title}</h2>
                  <p className="text-muted-foreground mb-4">
                    This section is currently under development. Check back later for full functionality.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => closeTab(tab.id, { stopPropagation: () => {} } as React.MouseEvent)}
                  >
                    Close This Tab
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* New tab dialog */}
      <Dialog open={isNewTabDialogOpen} onOpenChange={setIsNewTabDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Tab</DialogTitle>
            <DialogDescription>
              Select a tab type or search for available options
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for tabs..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="max-h-[400px] overflow-y-auto space-y-1">
              {filteredTabOptions.map((option) => (
                <button
                  key={option.type}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-dark-lighter flex items-center"
                  onClick={() => addNewTab(option.type, option.title)}
                >
                  <div>
                    <div className="font-medium">{option.title}</div>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
