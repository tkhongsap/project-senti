import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';
import { 
  ChevronDown, Users, Target, TrendingUp, 
  Calendar, Search, AlertCircle, Zap, MessageSquare, 
  ArrowRight, ChevronRight, RefreshCw, CheckCircle, Send
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalysisInterfaceProps {
  objectives: Record<string, string>;
}

export function AnalysisInterface({ objectives }: AnalysisInterfaceProps) {
  const [activeLifecycleStage, setActiveLifecycleStage] = useState('overview');
  const [generatingInsights, setGeneratingInsights] = useState(true);
  const [insightsProgress, setInsightsProgress] = useState(0);
  const [insights, setInsights] = useState<any[]>([]);
  const [showConversation, setShowConversation] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // Color schemes for different lifecycle stages
  const stageColors = {
    prospecting: '#3B82F6',
    ownership: '#10B981',
    inlife: '#6366F1',
    risky: '#F59E0B',
    churn: '#EF4444'
  };

  // Mock data for different charts
  const segmentDistributionData = [
    { name: 'High-Value', value: 3218, color: '#3B82F6' },
    { name: 'Regular', value: 7878, color: '#10B981' },
    { name: 'New', value: 2105, color: '#6366F1' },
    { name: 'At-Risk', value: 1893, color: '#F59E0B' },
    { name: 'Churned', value: 748, color: '#EF4444' }
  ];

  const customerJourneyData = [
    { month: 'Jan', prospecting: 1200, ownership: 850, inlife: 4500, risky: 950, churn: 350 },
    { month: 'Feb', prospecting: 1300, ownership: 940, inlife: 4600, risky: 930, churn: 380 },
    { month: 'Mar', prospecting: 1400, ownership: 1020, inlife: 4700, risky: 900, churn: 340 },
    { month: 'Apr', prospecting: 1350, ownership: 1100, inlife: 4800, risky: 850, churn: 320 },
    { month: 'May', prospecting: 1500, ownership: 1150, inlife: 4900, risky: 820, churn: 300 },
    { month: 'Jun', prospecting: 1600, ownership: 1250, inlife: 5000, risky: 800, churn: 280 }
  ];

  const churnRateData = [
    { month: 'Jan', rate: 2.4 },
    { month: 'Feb', rate: 2.2 },
    { month: 'Mar', rate: 2.5 },
    { month: 'Apr', rate: 2.3 },
    { month: 'May', rate: 1.9 },
    { month: 'Jun', rate: 1.7 }
  ];

  // Simulate analysis generation
  useEffect(() => {
    if (generatingInsights) {
      const timer = setInterval(() => {
        setInsightsProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(timer);
            setGeneratingInsights(false);
            generateInsights();
            // Trigger initial analysis agent message
            setTimeout(() => {
              setMessages([
                {
                  sender: 'agent',
                  content: "I've analyzed the customer data based on your campaign objectives. I've identified several key insights across the customer lifecycle. You can explore each lifecycle stage in detail or ask me specific questions about the analysis.",
                  timestamp: new Date()
                }
              ]);
              setShowConversation(true);
            }, 1000);
            return 100;
          }
          return prevProgress + 2;
        });
      }, 150);

      return () => clearInterval(timer);
    }
  }, [generatingInsights]);

  // Auto-scroll for messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateInsights = () => {
    const generatedInsights = [
      {
        id: 1,
        stage: 'prospecting',
        title: 'Social media leads have 23% higher lifetime value',
        description: 'Customers acquired through social media campaigns show significantly higher lifetime value compared to other channels.',
        impact: 'high',
        confidence: 0.85,
        relatedObjective: objectives?.prospecting
      },
      {
        id: 2,
        stage: 'ownership',
        title: "68% of new customers don't complete onboarding",
        description: "A majority of new customers aren't completing the full onboarding sequence, particularly dropping off at the account customization step.",
        impact: 'high',
        confidence: 0.92,
        relatedObjective: objectives?.ownership
      },
      {
        id: 3,
        stage: 'inlife',
        title: 'Cross-selling opportunity in premium segment',
        description: 'Premium segment customers show strong affinity for complementary products after 3 months of initial purchase.',
        impact: 'medium',
        confidence: 0.78,
        relatedObjective: objectives?.inlife
      },
      {
        id: 4,
        stage: 'risky',
        title: 'Usage drop precedes churn by 45 days on average',
        description: 'Customer usage metrics show a clear declining pattern approximately 45 days before churn occurs.',
        impact: 'high',
        confidence: 0.88,
        relatedObjective: objectives?.risky
      }
    ];

    setInsights(generatedInsights);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() === '') return;

    setMessages(prevMessages => [
      ...prevMessages,
      {
        sender: 'user',
        content: userInput,
        timestamp: new Date()
      }
    ]);

    const question = userInput;
    setUserInput('');

    setTimeout(() => {
      const response = generateAnalysisResponse(question);
      setMessages(prevMessages => [
        ...prevMessages,
        {
          sender: 'agent',
          content: response,
          timestamp: new Date()
        }
      ]);
    }, 1000);
  };

  const generateAnalysisResponse = (question: string) => {
    const questionLower = question.toLowerCase();

    if (questionLower.includes('prospecting') || questionLower.includes('leads')) {
      return "Based on my analysis of the prospecting stage, social media has been your most effective lead generation channel with a 3.2% conversion rate. However, referrals show the highest quality with a 5.7% conversion rate. This aligns with your objective to \"" + objectives?.prospecting + "\".";
    }

    if (questionLower.includes('churn') || questionLower.includes('retention')) {
      return "Looking at your churn data, I've found that churn rates have been declining over the past 6 months, from 2.4% to 1.7%. This positive trend suggests your retention efforts are working. The analysis shows that 27% of churned customers return within 90 days when targeted appropriately.";
    }

    return "Based on my analysis of your customer data across the lifecycle, I've found several insights relevant to your objectives. The data shows strong performance in the inlife stage, with opportunities for improvement in the ownership and risky stages. Would you like me to explore a specific lifecycle stage or metric in more detail?";
  };

  const renderTopStats = () => (
    <div className="grid grid-cols-5 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Total Customers</h3>
            <Users className="text-primary h-4 w-4" />
          </div>
          <p className="text-2xl font-bold">15,842</p>
          <p className="text-xs text-green-500">↑ 8.2% from last period</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Avg. Lifetime Value</h3>
            <Target className="text-primary h-4 w-4" />
          </div>
          <p className="text-2xl font-bold">$840</p>
          <p className="text-xs text-green-500">↑ 12.4% from last period</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Churn Rate</h3>
            <TrendingUp className="text-primary h-4 w-4" />
          </div>
          <p className="text-2xl font-bold">1.7%</p>
          <p className="text-xs text-green-500">↓ 0.7% from last period</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Active Campaigns</h3>
            <Calendar className="text-primary h-4 w-4" />
          </div>
          <p className="text-2xl font-bold">12</p>
          <p className="text-xs text-muted-foreground">Across all stages</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Key Insights</h3>
            <Zap className="text-primary h-4 w-4" />
          </div>
          <p className="text-2xl font-bold">{insights.length}</p>
          <p className="text-xs text-muted-foreground">Across all stages</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderCustomerJourney = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Customer Lifecycle Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={customerJourneyData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.entries(stageColors).map(([stage, color]) => (
                <Area
                  key={stage}
                  type="monotone"
                  dataKey={stage}
                  stackId="1"
                  stroke={color}
                  fill={color}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const renderSegmentDistribution = () => (
    <div className="grid grid-cols-3 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Segments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segmentDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {segmentDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Churn Rate Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={churnRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Churn Rate']} />
                <Legend />
                <Line type="monotone" dataKey="rate" stroke="#EF4444" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderInsights = () => {
    const filteredInsights = activeLifecycleStage === 'overview' 
      ? insights 
      : insights.filter(insight => insight.stage === activeLifecycleStage);

    return (
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>
            {activeLifecycleStage === 'overview' ? 'Key Insights Across Lifecycle' : `${activeLifecycleStage.charAt(0).toUpperCase() + activeLifecycleStage.slice(1)} Stage Insights`}
          </CardTitle>
          <Button variant="outline" size="sm" className="text-xs">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh Insights
          </Button>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {filteredInsights.map(insight => (
              <div key={insight.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-start">
                  <Zap className={`h-5 w-5 mr-3 mt-1 ${
                    insight.impact === 'high' 
                      ? 'text-red-500' 
                      : insight.impact === 'medium' 
                        ? 'text-amber-500' 
                        : 'text-blue-500'
                  }`} />
                  <div className="flex-1">
                    <h3 className="font-medium">{insight.title}</h3>
                    <p className="text-muted-foreground mt-1">{insight.description}</p>
                    {insight.relatedObjective && (
                      <div className="mt-2 text-sm text-primary">
                        <span className="font-medium">Related objective:</span> "{insight.relatedObjective}"
                      </div>
                    )}
                    <div className="mt-2 flex items-center text-sm text-muted-foreground">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        insight.impact === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : insight.impact === 'medium' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-blue-100 text-blue-800'
                      }`}>
                        {insight.impact.toUpperCase()} IMPACT
                      </span>
                      <span className="ml-3">
                        {Math.round(insight.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Campaign Analysis</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8 p-0"
        >
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <Tabs defaultValue="performance">
            <TabsList className="mb-4">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="objectives">Objectives</TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance" className="space-y-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={customerJourneyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {Object.entries(stageColors).map(([stage, color]) => (
                      <Bar key={stage} dataKey={stage} fill={color} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="trends" className="space-y-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={churnRateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="objectives" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(objectives).map(([stage, objective]) => (
                  <Card key={stage} className="overflow-hidden">
                    <CardHeader className="bg-primary/5 py-2">
                      <CardTitle className="text-sm font-medium capitalize">{stage}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 text-sm">
                      {objective}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
}