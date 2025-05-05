import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// Define the statistics response type
interface SixpointDealStatisticsResponse {
  totalDeals: number;
  stageStats: Record<string, number>;
  creditHubStats: Record<string, number>;
  countryStats: Record<string, number>;
  priorityStats: Record<string, number>;
  leadStats: Record<string, number>;
}

export function SixpointDealStatistics() {
  const { data: statistics, isLoading } = useQuery<SixpointDealStatisticsResponse>({
    queryKey: ['/api/sixpoint-deals/statistics'],
  });

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  // Define chart data type
  type ChartDataPoint = {
    name: string;
    value: number;
  };

  // Prepare data for the charts
  const stageData: ChartDataPoint[] = statistics?.stageStats 
    ? Object.entries(statistics.stageStats)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
    : [];

  const creditHubData: ChartDataPoint[] = statistics?.creditHubStats
    ? Object.entries(statistics.creditHubStats)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Deals by Stage</CardTitle>
          <CardDescription>
            Distribution of deals across different stages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {stageData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stageData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 60,
                  }}
                >
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80} 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Number of Deals" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No stage data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deals by Credit Hub</CardTitle>
          <CardDescription>
            Distribution of deals across different credit hubs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {creditHubData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={creditHubData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value, percent }) => 
                      `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {creditHubData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No credit hub data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>
            Quick overview of the deal pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
              <span className="text-2xl font-bold">{statistics?.totalDeals || 0}</span>
              <span className="text-sm text-muted-foreground">Total Deals</span>
            </div>
            
            {/* Highest stage count */}
            {stageData.length > 0 && (
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <span className="text-2xl font-bold">{stageData[0].value}</span>
                <span className="text-sm text-muted-foreground">
                  <Badge variant="outline">{stageData[0].name}</Badge>
                </span>
              </div>
            )}
            
            {/* Pre-screening count */}
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
              <span className="text-2xl font-bold">
                {statistics?.stageStats?.["Pre-Screening"] || 0}
              </span>
              <span className="text-sm text-muted-foreground">
                <Badge variant="secondary">Pre-Screening</Badge>
              </span>
            </div>
            
            {/* Due Diligence count */}
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
              <span className="text-2xl font-bold">
                {statistics?.stageStats?.["Due Diligence & U/W"] || 0}
              </span>
              <span className="text-sm text-muted-foreground">
                <Badge variant="default">Due Diligence</Badge>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}