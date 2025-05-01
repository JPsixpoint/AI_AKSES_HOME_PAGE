import { Orbit } from "lucide-react";
import { Badge } from "../ui/badge";
import { Avatar } from "../ui/avatar";
import { AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { formatCurrency } from "@/lib/utils";
import { Deal } from "@shared/schema";

interface AIMessageProps {
  content: string;
  data?: any;
  onSelect?: (content: string) => void;
}

export function AIMessage({ content, data, onSelect }: AIMessageProps) {
  const renderDealDetails = (deal: Deal) => {
    return (
      <div className="space-y-1 mt-2">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium">{deal.company}</p>
          <Badge
            variant="outline"
            className={`
              px-2 py-0.5 rounded text-xs
              ${deal.status === "Due Diligence" ? "bg-info/20 text-info" : 
                deal.status === "Prescreening" ? "bg-primary-lighter/20 text-primary-lighter" : 
                deal.status === "Indicative Proposal" ? "bg-warning/20 text-warning" : 
                deal.status === "Committed" ? "bg-success/20 text-success" : 
                deal.status === "Closed" ? "bg-success/20 text-success" : 
                "bg-danger/20 text-danger"}
            `}
          >
            {deal.status}
          </Badge>
        </div>
        <div className="space-y-1 text-xs">
          <p><span className="text-muted-foreground">Deal Value:</span> {formatCurrency(deal.value)}</p>
          <p><span className="text-muted-foreground">Region:</span> {deal.region}</p>
          <p><span className="text-muted-foreground">Sector:</span> {deal.sector}</p>
          <p><span className="text-muted-foreground">Lead Investor:</span> {deal.leadInvestor}</p>
          {deal.deadline && <p><span className="text-muted-foreground">Due Diligence Deadline:</span> {new Date(deal.deadline).toLocaleDateString()}</p>}
        </div>
      </div>
    );
  };
  
  const renderFollowUpQuestions = (questions: string[]) => {
    if (!questions || questions.length === 0) return null;
    
    return (
      <div className="mt-3 pt-2 border-t border-dark-surface">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className="text-xs text-primary-lighter py-1 px-2 hover:bg-primary/20 hover:text-white"
            onClick={() => onSelect && onSelect(question)}
          >
            {question}
          </Button>
        ))}
      </div>
    );
  };
  
  return (
    <div className="flex">
      <Avatar className="h-8 w-8 rounded-full bg-primary-light flex-shrink-0 flex items-center justify-center">
        <AvatarFallback>
          <Orbit className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="ml-3 bg-dark-surface p-3 rounded-lg rounded-tl-none max-w-[85%]">
        <p className="text-sm whitespace-pre-line">{content}</p>
        
        {data?.type === "deal_details" && data.deal && renderDealDetails(data.deal)}
        
        {data?.followUpQuestions && renderFollowUpQuestions(data.followUpQuestions)}
      </div>
    </div>
  );
}
