import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  trendValue 
}: StatsCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="rounded-full bg-primary/10 p-1.5">
            <div className="text-primary">{icon}</div>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex items-baseline">
          <div className="text-2xl font-bold truncate">{value}</div>
          {trend && trendValue && (
            <span className={`ml-2 text-xs font-medium ${
              trend === "up" 
                ? "text-green-500" 
                : trend === "down" 
                  ? "text-red-500" 
                  : "text-muted-foreground"
            }`}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 truncate">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
