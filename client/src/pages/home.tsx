import { useState } from "react";
import { Header } from "@/components/layout/header";
import { AICommandCenter } from "@/components/ai/ai-command-center";
import { TabsSystem } from "@/components/layout/tabs-system";
import { useMobile } from "@/hooks/use-mobile";

export default function Home() {
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const isMobile = useMobile();
  
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-1 overflow-hidden">
        <div className="flex flex-col lg:flex-row h-full overflow-hidden">
          {/* Mobile view - simple tabbed interface */}
          {isMobile && (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex border-b border-dark-surface mb-4">
                <button 
                  className={`py-2 px-4 text-sm font-medium ${selectedDealId === null ? 'text-primary-light border-b-2 border-primary-light' : 'text-muted-foreground'}`}
                  onClick={() => setSelectedDealId(null)}
                >
                  AI Command Center
                </button>
                <button 
                  className={`py-2 px-4 text-sm font-medium ${selectedDealId !== null ? 'text-primary-light border-b-2 border-primary-light' : 'text-muted-foreground'}`}
                  onClick={() => selectedDealId === null ? setSelectedDealId("default") : null}
                >
                  Deals Pipeline
                </button>
              </div>
              
              <div className="flex-1 overflow-hidden">
                {selectedDealId === null ? (
                  <AICommandCenter onDealSelect={(id) => setSelectedDealId(String(id))} />
                ) : (
                  <TabsSystem 
                    selectedDealId={selectedDealId} 
                    onSelectedDealChange={setSelectedDealId} 
                  />
                )}
              </div>
            </div>
          )}
          
          {/* Desktop view - AI Command Center and Tabs */}
          {!isMobile && (
            <>
              <div className="w-1/3 overflow-y-auto overflow-x-hidden pr-6 flex flex-col relative">
                <AICommandCenter onDealSelect={(id) => setSelectedDealId(String(id))} />
              </div>
              
              <div className="w-2/3 overflow-y-auto">
                <TabsSystem 
                  selectedDealId={selectedDealId} 
                  onSelectedDealChange={setSelectedDealId} 
                />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
