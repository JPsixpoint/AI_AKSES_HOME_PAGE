import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Search, BarChart3, GitCompare, Wrench } from "lucide-react";

export function VoiceCommandsGuide() {
  return (
    <div className="h-full overflow-auto">
      <Card className="bg-dark-lighter border-dark">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-primary">AKSES Voice Commands Guide</CardTitle>
          <CardDescription>
            Your AI assistant understands natural language. Here are some examples of what you can ask.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Find Deals Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">🔍 Find the Deals You Care About</h3>
            </div>
            <ul className="space-y-2 ml-7 text-sm">
              <li className="list-disc">
                <span className="text-muted-foreground">Ask for deals in a specific stage</span>
                <div className="mt-1 text-foreground font-mono text-xs bg-dark-surface p-2 rounded-md">
                  "Show me all deals in Pre-Screening"
                </div>
              </li>
              <li className="list-disc">
                <span className="text-muted-foreground">Filter by region or country</span>
                <div className="mt-1 text-foreground font-mono text-xs bg-dark-surface p-2 rounded-md">
                  "Which deals are in LATAM?"
                </div>
              </li>
              <li className="list-disc">
                <span className="text-muted-foreground">Combine filters for smart queries</span>
                <div className="mt-1 text-foreground font-mono text-xs bg-dark-surface p-2 rounded-md">
                  "Get all deals in Colombia that are in Due Diligence"
                </div>
              </li>
            </ul>
          </div>

          <Separator className="border-dark" />

          {/* Summarize Pipeline Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">📊 Summarize the Pipeline Instantly</h3>
            </div>
            <ul className="space-y-2 ml-7 text-sm">
              <li className="list-disc">
                <span className="text-muted-foreground">Get a quick snapshot of multiple deals</span>
                <div className="mt-1 text-foreground font-mono text-xs bg-dark-surface p-2 rounded-md">
                  "Summarize the top 5 deals in Mexico"
                </div>
              </li>
              <li className="list-disc">
                <span className="text-muted-foreground">Pull highlights based on priority</span>
                <div className="mt-1 text-foreground font-mono text-xs bg-dark-surface p-2 rounded-md">
                  "What are the highest priority deals in APAC?"
                </div>
              </li>
            </ul>
          </div>

          <Separator className="border-dark" />

          {/* Compare Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <GitCompare className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">📈 Compare What Matters</h3>
            </div>
            <ul className="space-y-2 ml-7 text-sm">
              <li className="list-disc">
                <span className="text-muted-foreground">Compare multiple deals side by side</span>
                <div className="mt-1 text-foreground font-mono text-xs bg-dark-surface p-2 rounded-md">
                  "Compare Monet, Sary, and Tuily"
                </div>
              </li>
              <li className="list-disc">
                <span className="text-muted-foreground">Highlight key differences in stage, region, or lead</span>
                <div className="mt-1 text-foreground font-mono text-xs bg-dark-surface p-2 rounded-md">
                  "What's the difference between Platacard and Waya deals?"
                </div>
              </li>
            </ul>
          </div>

          <Separator className="border-dark" />

          {/* Make Changes Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">🛠 Make Changes with Your Voice</h3>
            </div>
            <ul className="space-y-2 ml-7 text-sm">
              <li className="list-disc">
                <span className="text-muted-foreground">Advance a deal to the next stage</span>
                <div className="mt-1 text-foreground font-mono text-xs bg-dark-surface p-2 rounded-md">
                  "Move Platacard to IC Review"
                </div>
              </li>
              <li className="list-disc">
                <span className="text-muted-foreground">Reassign leads</span>
                <div className="mt-1 text-foreground font-mono text-xs bg-dark-surface p-2 rounded-md">
                  "Assign Tuily to Taimur"
                </div>
              </li>
              <li className="list-disc">
                <span className="text-muted-foreground">Adjust priority or hub</span>
                <div className="mt-1 text-foreground font-mono text-xs bg-dark-surface p-2 rounded-md">
                  "Set priority of Sary to High and credit hub to LATAM"
                </div>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}