import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { DataGrid } from "@/components/dashboard/data-grid";
import { StatsCard } from "@/components/dashboard/stats-card";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { StrategyConversationInterface } from "@/components/strategy/StrategyConversationInterface";
import { AnalysisInterface } from "@/components/strategy/AnalysisInterface";
import { calculateBasicStats, identifyTrends, aggregateByCategory } from "@/lib/analysis";
import { DataPoint } from "@shared/schema";
import { 
  BarChart3, 
  LogOut, 
  TrendingUp, 
  Trophy, 
  Upload, 
  PieChart, 
  LayoutDashboard, 
  Sparkles, 
  LineChart,
  Filter,
  ArrowUpRight
} from "lucide-react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

// Mock data for an empty database
const MOCK_DATA_POINTS: DataPoint[] = [
  {
    id: 1,
    campaignId: 1,
    value: 85,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    category: "Social"
  },
  {
    id: 2,
    campaignId: 1,
    value: 92,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25),
    category: "Email"
  },
  {
    id: 3,
    campaignId: 1,
    value: 78,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
    category: "Search"
  },
  {
    id: 4,
    campaignId: 1,
    value: 96,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    category: "Social"
  },
  {
    id: 5,
    campaignId: 1,
    value: 102,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    category: "Email"
  },
  {
    id: 6,
    campaignId: 1,
    value: 110,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    category: "Direct"
  },
  {
    id: 7,
    campaignId: 1,
    value: 124,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    category: "Social"
  },
  {
    id: 8,
    campaignId: 1,
    value: 115,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    category: "Referral"
  },
  {
    id: 9,
    campaignId: 1,
    value: 132,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    category: "Email"
  },
  {
    id: 10,
    campaignId: 1,
    value: 145,
    timestamp: new Date(),
    category: "Social"
  }
];

export default function HomePage() {
  const { logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"dashboard" | "strategy" | "analysis">("dashboard");
  const [displayData, setDisplayData] = useState<DataPoint[]>([]);

  // Fetch real data from API
  const { data: dataPoints = [] } = useQuery<DataPoint[]>({
    queryKey: ["/api/data-points"],
  });

  // Use mock data if no real data exists
  useEffect(() => {
    if (dataPoints && dataPoints.length > 0) {
      setDisplayData(dataPoints);
    } else {
      setDisplayData(MOCK_DATA_POINTS);
    }
  }, [dataPoints]);

  // Calculate statistics
  const stats = calculateBasicStats(displayData);
  const trends = identifyTrends(displayData);
  const latestTrend = trends[trends.length - 1]?.trend || "stable";
  const categoryStats = aggregateByCategory(displayData);
  const mostEffectiveCategory = categoryStats.length > 0 
    ? categoryStats.reduce((prev, current) => (prev.value > current.value) ? prev : current).category
    : "N/A";

  // Format numbers for display
  const formatValue = (value: number) => {
    return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();
  };

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
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight hidden sm:block">Marketing Campaign Dashboard</h1>
              <h1 className="text-xl font-bold leading-tight sm:hidden">Campaign Dashboard</h1>
              <p className="text-xs text-muted-foreground hidden md:block">Analytics and Campaign Performance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="mr-2 hidden sm:flex">
              <LineChart className="h-3 w-3 mr-1" />
              Last updated: {new Date().toLocaleDateString()}
            </Badge>
            <Button variant="ghost" onClick={handleLogout} className="sm:ml-2">
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <nav className="container mx-auto my-2 flex border-b">
        <button
          className={`px-4 py-2 text-sm font-medium flex items-center gap-1.5 ${
            activeTab === "dashboard"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("dashboard")}
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium flex items-center gap-1.5 ${
            activeTab === "strategy"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("strategy")}
        >
          <Sparkles className="h-4 w-4" />
          Strategy
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium flex items-center gap-1.5 ${
            activeTab === "analysis"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("analysis")}
        >
          <PieChart className="h-4 w-4" />
          Analysis
        </button>
      </nav>

      <main className="container py-4 flex-1 overflow-auto">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Campaign Overview</h2>
              <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5" />
                Filters
              </Button>
            </div>
            
            {/* Key Metrics Section */}
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
              <StatsCard 
                title="Total Engagement" 
                value={formatValue(stats.total || 1250)} 
                icon={<Trophy className="h-4 w-4" />}
                trend="up"
                trendValue="12.5%"
                description="From previous period"
              />
              <StatsCard 
                title="Average CPC" 
                value={`$${(stats.mean || 1.25).toFixed(2)}`}
                icon={<BarChart3 className="h-4 w-4" />}
                trend={stats.mean > 50 ? "up" : "down"}
                trendValue="4.5%"
                description="Per data point"
              />
              <StatsCard 
                title="Current Trend" 
                value={latestTrend.charAt(0).toUpperCase() + latestTrend.slice(1)}
                icon={<TrendingUp className="h-4 w-4" />}
                trend={latestTrend === "increasing" ? "up" : latestTrend === "decreasing" ? "down" : "neutral"}
                trendValue="Last 30 days"
              />
              <StatsCard 
                title="Data Points" 
                value={formatValue(displayData.length)} 
                icon={<Upload className="h-4 w-4" />}
                description="Total records"
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              {/* Main Chart - Takes 2/3 of width on large screens */}
              <div className="md:col-span-2">
                <TrendChart 
                  data={displayData} 
                  title="Campaign Performance Over Time" 
                  description="Visualize campaign metrics across time periods"
                />
              </div>
              
              {/* Best Performing Channel Card */}
              <div className="flex flex-col gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      Top Performing Channel
                      <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-200">New</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <ArrowUpRight className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{mostEffectiveCategory}</p>
                          <p className="text-xs text-muted-foreground">Best conversion rate</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-medium text-green-600">+18.2%</p>
                        <p className="text-xs text-muted-foreground">vs. average</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Recent Data Points */}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-2 flex items-center">
                    Recent Data Points
                    <Button variant="ghost" size="sm" className="ml-2 h-6 w-6 p-0">
                      <Filter className="h-3.5 w-3.5" />
                    </Button>
                  </h2>
                  <DataGrid data={displayData.slice(-5)} maxHeight="300px" />
                </div>
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