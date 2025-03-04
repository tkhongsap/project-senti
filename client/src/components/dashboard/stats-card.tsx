import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, ArrowRight } from "lucide-react";

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
  const getTrendColor = () => {
    if (trend === "up") return "text-emerald-500 bg-emerald-50";
    if (trend === "down") return "text-rose-500 bg-rose-50";
    return "text-amber-500 bg-amber-50";
  };

  const getTrendIcon = () => {
    if (trend === "up") return <ArrowUp className="h-3 w-3" />;
    if (trend === "down") return <ArrowDown className="h-3 w-3" />;
    return <ArrowRight className="h-3 w-3" />;
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md border-border/60">
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
        <div className="flex items-center">
          <div className="text-2xl font-bold truncate">{value}</div>
          {trend && trendValue && (
            <div className={`ml-2 text-xs font-medium flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-2 truncate">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
