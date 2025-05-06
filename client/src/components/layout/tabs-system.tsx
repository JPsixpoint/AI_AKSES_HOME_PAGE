import React, { useState, useRef, useEffect } from "react";
import { Search, Plus, X, PanelLeft, MoveRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
      {/* Tabs bar */}
      <div className="flex items-center bg-dark-surface border-b border-dark overflow-x-auto">
        {tabs.map((tab) => (
          <div 
            key={tab.id}
            className={cn(
              "flex items-center min-w-fit px-3 py-2 text-sm border-r border-dark cursor-pointer",
              activeTabId === tab.id 
                ? "bg-dark-lighter text-foreground" 
                : "text-muted-foreground hover:bg-dark-lighter/50"
            )}
            onClick={() => switchToTab(tab.id)}
          >
            <span className="truncate max-w-[150px]">{tab.title}</span>
            
            {/* Only show close button if there's more than one tab */}
            {tabs.length > 1 && (
              <button 
                className="ml-2 p-0.5 rounded-sm opacity-70 hover:opacity-100 hover:bg-background"
                onClick={(e) => closeTab(tab.id, e)}
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
        
        {/* New tab button */}
        <button 
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-dark-lighter/50"
          onClick={() => setIsNewTabDialogOpen(true)}
        >
          <Plus size={16} />
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
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-2">{tab.title}</h2>
                  <p className="text-muted-foreground">
                    This tab is under development. 
                  </p>
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
