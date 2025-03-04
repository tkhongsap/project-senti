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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define types
type LifecycleStage = 'prospecting' | 'ownership' | 'inlife' | 'risky' | 'churn';

type WizardStep = 'objectives' | 'audience' | 'channels' | 'recommendations' | 'summary';

type CampaignObjectives = {
  name: string;
  description: string;
  kpi: string;
  budget?: string;
  timeline?: string;
};

type Audience = {
  primarySegment: string;
  ageRange: string;
  location: string;
  interests: string[];
  customAttributes: string;
};

type Channel = {
  name: string;
  priority: 'high' | 'medium' | 'low';
  budget: string;
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
  const [currentStep, setCurrentStep] = useState<WizardStep>('objectives');
  const [progress, setProgress] = useState(20);
  const [campaignObjectives, setCampaignObjectives] = useState<CampaignObjectives>({
    name: '',
    description: '',
    kpi: '',
    budget: '',
    timeline: '',
  });
  const [audience, setAudience] = useState<Audience>({
    primarySegment: '',
    ageRange: '',
    location: '',
    interests: [],
    customAttributes: '',
  });
  const [channels, setChannels] = useState<Channel[]>([
    { name: 'Email', priority: 'medium', budget: '' },
    { name: 'Social Media', priority: 'high', budget: '' },
    { name: 'Paid Search', priority: 'low', budget: '' },
  ]);
  const [interestInput, setInterestInput] = useState('');
  const [recommendations, setRecommendations] = useState<StrategyRecommendation[]>([]);
  const [generatingRecommendations, setGeneratingRecommendations] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [conversationMode, setConversationMode] = useState(false);
  const [messages, setMessages] = useState<Array<{text: string, sender: 'user' | 'assistant'}>>([]);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Update progress based on current step
  useEffect(() => {
    switch (currentStep) {
      case 'objectives':
        setProgress(20);
        break;
      case 'audience':
        setProgress(40);
        break;
      case 'channels':
        setProgress(60);
        break;
      case 'recommendations':
        setProgress(80);
        break;
      case 'summary':
        setProgress(100);
        break;
    }
  }, [currentStep]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate recommendations based on inputs
  useEffect(() => {
    if (currentStep === 'recommendations' && recommendations.length === 0) {
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
        description: `A targeted campaign focusing on ${audience.primarySegment} in ${audience.location} using interest-based targeting for ${campaignObjectives.name}.`,
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

  // Handle objectives form submission
  const handleObjectivesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!campaignObjectives.name || !campaignObjectives.description || !campaignObjectives.kpi) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Move to next step
    setCurrentStep('audience');
    
    if (conversationMode) {
      setMessages(prev => [
        ...prev,
        { 
          text: `I've set my campaign name to "${campaignObjectives.name}" with the primary objective: ${campaignObjectives.description}`, 
          sender: 'user' 
        },
        { 
          text: "Great! Now let's define your target audience. Who are you primarily trying to reach with this campaign?", 
          sender: 'assistant' 
        }
      ]);
    }
  };

  // Handle audience form submission
  const handleAudienceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!audience.primarySegment || !audience.ageRange || !audience.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Move to next step
    setCurrentStep('channels');
    
    if (conversationMode) {
      setMessages(prev => [
        ...prev,
        { 
          text: `My primary audience is ${audience.primarySegment} in the ${audience.ageRange} age range, located in ${audience.location}.`, 
          sender: 'user' 
        },
        { 
          text: "Thanks for that information. Now let's specify which marketing channels you plan to use and their priorities.", 
          sender: 'assistant' 
        }
      ]);
    }
  };

  // Handle channel updates
  const updateChannelPriority = (index: number, priority: 'high' | 'medium' | 'low') => {
    const updatedChannels = [...channels];
    updatedChannels[index].priority = priority;
    setChannels(updatedChannels);
  };

  const updateChannelBudget = (index: number, budget: string) => {
    const updatedChannels = [...channels];
    updatedChannels[index].budget = budget;
    setChannels(updatedChannels);
  };

  // Add interest to audience
  const addInterest = () => {
    if (interestInput.trim() && !audience.interests.includes(interestInput.trim())) {
      setAudience({
        ...audience,
        interests: [...audience.interests, interestInput.trim()]
      });
      setInterestInput('');
    }
  };

  // Remove interest from audience
  const removeInterest = (interest: string) => {
    setAudience({
      ...audience,
      interests: audience.interests.filter(i => i !== interest)
    });
  };

  // Handle channel form submission
  const handleChannelsSubmit = () => {
    setCurrentStep('recommendations');
    
    if (conversationMode) {
      setMessages(prev => [
        ...prev,
        { 
          text: `I've prioritized ${channels.filter(c => c.priority === 'high').map(c => c.name).join(', ')} as my primary channels.`, 
          sender: 'user' 
        },
        { 
          text: "Based on your inputs, I'll now generate strategic recommendations for each stage of the customer lifecycle.", 
          sender: 'assistant' 
        }
      ]);
    }
  };

  // Go to summary step
  const handleGoToSummary = () => {
    setCurrentStep('summary');
    
    if (conversationMode) {
      setMessages(prev => [
        ...prev,
        { 
          text: "I like these recommendations. Let's proceed to the summary.", 
          sender: 'user' 
        },
        { 
          text: "Great! Here's a comprehensive summary of your marketing strategy across all customer lifecycle stages.", 
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
          text: "Hi! I'm your Marketing Strategy Assistant. I'll help you develop an effective campaign strategy across all customer lifecycle stages. What's the primary objective of your campaign?", 
          sender: 'assistant' 
        }
      ]);
    }
  };

  // Render form-based UI
  const renderFormUI = () => {
    return (
      <div className="w-full">
        <div className="grid grid-cols-5 mb-4 gap-2 p-1 bg-muted rounded-lg">
          {['objectives', 'audience', 'channels', 'recommendations', 'summary'].map((step, index) => (
            <div 
              key={step}
              className={`text-center py-2 px-3 rounded-md text-sm font-medium
                ${currentStep === step ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}
              `}
            >
              <span className="hidden md:inline">{step.charAt(0).toUpperCase() + step.slice(1)}</span>
              <span className="md:hidden">{index + 1}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          {currentStep === 'objectives' && (
            <form onSubmit={handleObjectivesSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    id="name"
                    placeholder="Summer 2025 Promotion"
                    value={campaignObjectives.name}
                    onChange={(e) => setCampaignObjectives({...campaignObjectives, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Primary Objective</Label>
                  <Textarea
                    id="description"
                    placeholder="Increase customer acquisition by 20% in Q3..."
                    value={campaignObjectives.description}
                    onChange={(e) => setCampaignObjectives({...campaignObjectives, description: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="kpi">Key Performance Indicators (KPIs)</Label>
                  <Textarea
                    id="kpi"
                    placeholder="Conversion rate, Customer acquisition cost..."
                    value={campaignObjectives.kpi}
                    onChange={(e) => setCampaignObjectives({...campaignObjectives, kpi: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget">Campaign Budget (Optional)</Label>
                    <Input
                      id="budget"
                      placeholder="$10,000"
                      value={campaignObjectives.budget}
                      onChange={(e) => setCampaignObjectives({...campaignObjectives, budget: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="timeline">Timeline (Optional)</Label>
                    <Input
                      id="timeline"
                      placeholder="Q3 2025 (Jul-Sep)"
                      value={campaignObjectives.timeline}
                      onChange={(e) => setCampaignObjectives({...campaignObjectives, timeline: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button type="submit">
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          )}
          
          {currentStep === 'audience' && (
            <form onSubmit={handleAudienceSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="primarySegment">Primary Customer Segment</Label>
                  <Select 
                    onValueChange={(value) => setAudience({...audience, primarySegment: value})}
                    value={audience.primarySegment}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer segment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new-customers">New Customers</SelectItem>
                      <SelectItem value="existing-customers">Existing Customers</SelectItem>
                      <SelectItem value="high-value-customers">High-Value Customers</SelectItem>
                      <SelectItem value="dormant-customers">Dormant Customers</SelectItem>
                      <SelectItem value="at-risk-customers">At-Risk Customers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="ageRange">Age Range</Label>
                  <Select 
                    onValueChange={(value) => setAudience({...audience, ageRange: value})}
                    value={audience.ageRange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select age range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18-24">18-24</SelectItem>
                      <SelectItem value="25-34">25-34</SelectItem>
                      <SelectItem value="35-44">35-44</SelectItem>
                      <SelectItem value="45-54">45-54</SelectItem>
                      <SelectItem value="55+">55+</SelectItem>
                      <SelectItem value="all">All Ages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="location">Geographic Location</Label>
                  <Input
                    id="location"
                    placeholder="Global, USA, New York, etc."
                    value={audience.location}
                    onChange={(e) => setAudience({...audience, location: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label>Interests & Behaviors</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Add an interest"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                    />
                    <Button type="button" onClick={addInterest} variant="outline">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {audience.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary" className="py-1">
                        {interest}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-4 w-4 p-0 ml-1" 
                          onClick={() => removeInterest(interest)}
                        >
                          ×
                        </Button>
                      </Badge>
                    ))}
                    {audience.interests.length === 0 && (
                      <span className="text-sm text-muted-foreground">No interests added yet</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="customAttributes">Custom Audience Attributes (Optional)</Label>
                  <Textarea
                    id="customAttributes"
                    placeholder="Additional audience characteristics..."
                    value={audience.customAttributes}
                    onChange={(e) => setAudience({...audience, customAttributes: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCurrentStep('objectives')}
                >
                  Back
                </Button>
                <Button type="submit">
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          )}
          
          {currentStep === 'channels' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Marketing Channels & Priorities</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select the priority level for each channel and allocate budget if applicable.
                </p>
                
                <div className="space-y-4">
                  {channels.map((channel, index) => (
                    <div key={index} className="p-4 border rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{channel.name}</h4>
                        <div className="flex gap-2">
                          <Badge 
                            variant={channel.priority === 'low' ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => updateChannelPriority(index, 'low')}
                          >
                            Low
                          </Badge>
                          <Badge 
                            variant={channel.priority === 'medium' ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => updateChannelPriority(index, 'medium')}
                          >
                            Medium
                          </Badge>
                          <Badge 
                            variant={channel.priority === 'high' ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => updateChannelPriority(index, 'high')}
                          >
                            High
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor={`budget-${index}`}>Allocated Budget (Optional)</Label>
                        <Input
                          id={`budget-${index}`}
                          placeholder="$"
                          value={channel.budget}
                          onChange={(e) => updateChannelBudget(index, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCurrentStep('audience')}
                >
                  Back
                </Button>
                <Button 
                  type="button"
                  onClick={handleChannelsSubmit}
                >
                  Generate Recommendations <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {currentStep === 'recommendations' && (
            <div className="space-y-4">
              {generatingRecommendations ? (
                <div className="space-y-4 py-8">
                  <div className="text-center">
                    <Sparkles className="h-8 w-8 mx-auto text-primary animate-pulse" />
                    <h3 className="mt-4 text-lg font-medium">Generating Strategic Recommendations</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Analyzing your campaign objectives, audience, and channels...
                    </p>
                  </div>
                  <Progress value={generationProgress} className="w-full mt-4" />
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-medium">Strategic Recommendations</h3>
                  <p className="text-sm text-muted-foreground">
                    Based on your campaign objectives, audience, and channel priorities.
                  </p>
                  
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
                  
                  <div className="mt-6 flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setCurrentStep('channels')}
                    >
                      Back
                    </Button>
                    <Button 
                      type="button"
                      onClick={handleGoToSummary}
                    >
                      Continue to Summary <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
          
          {currentStep === 'summary' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Campaign Strategy Summary</h3>
              <p className="text-sm text-muted-foreground">
                Here's a complete overview of your marketing campaign strategy.
              </p>
              
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium flex items-center">
                        <Target className="mr-2 h-4 w-4 text-primary" />
                        Campaign Objectives
                      </h4>
                      <div className="ml-6 mt-2">
                        <p><span className="font-medium">Name:</span> {campaignObjectives.name}</p>
                        <p><span className="font-medium">Primary Objective:</span> {campaignObjectives.description}</p>
                        <p><span className="font-medium">KPIs:</span> {campaignObjectives.kpi}</p>
                        {campaignObjectives.budget && (
                          <p><span className="font-medium">Budget:</span> {campaignObjectives.budget}</p>
                        )}
                        {campaignObjectives.timeline && (
                          <p><span className="font-medium">Timeline:</span> {campaignObjectives.timeline}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium flex items-center">
                        <Users className="mr-2 h-4 w-4 text-primary" />
                        Target Audience
                      </h4>
                      <div className="ml-6 mt-2">
                        <p><span className="font-medium">Primary Segment:</span> {audience.primarySegment.replace('-', ' ')}</p>
                        <p><span className="font-medium">Age Range:</span> {audience.ageRange}</p>
                        <p><span className="font-medium">Location:</span> {audience.location}</p>
                        {audience.interests.length > 0 && (
                          <div>
                            <span className="font-medium">Interests:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {audience.interests.map((interest, index) => (
                                <Badge key={index} variant="secondary" className="px-2 py-0.5">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {audience.customAttributes && (
                          <p className="mt-1"><span className="font-medium">Additional Attributes:</span> {audience.customAttributes}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium flex items-center">
                        <BarChart className="mr-2 h-4 w-4 text-primary" />
                        Marketing Channels
                      </h4>
                      <div className="ml-6 mt-2 space-y-2">
                        {channels.map((channel, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span>{channel.name}</span>
                            <div className="flex items-center">
                              {channel.budget && (
                                <span className="text-sm mr-2">{channel.budget}</span>
                              )}
                              <Badge 
                                className={
                                  channel.priority === 'high' 
                                    ? 'bg-red-100 text-red-800 hover:bg-red-100' 
                                    : channel.priority === 'medium'
                                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                                      : 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                                }
                              >
                                {channel.priority.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium flex items-center">
                        <Sparkles className="mr-2 h-4 w-4 text-primary" />
                        Strategy Overview
                      </h4>
                      <div className="ml-6 mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(lifecycleStages).map(([stage, title]) => {
                          const stageRecs = recommendations.filter(rec => rec.stage === stage);
                          if (stageRecs.length === 0) return null;
                          
                          return (
                            <Card key={stage} className="border-l-4 border-l-primary shadow-sm">
                              <CardHeader className="pb-1 pt-3 px-3">
                                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                              </CardHeader>
                              <CardContent className="px-3 pb-3 pt-0">
                                <ul className="text-sm space-y-1 list-inside list-disc">
                                  {stageRecs.map((rec, idx) => (
                                    <li key={idx}>
                                      {rec.title}
                                      {rec.priority === 'high' && (
                                        <Badge variant="outline" className="ml-1.5 px-1 py-0 text-[10px]">
                                          PRIORITY
                                        </Badge>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6 flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCurrentStep('recommendations')}
                >
                  Back
                </Button>
                <div className="space-x-2">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => handleExport('pdf')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleSave}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Strategy
                  </Button>
                </div>
              </div>
            </div>
          )}
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
              <div>Current step: <span className="font-medium">{currentStep.charAt(0).toUpperCase() + currentStep.slice(1)}</span></div>
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
                Marketing Strategy Wizard
              </CardTitle>
              <CardDescription>
                Develop a comprehensive marketing strategy across the customer lifecycle
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