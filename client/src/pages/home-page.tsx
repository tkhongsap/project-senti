import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { DataGrid } from "@/components/dashboard/data-grid";
import { StatsCard } from "@/components/dashboard/stats-card";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { StrategyConversationInterface } from "@/components/strategy/StrategyConversationInterface";
import { AnalysisInterface } from "@/components/strategy/AnalysisInterface";
import { calculateBasicStats, identifyTrends } from "@/lib/analysis";
import { DataPoint } from "@shared/schema";
import { BarChart3, LogOut, TrendingUp, Trophy, Upload } from "lucide-react";
import { useLocation } from "wouter";

export default function HomePage() {
  const { logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  const { data: dataPoints = [] } = useQuery<DataPoint[]>({
    queryKey: ["/api/data-points"],
  });

  const stats = calculateBasicStats(dataPoints);
  const trends = identifyTrends(dataPoints);
  const latestTrend = trends[trends.length - 1]?.trend || "stable";

  // Mock objectives for demo
  const objectives = {
    prospecting: "Increase qualified lead generation by 25% through targeted social media campaigns",
    ownership: "Improve new customer onboarding completion rate to 85%",
    inlife: "Boost customer engagement and product adoption rates by 30%",
    risky: "Reduce customer churn risk by identifying early warning signs",
    churn: "Implement targeted win-back campaigns with 20% success rate"
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">Marketing Campaign Dashboard</h1>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        <StrategyConversationInterface />

        <AnalysisInterface objectives={objectives} />

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