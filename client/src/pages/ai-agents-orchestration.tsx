import React from "react";
import { AIAgentsOrchestration } from "@/components/ai/ai-agents-orchestration";
import { useSearchParams } from "wouter";

export default function AIAgentsOrchestrationPage() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "directory";
  
  return (
    <div className="p-6 bg-dark-lighter h-full overflow-auto">
      <AIAgentsOrchestration initialTab={tab} />
    </div>
  );
}