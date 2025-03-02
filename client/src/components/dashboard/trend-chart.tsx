import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataPoint } from "@shared/schema";

interface TrendChartProps {
  data: DataPoint[];
  title: string;
}

export function TrendChart({ data, title }: TrendChartProps) {
  const chartData = data.map(point => ({
    timestamp: new Date(point.timestamp).toLocaleDateString(),
    value: point.value
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                strokeWidth={2} 
                stroke="hsl(var(--primary))"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
