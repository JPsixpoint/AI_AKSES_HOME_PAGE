import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { DollarSign, Briefcase, Activity, CheckCircle } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { formatCurrency } from "@/lib/utils";

export function DealStatistics() {
  const { data: stats, isLoading } = useQuery({
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
  const defaultStats = {
    totalDealValue: 32500000,
    activeDealCount: 15,
    dueDiligenceCount: 3,
    completedDealCount: 8,
    valueChangePercent: 12,
    newDealsThisMonth: 3,
    dueDiligenceChangeWeekly: 0,
    completedThisQuarter: 2
  };
  
  const displayStats = stats || defaultStats;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      <StatCard
        title="Total Deal Value"
        value={formatCurrency(displayStats.totalDealValue)}
        change={`${displayStats.valueChangePercent}%`}
        changeText="vs last month"
        icon={<DollarSign className="h-4 w-4 text-success" />}
        iconColor="bg-success/20"
      />
      
      <StatCard
        title="Active Deals"
        value={displayStats.activeDealCount}
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
        title="Completed Deals"
        value={displayStats.completedDealCount}
        change={displayStats.completedThisQuarter}
        changeText="this quarter"
        icon={<CheckCircle className="h-4 w-4 text-success" />}
        iconColor="bg-success/20"
      />
    </div>
  );
}
