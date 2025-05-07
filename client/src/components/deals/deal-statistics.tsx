import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { DollarSign, Briefcase, Activity, CheckCircle } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { formatCurrency } from "@/lib/utils";

// Define the shape of the statistics response
interface DealStatisticsResponse {
  totalDeals: number;
  stageStats: Record<string, number>;
  creditHubStats: Record<string, number>;
  dueDiligenceCount: number;
  prescreeningCount: number;
  leadCount: number;
  closedCount: number;
  valueChangePercent: number;
  newDealsThisMonth: number;
  dueDiligenceChangeWeekly: number;
  completedThisQuarter: number;
}

export function DealStatistics() {
  const { data: stats, isLoading } = useQuery<DealStatisticsResponse>({
    queryKey: ['/api/deals/statistics'],
  });
  
  const StatCard = ({ 
    title, 
    value, 
    change, 
    changeText, 
    icon, 
    iconColor 
  }: { 
    title: string;
    value: string | number;
    change: string | number;
    changeText: string;
    icon: React.ReactNode;
    iconColor: string;
  }) => (
    <motion.div 
      className="bg-dark-lighter p-4 rounded-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-xl font-medium">{value}</p>
        </div>
        <div className={`w-8 h-8 rounded-full ${iconColor} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="mt-2 flex items-center text-xs">
        <span className={`${parseFloat(change.toString()) > 0 ? 'text-success' : parseFloat(change.toString()) < 0 ? 'text-danger' : 'text-warning'} mr-1`}>
          {parseFloat(change.toString()) > 0 ? '+' : ''}{change}
        </span>
        <span className="text-muted-foreground">{changeText}</span>
      </div>
    </motion.div>
  );
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-4 mt-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-dark-lighter p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="mt-4">
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // Default values if stats are missing
  const defaultStats: DealStatisticsResponse = {
    totalDeals: 0,
    stageStats: {},
    creditHubStats: {},
    leadCount: 0,
    dueDiligenceCount: 0,
    closedCount: 0,
    prescreeningCount: 0,
    valueChangePercent: 0,
    newDealsThisMonth: 0,
    dueDiligenceChangeWeekly: 0,
    completedThisQuarter: 0
  };
  
  const displayStats = stats || defaultStats;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      <StatCard
        title="Total Deals"
        value={displayStats.totalDeals}
        change={`${displayStats.valueChangePercent}%`}
        changeText="vs last month"
        icon={<DollarSign className="h-4 w-4 text-success" />}
        iconColor="bg-success/20"
      />
      
      <StatCard
        title="Leads"
        value={displayStats.leadCount}
        change={displayStats.newDealsThisMonth}
        changeText="new this month"
        icon={<Briefcase className="h-4 w-4 text-primary-light" />}
        iconColor="bg-primary/20"
      />
      
      <StatCard
        title="Due Diligence"
        value={displayStats.dueDiligenceCount}
        change={displayStats.dueDiligenceChangeWeekly}
        changeText="change since last week"
        icon={<Activity className="h-4 w-4 text-info" />}
        iconColor="bg-info/20"
      />
      
      <StatCard
        title="Pre-Screening"
        value={displayStats.prescreeningCount}
        change={displayStats.completedThisQuarter}
        changeText="this quarter"
        icon={<CheckCircle className="h-4 w-4 text-success" />}
        iconColor="bg-success/20"
      />
    </div>
  );
}
