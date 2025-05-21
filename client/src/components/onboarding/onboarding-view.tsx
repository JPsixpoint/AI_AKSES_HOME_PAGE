import React from "react";
import {
  Brain,
  Database,
  FileText,
  BarChart2,
  Users,
  Calculator,
  Cpu,
  Shield,
  RefreshCw,
  Plug,
  ScrollText,
  ChevronRight,
  BookOpen,
  ListPlus,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Helper component for feature cards
const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon, 
  color = "blue", 
  buttonText = "View Details",
  onClick,
  isExternal = false
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType; 
  color?: string;
  buttonText?: string;
  onClick: () => void;
  isExternal?: boolean;
}) => (
  <div className="h-full">
    <Card className="h-full backdrop-blur-md bg-black/30 border border-gray-800 hover:border-gray-700 transition-all overflow-hidden group hover:shadow-md hover:shadow-blue-900/20">
      <CardHeader className="pb-2">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 bg-${color}-900/30`}>
          <Icon className={`h-5 w-5 text-${color}-400`} />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground pb-2">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Badge variant="outline" className="mr-1 mb-1">Featured</Badge>
          <Badge variant="outline" className="mr-1 mb-1">AI-Powered</Badge>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-between group-hover:bg-blue-900/20"
          onClick={onClick}
        >
          {buttonText} {isExternal ? <ExternalLink className="h-4 w-4 ml-2 opacity-50" /> : <ChevronRight className="h-4 w-4 ml-2 opacity-50" />}
        </Button>
      </CardFooter>
    </Card>
  </div>
);

// Helper component for enterprise highlight cards
const EnterpriseCard = ({ icon: Icon, title, color = "blue" }: { icon: React.ElementType; title: string; color?: string }) => (
  <div>
    <Card className="backdrop-blur-md bg-black/20 border border-gray-800 hover:border-gray-700 transition-all">
      <CardContent className="p-4 flex items-center">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-${color}-900/30`}>
          <Icon className={`h-4 w-4 text-${color}-400`} />
        </div>
        <div className="font-medium text-sm">{title}</div>
      </CardContent>
    </Card>
  </div>
);

// Demo item component
const DemoItem = ({ 
  title, 
  description, 
  index, 
  onClick
}: { 
  title: string; 
  description: string; 
  index: number;
  onClick?: () => void;
}) => (
  <div className="mb-4 last:mb-0">
    <div 
      className="border border-gray-800 hover:border-gray-700 rounded-lg p-4 backdrop-blur-md bg-black/20 transition-all cursor-pointer hover:shadow-md hover:shadow-blue-900/20"
      onClick={onClick}
    >
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-3 text-white font-bold">
          {index + 1}
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground ml-11">{description}</p>
    </div>
  </div>
);

