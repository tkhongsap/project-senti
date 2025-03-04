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
  const [activeTab, setActiveTab] = useState<"dashboard" | "strategy" | "analysis">("dashboard");

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
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold hidden sm:block">Marketing Campaign Dashboard</h1>
            <h1 className="text-xl font-bold sm:hidden">Campaign Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={handleLogout} className="sm:ml-2">
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto mt-4 mb-2 flex border-b">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "dashboard"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "strategy"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("strategy")}
        >
          Strategy
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "analysis"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("analysis")}
        >
          Analysis
        </button>
      </div>

      <main className="container py-4 flex-1 overflow-auto">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
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

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="order-2 lg:order-1">
                <TrendChart 
                  data={dataPoints} 
                  title="Campaign Performance Over Time" 
                />
              </div>
              <div className="space-y-2 order-1 lg:order-2">
                <h2 className="text-lg font-semibold px-1">Recent Data Points</h2>
                <DataGrid data={dataPoints.slice(-5)} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "strategy" && (
          <div className="space-y-6">
            <StrategyConversationInterface />
          </div>
        )}

        {activeTab === "analysis" && (
          <div className="space-y-6">
            <AnalysisInterface objectives={objectives} />
          </div>
        )}
      </main>
    </div>
  );
}