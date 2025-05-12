import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function AksesArchitecture() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">AKSES AI Architecture</h1>
      <p className="text-muted-foreground mb-6">
        Three-Tiered AI Orchestration Architecture for Asset Management Intelligence
      </p>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tiers">Learning Tiers</TabsTrigger>
          <TabsTrigger value="orchestration">Orchestration System</TabsTrigger>
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="technical">Technical Implementation</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Three-Tiered Learning System</CardTitle>
              <CardDescription>
                A sophisticated hierarchical learning system operating across three distinct privacy and knowledge-sharing tiers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3">
                  <p className="mb-4">
                    Akses AI implements a sophisticated three-tiered learning system with multi-model 
                    orchestration for asset management intelligence. The architecture is designed to balance 
                    personalization, knowledge sharing, and global intelligence while maintaining 
                    appropriate privacy boundaries.
                  </p>
                  
                  <div className="flex flex-col gap-4 mt-6">
                    <div className="p-4 border rounded-lg bg-dark-surface">
                      <h3 className="text-lg font-medium mb-2">Architecture Highlights</h3>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Hierarchical learning system with privacy-preserving tiers</li>
                        <li>Multi-model orchestration with dynamic selection</li>
                        <li>Specialized AI agents for different financial domains</li>
                        <li>Reinforcement learning for continuous improvement</li>
                        <li>Cross-document analysis for comprehensive insights</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-1/3">
                  <div className="h-full p-4 border rounded-lg bg-dark-surface">
                    <h3 className="text-lg font-medium mb-4">Key Components</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/20 text-primary">Tier 1</Badge>
                        <span>User-Level Intelligence</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-info/20 text-info">Tier 2</Badge>
                        <span>Organization-Level Intelligence</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-success/20 text-success">Tier 3</Badge>
                        <span>Global-Level Intelligence</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-6">
                        <Badge variant="outline" className="bg-warning/20 text-warning">Orchestration</Badge>
                        <span>Meta-Orchestrator</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-secondary/20 text-secondary">Agents</Badge>
                        <span>Specialized AI Agents</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-muted/20 text-muted-foreground">RL</Badge>
                        <span>Reinforcement Learning System</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Architecture Diagram */}
              <div className="mt-8 p-6 border rounded-lg bg-dark-surface">
                <h3 className="text-lg font-medium mb-4">Architecture Diagram</h3>
                <div className="w-full h-[400px] flex flex-col items-center justify-center">
                  {/* Simplified Architecture Diagram using Flexbox and CSS */}
                  <div className="relative w-full max-w-3xl h-full">
                    {/* Tier 3 - Global Level */}
                    <div className="absolute top-0 left-0 right-0 h-[100px] border-2 border-success/40 rounded-lg bg-success/5 flex items-center justify-center">
                      <div className="text-center">
                        <Badge variant="outline" className="mb-2 bg-success/20 text-success">Tier 3</Badge>
                        <h4 className="font-bold">Global-Level Intelligence</h4>
                        <p className="text-xs text-muted-foreground">Anonymized cross-customer insights</p>
                      </div>
                    </div>
                    
                    {/* Tier 2 - Organization Level */}
                    <div className="absolute top-[120px] left-0 right-0 h-[100px] border-2 border-info/40 rounded-lg bg-info/5 flex items-center justify-center">
                      <div className="text-center">
                        <Badge variant="outline" className="mb-2 bg-info/20 text-info">Tier 2</Badge>
                        <h4 className="font-bold">Organization-Level Intelligence</h4>
                        <p className="text-xs text-muted-foreground">Cross-user knowledge sharing</p>
                      </div>
                    </div>
                    
                    {/* Tier 1 - User Level */}
                    <div className="absolute top-[240px] left-0 right-0 h-[100px] border-2 border-primary/40 rounded-lg bg-primary/5 flex items-center justify-center">
                      <div className="text-center">
                        <Badge variant="outline" className="mb-2 bg-primary/20 text-primary">Tier 1</Badge>
                        <h4 className="font-bold">User-Level Intelligence</h4>
                        <p className="text-xs text-muted-foreground">Personalized intelligence</p>
                      </div>
                    </div>
                    
                    {/* Meta-Orchestrator */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-[360px] w-[180px] h-[40px] border-2 border-warning/40 rounded-lg bg-warning/10 flex items-center justify-center">
                      <span className="text-sm font-bold">Meta-Orchestrator</span>
                    </div>
                    
                    {/* Connector Lines */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-[100px] w-[2px] h-[20px] bg-gradient-to-b from-success to-info"></div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-[220px] w-[2px] h-[20px] bg-gradient-to-b from-info to-primary"></div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-[340px] w-[2px] h-[20px] bg-gradient-to-b from-primary to-warning"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tiers Tab */}
        <TabsContent value="tiers">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tier 1 */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <Badge variant="outline" className="w-fit mb-2 bg-primary/20 text-primary">Tier 1</Badge>
                <CardTitle>User-Level Intelligence</CardTitle>
                <CardDescription>Personalized, private intelligence tailored to individual users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Data Scope</h4>
                    <p className="text-sm text-muted-foreground">User-specific interactions, preferences, and usage patterns</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Privacy Level</h4>
                    <p className="text-sm text-muted-foreground">Highest - data remains private to the specific user</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Persistence</h4>
                    <p className="text-sm text-muted-foreground">User data stored in isolated database partitions with end-to-end encryption</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Key Components</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      <li>Personal context manager</li>
                      <li>User-specific fine-tuning module</li>
                      <li>Private vector store</li>
                      <li>Preference tracking</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Tier 2 */}
            <Card className="border-l-4 border-l-info">
              <CardHeader>
                <Badge variant="outline" className="w-fit mb-2 bg-info/20 text-info">Tier 2</Badge>
                <CardTitle>Organization-Level Intelligence</CardTitle>
                <CardDescription>Cross-user knowledge sharing within a single organization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Data Scope</h4>
                    <p className="text-sm text-muted-foreground">Anonymized patterns, insights, and domain knowledge within an organization</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Privacy Level</h4>
                    <p className="text-sm text-muted-foreground">High - data is anonymized and shared only within organization boundaries</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Persistence</h4>
                    <p className="text-sm text-muted-foreground">Organization-specific database with differential privacy safeguards</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Key Components</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      <li>Cross-user pattern recognition</li>
                      <li>Organization-specific vector store</li>
                      <li>Domain knowledge graph builder</li>
                      <li>Privacy anonymization pipeline</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Tier 3 */}
            <Card className="border-l-4 border-l-success">
              <CardHeader>
                <Badge variant="outline" className="w-fit mb-2 bg-success/20 text-success">Tier 3</Badge>
                <CardTitle>Global-Level Intelligence</CardTitle>
                <CardDescription>Anonymized cross-customer insights for system-wide improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Data Scope</h4>
                    <p className="text-sm text-muted-foreground">Fully anonymized patterns across all customers</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Privacy Level</h4>
                    <p className="text-sm text-muted-foreground">Managed through robust anonymization and statistical techniques</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Persistence</h4>
                    <p className="text-sm text-muted-foreground">Global vector databases with access controls</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Key Components</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      <li>Global pattern recognition system</li>
                      <li>Federated learning coordinator</li>
                      <li>Trend analysis engine</li>
                      <li>Differential privacy framework</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orchestration System Tab */}
        <TabsContent value="orchestration">
          <Card>
            <CardHeader>
              <CardTitle>Orchestration System Components</CardTitle>
              <CardDescription>The intelligent coordination layer that manages AI processing</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="meta-orchestrator">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-warning/20 text-warning">Core</Badge>
                      <h3 className="text-base font-medium">Meta-Orchestrator</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 rounded-lg bg-dark-surface">
                      <h4 className="font-medium mb-2">Role</h4>
                      <p className="text-sm text-muted-foreground mb-4">Top-level coordinator that manages the entire process flow</p>
                      
                      <h4 className="font-medium mb-2">Functions</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground mb-4">
                        <li>Delegates tasks to specialized orchestrators</li>
                        <li>Monitors performance metrics across all agents</li>
                        <li>Implements the reinforcement learning layer for improving orchestration decisions</li>
                        <li>Manages the global fallback strategy for handling edge cases</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="model-orchestrator">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary/20 text-primary">Models</Badge>
                      <h3 className="text-base font-medium">Model Selection Orchestrator</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 rounded-lg bg-dark-surface">
                      <h4 className="font-medium mb-2">Role</h4>
                      <p className="text-sm text-muted-foreground mb-4">Dynamically selects the optimal LLM for each task</p>
                      
                      <h4 className="font-medium mb-2">Implementation</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground mb-4">
                        <li>Uses historical performance data across different task types</li>
                        <li>Conducts real-time model benchmarking on sample tasks</li>
                        <li>Implements cost optimization algorithms to balance performance vs. resource usage</li>
                        <li>Maintains a performance history database for each model across task types</li>
                      </ul>
                      
                      <h4 className="font-medium mb-2">Models Managed</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-primary/10 text-primary border-primary/20">OpenAI GPT-4o</Badge>
                        <Badge className="bg-secondary/10 text-secondary border-secondary/20">Anthropic Claude 3.7</Badge>
                        <Badge className="bg-info/10 text-info border-info/20">Google Gemini 1.5 Pro</Badge>
                        <Badge className="bg-warning/10 text-warning border-warning/20">Perplexity Sonar</Badge>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="embedding-orchestrator">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-info/20 text-info">Embeddings</Badge>
                      <h3 className="text-base font-medium">Embedding Orchestrator</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 rounded-lg bg-dark-surface">
                      <h4 className="font-medium mb-2">Role</h4>
                      <p className="text-sm text-muted-foreground mb-4">Manages multi-model embeddings for optimal semantic representation</p>
                      
                      <h4 className="font-medium mb-2">Implementation</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground mb-4">
                        <li>Combines embeddings from multiple providers for enhanced accuracy</li>
                        <li>Uses ensemble techniques for improved retrieval performance</li>
                        <li>Dynamically selects embedding models based on content type</li>
                      </ul>
                      
                      <h4 className="font-medium mb-2">Models Managed</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-success/10 text-success border-success/20">Cohere Embed v4</Badge>
                        <Badge className="bg-primary/10 text-primary border-primary/20">OpenAI (text-embedding-3-large)</Badge>
                        <Badge className="bg-info/10 text-info border-info/20">Google Gemini Embeddings</Badge>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="modal-orchestrator">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-secondary/20 text-secondary">Modalities</Badge>
                      <h3 className="text-base font-medium">Modal Processing Orchestrator</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 rounded-lg bg-dark-surface">
                      <h4 className="font-medium mb-2">Role</h4>
                      <p className="text-sm text-muted-foreground mb-4">Handles different types of inputs (text, images, numeric data)</p>
                      
                      <h4 className="font-medium mb-2">Implementation</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground mb-4">
                        <li>Routes different content types to specialized processors</li>
                        <li>Ensures proper encoding and normalization across modalities</li>
                        <li>Combines multi-modal inputs into unified representations</li>
                        <li>Implements fallback strategies for handling unsupported content types</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="agent-coordinators">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-success/20 text-success">Coordination</Badge>
                      <h3 className="text-base font-medium">Specialized Agent Coordinators</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 rounded-lg bg-dark-surface">
                      <h4 className="font-medium mb-2">Role</h4>
                      <p className="text-sm text-muted-foreground mb-4">Manage domain-specific agents that perform specialized tasks</p>
                      
                      <h4 className="font-medium mb-2">Implementation</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground mb-4">
                        <li>Each coordinator optimizes for domain-specific metrics</li>
                        <li>Implements domain-specific post-processing and validation</li>
                        <li>Maintains specialized tools and data sources per domain</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Agents Tab */}
        <TabsContent value="agents">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Financial Analyst Agent */}
            <Card>
              <CardHeader className="bg-dark-surface border-b border-dark">
                <Badge variant="outline" className="w-fit mb-2 bg-primary/20 text-primary">Agent</Badge>
                <CardTitle>Financial Analyst Agent</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Primary Models</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-primary/10 text-primary border-primary/20">GPT-4o</Badge>
                      <Badge className="bg-secondary/10 text-secondary border-secondary/20">Claude 3.7</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Vector Database</h4>
                    <p className="text-sm text-muted-foreground">PineconeDB with financial domain fine-tuning</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Special Features</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      <li>Financial ratio calculator</li>
                      <li>Anomaly detection system (sensitivity adjustable: 1-100%)</li>
                      <li>XBRL parser for financial statement extraction</li>
                      <li>Time-series forecast integration</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Legal Assistant Agent */}
            <Card>
              <CardHeader className="bg-dark-surface border-b border-dark">
                <Badge variant="outline" className="w-fit mb-2 bg-info/20 text-info">Agent</Badge>
                <CardTitle>Legal Assistant Agent</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Primary Models</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-secondary/10 text-secondary border-secondary/20">Claude 3.7</Badge>
                      <Badge className="bg-primary/10 text-primary border-primary/20">GPT-4o</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Vector Database</h4>
                    <p className="text-sm text-muted-foreground">ChromaDB with legal corpus embeddings</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Special Features</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      <li>Legal precedent retrieval system</li>
                      <li>Contract clause comparison engine</li>
                      <li>Risk detection with confidence scoring</li>
                      <li>Jurisdiction-specific compliance checkers</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Deal Strategist Agent */}
            <Card>
              <CardHeader className="bg-dark-surface border-b border-dark">
                <Badge variant="outline" className="w-fit mb-2 bg-warning/20 text-warning">Agent</Badge>
                <CardTitle>Deal Strategist Agent</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Primary Models</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-primary/10 text-primary border-primary/20">GPT-4o</Badge>
                      <Badge className="bg-warning/10 text-warning border-warning/20">Perplexity</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Vector Database</h4>
                    <p className="text-sm text-muted-foreground">PineconeDB (separate index from Financial Analyst)</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Special Features</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      <li>M&A synergy calculator</li>
                      <li>Valuation comparison system</li>
                      <li>Market trend analysis integration</li>
                      <li>Regulatory approval likelihood estimator</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Research Assistant Agent */}
            <Card>
              <CardHeader className="bg-dark-surface border-b border-dark">
                <Badge variant="outline" className="w-fit mb-2 bg-success/20 text-success">Agent</Badge>
                <CardTitle>Research Assistant Agent</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Primary Models</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-secondary/10 text-secondary border-secondary/20">Claude 3.7</Badge>
                      <Badge className="bg-warning/10 text-warning border-warning/20">Perplexity</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Vector Database</h4>
                    <p className="text-sm text-muted-foreground">Multi-index ChromaDB for diverse sources</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Special Features</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      <li>Literature review automation</li>
                      <li>Source validation and credibility scoring</li>
                      <li>Cross-source synthesis engine</li>
                      <li>Search strategy optimizer</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Only display on full page */}
            <div className="md:col-span-2 flex justify-center">
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setActiveTab("technical")}
              >
                View Technical Implementation
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Technical Implementation Tab */}
        <TabsContent value="technical">
          <Card>
            <CardHeader>
              <CardTitle>Technical Implementation Details</CardTitle>
              <CardDescription>System architecture and implementation specifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* API Layer */}
                <div className="p-4 border rounded-lg bg-dark-surface">
                  <h3 className="text-lg font-medium mb-3">API Layer</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>RESTful endpoints for agent interaction</li>
                    <li>WebSocket support for real-time updates</li>
                    <li>GraphQL interface for complex data queries</li>
                    <li>Authentication with OAuth2 and JWT</li>
                    <li>Rate limiting and throttling</li>
                  </ul>
                </div>
                
                {/* Database Architecture */}
                <div className="p-4 border rounded-lg bg-dark-surface">
                  <h3 className="text-lg font-medium mb-3">Database Architecture</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>PostgreSQL for structured data and relationship management</li>
                    <li>Vector databases (Pinecone, Chroma, Qdrant) for embeddings</li>
                    <li>Redis for caching and session management</li>
                    <li>TimescaleDB for time-series metrics</li>
                  </ul>
                </div>
                
                {/* Deployment Infrastructure */}
                <div className="p-4 border rounded-lg bg-dark-surface">
                  <h3 className="text-lg font-medium mb-3">Deployment Infrastructure</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>Containerized microservices (Docker)</li>
                    <li>Kubernetes orchestration</li>
                    <li>Auto-scaling based on demand</li>
                    <li>Blue-green deployment for zero-downtime updates</li>
                    <li>Separate environments for tiers to enforce isolation</li>
                  </ul>
                </div>
                
                {/* Security & Privacy Framework */}
                <div className="p-4 border rounded-lg bg-dark-surface">
                  <h3 className="text-lg font-medium mb-3">Security & Privacy Framework</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>End-to-end encryption for user data</li>
                    <li>Differential privacy implementation (ε-differential privacy with ε=0.1)</li>
                    <li>Strict data partitioning between tiers</li>
                    <li>Anonymization pipelines for cross-organization learning</li>
                    <li>Federated learning capabilities where appropriate</li>
                  </ul>
                </div>
              </div>
              
              {/* Reinforcement Learning System */}
              <div className="mt-6 p-6 border rounded-lg bg-dark-surface">
                <h3 className="text-lg font-medium mb-4">Reinforcement Learning System</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Signal Collection Pipeline</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      <li>Captures user feedback (explicit and implicit)</li>
                      <li>Records task completion metrics and timings</li>
                      <li>Tracks model selection outcomes</li>
                      <li>Measures retrieval accuracy and relevance</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Learning Components</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      <li>Value Function Estimator: Predicts expected utility</li>
                      <li>Policy Optimizer: Updates orchestration strategies</li>
                      <li>Reward Shaping: Defines multi-dimensional utility metrics</li>
                      <li>Experience Replay: Maintains history of past decisions</li>
                    </ul>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h4 className="font-medium mb-2">Learning Loop Implementation</h4>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex-1 min-w-[200px] p-3 border rounded-lg bg-dark-lighter">
                        <h5 className="text-sm font-medium mb-1">Real-time</h5>
                        <p className="text-xs text-muted-foreground">Micro-adjustments for immediate task optimization</p>
                      </div>
                      
                      <div className="flex-1 min-w-[200px] p-3 border rounded-lg bg-dark-lighter">
                        <h5 className="text-sm font-medium mb-1">Daily</h5>
                        <p className="text-xs text-muted-foreground">Batch processing for strategy updates</p>
                      </div>
                      
                      <div className="flex-1 min-w-[200px] p-3 border rounded-lg bg-dark-lighter">
                        <h5 className="text-sm font-medium mb-1">Weekly</h5>
                        <p className="text-xs text-muted-foreground">Comprehensive model re-calibration</p>
                      </div>
                      
                      <div className="flex-1 min-w-[200px] p-3 border rounded-lg bg-dark-lighter">
                        <h5 className="text-sm font-medium mb-1">Monthly</h5>
                        <p className="text-xs text-muted-foreground">Strategy validation with synthetic benchmarks</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Integration Guidelines */}
              <div className="mt-6 p-4 border rounded-lg bg-dark-surface">
                <h3 className="text-lg font-medium mb-2">Integration Guidelines</h3>
                <p className="text-sm text-muted-foreground">
                  Developers should implement the appropriate interfaces for each component, following strict typing 
                  requirements and API contracts. The system uses dependency injection throughout to allow component 
                  swapping as needed.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  All orchestrators must implement the IOrchestratorBase interface, and specialized agents should 
                  extend the BaseAgent abstract class. Communication between tiers happens through the TierBoundaryService 
                  to enforce privacy controls.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}