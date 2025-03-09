import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  ChevronRight,
  Download,
  MessageSquare,
  Save,
  Send,
  Target,
  Users,
  Wallet,
  BarChart,
  ArrowRight,
  Sparkles,
  Database,
  LineChart,
  PenTool,
  Rocket,
  BarChart4,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define types
type LifecycleStage = 'prospecting' | 'ownership' | 'inlife' | 'risky' | 'churn';

type WizardStep = 'strategy' | 'ingestion' | 'analysis' | 'creative' | 'execution' | 'monitor';

type ObjectivesByStage = {
  prospecting: string;
  ownership: string;
  inlife: string;
  risky: string;
  churn: string;
};

type IngestData = {
  dataSources: string[];
  dataQuality: number;
  customerSegments: string[];
  customMapping: string;
};

type StrategyRecommendation = {
  stage: LifecycleStage;
  title: string;
  description: string;
  channels: string[];
  expectedOutcome: string;
  priority: 'high' | 'medium' | 'low';
};

export function StrategyWizardSimple() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<WizardStep>('strategy');
  const [progress, setProgress] = useState(16);
  const [messageInput, setMessageInput] = useState('');
  const [currentLifecycleStage, setCurrentLifecycleStage] = useState<LifecycleStage>('prospecting');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationMode, setConversationMode] = useState(false);
  const [messages, setMessages] = useState<Array<{text: string, sender: 'user' | 'assistant'}>>([]);
  const [recommendations, setRecommendations] = useState<StrategyRecommendation[]>([]);
  const [generatingRecommendations, setGeneratingRecommendations] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  // Strategy stage objectives
  const [objectives, setObjectives] = useState<ObjectivesByStage>({
    prospecting: '',
    ownership: '',
    inlife: '',
    risky: '',
    churn: '',
  });
  
  // Data ingestion details
  const [ingestData, setIngestData] = useState<IngestData>({
    dataSources: [],
    dataQuality: 0,
    customerSegments: [],
    customMapping: ''
  });
  
  // Data source input
  const [dataSourceInput, setDataSourceInput] = useState('');
  const [segmentInput, setSegmentInput] = useState('');
  
  // Analysis results
  const [analysisFinished, setAnalysisFinished] = useState(false);
  
  // Campaign details
  const [campaignName, setCampaignName] = useState('');
  const [campaignBudget, setCampaignBudget] = useState('');
  const [campaignTimeline, setCampaignTimeline] = useState('');

  // Define lifecycle stages
  const lifecycleStages: Record<LifecycleStage, string> = {
    prospecting: 'Prospecting & Acquisition',
    ownership: 'Initial Ownership',
    inlife: 'Ongoing Relationship',
    risky: 'At-Risk Customers',
    churn: 'Churn Recovery'
  };

  // Stage descriptions
  const stageDescriptions: Record<LifecycleStage, string> = {
    prospecting: 'Attracting and acquiring new customers who are not yet familiar with your brand',
    ownership: 'Making a positive first impression and onboarding new customers effectively',
    inlife: 'Nurturing relationships with existing customers to maximize lifetime value',
    risky: 'Identifying and re-engaging customers showing signs of decreased interest',
    churn: 'Winning back customers who have stopped engaging with your brand'
  };
  
  // Step descriptions
  const stepDescriptions: Record<WizardStep, {title: string, description: string, icon: React.ReactNode}> = {
    strategy: {
      title: 'Strategy Definition',
      description: 'Define your objectives for each customer lifecycle stage',
      icon: <Target className="h-5 w-5" />
    },
    ingestion: {
      title: 'Data Ingestion',
      description: 'Connect to data sources and validate data quality',
      icon: <Database className="h-5 w-5" />
    },
    analysis: {
      title: 'Analysis',
      description: 'Generate insights from your customer data',
      icon: <LineChart className="h-5 w-5" />
    },
    creative: {
      title: 'Creative Generation',
      description: 'Generate content for each segment and channel',
      icon: <PenTool className="h-5 w-5" />
    },
    execution: {
      title: 'Campaign Execution',
      description: 'Deploy your campaign across channels',
      icon: <Rocket className="h-5 w-5" />
    },
    monitor: {
      title: 'Campaign Monitoring',
      description: 'Track performance metrics and optimize',
      icon: <BarChart4 className="h-5 w-5" />
    }
  };

  // Update progress based on current step
  useEffect(() => {
    switch (currentStep) {
      case 'strategy':
        setProgress(16);
        break;
      case 'ingestion':
        setProgress(32);
        break;
      case 'analysis':
        setProgress(50);
        break;
      case 'creative':
        setProgress(66);
        break;
      case 'execution':
        setProgress(83);
        break;
      case 'monitor':
        setProgress(100);
        break;
    }
  }, [currentStep]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate insights when analysis tab is opened
  useEffect(() => {
    if (currentStep === 'analysis' && !analysisFinished) {
      const timer = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => {
              setAnalysisFinished(true);
            }, 500);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      
      return () => clearInterval(timer);
    }
  }, [currentStep, analysisFinished]);

  // Generate recommendations when we move to the creative tab
  useEffect(() => {
    if (currentStep === 'creative' && recommendations.length === 0) {
      setGeneratingRecommendations(true);
      
      const timer = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => {
              setGeneratingRecommendations(false);
              generateMockRecommendations();
            }, 500);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      
      return () => clearInterval(timer);
    }
  }, [currentStep]);

  // Generate mock recommendations
  const generateMockRecommendations = () => {
    const mockRecommendations: StrategyRecommendation[] = [
      {
        stage: 'prospecting',
        title: 'Social Media Lead Generation Campaign',
        description: `A targeted campaign focusing on new potential customers using interest-based targeting for ${campaignName || 'your campaign'}.`,
        channels: ['Social Media', 'Display Advertising'],
        expectedOutcome: 'Increase qualified leads by 15-20% in the targeted segment.',
        priority: 'high'
      },
      {
        stage: 'prospecting',
        title: 'Content Marketing Initiative',
        description: 'Develop educational content addressing the pain points of the target audience.',
        channels: ['Blog', 'Email', 'Social Media'],
        expectedOutcome: 'Build brand awareness and establish thought leadership.',
        priority: 'medium'
      },
      {
        stage: 'ownership',
        title: 'Customer Onboarding Program',
        description: 'Structured communication series to guide new customers through product features.',
        channels: ['Email', 'In-App Messaging'],
        expectedOutcome: 'Reduce time-to-value and improve initial satisfaction scores.',
        priority: 'high'
      },
      {
        stage: 'inlife',
        title: 'Customer Loyalty Program',
        description: 'Reward system for continued engagement and product usage.',
        channels: ['Email', 'App Notifications', 'Direct Mail'],
        expectedOutcome: 'Increase repeat purchase rate and customer lifetime value.',
        priority: 'medium'
      },
      {
        stage: 'risky',
        title: 'Re-engagement Campaign',
        description: 'Targeted offers for customers showing decreased activity.',
        channels: ['Email', 'SMS', 'Retargeting Ads'],
        expectedOutcome: 'Recover 25% of at-risk customers within 30 days.',
        priority: 'high'
      },
      {
        stage: 'churn',
        title: 'Win-back Campaign',
        description: 'Special incentives for recently churned customers.',
        channels: ['Email', 'Direct Mail', 'Retargeting'],
        expectedOutcome: 'Recover 10-15% of churned customers within 60 days.',
        priority: 'medium'
      }
    ];

    setRecommendations(mockRecommendations);
  };

  // Add data source
  const addDataSource = () => {
    if (dataSourceInput.trim() && !ingestData.dataSources.includes(dataSourceInput.trim())) {
      setIngestData({
        ...ingestData,
        dataSources: [...ingestData.dataSources, dataSourceInput.trim()]
      });
      setDataSourceInput('');
    }
  };

  // Remove data source
  const removeDataSource = (source: string) => {
    setIngestData({
      ...ingestData,
      dataSources: ingestData.dataSources.filter(s => s !== source)
    });
  };

  // Add customer segment
  const addSegment = () => {
    if (segmentInput.trim() && !ingestData.customerSegments.includes(segmentInput.trim())) {
      setIngestData({
        ...ingestData,
        customerSegments: [...ingestData.customerSegments, segmentInput.trim()]
      });
      setSegmentInput('');
    }
  };

  // Remove customer segment
  const removeSegment = (segment: string) => {
    setIngestData({
      ...ingestData,
      customerSegments: ingestData.customerSegments.filter(s => s !== segment)
    });
  };
  
  // Check if at least one objective is filled
  const hasAtLeastOneObjective = () => {
    return Object.values(objectives).some(obj => obj.trim() !== '');
  };

  // Handle objective form submission
  const handleStrategySubmit = () => {
    // Validate objectives - only need one lifecycle stage objective
    if (!hasAtLeastOneObjective()) {
      toast({
        title: "Missing Objectives",
        description: "Please define at least one objective for any customer lifecycle stage",
        variant: "destructive"
      });
      return;
    }
    
    // Move to next step
    setCurrentStep('ingestion');
    
    if (conversationMode) {
      setMessages(prev => [
        ...prev,
        { 
          text: "I've defined the key objectives for my campaign. Let's move to data ingestion.", 
          sender: 'user' 
        },
        { 
          text: "Great! Now let's set up your data sources for the campaign. What data do you have available?", 
          sender: 'assistant' 
        }
      ]);
    }
  };

  // Handle ingestion form submission
  const handleIngestionSubmit = () => {
    // Move to next step - no validation required, user can proceed with default data
    setCurrentStep('analysis');
    
    if (conversationMode) {
      const messageText = ingestData.dataSources.length > 0 
        ? `I've added ${ingestData.dataSources.length} data sources for this campaign.`
        : "I'd like to proceed with the default data sources.";
        
      setMessages(prev => [
        ...prev,
        { 
          text: messageText, 
          sender: 'user' 
        },
        { 
          text: "Perfect! I'll analyze your data to generate insights for your campaign strategy.", 
          sender: 'assistant' 
        }
      ]);
    }
  };

  // Handle analysis form submission
  const handleAnalysisSubmit = () => {
    // If analysis is not finished, show a warning but allow proceeding
    if (!analysisFinished) {
      toast({
        title: "Analysis Not Complete",
        description: "The analysis is still in progress, but you can continue if you wish"
      });
      
      // Force analysis to complete so recommendations can be generated
      setAnalysisFinished(true);
      setGenerationProgress(100);
    }
    
    // Move to next step
    setCurrentStep('creative');
    
    if (conversationMode) {
      setMessages(prev => [
        ...prev,
        { 
          text: "The analysis looks good. Let's generate creative content next.", 
          sender: 'user' 
        },
        { 
          text: "I'll generate content recommendations for each customer lifecycle stage based on your objectives and data analysis.", 
          sender: 'assistant' 
        }
      ]);
    }
  };
  
  // Handle creative form submission
  const handleCreativeSubmit = () => {
    // If recommendations aren't generated yet, force them to be generated
    if (recommendations.length === 0) {
      toast({
        title: "Content Generation",
        description: "Generating recommendations now. You can proceed immediately."
      });
      
      // Force generation to complete
      setGeneratingRecommendations(false);
      generateMockRecommendations();
    }
    
    // Move to next step
    setCurrentStep('execution');
    
    if (conversationMode) {
      setMessages(prev => [
        ...prev,
        { 
          text: "These creative recommendations look great. Let's move to campaign execution.", 
          sender: 'user' 
        },
        { 
          text: "Now we'll set up the deployment schedule and channels for your campaign.", 
          sender: 'assistant' 
        }
      ]);
    }
  };
  
  // Handle execution form submission
  const handleExecutionSubmit = () => {
    // Move to next step - no validation required, user can proceed with or without a campaign name
    setCurrentStep('monitor');
    
    if (conversationMode) {
      const messageText = campaignName 
        ? `I've named the campaign "${campaignName}" and set up the execution parameters.`
        : "I've set up the execution parameters for this campaign.";
        
      setMessages(prev => [
        ...prev,
        { 
          text: messageText, 
          sender: 'user' 
        },
        { 
          text: "Perfect! Your campaign is now ready for monitoring. You'll be able to track performance metrics and optimize in real-time.", 
          sender: 'assistant' 
        }
      ]);
    }
  };
  
  // Export strategy as PDF or JSON
  const handleExport = (format: 'pdf' | 'json') => {
    toast({
      title: "Strategy Exported",
      description: `Your strategy has been exported as ${format.toUpperCase()}`,
    });
  };

  // Save strategy to database
  const handleSave = () => {
    toast({
      title: "Strategy Saved",
      description: "Your strategy has been saved successfully",
    });
  };

  // Handle chat message submission
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    setMessages(prev => [...prev, { text: messageInput, sender: 'user' }]);
    setMessageInput('');

    // Simulate AI response
    setTimeout(() => {
      let response = "I'm analyzing your input...";

      if (messageInput.toLowerCase().includes("budget")) {
        response = "Based on your campaign objectives and channels, I recommend allocating 40% of your budget to prospecting activities, 25% to customer retention, 20% to at-risk customers, and 15% to win-back campaigns.";
      } else if (messageInput.toLowerCase().includes("timeline")) {
        response = "For optimal results, I suggest running the prospecting campaign for 8 weeks, followed by a 4-week evaluation period. The loyalty and retention campaigns should run continuously with quarterly assessments.";
      } else if (messageInput.toLowerCase().includes("segment") || messageInput.toLowerCase().includes("audience")) {
        response = "Looking at your audience parameters, I recommend further segmenting your primary audience based on past purchase behavior. This could improve campaign relevance by up to 35%.";
      } else {
        response = "I've noted your input. Is there any specific aspect of the strategy you'd like me to elaborate on or modify?";
      }

      setMessages(prev => [...prev, { text: response, sender: 'assistant' }]);
    }, 1000);
  };

  // Toggle conversation mode
  const handleToggleConversationMode = () => {
    setConversationMode(!conversationMode);
    
    if (!conversationMode && messages.length === 0) {
      setMessages([
        { 
          text: "Hi! I'm your Marketing Strategy Assistant. I'll help you develop an effective campaign strategy across all customer lifecycle stages. Let's start by defining objectives for each stage.", 
          sender: 'assistant' 
        }
      ]);
    }
  };

  // Render form-based UI for the Strategy Tab
  const renderStrategyForm = () => {
    return (
      <div className="space-y-6">
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium">Define Campaign Objectives</h3>
            <p className="text-sm text-muted-foreground">
              Set specific goals for each customer lifecycle stage
            </p>
          </div>
          
          <div className="grid gap-4">
            <div>
              <Label htmlFor="campaignName" className="mb-1">Campaign Name</Label>
              <Input
                id="campaignName"
                placeholder="Summer 2025 Promotion"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="campaignBudget" className="mb-1">Campaign Budget (Optional)</Label>
                <Input
                  id="campaignBudget"
                  placeholder="$10,000"
                  value={campaignBudget}
                  onChange={(e) => setCampaignBudget(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="campaignTimeline" className="mb-1">Timeline (Optional)</Label>
                <Input
                  id="campaignTimeline"
                  placeholder="Q3 2025 (Jul-Sep)"
                  value={campaignTimeline}
                  onChange={(e) => setCampaignTimeline(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        
        <Tabs value={currentLifecycleStage} onValueChange={(v) => setCurrentLifecycleStage(v as LifecycleStage)}>
          <TabsList className="grid grid-cols-5 w-full">
            {Object.entries(lifecycleStages).map(([stage, label]) => (
              <TabsTrigger key={stage} value={stage} className="text-xs sm:text-sm">
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.split(' ')[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {Object.entries(lifecycleStages).map(([stage, label]) => (
            <TabsContent key={stage} value={stage} className="space-y-4 mt-4">
              <div>
                <h4 className="text-sm font-medium mb-1">{label}</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  {stageDescriptions[stage as LifecycleStage]}
                </p>
                
                <Textarea
                  placeholder={`Enter objectives for ${label}...`}
                  value={objectives[stage as LifecycleStage]}
                  onChange={(e) => setObjectives({...objectives, [stage]: e.target.value})}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="text-xs text-muted-foreground mt-2">
                <p className="font-medium">Examples:</p>
                {stage === 'prospecting' && (
                  <p>Increase qualified lead generation by 25% through targeted social media campaigns</p>
                )}
                {stage === 'ownership' && (
                  <p>Improve new customer onboarding completion rate to 85%</p>
                )}
                {stage === 'inlife' && (
                  <p>Boost customer engagement and product adoption rates by 30%</p>
                )}
                {stage === 'risky' && (
                  <p>Reduce customer churn risk by identifying early warning signs</p>
                )}
                {stage === 'churn' && (
                  <p>Implement targeted win-back campaigns with 20% success rate</p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="flex justify-between pt-4">
          <div>
            <Badge variant="outline" className="bg-primary/5">
              Strategy Agent
            </Badge>
          </div>
          <Button onClick={handleStrategySubmit}>
            Continue to Data Ingestion <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };
  
  // Render form-based UI for the Data Ingestion Tab
  const renderIngestionForm = () => {
    return (
      <div className="space-y-6">
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium">Data Ingestion</h3>
            <p className="text-sm text-muted-foreground">
              Connect to data sources and validate data quality
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="mb-1">Data Sources</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a data source (CRM, Analytics, etc.)"
                  value={dataSourceInput}
                  onChange={(e) => setDataSourceInput(e.target.value)}
                />
                <Button type="button" onClick={addDataSource} variant="outline">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {ingestData.dataSources.map((source, index) => (
                  <Badge key={index} variant="secondary" className="py-1">
                    {source}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-4 w-4 p-0 ml-1" 
                      onClick={() => removeDataSource(source)}
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
                {ingestData.dataSources.length === 0 && (
                  <span className="text-sm text-muted-foreground">No data sources added yet</span>
                )}
              </div>
            </div>
            
            <div>
              <Label className="mb-1">Data Quality Assessment</Label>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Rate your confidence in your data quality</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Low</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={ingestData.dataQuality}
                    onChange={(e) => setIngestData({...ingestData, dataQuality: parseInt(e.target.value)})}
                    className="flex-1"
                  />
                  <span className="text-sm">High</span>
                </div>
                <div className="text-right text-sm">
                  {ingestData.dataQuality}%
                </div>
              </div>
            </div>
            
            <div>
              <Label className="mb-1">Customer Segments</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a customer segment"
                  value={segmentInput}
                  onChange={(e) => setSegmentInput(e.target.value)}
                />
                <Button type="button" onClick={addSegment} variant="outline">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {ingestData.customerSegments.map((segment, index) => (
                  <Badge key={index} variant="secondary" className="py-1">
                    {segment}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-4 w-4 p-0 ml-1" 
                      onClick={() => removeSegment(segment)}
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
                {ingestData.customerSegments.length === 0 && (
                  <span className="text-sm text-muted-foreground">No segments added yet</span>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="customMapping">Custom Data Mapping (Optional)</Label>
              <Textarea
                id="customMapping"
                placeholder="Define how your data maps to customer lifecycle stages..."
                value={ingestData.customMapping}
                onChange={(e) => setIngestData({...ingestData, customMapping: e.target.value})}
                className="min-h-[80px]"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep('strategy')}
            >
              Back
            </Button>
            <Badge variant="outline" className="bg-primary/5">
              Ingestion Agent
            </Badge>
          </div>
          <Button onClick={handleIngestionSubmit}>
            Continue to Analysis <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };
  
  // Render form-based UI for the Analysis Tab
  const renderAnalysisForm = () => {
    return (
      <div className="space-y-6">
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium">Data Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Generate insights from your customer data
            </p>
          </div>
          
          {!analysisFinished ? (
            <div className="space-y-4 py-8">
              <div className="text-center">
                <LineChart className="h-8 w-8 mx-auto text-primary animate-pulse" />
                <h3 className="mt-4 text-lg font-medium">Analyzing Data</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Running statistical analysis and pattern detection...
                </p>
              </div>
              <Progress value={generationProgress} className="w-full mt-4" />
            </div>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Statistical Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                      <span>Customer acquisition costs have decreased by 12% in recent months</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                      <span>Average order value is 15% higher for repeat customers</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                      <span>Conversion rates show significant variation by geographic region</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Pattern Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                      <span>Customers who engage with email campaigns are 3x more likely to purchase</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                      <span>Weekend promotions consistently outperform weekday campaigns</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                      <span>Free shipping offers drive 25% more conversions than percentage discounts</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Lifecycle-Specific Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {Object.entries(lifecycleStages).map(([stage, title]) => (
                      <AccordionItem key={stage} value={stage}>
                        <AccordionTrigger className="py-2">
                          <span className="text-sm font-medium">{title}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 text-sm pl-2">
                            {stage === 'prospecting' && (
                              <>
                                <p>• Social media is the most cost-effective acquisition channel</p>
                                <p>• Brand awareness is highest among 25-34 year olds</p>
                                <p>• Video content drives 40% more engagement than static images</p>
                              </>
                            )}
                            {stage === 'ownership' && (
                              <>
                                <p>• 35% of new customers don't complete the onboarding process</p>
                                <p>• First 14 days are critical for establishing product usage habits</p>
                                <p>• Educational content significantly reduces support ticket volume</p>
                              </>
                            )}
                            {stage === 'inlife' && (
                              <>
                                <p>• Loyalty program members spend 45% more annually</p>
                                <p>• Personalized recommendations increase cross-selling by 28%</p>
                                <p>• Regular engagement with mobile app correlates with retention</p>
                              </>
                            )}
                            {stage === 'risky' && (
                              <>
                                <p>• Decreased login frequency is an early warning sign of churn</p>
                                <p>• Price sensitivity increases dramatically in at-risk segments</p>
                                <p>• Incentives work best when aligned with previous purchase behavior</p>
                              </>
                            )}
                            {stage === 'churn' && (
                              <>
                                <p>• 70% of churned customers cited price as primary reason</p>
                                <p>• Win-back offers are most effective within 30 days of churn</p>
                                <p>• Customers who return after churning have 15% higher LTV</p>
                              </>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        <div className="flex justify-between pt-4">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep('ingestion')}
            >
              Back
            </Button>
            <Badge variant="outline" className="bg-primary/5">
              Analysis Agent
            </Badge>
          </div>
          <Button 
            onClick={handleAnalysisSubmit} 
            disabled={!analysisFinished}
          >
            Continue to Content <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };
  
  // Render form-based UI for the Creative Tab
  const renderCreativeForm = () => {
    return (
      <div className="space-y-6">
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium">Creative Content Generation</h3>
            <p className="text-sm text-muted-foreground">
              Generate content for each customer lifecycle stage
            </p>
          </div>
          
          {generatingRecommendations ? (
            <div className="space-y-4 py-8">
              <div className="text-center">
                <Sparkles className="h-8 w-8 mx-auto text-primary animate-pulse" />
                <h3 className="mt-4 text-lg font-medium">Generating Content Recommendations</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Creating tailored strategies for each lifecycle stage...
                </p>
              </div>
              <Progress value={generationProgress} className="w-full mt-4" />
            </div>
          ) : (
            <div className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(lifecycleStages).map(([stage, title]) => (
                  <AccordionItem key={stage} value={stage}>
                    <AccordionTrigger className="hover:no-underline px-4 py-3 data-[state=open]:bg-muted/40 rounded-md">
                      <div className="flex items-center text-left">
                        <div className="w-3 h-3 rounded-full bg-primary mr-3"></div>
                        <div>
                          <h4 className="font-medium">{title}</h4>
                          <p className="text-xs text-muted-foreground">{stageDescriptions[stage as LifecycleStage]}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4">
                      <div className="space-y-4 py-2">
                        {recommendations
                          .filter(rec => rec.stage === stage)
                          .map((rec, idx) => (
                            <Card key={idx} className="border-l-4 border-l-primary shadow-sm">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h5 className="font-medium">{rec.title}</h5>
                                    <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                                    
                                    <div className="mt-3">
                                      <h6 className="text-xs font-medium text-muted-foreground">CHANNELS</h6>
                                      <div className="flex flex-wrap gap-2 mt-1">
                                        {rec.channels.map((channel, cidx) => (
                                          <Badge key={cidx} variant="outline" className="px-2 py-0.5">
                                            {channel}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    <div className="mt-3">
                                      <h6 className="text-xs font-medium text-muted-foreground">EXPECTED OUTCOME</h6>
                                      <p className="text-sm mt-1">{rec.expectedOutcome}</p>
                                    </div>
                                  </div>
                                  
                                  <Badge 
                                    className={
                                      rec.priority === 'high' 
                                        ? 'bg-red-100 text-red-800 hover:bg-red-100' 
                                        : rec.priority === 'medium'
                                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                                          : 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                                    }
                                  >
                                    {rec.priority.toUpperCase()} PRIORITY
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          
                        {recommendations.filter(rec => rec.stage === stage).length === 0 && (
                          <p className="text-sm text-muted-foreground py-2">No recommendations for this stage.</p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
        
        <div className="flex justify-between pt-4">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep('analysis')}
            >
              Back
            </Button>
            <Badge variant="outline" className="bg-primary/5">
              Creative Agent
            </Badge>
          </div>
          <Button 
            onClick={handleCreativeSubmit}
            disabled={generatingRecommendations || recommendations.length === 0}
          >
            Continue to Execution <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };
  
  // Render form-based UI for the Execution Tab
  const renderExecutionForm = () => {
    return (
      <div className="space-y-6">
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium">Campaign Execution</h3>
            <p className="text-sm text-muted-foreground">
              Set up deployment schedule and channels
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div>
                <Label htmlFor="executionName">Campaign Name</Label>
                <Input
                  id="executionName"
                  placeholder="Enter campaign name"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="executionStart">Start Date</Label>
                <Input
                  id="executionStart"
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Channel Deployment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {['Email', 'Social Media', 'Paid Search', 'Display Advertising', 'SMS'].map((channel, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1 border-b">
                        <span className="text-sm">{channel}</span>
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id={`channel-${idx}`} 
                            defaultChecked={idx < 3}
                            className="mr-1"
                          />
                          <Label htmlFor={`channel-${idx}`} className="text-xs">Active</Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Performance Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {['Conversion Rate', 'Click-through Rate', 'Cost per Acquisition', 'Return on Ad Spend', 'Customer Lifetime Value'].map((metric, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1 border-b">
                        <span className="text-sm">{metric}</span>
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id={`metric-${idx}`} 
                            defaultChecked
                            className="mr-1"
                          />
                          <Label htmlFor={`metric-${idx}`} className="text-xs">Track</Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Label htmlFor="optimizationRules">Optimization Rules (Optional)</Label>
              <Textarea
                id="optimizationRules"
                placeholder="Define rules for automatic campaign optimization..."
                className="min-h-[80px]"
                defaultValue="Pause ads with CTR below 0.5% after 1000 impressions
Increase budget for ads with ROAS > 300%
Alert when CPA exceeds target by 25%"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep('creative')}
            >
              Back
            </Button>
            <Badge variant="outline" className="bg-primary/5">
              Execution Agent
            </Badge>
          </div>
          <Button onClick={handleExecutionSubmit}>
            Continue to Monitoring <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };
  
  // Render form-based UI for the Monitor Tab
  const renderMonitorForm = () => {
    return (
      <div className="space-y-6">
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium">Campaign Monitoring</h3>
            <p className="text-sm text-muted-foreground">
              Track performance metrics and optimize in real-time
            </p>
          </div>
          
          <div className="space-y-4">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Campaign Summary: {campaignName || "New Campaign"}</CardTitle>
                <CardDescription>
                  Ready to launch across all customer lifecycle stages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Lifecycle Coverage</h4>
                    <div className="grid grid-cols-5 gap-2">
                      {Object.entries(lifecycleStages).map(([stage, title]) => (
                        <div key={stage} className="flex flex-col items-center">
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{width: '100%'}}></div>
                          </div>
                          <span className="text-xs mt-1 text-center">
                            {title.split(' ')[0]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border p-3 rounded-md">
                      <h5 className="text-xs text-muted-foreground mb-1">STRATEGIES</h5>
                      <p className="text-2xl font-semibold">{recommendations.length}</p>
                      <p className="text-xs text-muted-foreground">Across all stages</p>
                    </div>
                    
                    <div className="border p-3 rounded-md">
                      <h5 className="text-xs text-muted-foreground mb-1">DATA SOURCES</h5>
                      <p className="text-2xl font-semibold">{ingestData.dataSources.length || 3}</p>
                      <p className="text-xs text-muted-foreground">Connected and verified</p>
                    </div>
                    
                    <div className="border p-3 rounded-md">
                      <h5 className="text-xs text-muted-foreground mb-1">CHANNELS</h5>
                      <p className="text-2xl font-semibold">5</p>
                      <p className="text-xs text-muted-foreground">Ready for deployment</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Next Steps</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                        <span>Deploy campaign across selected channels</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                        <span>Monitor performance against KPIs</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                        <span>Apply optimization rules to maximize results</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('execution')}>
                  Back
                </Button>
                <div className="space-x-2">
                  <Button 
                    variant="outline"
                    onClick={() => handleExport('pdf')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Strategy
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <Badge variant="outline" className="bg-primary/5">
            Monitoring Agent
          </Badge>
          <Button variant="outline" onClick={() => setCurrentStep('strategy')}>
            Start New Campaign
          </Button>
        </div>
      </div>
    );
  };

  // Render form-based UI
  const renderFormUI = () => {
    return (
      <div className="w-full">
        <div className="mb-6">
          <div className="grid grid-cols-6 mb-4 gap-2 p-1 bg-muted rounded-lg">
            {['strategy', 'ingestion', 'analysis', 'creative', 'execution', 'monitor'].map((step) => (
              <div 
                key={step}
                className={`text-center py-2 px-3 rounded-md text-xs sm:text-sm font-medium
                  ${currentStep === step ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}
                `}
              >
                <span className="hidden md:inline">{stepDescriptions[step as WizardStep].title}</span>
                <span className="md:hidden">{stepDescriptions[step as WizardStep].icon}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          {currentStep === 'strategy' && renderStrategyForm()}
          {currentStep === 'ingestion' && renderIngestionForm()}
          {currentStep === 'analysis' && renderAnalysisForm()}
          {currentStep === 'creative' && renderCreativeForm()}
          {currentStep === 'execution' && renderExecutionForm()}
          {currentStep === 'monitor' && renderMonitorForm()}
        </div>
      </div>
    );
  };

  // Render conversation UI
  const renderConversationUI = () => {
    return (
      <div className="space-y-4">
        <ScrollArea className="h-[400px] md:h-[500px] pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-3 max-w-[85%] ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
        
        <CardFooter className="px-0 pt-2 pb-0">
          <div className="w-full flex flex-col space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div>Current step: <span className="font-medium">{stepDescriptions[currentStep].title}</span></div>
              <div className="flex items-center gap-1">
                <ArrowRight className="h-3 w-3" />
                <span>Progress: <span className="font-medium">{progress}%</span></span>
              </div>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
        </CardFooter>
      </div>
    );
  };

  return (
    <div>
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Marketing Campaign Builder
              </CardTitle>
              <CardDescription>
                Develop a comprehensive strategy across the customer lifecycle
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleConversationMode}
              className="flex items-center gap-1.5"
            >
              <MessageSquare className="h-4 w-4" />
              {conversationMode ? "Switch to Form Mode" : "Switch to Chat Mode"}
            </Button>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        <CardContent className="pb-4">
          {!conversationMode ? renderFormUI() : renderConversationUI()}
        </CardContent>
      </Card>
    </div>
  );
}