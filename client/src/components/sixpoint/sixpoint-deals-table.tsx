import { useQuery } from "@tanstack/react-query";
import { SixpointDeal } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

interface SixpointDealsTableProps {
  selectedDealId?: string | null;
  onRowClick?: (dealId: string) => void;
}

export function SixpointDealsTable({ selectedDealId, onRowClick }: SixpointDealsTableProps) {
  const { data: deals, isLoading } = useQuery<SixpointDeal[]>({
    queryKey: ['/api/sixpoint-deals'],
  });

  // Function to get badge color based on stage
  const getStageBadgeVariant = (stage: string | null): "default" | "outline" | "secondary" | "destructive" | "success" => {
    if (!stage) return "outline";
    
    switch (stage.toLowerCase()) {
      case "lead":
        return "default";
      case "pre-screening":
        return "secondary";
      case "due diligence & u/w":
        return "success";
      case "term sheet negotiation":
        return "success";
      case "closed - won":
        return "success";
      case "closed - lost":
        return "destructive";
      case "pass":
        return "destructive";
      case "re-engage":
        return "outline";
      default:
        return "outline";
    }
  };

  // Function to get region badge color
  const getRegionBadgeVariant = (region: string | null): "default" | "outline" | "secondary" | "destructive" | "success" => {
    if (!region) return "outline";
    
    switch (region.toUpperCase()) {
      case "LATAM":
        return "default";
      case "EMENA":
        return "secondary";
      case "SSA":
        return "success";
      case "APAC":
        return "outline";
      default:
        return "outline";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Credit Hub</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Lead</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals && deals.length > 0 ? (
            deals.map((deal) => (
              <TableRow 
                key={deal.id} 
                className={selectedDealId === deal.id ? "bg-muted/50" : ""}
                onClick={() => onRowClick?.(deal.id)}
              >
                <TableCell className="font-medium">{deal.name || "Unnamed Deal"}</TableCell>
                <TableCell>{deal.country || "Unknown"}</TableCell>
                <TableCell>
                  {deal.creditHub ? (
                    <Badge variant={getRegionBadgeVariant(deal.creditHub)}>
                      {deal.creditHub}
                    </Badge>
                  ) : (
                    "Unknown"
                  )}
                </TableCell>
                <TableCell>
                  {deal.stage ? (
                    <Badge variant={getStageBadgeVariant(deal.stage)}>
                      {deal.stage}
                    </Badge>
                  ) : (
                    "Unknown"
                  )}
                </TableCell>
                <TableCell>{deal.lead || "Unassigned"}</TableCell>
                <TableCell>{deal.createdAt ? formatDate(deal.createdAt) : "Unknown"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No deals found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}