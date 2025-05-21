import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bot,
  Plus,
  Search,
  BarChart3,
  Settings,
  BrainCircuit,
  FileBox,
  Sparkles,
  PlusCircle,
  Slack,
  Layers,
  Code,
  FileJson,
  BookOpen,
  MessageSquare,
  Bookmark,
  FileUp,
  LineChart,
  AreaChart,
  Clock,
  Users,
  AlertTriangle,
  Database,
  GitBranch,
  Share2,
  EyeOff,
  Lock,
  UserCog,
  Rocket,
  Workflow,
  Globe,
  Leaf,
  Table,
  FileText,
  Mail,
  Bell,
  CheckCircle,
  Play,
  Wand,
  X,
  File,
  Brain
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const agentTypes = [
  { id: "tool-calling", name: "Tool Calling", icon: <Code className="w-4 h-4" /> },
  { id: "rag", name: "RAG", icon: <FileBox className="w-4 h-4" /> },
  { id: "text-only", name: "Text-only", icon: <MessageSquare className="w-4 h-4" /> },
  { id: "data-enrichment", name: "Data Enrichment", icon: <Database className="w-4 h-4" /> },
  { id: "chat-ui", name: "Chat UI", icon: <MessageSquare className="w-4 h-4" /> },
];

const agentDomains = [
  { id: "risk", name: "Risk" },
  { id: "legal", name: "Legal" },
  { id: "ops", name: "Operations" },
  { id: "esg", name: "ESG" },
  { id: "finance", name: "Finance" },
  { id: "all", name: "All Domains" },
];

const agentStatuses = [
  { id: "active", name: "Active", color: "bg-green-500" },
  { id: "auto", name: "Auto", color: "bg-blue-500" },
  { id: "manual", name: "Manual", color: "bg-yellow-500" },
  { id: "development", name: "In Development", color: "bg-purple-500" },
  { id: "archived", name: "Archived", color: "bg-gray-500" },
];

// Sample agents data
const agents = [
  {
    id: 1,
    name: "Pre-Screening Agent",
    description: "Automates initial deal evaluation process",
    domain: "risk",
    status: "active",
    icon: <Sparkles className="w-6 h-6 text-blue-400" />,
    calls: 1423,
    avgResponseTime: 1.2,
    owner: "AI Team",
  },
  {
    id: 2,
    name: "Deal Memo Generator",
    description: "Creates structured deal memos from data",
    domain: "finance",
    status: "active",
    icon: <FileJson className="w-6 h-6 text-emerald-400" />,
    calls: 856,
    avgResponseTime: 2.8,
    owner: "Credit Team",
  },
  {
    id: 3,
    name: "Covenant Monitor",
    description: "Tracks and alerts on covenant compliance",
    domain: "legal",
    status: "manual",
    icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
    calls: 324,
    avgResponseTime: 0.9,
    owner: "Legal Team",
  },
  {
    id: 4,
    name: "ESG Risk Analyzer",
    description: "Evaluates environmental and governance risks",
    domain: "esg",
    status: "development",
    icon: <Bookmark className="w-6 h-6 text-green-400" />,
    calls: 58,
    avgResponseTime: 4.2,
    owner: "Research Team",
  },
  {
    id: 5,
    name: "Documents Processor",
    description: "Extracts and organizes data from documents",
    domain: "ops",
    status: "auto",
    icon: <FileBox className="w-6 h-6 text-indigo-400" />,
    calls: 2156,
    avgResponseTime: 0.6,
    owner: "Data Team",
  },
  {
    id: 6,
    name: "Market Intelligence",
    description: "Provides market insights and trends",
    domain: "finance",
    status: "active",
    icon: <LineChart className="w-6 h-6 text-purple-400" />,
    calls: 743,
    avgResponseTime: 3.1,
    owner: "Analyst Team",
  },
];

