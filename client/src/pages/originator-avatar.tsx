import { useState } from "react";
import { Header } from "@/components/layout/header";
import { AICommandCenter } from "@/components/ai/ai-command-center";
import { useMobile } from "@/hooks/use-mobile";

export default function OriginatorAvatar() {
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const isMobile = useMobile();
  
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      
      <main className="container mx-auto px-4 py-6 flex-1 overflow-hidden">
        <div className="flex flex-col lg:flex-row h-full overflow-hidden">
          <div className="w-full lg:max-w-3xl mx-auto overflow-y-auto overflow-x-hidden flex flex-col relative">
            <h1 className="text-2xl font-semibold mb-6 text-center">Originator Avatar</h1>
            <AICommandCenter onDealSelect={(id) => setSelectedDealId(String(id))} />
          </div>
        </div>
      </main>
    </div>
  );
}