export function OnboardingView() {
  // Navigation functions
  const openTab = (tabType: string, tabTitle: string) => {
    if ((window as any).openTab) {
      (window as any).openTab(tabType, tabTitle);
    }
  };

  const openPrescreening = () => {
    if ((window as any).openPrescreeningTab) {
      (window as any).openPrescreeningTab();
    } else {
      openTab("AI PreScreening", "AI PreScreening");
    }
  };

  const openArchitecture = () => {
    if ((window as any).openArchitectureTab) {
      (window as any).openArchitectureTab();
    } else {
      openTab("AKSES Architecture", "AKSES Architecture");
    }
  };

  const openAgentBuilder = () => {
    const tabsSystem = document.querySelector('[data-tabs-system]');
    
    if (window.opener) {
      window.opener.postMessage({ action: 'openAgentBuilder' }, '*');
    }
    
    // Create or activate AI Agents tab with Agent Builder selected
    if ((window as any).openTab) {
      (window as any).openTab("AI Agents Orchestration", "Agent Builder", "builder");
    }
  };
  
  const openRagVault = () => {
    openTab("AI Agents Orchestration", "RAG Vault");
  };

  const openPipeline = () => {
    openTab("Pipeline", "Pipeline");
  };

  const openCRM = () => {
    openTab("AI CRM", "AI CRM");
  };

  const openExternalUrl = (url: string) => {
    window.open(url, '_blank');
  };

  const openDueDiligence = () => {
    openExternalUrl('https://deal-diligence-manager.replit.app/auth');
  };

  const openTapeCracker = () => {
    openExternalUrl('https://sixpointcapital.github.io/tape-cracker-ai-agent/#/');
  };

  return (
    <div className="w-full h-full overflow-auto">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-black to-gray-900 p-8 md:p-12 rounded-xl mb-8 overflow-hidden border border-gray-800">
        <div className="absolute inset-0 bg-grid-white/[0.02] mask-fade-out"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            The End-to-End AI OS for Asset Managers
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Underwriting redefined. AI Agents in command.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 border-0"
              onClick={openAgentBuilder}
            >
              Start with Agent Builder
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="rounded-full"
              onClick={openPipeline}
            >
              Upload a Deal
            </Button>
          </div>
        </div>
      </div>

      {/* Highlight Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <FeatureCard 
          title="AI Agent Army" 
          description="Specialized agents trained to execute underwriting, analysis, and decision support" 
          icon={Brain}
          color="indigo"
          buttonText="View Agents"
          onClick={openAgentBuilder}
        />
        <FeatureCard 
          title="RAG Vaults" 
          description="Reusable, structured knowledge — by company, deal, or conversation" 
          icon={Database}
          color="purple"
          buttonText="Explore Vaults"
          onClick={openRagVault}
        />
        <FeatureCard 
          title="Tape Cracker" 
          description="Upload tapes, analyze portfolio stats, flag anomalies" 
          icon={FileText}
          color="green"
          buttonText="Analyze Tapes"
          onClick={openTapeCracker}
          isExternal={true}
        />
        <FeatureCard 
          title="AI PreScreening" 
          description="Submit a deal. Get insights. Auto-summarizes pitch decks and highlights missing data." 
          icon={ListPlus}
          color="red"
          buttonText="Start Screening"
          onClick={openPrescreening}
        />
        <FeatureCard 
          title="Agent Builder" 
          description="Build your own AI copilots. Choose tools, assign vaults, and set behaviors." 
          icon={Cpu}
          color="yellow"
          buttonText="Build Agent"
          onClick={openAgentBuilder}
        />
        <FeatureCard 
          title="Pipeline" 
          description="Manage the entire underwriting flow. Track all deals across lifecycle stages." 
          icon={BarChart2}
          color="blue"
          buttonText="View Pipeline"
          onClick={openPipeline}
        />
        <FeatureCard 
          title="AI CRM" 
          description="Centralize all people, companies, and interactions with intelligent relationship tracking." 
          icon={Users}
          color="teal"
          buttonText="Open CRM"
          onClick={openCRM}
        />
        <FeatureCard 
          title="Pool Analytics" 
          description="Advanced performance breakdowns. Analyze cohorts, risk decay, defaults." 
          icon={BarChart2}
          color="orange"
          buttonText="View Analytics"
          onClick={() => openTab("Deal Information", "Pool Analytics")}
        />
        <FeatureCard 
          title="Pricer" 
          description="Model terms, simulate returns, generate deal docs with AI assistance." 
          icon={Calculator}
          color="pink"
          buttonText="Open Pricer"
          onClick={() => openTab("Pricer", "Pricer")}
        />
      </div>

      {/* Architecture Section */}
      <div className="relative backdrop-blur-md bg-black/20 p-6 rounded-xl border border-gray-800 mb-8">
        <div>
          <div className="flex items-center mb-4">
            <BookOpen className="h-6 w-6 mr-3 text-blue-400" />
            <h2 className="text-xl font-semibold">AI Architecture</h2>
          </div>
          
          <p className="text-muted-foreground mb-6">
            AKSES implements a Three-Tiered Intelligence Framework that provides scalable and secure AI capabilities.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-gray-800 bg-gray-900/50">
              <h3 className="font-medium mb-2">Tier 1: User-Level Vaults</h3>
              <p className="text-sm text-muted-foreground">
                Personal context and preferences that travel with each user, adapting the AI experience to individual workflow patterns.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-gray-800 bg-gray-900/50">
              <h3 className="font-medium mb-2">Tier 2: Org-Level Collaboration</h3>
              <p className="text-sm text-muted-foreground">
                Shared knowledge base for team collaboration, with strict access controls and versioning for institutional memory.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-gray-800 bg-gray-900/50">
              <h3 className="font-medium mb-2">Tier 3: Anonymized Pattern Learning</h3>
              <p className="text-sm text-muted-foreground">
                Secure learning from anonymized workflows to improve AI performance while maintaining data security.
              </p>
            </div>
          </div>
          
          <div className="mt-4 text-right">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={openArchitecture}
            >
              View Complete Architecture <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Enterprise Highlights */}
      <h2 className="text-xl font-semibold mb-4">Enterprise Ready</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <EnterpriseCard icon={Shield} title="Secure by Design" color="red" />
        <EnterpriseCard icon={RefreshCw} title="Import Your Workflow" color="green" />
        <EnterpriseCard icon={Plug} title="Flexible Backend" color="blue" />
        <EnterpriseCard icon={Brain} title="Model Agnostic" color="purple" />
        <EnterpriseCard icon={Users} title="Role-Based Access" color="yellow" />
      </div>

      {/* Demo Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <h2 className="text-xl font-semibold mb-4">Interactive Demos</h2>
          <div className="space-y-4">
            <DemoItem 
              title="Submit a Deal with PreScreening" 
              description="See how AI analyzes pitch decks and performs rapid due diligence."
              index={0}
              onClick={openPrescreening}
            />
            <DemoItem 
              title="Build an Agent from Scratch" 
              description="Create a customized AI agent with specific tools and knowledge vaults."
              index={1}
              onClick={openAgentBuilder}
            />
            <DemoItem 
              title="View All Monet Interactions in CRM" 
              description="Explore relationship intelligence across your organization."
              index={2}
              onClick={openCRM}
            />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-950/30 to-indigo-950/30 rounded-xl border border-gray-800 p-6 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
            <ScrollText className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-medium mb-2">Ready to Run Your Fund with AI?</h3>
          <p className="text-center text-muted-foreground mb-6 max-w-md">
            AKSES brings together every tool and insight you need in one comprehensive platform.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button onClick={openAgentBuilder}>Start with Agent Builder</Button>
            <Button variant="outline" onClick={openPipeline}>Upload a Deal</Button>
            <Button variant="outline" onClick={openRagVault}>Explore Your Vaults</Button>
            <Button variant="outline" onClick={openCRM}>Launch CRM</Button>
          </div>
        </div>
      </div>
    </div>
  );
}