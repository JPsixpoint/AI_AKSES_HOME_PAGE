import React, { useState } from "react";
import {
  Users,
  Building2,
  Calendar,
  Search,
  Plus,
  Filter,
  List,
  Grid,
  FileText,
  BarChart3,
  Mail,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AICRM() {
  const [activeTab, setActiveTab] = useState("contacts");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">CRM - Relationship Intelligence</h1>
          <p className="text-muted-foreground">Your intelligence layer for people, companies, and interactions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => document.getElementById('import-dropdown')?.classList.toggle('hidden')}
            >
              <Mail className="mr-2 h-4 w-4" />
              Import Data
            </Button>
            <div 
              id="import-dropdown" 
              className="absolute z-10 mt-1 hidden w-48 rounded-md bg-popover shadow-lg border border-border"
            >
              <div className="py-1">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start px-4 py-2 text-sm hover:bg-muted"
                  onClick={() => console.log('Import from DealCloud')}
                >
                  From DealCloud
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start px-4 py-2 text-sm hover:bg-muted"
                  onClick={() => console.log('Import from Hubspot')}
                >
                  From Hubspot
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start px-4 py-2 text-sm hover:bg-muted"
                  onClick={() => console.log('Import from CSV')}
                >
                  From CSV
                </Button>
              </div>
            </div>
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 w-full max-w-md">
          <Input 
            placeholder="Search contacts, companies or interactions..." 
            className="w-full"
          />
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={viewMode === "list" ? "default" : "outline"} 
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === "grid" ? "default" : "outline"} 
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="contacts" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 p-0 bg-transparent border-b">
          <TabsTrigger value="contacts" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-2">
            <Users className="mr-2 h-4 w-4" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="companies" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-2">
            <Building2 className="mr-2 h-4 w-4" />
            Companies
          </TabsTrigger>
          <TabsTrigger value="interactions" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-2">
            <Calendar className="mr-2 h-4 w-4" />
            Interactions
          </TabsTrigger>
          <TabsTrigger value="intelligence" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-2">
            <BarChart3 className="mr-2 h-4 w-4" />
            Origination Intelligence
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="mt-0">
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
            {/* Sample contact cards */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className={viewMode === "list" ? "flex" : ""}>
                <CardContent className={`${viewMode === "list" ? "flex items-center py-4" : "p-6"}`}>
                  <div className={`${viewMode === "list" ? "flex-1 flex items-center" : ""}`}>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold mb-3">
                      JD
                    </div>
                    {viewMode === "list" ? (
                      <div className="ml-4">
                        <h3 className="font-medium">John Doe {i}</h3>
                        <p className="text-sm text-muted-foreground">CEO, Fintech Corp</p>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-medium mt-2">John Doe {i}</h3>
                        <p className="text-sm text-muted-foreground">CEO, Fintech Corp</p>
                      </>
                    )}
                  </div>

                  {viewMode === "list" ? (
                    <div className="flex items-center gap-6">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2">Founder</Badge>
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Warm</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-wrap gap-2 mt-3 mb-4">
                        <Badge variant="outline">Founder</Badge>
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Warm</Badge>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs text-muted-foreground">Last contact: 3 days ago</span>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="companies" className="mt-0">
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
            {/* Sample company cards */}
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className={viewMode === "list" ? "flex" : ""}>
                <CardContent className={`${viewMode === "list" ? "flex items-center py-4" : "p-6"}`}>
                  <div className={`${viewMode === "list" ? "flex-1 flex items-center" : ""}`}>
                    <div className="w-12 h-12 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold mb-3">
                      FC
                    </div>
                    {viewMode === "list" ? (
                      <div className="ml-4">
                        <h3 className="font-medium">Fintech Corp {i}</h3>
                        <p className="text-sm text-muted-foreground">Lending Platform • APAC</p>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-medium mt-2">Fintech Corp {i}</h3>
                        <p className="text-sm text-muted-foreground">Lending Platform • APAC</p>
                      </>
                    )}
                  </div>

                  {viewMode === "list" ? (
                    <div className="flex items-center gap-6">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2">Fintech</Badge>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Live Portfolio</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">8 contacts</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-wrap gap-2 mt-3 mb-4">
                        <Badge variant="outline">Fintech</Badge>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Live Portfolio</Badge>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs text-muted-foreground">8 contacts</span>
                        <span className="text-xs text-muted-foreground">Last update: 1 week ago</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="interactions" className="mt-0">
          <div className="space-y-4">
            {/* Sample interaction cards */}
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-muted-foreground shrink-0">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium">Meeting with John Doe and Team</h3>
                        <Badge variant="outline">Meeting</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">3 days ago • 45 minutes</p>
                      <p className="text-sm mb-3">Discussed financing options for expansion into Southeast Asia markets. CFO mentioned rising default rates in consumer segment.</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">John Doe</Badge>
                        <Badge variant="secondary" className="text-xs">Sarah Johnson</Badge>
                        <Badge variant="secondary" className="text-xs">Fintech Corp</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-3 w-3" />
                          View Notes
                        </Button>
                        <Button variant="outline" size="sm">
                          <Calendar className="mr-2 h-3 w-3" />
                          Schedule Follow-up
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="intelligence" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Top Origination Sources</CardTitle>
                <CardDescription>Last 90 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Sara Johnson", count: 5, role: "Investment Director" },
                    { name: "Mark Williams", count: 3, role: "Partner" },
                    { name: "Li Wei", count: 2, role: "APAC Lead" },
                  ].map((source, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b">
                      <div>
                        <p className="font-medium">{source.name}</p>
                        <p className="text-sm text-muted-foreground">{source.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{source.count}</p>
                        <p className="text-xs text-muted-foreground">deals sourced</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Inactive Relationships</CardTitle>
                <CardDescription>No interaction in 60+ days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "John Doe", days: 82, company: "Fintech Corp" },
                    { name: "Alice Chen", days: 75, company: "Global Credit" },
                    { name: "Robert Garcia", days: 65, company: "Quantum Finance" },
                  ].map((contact, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b">
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{contact.days}</p>
                        <p className="text-xs text-muted-foreground">days inactive</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}