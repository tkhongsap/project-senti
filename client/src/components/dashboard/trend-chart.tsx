import { useState } from "react";
import { 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Area,
  AreaChart
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataPoint } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, CalendarDays, Clock, RefreshCcw } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TrendChartProps {
  data: DataPoint[];
  title: string;
  description?: string;
}

export function TrendChart({ data, title, description }: TrendChartProps) {
  const [chartType, setChartType] = useState<"line" | "area">("area");
  const [timeRange, setTimeRange] = useState<"all" | "month" | "week">("all");
  
  // Process data based on time range
  const getFilteredData = () => {
    if (timeRange === "all" || data.length === 0) {
      return data;
    }
    
    const now = new Date();
    const cutoffDate = new Date();
    
    if (timeRange === "month") {
      cutoffDate.setMonth(now.getMonth() - 1);
    } else if (timeRange === "week") {
      cutoffDate.setDate(now.getDate() - 7);
    }
    
    return data.filter(point => new Date(point.timestamp) >= cutoffDate);
  };
  
  const filteredData = getFilteredData();
  
  const chartData = filteredData.map(point => ({
    timestamp: new Date(point.timestamp).toLocaleDateString(),
    value: point.value,
    category: point.category
  }));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${chartType === 'line' ? 'bg-primary/10 text-primary' : ''}`}
              onClick={() => setChartType("line")}
            >
              <TrendingUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${chartType === 'area' ? 'bg-primary/10 text-primary' : ''}`} 
              onClick={() => setChartType("area")}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs 
          defaultValue="all" 
          className="w-full mt-2"
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as "all" | "month" | "week")}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="text-xs">All Time</TabsTrigger>
            <TabsTrigger value="month" className="text-xs">Last Month</TabsTrigger>
            <TabsTrigger value="week" className="text-xs">Last Week</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0 pt-4">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart 
                data={chartData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fontSize: 12 }} 
                  tickLine={{ stroke: 'var(--muted-foreground)' }}
                  axisLine={{ stroke: 'var(--border)' }}
                />
                <YAxis
                  width={40}
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: 'var(--muted-foreground)' }}
                  axisLine={{ stroke: 'var(--border)' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  strokeWidth={2} 
                  stroke="hsl(var(--primary))"
                  dot={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, r: 3, fill: 'var(--background)' }}
                  activeDot={{ r: 5, stroke: 'hsl(var(--primary))', strokeWidth: 1 }}
                />
              </LineChart>
            ) : (
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fontSize: 12 }} 
                  tickLine={{ stroke: 'var(--muted-foreground)' }}
                  axisLine={{ stroke: 'var(--border)' }}
                />
                <YAxis
                  width={40}
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: 'var(--muted-foreground)' }}
                  axisLine={{ stroke: 'var(--border)' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="hsl(var(--primary)/0.2)"
                  dot={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, r: 3, fill: 'var(--background)' }}
                  activeDot={{ r: 5, stroke: 'hsl(var(--primary))', strokeWidth: 1 }}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