export function AIAgentsOrchestration() {
  const [selectedTab, setSelectedTab] = useState("directory");
  const [domainFilter, setDomainFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter agents based on selected filters
  const filteredAgents = agents.filter(agent => {
    const matchesDomain = domainFilter === "all" || agent.domain === domainFilter;
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter;
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDomain && matchesStatus && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-dark-border pb-4 mb-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-primary-light" />
          <h2 className="text-xl font-semibold">AI Agents Orchestration</h2>
        </div>
        <Button onClick={() => setSelectedTab("create-new")}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Agent
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="w-full justify-start mb-4">
          <TabsTrigger value="directory" className="flex items-center gap-1">
            <Bot className="h-4 w-4" />
            Agent Directory
          </TabsTrigger>
          <TabsTrigger value="builder" className="flex items-center gap-1">
            <Workflow className="h-4 w-4" />
            Agent Builder
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            Monitoring & Logs
          </TabsTrigger>
          <TabsTrigger value="governance" className="flex items-center gap-1">
            <Lock className="h-4 w-4" />
            Governance
          </TabsTrigger>
          <TabsTrigger value="create-new" className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            Create New
          </TabsTrigger>
        </TabsList>

        {/* 1. Agent Directory */}
        <TabsContent value="directory" className="flex-1 overflow-hidden">
          <div className="mb-4 flex flex-wrap gap-3 items-center justify-between">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={domainFilter} onValueChange={setDomainFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by domain" />
                </SelectTrigger>
                <SelectContent>
                  {agentDomains.map(domain => (
                    <SelectItem key={domain.id} value={domain.id}>{domain.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {agentStatuses.map(status => (
                    <SelectItem key={status.id} value={status.id}>{status.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <ScrollArea className="flex-1 pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAgents.map(agent => (
                <Card key={agent.id} className="border border-dark-border bg-dark-card">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {agent.icon}
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                      </div>
                      <Badge className={`${
                        agent.status === "active" ? "bg-green-600" :
                        agent.status === "auto" ? "bg-blue-600" :
                        agent.status === "manual" ? "bg-amber-600" :
                        agent.status === "development" ? "bg-purple-600" : "bg-gray-600"
                      } text-white`}>
                        {agent.status === "active" ? "Active" :
                         agent.status === "auto" ? "Auto" :
                         agent.status === "manual" ? "Manual" :
                         agent.status === "development" ? "In Dev" : "Archived"}
                      </Badge>
                    </div>
                    <CardDescription>{agent.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-sm text-muted-foreground grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1">
                        <Database className="h-3.5 w-3.5" />
                        <span>Domain: {
                          agent.domain === "risk" ? "Risk" :
                          agent.domain === "legal" ? "Legal" :
                          agent.domain === "ops" ? "Operations" :
                          agent.domain === "esg" ? "ESG" : "Finance"
                        }</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>Owner: {agent.owner}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{agent.calls.toLocaleString()} calls</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{agent.avgResponseTime}s response</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="w-full flex justify-between">
                      <Button variant="outline" size="sm">Details</Button>
                      <Button variant="ghost" size="sm" className="text-primary-light">
                        <Settings className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* 2. Enhanced Agent Builder */}
        <TabsContent value="builder" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <Card className="border border-dark-border bg-dark-card mb-6">
              <CardHeader className="bg-gradient-to-r from-indigo-950/70 to-purple-950/70 border-b border-dark-border">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-purple-400" />
                  <CardTitle>Advanced Agent Configurator</CardTitle>
                </div>
                <CardDescription>Build powerful AI agents with specialized capabilities and automated workflows</CardDescription>
              </CardHeader>
              
              {/* Agent Identity Section */}
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2 mb-4 text-indigo-300">
                      <Brain className="h-5 w-5" />
                      1. Agent Identity
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="agent-name">Agent Name</Label>
                        <Input id="agent-name" placeholder="E.g., Delinquency Watchdog" defaultValue="Delinquency Watchdog" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="agent-role">Agent Role/Persona</Label>
                        <Select defaultValue="risk-analyst">
                          <SelectTrigger>
                            <SelectValue placeholder="Select agent role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="risk-analyst">Risk Analyst</SelectItem>
                            <SelectItem value="compliance">Compliance Copilot</SelectItem>
                            <SelectItem value="ic-assistant">IC Pack Assistant</SelectItem>
                            <SelectItem value="credit-monitor">Credit Monitor</SelectItem>
                            <SelectItem value="custom">Custom Role...</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="agent-purpose">Purpose</Label>
                        <Input 
                          id="agent-purpose" 
                          placeholder="Summary of agent's purpose..." 
                          defaultValue="Monitor delinquency daily and alert when over 6%"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Concise summary of what this agent will do</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="agent-domain">Domain</Label>
                        <Select defaultValue="risk">
                          <SelectTrigger>
                            <SelectValue placeholder="Select domain" />
                          </SelectTrigger>
                          <SelectContent>
                            {agentDomains.filter(d => d.id !== "all").map(domain => (
                              <SelectItem key={domain.id} value={domain.id}>{domain.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="execution-mode">Execution Mode</Label>
                        <Select defaultValue="scheduled">
                          <SelectTrigger>
                            <SelectValue placeholder="Select execution mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="on-demand">On-Demand</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="triggered">Triggered</SelectItem>
                            <SelectItem value="auto">Auto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tools & Resources Section */}
                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2 mb-4 text-indigo-300">
                      <Settings className="h-5 w-5" />
                      2. Tools & Resources
                    </h3>
                    
                    <div className="flex flex-col gap-6">
                      {/* Tools drag-drop interface */}
                      <div className="border border-dark-border rounded-md bg-dark-lighter p-4">
                        <h4 className="text-sm font-medium mb-3">Tools (Drag & Drop)</h4>
                        
                        <div className="grid grid-cols-2 gap-x-10 gap-y-2">
                          <div className="space-y-3">
                            <p className="text-xs text-muted-foreground">Available Tools</p>
                            <div className="space-y-2 min-h-24 bg-dark-card rounded-md p-2 border border-dark-border border-dashed">
                              {[
                                { id: "portfolio-analyzer", name: "Portfolio Analyzer", icon: <BarChart3 className="h-4 w-4 text-emerald-400" /> },
                                { id: "deal-finder", name: "Deal Finder", icon: <Search className="h-4 w-4 text-blue-400" /> },
                                { id: "pdf-parser", name: "PDF Parser", icon: <FileUp className="h-4 w-4 text-amber-400" /> },
                                { id: "doc-comparator", name: "Document Comparator", icon: <File className="h-4 w-4 text-indigo-400" /> },
                                { id: "mongo-search", name: "Mongo Search", icon: <Database className="h-4 w-4 text-purple-400" /> },
                              ].map(tool => (
                                <div key={tool.id} className="flex items-center gap-2 p-1.5 rounded-md bg-dark-surface cursor-move hover:bg-dark-active transition-colors">
                                  {tool.icon}
                                  <span className="text-xs">{tool.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <p className="text-xs text-muted-foreground">Selected Tools</p>
                            <div className="space-y-2 min-h-24 bg-dark-card rounded-md p-2 border border-blue-900 border-dashed">
                              {[
                                { id: "tape-cracker", name: "Tape Cracker", icon: <Code className="h-4 w-4 text-blue-400" /> },
                                { id: "risk-analyzer", name: "Risk Ratio Analyzer", icon: <BarChart3 className="h-4 w-4 text-red-400" /> },
                                { id: "pricer", name: "Pricer", icon: <BarChart3 className="h-4 w-4 text-green-400" /> },
                              ].map(tool => (
                                <div key={tool.id} className="flex items-center justify-between p-1.5 rounded-md bg-blue-950/30 cursor-move group">
                                  <div className="flex items-center gap-2">
                                    {tool.icon}
                                    <span className="text-xs">{tool.name}</span>
                                  </div>
                                  <X className="h-3 w-3 text-muted-foreground hover:text-white cursor-pointer transition-colors opacity-0 group-hover:opacity-100" />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Resources drag-drop interface */}
                      <div className="border border-dark-border rounded-md bg-dark-lighter p-4">
                        <h4 className="text-sm font-medium mb-3">Resources (Drag & Drop)</h4>
                        
                        <div className="grid grid-cols-2 gap-x-10 gap-y-2">
                          <div className="space-y-3">
                            <p className="text-xs text-muted-foreground">Available Resources</p>
                            <div className="space-y-2 min-h-24 bg-dark-card rounded-md p-2 border border-dark-border border-dashed">
                              {[
                                { id: "term-sheets", name: "TermSheets Collection", icon: <BookOpen className="h-4 w-4 text-amber-400" />, type: "vector-db" },
                                { id: "bloomberg", name: "Bloomberg API", icon: <BarChart3 className="h-4 w-4 text-blue-400" />, type: "feed" },
                                { id: "world-bank", name: "World Bank API", icon: <Globe className="h-4 w-4 text-green-400" />, type: "feed" },
                                { id: "esg-criteria", name: "ESG Criteria", icon: <Leaf className="h-4 w-4 text-emerald-400" />, type: "vector-db" },
                                { id: "ic-outcomes", name: "IC Outcomes", icon: <BarChart3 className="h-4 w-4 text-purple-400" />, type: "org-data" },
                              ].map(resource => (
                                <div key={resource.id} className="flex items-center gap-2 p-1.5 rounded-md bg-dark-surface cursor-move hover:bg-dark-active transition-colors">
                                  {resource.icon}
                                  <span className="text-xs">{resource.name}</span>
                                  <Badge variant="outline" className="text-[10px] h-4 px-1 ml-auto">
                                    {resource.type === "vector-db" ? "RAG" : 
                                     resource.type === "feed" ? "Feed" : "Org"}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <p className="text-xs text-muted-foreground">Selected Resources</p>
                            <div className="space-y-2 min-h-24 bg-dark-card rounded-md p-2 border border-teal-900 border-dashed">
                              {[
                                { id: "scale-db", name: "S.C.A.L.E. DB", icon: <Database className="h-4 w-4 text-teal-400" />, type: "org-data" },
                                { id: "portfolio-csv", name: "Portfolio.csv", icon: <FileUp className="h-4 w-4 text-yellow-400" />, type: "file" },
                                { id: "esg-framework", name: "ESG Framework.pdf", icon: <FileUp className="h-4 w-4 text-amber-400" />, type: "file" },
                              ].map(resource => (
                                <div key={resource.id} className="flex items-center justify-between p-1.5 rounded-md bg-teal-950/30 cursor-move group">
                                  <div className="flex items-center gap-2">
                                    {resource.icon}
                                    <span className="text-xs">{resource.name}</span>
                                  </div>
                                  <Badge variant="outline" className="text-[10px] h-4 px-1 mr-1">
                                    {resource.type === "file" ? "File" : 
                                     resource.type === "feed" ? "Feed" : "Org"}
                                  </Badge>
                                  <X className="h-3 w-3 text-muted-foreground hover:text-white cursor-pointer transition-colors opacity-0 group-hover:opacity-100" />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
                            <Plus className="h-3 w-3" />
                            Upload New Resource
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Behavior & Scheduling Section */}
                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2 mb-4 text-indigo-300">
                      <Clock className="h-5 w-5" />
                      3. Behavior & Scheduling
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="run-type">Run Type</Label>
                        <Select defaultValue="daily">
                          <SelectTrigger>
                            <SelectValue placeholder="Select run type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="real-time">Real-Time</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="on-change">On Change</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="schedule-time">Schedule Time</Label>
                        <div className="flex items-center gap-2">
                          <Select defaultValue="6">
                            <SelectTrigger className="w-20">
                              <SelectValue placeholder="Hour" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({length: 12}, (_, i) => (
                                <SelectItem key={i} value={String(i + 1)}>{i + 1}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span>:</span>
                          <Select defaultValue="00">
                            <SelectTrigger className="w-20">
                              <SelectValue placeholder="Min" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="00">00</SelectItem>
                              <SelectItem value="15">15</SelectItem>
                              <SelectItem value="30">30</SelectItem>
                              <SelectItem value="45">45</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select defaultValue="am">
                            <SelectTrigger className="w-20">
                              <SelectValue placeholder="AM/PM" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="am">AM</SelectItem>
                              <SelectItem value="pm">PM</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select defaultValue="est">
                            <SelectTrigger className="w-24">
                              <SelectValue placeholder="Timezone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="est">EST</SelectItem>
                              <SelectItem value="cst">CST</SelectItem>
                              <SelectItem value="mst">MST</SelectItem>
                              <SelectItem value="pst">PST</SelectItem>
                              <SelectItem value="utc">UTC</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-4">
                      <Switch id="weekdays-only" defaultChecked />
                      <Label htmlFor="weekdays-only">Only run on weekdays</Label>
                    </div>
                    
                    <div className="mt-6">
                      <Label>Auto-actions</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="action-email" defaultChecked />
                          <Label htmlFor="action-email" className="flex items-center gap-1">
                            <Mail className="h-4 w-4 text-blue-400" />
                            <span>Send report to my email</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="action-slack" defaultChecked />
                          <Label htmlFor="action-slack" className="flex items-center gap-1">
                            <Slack className="h-4 w-4 text-teal-400" />
                            <span>Post summary to Slack #risk-updates</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="action-dashboard" />
                          <Label htmlFor="action-dashboard" className="flex items-center gap-1">
                            <LineChart className="h-4 w-4 text-purple-400" />
                            <span>Update Retool dashboard</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="action-notification" />
                          <Label htmlFor="action-notification" className="flex items-center gap-1">
                            <Bell className="h-4 w-4 text-amber-400" />
                            <span>Send in-app notification</span>
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Natural Language Goal/Prompt */}
                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2 mb-4 text-indigo-300">
                      <MessageSquare className="h-5 w-5" />
                      4. Natural Language Goal / Prompt
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="system-prompt">Base Prompt</Label>
                      <div className="border border-dark-border rounded-md bg-dark-lighter">
                        <textarea 
                          id="system-prompt" 
                          className="w-full h-32 p-3 bg-dark-lighter text-sm rounded-md resize-none outline-none" 
                          placeholder="Instructions for your agent..."
                          defaultValue="You are a financial analyst. Every morning, check for any loan portfolios with NAR < 24% and default rate > 5%. Run a wind-down simulation if any are found. Then email a 3-paragraph summary to the credit team."
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Define the agent's behavior and goals in natural language</p>
                    </div>
                    
                    <div className="flex justify-end mt-2">
                      <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1 text-muted-foreground">
                        <Wand className="h-3 w-3" />
                        Generate from purpose
                      </Button>
                    </div>
                  </div>
                  
                  {/* Outputs Section */}
                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2 mb-4 text-indigo-300">
                      <Share2 className="h-5 w-5" />
                      5. Outputs
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: "pdf-report", name: "PDF Report (IC Memo style)", icon: <FileText className="h-4 w-4 text-red-400" />, checked: true },
                        { id: "table", name: "Table (HTML/Markdown/CSV)", icon: <Table className="h-4 w-4 text-blue-400" />, checked: false },
                        { id: "slack", name: "Slack message", icon: <Slack className="h-4 w-4 text-teal-400" />, checked: true },
                        { id: "json", name: "JSON block for developer consumption", icon: <Code className="h-4 w-4 text-purple-400" />, checked: false },
                        { id: "email", name: "Email (HTML + attachment)", icon: <Mail className="h-4 w-4 text-amber-400" />, checked: true },
                      ].map(output => (
                        <div key={output.id} className="flex items-center space-x-2">
                          <Switch id={`output-${output.id}`} defaultChecked={output.checked} />
                          <Label htmlFor={`output-${output.id}`} className="flex items-center gap-1">
                            {output.icon}
                            <span>{output.name}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Example Config Summary */}
                  <div className="border border-dark-border rounded-md bg-dark-lighter p-4 mt-6">
                    <h4 className="text-sm font-medium mb-3 text-teal-400 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Agent Configuration Summary
                    </h4>
                    
                    <div className="grid grid-cols-3 gap-y-2 text-xs">
                      <div className="text-muted-foreground">Name</div>
                      <div className="col-span-2 font-medium">"Delinquency Watchdog"</div>
                      
                      <div className="text-muted-foreground">Role</div>
                      <div className="col-span-2 font-medium">"Risk Ops Agent"</div>
                      
                      <div className="text-muted-foreground">Trigger</div>
                      <div className="col-span-2 font-medium">Daily @ 6AM EST</div>
                      
                      <div className="text-muted-foreground">Tools</div>
                      <div className="col-span-2 font-medium">Tape Cracker, Risk Ratio Analyzer, Email</div>
                      
                      <div className="text-muted-foreground">Resources</div>
                      <div className="col-span-2 font-medium">S.C.A.L.E. DB, Portfolio.csv, ESG Framework.pdf</div>
                      
                      <div className="text-muted-foreground">Actions</div>
                      <div className="col-span-2 font-medium">Runs analysis → if any trigger breached → generate PDF → email to PM</div>
                      
                      <div className="text-muted-foreground">Output</div>
                      <div className="col-span-2 font-medium">Email with PDF + Slack notification</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t border-dark-border pt-4">
                <div className="flex gap-2">
                  <Button variant="outline">Save as Draft</Button>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Play className="h-4 w-4" />
                    Test Run
                  </Button>
                </div>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  Save & Activate Agent
                </Button>
              </CardFooter>
            </Card>
          </ScrollArea>
        </TabsContent>

        {/* 3. Monitoring & Logs */}
        <TabsContent value="monitoring" className="flex-1 overflow-hidden">
          <div className="mb-4">
            <Select defaultValue="1">
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Select agent to monitor" />
              </SelectTrigger>
              <SelectContent>
                {agents.map(agent => (
                  <SelectItem key={agent.id} value={agent.id.toString()}>
                    <div className="flex items-center gap-2">
                      {agent.icon}
                      <span>{agent.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6">
              <Card className="border border-dark-border bg-dark-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-dark-lighter rounded-md p-3">
                      <div className="text-sm text-muted-foreground">Total Calls</div>
                      <div className="text-2xl font-semibold">1,423</div>
                      <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
                        <AreaChart className="h-3 w-3" />
                        <span>+12% from last week</span>
                      </div>
                    </div>
                    <div className="bg-dark-lighter rounded-md p-3">
                      <div className="text-sm text-muted-foreground">Avg Response Time</div>
                      <div className="text-2xl font-semibold">1.2s</div>
                      <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
                        <AreaChart className="h-3 w-3" />
                        <span>-0.3s from last week</span>
                      </div>
                    </div>
                    <div className="bg-dark-lighter rounded-md p-3">
                      <div className="text-sm text-muted-foreground">Token Cost</div>
                      <div className="text-2xl font-semibold">$17.85</div>
                      <div className="text-xs text-amber-500 flex items-center gap-1 mt-1">
                        <AreaChart className="h-3 w-3" />
                        <span>+8% from last week</span>
                      </div>
                    </div>
                    <div className="bg-dark-lighter rounded-md p-3">
                      <div className="text-sm text-muted-foreground">API Errors</div>
                      <div className="text-2xl font-semibold">2</div>
                      <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
                        <AreaChart className="h-3 w-3" />
                        <span>-5 from last week</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-dark-border">
                    <div className="h-40 w-full bg-dark-lighter rounded-md flex items-center justify-center">
                      <div className="text-muted-foreground text-sm flex flex-col items-center">
                        <LineChart className="h-8 w-8 mb-2" />
                        <span>Weekly Usage Chart</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-dark-border bg-dark-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Top Queries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { query: "Generate pre-screening for Acme Corp", count: 38, user: "Sarah Johnson" },
                      { query: "Analyze covenants for Project X", count: 27, user: "Michael Chen" },
                      { query: "Summarize key risks for EcoTech deal", count: 21, user: "David Williams" },
                      { query: "Calculate financial metrics for Sunrise", count: 19, user: "Emma Patterson" },
                      { query: "Compare market benchmarks", count: 15, user: "Alex Thompson" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-dark-border last:border-0">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">{item.query}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-muted-foreground">{item.user}</div>
                          <Badge variant="outline" className="ml-2">{item.count}x</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-dark-border bg-dark-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Recent Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { message: "Successfully generated pre-screening report", time: "2 mins ago", status: "success" },
                      { message: "API timeout when accessing market data", time: "15 mins ago", status: "error" },
                      { message: "Model fallback to GPT-3.5 due to quota limits", time: "1 hour ago", status: "warning" },
                      { message: "User feedback received: Accurate analysis", time: "3 hours ago", status: "info" },
                      { message: "New data source connected: Q1 financials", time: "Yesterday, 4:23 PM", status: "success" },
                    ].map((log, i) => (
                      <div key={i} className="flex items-center gap-2 py-2 border-b border-dark-border last:border-0">
                        <div className={`h-2 w-2 rounded-full ${
                          log.status === "success" ? "bg-green-500" :
                          log.status === "error" ? "bg-red-500" :
                          log.status === "warning" ? "bg-amber-500" : "bg-blue-500"
                        }`} />
                        <div className="text-sm flex-1">{log.message}</div>
                        <div className="text-xs text-muted-foreground">{log.time}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* 4. Governance */}
        <TabsContent value="governance" className="flex-1 overflow-hidden">
          <div className="mb-4">
            <Select defaultValue="1">
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Select agent to configure" />
              </SelectTrigger>
              <SelectContent>
                {agents.map(agent => (
                  <SelectItem key={agent.id} value={agent.id.toString()}>
                    <div className="flex items-center gap-2">
                      {agent.icon}
                      <span>{agent.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6">
              <Card className="border border-dark-border bg-dark-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Access Control</CardTitle>
                  <CardDescription>Control who can use this agent and where it appears</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Applications</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {[
                          { id: "pre-flight", name: "Pre-Flight" },
                          { id: "deal-manager", name: "Deal Manager" },
                          { id: "portfolio-monitor", name: "Portfolio Monitor" },
                          { id: "command-center", name: "Command Center" },
                          { id: "documentation", name: "Documentation" },
                          { id: "admin-console", name: "Admin Console" },
                        ].map(app => (
                          <div key={app.id} className="flex items-center space-x-2">
                            <Switch id={`app-${app.id}`} defaultChecked={app.id === "pre-flight" || app.id === "command-center"} />
                            <Label htmlFor={`app-${app.id}`}>{app.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>User Roles</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {[
                          { id: "admin", name: "Administrators" },
                          { id: "analyst", name: "Analysts" },
                          { id: "manager", name: "Managers" },
                          { id: "viewer", name: "Viewers" },
                          { id: "legal", name: "Legal Team" },
                          { id: "exec", name: "Executives" },
                        ].map(role => (
                          <div key={role.id} className="flex items-center space-x-2">
                            <Switch id={`role-${role.id}`} defaultChecked={role.id !== "viewer"} />
                            <Label htmlFor={`role-${role.id}`}>{role.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-dark-border bg-dark-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Deployment Environment</CardTitle>
                  <CardDescription>Select where this agent operates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="rounded-md border border-dark-border p-3 flex flex-col items-center cursor-pointer hover:border-primary-light transition-colors">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 w-8 h-8 rounded-full flex items-center justify-center mb-2">
                          <Rocket className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-sm font-medium">Development</div>
                        <div className="text-xs text-muted-foreground">Testing & iteration</div>
                      </div>
                      <div className="rounded-md border border-dark-border p-3 flex flex-col items-center cursor-pointer hover:border-primary-light transition-colors">
                        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 w-8 h-8 rounded-full flex items-center justify-center mb-2">
                          <Layers className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-sm font-medium">Staging</div>
                        <div className="text-xs text-muted-foreground">Pre-production</div>
                      </div>
                      <div className="rounded-md border border-primary-light p-3 flex flex-col items-center cursor-pointer bg-dark-border/20">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-8 h-8 rounded-full flex items-center justify-center mb-2">
                          <Database className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-sm font-medium">Production</div>
                        <div className="text-xs text-muted-foreground">Live environment</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="owner">Agent Owner</Label>
                      <Input id="owner" placeholder="Team or individual responsible" defaultValue="AI Team" />
                      <p className="text-xs text-muted-foreground mt-1">This person/team will receive all alerts and be responsible for maintenance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-dark-border bg-dark-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Agent Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button variant="outline" className="flex flex-col h-auto py-3 gap-1">
                      <EyeOff className="h-4 w-4" />
                      <span>Disable Agent</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-auto py-3 gap-1">
                      <GitBranch className="h-4 w-4" />
                      <span>Clone Agent</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-auto py-3 gap-1">
                      <Share2 className="h-4 w-4" />
                      <span>View Dependencies</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-auto py-3 gap-1 text-red-500 hover:text-red-400">
                      <UserCog className="h-4 w-4" />
                      <span>Archive Agent</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* 5. Create New Agent */}
        <TabsContent value="create-new" className="flex-1 overflow-hidden">
          <Card className="border border-dark-border bg-dark-card">
            <CardHeader>
              <CardTitle>Create New Agent</CardTitle>
              <CardDescription>Let's set up a new AI agent for your workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="new-agent-name">Agent Name</Label>
                  <Input id="new-agent-name" placeholder="Name your new agent" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-agent-purpose">Purpose</Label>
                  <textarea 
                    id="new-agent-purpose" 
                    className="w-full h-24 p-2 border border-dark-border bg-dark-lighter text-sm rounded-md resize-none outline-none" 
                    placeholder="Describe what this agent will do..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Choose Agent Archetype</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { 
                        id: "deal-support", 
                        name: "Deal Support Agent", 
                        description: "Assists with pre-flight and memo generation",
                        icon: <FileJson className="h-5 w-5 text-emerald-400" />
                      },
                      { 
                        id: "doc-analysis", 
                        name: "Document Analysis Agent", 
                        description: "Extracts insights from documents",
                        icon: <FileBox className="h-5 w-5 text-indigo-400" />
                      },
                      { 
                        id: "covenant", 
                        name: "Covenant Risk Monitor", 
                        description: "Tracks compliance with covenants",
                        icon: <AlertTriangle className="h-5 w-5 text-amber-400" />
                      },
                      { 
                        id: "underwriting", 
                        name: "Underwriting Auditor", 
                        description: "Reviews and validates underwriting",
                        icon: <Bookmark className="h-5 w-5 text-blue-400" />
                      },
                    ].map(archetype => (
                      <div key={archetype.id} className="rounded-md border border-dark-border hover:border-primary-light transition-colors p-3 flex items-start gap-3 cursor-pointer">
                        <div className="mt-0.5">{archetype.icon}</div>
                        <div>
                          <div className="text-sm font-medium">{archetype.name}</div>
                          <div className="text-xs text-muted-foreground">{archetype.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Agent Behavior</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { 
                        id: "chat", 
                        name: "Chat Interface", 
                        description: "Interactive conversations",
                        icon: <MessageSquare className="h-5 w-5 text-blue-400" />
                      },
                      { 
                        id: "embedded", 
                        name: "Embedded Assistant", 
                        description: "Built into applications",
                        icon: <Layers className="h-5 w-5 text-purple-400" />
                      },
                      { 
                        id: "scheduled", 
                        name: "Scheduled Automation", 
                        description: "Runs on defined schedule",
                        icon: <Clock className="h-5 w-5 text-green-400" />
                      },
                    ].map(behavior => (
                      <div key={behavior.id} className="rounded-md border border-dark-border hover:border-primary-light transition-colors p-3 flex items-start gap-3 cursor-pointer">
                        <div className="mt-0.5">{behavior.icon}</div>
                        <div>
                          <div className="text-sm font-medium">{behavior.name}</div>
                          <div className="text-xs text-muted-foreground">{behavior.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>RAG Knowledge Source</Label>
                  <Select defaultValue="all-sources">
                    <SelectTrigger>
                      <SelectValue placeholder="Select knowledge source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-sources">All Available Sources</SelectItem>
                      <SelectItem value="deals-db">Deals Database</SelectItem>
                      <SelectItem value="legal-docs">Legal Documents</SelectItem>
                      <SelectItem value="market-data">Market Data</SelectItem>
                      <SelectItem value="custom-docs">Custom Documents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Continue to Configuration</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}