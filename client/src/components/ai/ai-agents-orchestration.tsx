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

        {/* 2. Agent Builder */}
        <TabsContent value="builder" className="flex-1 overflow-hidden">
          <Card className="border border-dark-border bg-dark-card">
            <CardHeader>
              <CardTitle>Agent Configurator</CardTitle>
              <CardDescription>Build and configure AI agents with specialized capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="agent-name">Agent Name</Label>
                  <Input id="agent-name" placeholder="E.g., Deal Analyzer, Doc Processor..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agent-type">Agent Type</Label>
                  <Select defaultValue="tool-calling">
                    <SelectTrigger>
                      <SelectValue placeholder="Select agent type" />
                    </SelectTrigger>
                    <SelectContent>
                      {agentTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          <div className="flex items-center gap-2">
                            {type.icon}
                            <span>{type.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="agent-owner">Owner</Label>
                  <Input id="agent-owner" placeholder="Team or individual responsible" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="system-prompt">Base System Prompt</Label>
                <div className="border border-dark-border rounded-md">
                  <textarea 
                    id="system-prompt" 
                    className="w-full h-32 p-2 bg-dark-lighter text-sm rounded-md resize-none outline-none" 
                    placeholder="You are an AI agent specialized in [domain]. Your primary purpose is to..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Available Tools</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    { id: "tape-cracker", name: "Tape Cracker", icon: <Code className="h-4 w-4" /> },
                    { id: "memo-generator", name: "Memo Generator", icon: <FileJson className="h-4 w-4" /> },
                    { id: "document-search", name: "Document Search", icon: <BookOpen className="h-4 w-4" /> },
                    { id: "slack-notify", name: "Slack Notifications", icon: <Slack className="h-4 w-4" /> },
                    { id: "data-analyzer", name: "Data Analyzer", icon: <BarChart3 className="h-4 w-4" /> },
                    { id: "doc-uploader", name: "Document Uploader", icon: <FileUp className="h-4 w-4" /> },
                  ].map(tool => (
                    <div key={tool.id} className="flex items-center space-x-2">
                      <Switch id={`tool-${tool.id}`} />
                      <Label htmlFor={`tool-${tool.id}`} className="flex items-center gap-1">
                        {tool.icon}
                        <span>{tool.name}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Source of Truth (Knowledge Base)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    { id: "deals-database", name: "Deals Database" },
                    { id: "legal-docs", name: "Legal Documents" },
                    { id: "company-policies", name: "Company Policies" },
                    { id: "market-reports", name: "Market Reports" },
                    { id: "procedural-guides", name: "Procedural Guides" },
                    { id: "historical-deals", name: "Historical Deals" },
                  ].map(source => (
                    <div key={source.id} className="flex items-center space-x-2">
                      <Switch id={`source-${source.id}`} />
                      <Label htmlFor={`source-${source.id}`}>{source.name}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="output-format">Output Format</Label>
                <Select defaultValue="markdown">
                  <SelectTrigger>
                    <SelectValue placeholder="Select output format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="markdown">Markdown</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="table">Table</SelectItem>
                    <SelectItem value="text">Plain Text</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Save as Draft</Button>
              <Button>Save & Activate Agent</Button>
            </CardFooter>
          </Card>
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