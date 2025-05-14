import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Search, BarChart3, GitCompare, Wrench } from "lucide-react";

export function VoiceCommandsGuide() {
  return (
    <div className="h-full overflow-auto p-6 bg-dark">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">Voice Command Guide</h1>
        <p className="text-muted-foreground mb-6">
          Your AI assistant understands natural language. Simply speak or type these commands.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Find Deals Section */}
          <Card className="bg-dark-lighter border-dark overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-blue-900/30 to-primary/20 p-4 border-b border-dark">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600/30 p-2 rounded-full">
                  <Search className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-white">🔍 Find the Deals You Care About</h3>
              </div>
            </div>
            <CardContent className="p-5">
              <ul className="space-y-4">
                <li className="border-b border-dark/50 pb-3">
                  <p className="text-muted-foreground mb-2">Ask for deals in a specific stage</p>
                  <div className="bg-dark-surface p-3 rounded-md border border-dark/70 font-mono text-sm text-primary-foreground">
                    "Show me all deals in Pre-Screening"
                  </div>
                </li>
                <li className="border-b border-dark/50 pb-3">
                  <p className="text-muted-foreground mb-2">Filter by region or country</p>
                  <div className="bg-dark-surface p-3 rounded-md border border-dark/70 font-mono text-sm text-primary-foreground">
                    "Which deals are in LATAM?"
                  </div>
                </li>
                <li>
                  <p className="text-muted-foreground mb-2">Combine filters for smart queries</p>
                  <div className="bg-dark-surface p-3 rounded-md border border-dark/70 font-mono text-sm text-primary-foreground">
                    "Get all deals in Colombia that are in Due Diligence"
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Summarize Pipeline Section */}
          <Card className="bg-dark-lighter border-dark overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-green-900/30 to-green-700/20 p-4 border-b border-dark">
              <div className="flex items-center gap-3">
                <div className="bg-green-700/30 p-2 rounded-full">
                  <BarChart3 className="h-5 w-5 text-green-400" />
                </div>
                <h3 className="text-lg font-medium text-white">📊 Summarize the Pipeline</h3>
              </div>
            </div>
            <CardContent className="p-5">
              <ul className="space-y-4">
                <li className="border-b border-dark/50 pb-3">
                  <p className="text-muted-foreground mb-2">Get a quick snapshot of multiple deals</p>
                  <div className="bg-dark-surface p-3 rounded-md border border-dark/70 font-mono text-sm text-primary-foreground">
                    "Summarize the top 5 deals in Mexico"
                  </div>
                </li>
                <li>
                  <p className="text-muted-foreground mb-2">Pull highlights based on priority</p>
                  <div className="bg-dark-surface p-3 rounded-md border border-dark/70 font-mono text-sm text-primary-foreground">
                    "What are the highest priority deals in APAC?"
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Compare Section */}
          <Card className="bg-dark-lighter border-dark overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-purple-900/30 to-purple-700/20 p-4 border-b border-dark">
              <div className="flex items-center gap-3">
                <div className="bg-purple-700/30 p-2 rounded-full">
                  <GitCompare className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-white">📈 Compare What Matters</h3>
              </div>
            </div>
            <CardContent className="p-5">
              <ul className="space-y-4">
                <li className="border-b border-dark/50 pb-3">
                  <p className="text-muted-foreground mb-2">Compare multiple deals side by side</p>
                  <div className="bg-dark-surface p-3 rounded-md border border-dark/70 font-mono text-sm text-primary-foreground">
                    "Compare Monet, Sary, and Tuily"
                  </div>
                </li>
                <li>
                  <p className="text-muted-foreground mb-2">Highlight key differences</p>
                  <div className="bg-dark-surface p-3 rounded-md border border-dark/70 font-mono text-sm text-primary-foreground">
                    "What's the difference between Platacard and Waya deals?"
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Make Changes Section */}
          <Card className="bg-dark-lighter border-dark overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-orange-900/30 to-orange-700/20 p-4 border-b border-dark">
              <div className="flex items-center gap-3">
                <div className="bg-orange-700/30 p-2 rounded-full">
                  <Wrench className="h-5 w-5 text-orange-400" />
                </div>
                <h3 className="text-lg font-medium text-white">🛠 Make Changes with Your Voice</h3>
              </div>
            </div>
            <CardContent className="p-5">
              <ul className="space-y-4">
                <li className="border-b border-dark/50 pb-3">
                  <p className="text-muted-foreground mb-2">Advance a deal to the next stage</p>
                  <div className="bg-dark-surface p-3 rounded-md border border-dark/70 font-mono text-sm text-primary-foreground">
                    "Move Platacard to IC Review"
                  </div>
                </li>
                <li className="border-b border-dark/50 pb-3">
                  <p className="text-muted-foreground mb-2">Reassign leads</p>
                  <div className="bg-dark-surface p-3 rounded-md border border-dark/70 font-mono text-sm text-primary-foreground">
                    "Assign Tuily to Taimur"
                  </div>
                </li>
                <li>
                  <p className="text-muted-foreground mb-2">Adjust priority or hub</p>
                  <div className="bg-dark-surface p-3 rounded-md border border-dark/70 font-mono text-sm text-primary-foreground">
                    "Set priority of Sary to High and credit hub to LATAM"
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}