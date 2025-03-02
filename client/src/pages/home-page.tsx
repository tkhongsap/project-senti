import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { DataGrid } from "@/components/dashboard/data-grid";
import { StatsCard } from "@/components/dashboard/stats-card";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { UploadForm } from "@/components/data-ingestion/upload-form";
import { calculateBasicStats, identifyTrends } from "@/lib/analysis";
import { DataPoint } from "@shared/schema";
import { BarChart3, LogOut, TrendingUp, Trophy, Upload } from "lucide-react";

export default function HomePage() {
  const { logoutMutation } = useAuth();

  const { data: dataPoints = [] } = useQuery<DataPoint[]>({
    queryKey: ["/api/data-points"],
  });

  const stats = calculateBasicStats(dataPoints);
  const trends = identifyTrends(dataPoints);
  const latestTrend = trends[trends.length - 1]?.trend || "stable";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold">Marketing Campaign Dashboard</h1>
          <Button variant="ghost" onClick={() => logoutMutation.mutate()}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        <UploadForm />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Value"
            value={stats.total}
            icon={<Trophy />}
          />
          <StatsCard
            title="Average"
            value={stats.mean.toFixed(2)}
            icon={<BarChart3 />}
          />
          <StatsCard
            title="Current Trend"
            value={latestTrend}
            icon={<TrendingUp />}
          />
          <StatsCard
            title="Data Points"
            value={dataPoints.length}
            icon={<Upload />}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <TrendChart 
            data={dataPoints} 
            title="Campaign Performance Over Time" 
          />
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Recent Data Points</h2>
            <DataGrid data={dataPoints.slice(-5)} />
          </div>
        </div>
      </main>
    </div>
  );
}