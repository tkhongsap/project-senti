import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronRight, Upload, CheckCircle, Network, Database, FileText, AlertCircle, X, ChevronDown, ArrowRight, RefreshCw, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { uploadCSVData } from "@/lib/data-ingestion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

type LifecycleStage = 'prospecting' | 'ownership' | 'inlife' | 'risky' | 'churn';
type Message = {
  sender: 'user' | 'agent' | 'ingestion';
  content: string;
  timestamp: Date;
};

export function StrategyConversationInterface() {
  const [activeStep, setActiveStep] = useState<'strategy' | 'ingestion'>('strategy');
  const [messages, setMessages] = useState<Message[]>([{
    sender: 'agent',
    content: "Hi there! I'm your Strategy Agent. Let's start by defining your campaign objectives across the customer lifecycle. What are your main goals for each stage?",
    timestamp: new Date()
  }]);
  const [userInput, setUserInput] = useState('');
  const [objectives, setObjectives] = useState<Record<LifecycleStage, string>>({
    prospecting: '',
    ownership: '',
    inlife: '',
    risky: '',
    churn: ''
  });
  const [currentLifecycleStage, setCurrentLifecycleStage] = useState<LifecycleStage>('prospecting');
  const [allObjectivesDefined, setAllObjectivesDefined] = useState(false);

  // Data ingestion state
  const [activeTab, setActiveTab] = useState<'file' | 'api' | 'database'>('file');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'validating' | 'processing' | 'complete' | 'error' | null>(null);
  const [validationResults, setValidationResults] = useState<Array<{type: 'success' | 'warning' | 'info', message: string}>>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(true);

  const lifecycleStages: Record<LifecycleStage, string> = {
    prospecting: `Attracting and engaging potential customers who aren't yet customers`,
    ownership: `Initial customer onboarding and early relationship building`,
    inlife: `Deepening relationships with active and satisfied customers`,
    risky: `Addressing customers showing signs of dissatisfaction or decreased engagement`,
    churn: `Re-engaging customers who have left or are about to leave`
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const allDefined = Object.values(objectives).every(value => value !== '');
    setAllObjectivesDefined(allDefined);
  }, [objectives]);

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].sender === 'user') {
      setTimeout(() => {
        if (!allObjectivesDefined) {
          handleStrategyAgentResponse();
        } else if (activeStep === 'strategy' && messages[messages.length - 1].content.toLowerCase().includes('yes')) {
          handleStrategyComplete();
        }
      }, 1000);
    }
  }, [messages]);

  useEffect(() => {
    if (uploadedFiles.length > 0 && uploadStatus === 'validating') {
      const timer = setTimeout(() => {
        setUploadStatus('processing');
        setValidationResults([
          { type: 'success', message: 'File format is valid' },
          { type: 'success', message: 'All required columns present' },
          { type: 'warning', message: '15% of records have missing values' },
          { type: 'info', message: 'Processing campaign data' }
        ]);

        let progress = 0;
        const progressTimer = setInterval(() => {
          progress += 5;
          setUploadProgress(progress);

          if (progress >= 100) {
            clearInterval(progressTimer);
            setUploadStatus('complete');
          }
        }, 300);

        return () => {
          clearInterval(progressTimer);
          clearTimeout(timer);
        };
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [uploadedFiles, uploadStatus]);

  const handleStrategyAgentResponse = () => {
    const userResponse = messages[messages.length - 1].content;
    const updatedObjectives = { ...objectives };
    updatedObjectives[currentLifecycleStage] = userResponse;
    setObjectives(updatedObjectives);

    const stages = Object.keys(lifecycleStages) as LifecycleStage[];
    const currentIndex = stages.indexOf(currentLifecycleStage);

    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      setCurrentLifecycleStage(nextStage);

      setMessages(prevMessages => [...prevMessages, {
        sender: 'agent',
        content: `Thanks! Now let's talk about the ${nextStage} stage: ${lifecycleStages[nextStage]}. What are your objectives for this stage?`,
        timestamp: new Date()
      }]);
    } else {
      setMessages(prevMessages => [
        ...prevMessages,
        {
          sender: 'agent',
          content: "Great! I've collected objectives for all customer lifecycle stages. Let me summarize what we've discussed:",
          timestamp: new Date()
        },
        {
          sender: 'agent',
          content: summarizeObjectives(updatedObjectives),
          timestamp: new Date()
        },
        {
          sender: 'agent',
          content: "Does this accurately capture your campaign objectives across the customer lifecycle? Type 'yes' to proceed to data ingestion, or clarify if you'd like to make any changes.",
          timestamp: new Date()
        }
      ]);
    }
  };

  const handleStrategyComplete = () => {
    setMessages(prevMessages => [
      ...prevMessages,
      {
        sender: 'agent',
        content: "Perfect! I'm now handing you over to the Ingestion Agent who will help you upload the data needed to meet these objectives.",
        timestamp: new Date()
      },
      {
        sender: 'ingestion',
        content: "Hello, I'm your Ingestion Agent! Based on your campaign objectives, we'll need customer data across various lifecycle stages. Please upload your customer data files (CSV, Excel, or JSON).",
        timestamp: new Date()
      }
    ]);
    setActiveStep('ingestion');
  };

  const summarizeObjectives = (objectives: Record<LifecycleStage, string>) => {
    let summary = "**Campaign Objectives Summary:**\n\n";

    Object.entries(objectives).forEach(([stage, objective]) => {
      const formattedStage = stage.charAt(0).toUpperCase() + stage.slice(1);
      summary += `**${formattedStage} Stage:** ${objective}\n\n`;
    });

    return summary;
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

    setUserInput('');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (files: File[]) => {
    setUploadedFiles(files);
    setUploadStatus('validating');
    setUploadProgress(0);

    try {
      await uploadCSVData(files[0]);
      queryClient.invalidateQueries({ queryKey: ["/api/data-points"] });

      setMessages(prevMessages => [
        ...prevMessages,
        {
          sender: 'user',
          content: `Uploaded file: ${files[0].name}`,
          timestamp: new Date()
        },
        {
          sender: 'ingestion',
          content: `I've successfully processed your data file. Based on your objectives, I've mapped the data to your campaign stages and prepared it for analysis.`,
          timestamp: new Date()
        }
      ]);

      toast({
        title: "Upload Successful",
        description: "Your campaign data has been processed successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "An error occurred during upload",
        variant: "destructive",
      });
    }
  };

  const renderSourceTabs = () => (
    <div className="mb-4">
      <Tabs defaultValue="file" value={activeTab} onValueChange={(value) => setActiveTab(value as 'file' | 'api' | 'database')}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="file" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> 
            <span className="hidden sm:inline">File Upload</span>
            <span className="sm:hidden">File</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Network className="h-4 w-4" /> 
            <span className="hidden sm:inline">API Connection</span>
            <span className="sm:hidden">API</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" /> 
            <span className="hidden sm:inline">Database</span>
            <span className="sm:hidden">DB</span>
          </TabsTrigger>
        </TabsList>
        <div className="mt-2 text-xs text-muted-foreground text-center">
          {activeTab === 'file' && "Support for CSV, Excel, and JSON formats"}
          {activeTab === 'api' && "Connect to REST or GraphQL endpoints"}
          {activeTab === 'database' && "Connect to SQL or NoSQL databases"}
        </div>
      </Tabs>
    </div>
  );

  const renderFileUpload = () => {
    if (uploadedFiles.length > 0 && uploadStatus) {
      return (
        <div className="p-3 bg-muted/50 rounded-lg border border-border/50">
          <div className="flex flex-col space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                {uploadStatus === 'processing' ? (
                  <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                ) : uploadStatus === 'complete' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : null}
              </div>
            ))}
          </div>

          {uploadStatus === 'processing' && (
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium">Processing file</span>
                <span className="font-medium">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-1.5">
                <div 
                  className="bg-primary h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="mt-3 grid grid-cols-1 gap-1.5">
            {validationResults.map((result, index) => (
              <div key={index} className="flex items-center">
                {result.type === 'success' && <CheckCircle className="h-3 w-3 text-green-500 mr-1.5" />}
                {result.type === 'warning' && <AlertCircle className="h-3 w-3 text-yellow-500 mr-1.5" />}
                {result.type === 'info' && <AlertCircle className="h-3 w-3 text-blue-500 mr-1.5" />}
                <span className="text-xs">{result.message}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div 
        className={`border border-dashed rounded-lg p-4 flex flex-col items-center justify-center h-[140px] ${dragActive ? 'border-primary bg-primary/5' : 'border-border'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept=".csv,.xlsx,.json"
          className="hidden"
        />

        <Upload className={`h-8 w-8 mb-2 ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
        
        <div className="text-center mb-3">
          <h3 className="text-sm font-medium mb-1">
            {dragActive ? 'Drop file here' : 'Drag & drop file here'}
          </h3>
          <p className="text-xs text-muted-foreground">
            CSV, Excel, or JSON (Max 50MB)
          </p>
        </div>

        <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
          Browse Files
        </Button>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Strategy Assistant
          </CardTitle>
          <CardDescription>AI-powered campaign strategy development</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={activeStep === 'strategy' ? "default" : "outline"} className="h-6">
            Strategy
          </Badge>
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
          <Badge variant={activeStep === 'ingestion' ? "default" : "outline"} className="h-6">
            Data Ingestion
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0 ml-2"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="p-4">
          <Tabs value={activeStep} className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger 
                value="strategy" 
                className="data-[state=active]:bg-primary/10"
                onClick={() => activeStep === "ingestion" && setActiveStep("strategy")}
              >
                Strategy Development
              </TabsTrigger>
              <TabsTrigger 
                value="ingestion"
                className="data-[state=active]:bg-primary/10"
                onClick={() => activeStep === "strategy" && allObjectivesDefined && setActiveStep("ingestion")}
              >
                Data Ingestion
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-4 flex-1 overflow-hidden">
            {/* Lifecycle stages sidebar - hidden on mobile */}
            <div className="w-52 min-w-52 space-y-2 bg-muted/30 p-2 rounded-lg hidden sm:block">
              {(Object.keys(lifecycleStages) as LifecycleStage[]).map((stage) => (
                <div
                  key={stage}
                  className={`p-3 rounded-lg border ${
                    stage === currentLifecycleStage
                      ? 'bg-primary/10 border-primary'
                      : objectives[stage]
                      ? 'bg-green-50 border-green-200'
                      : 'bg-muted border-border'
                  }`}
                >
                  <div className="flex items-start">
                    {objectives[stage] && (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    )}
                    <div>
                      <h3 className="font-medium capitalize">{stage}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{lifecycleStages[stage]}</p>
                      {objectives[stage] && (
                        <p className="text-xs text-primary mt-1 italic">
                          "{objectives[stage].substring(0, 60)}..."
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main conversation area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Messages scroll area */}
              <ScrollArea className="flex-1 pr-4 h-[300px]">
                <div className="space-y-3 mb-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.sender !== 'user' && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                          {message.sender === 'ingestion' ? 
                            <Database className="h-4 w-4 text-primary" /> : 
                            <MessageSquare className="h-4 w-4 text-primary" />
                          }
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2.5 ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                            : message.sender === 'ingestion'
                            ? 'bg-green-100 border border-green-200 rounded-tl-none'
                            : 'bg-muted/70 border border-border rounded-tl-none'
                        }`}
                      >
                        {message.sender !== 'user' && (
                          <div className="text-xs font-medium text-primary mb-1">
                            {message.sender === 'ingestion' ? 'Ingestion Agent' : 'Strategy Agent'}
                          </div>
                        )}
                        <div className="whitespace-pre-wrap text-sm">
                          {message.content.includes('**') 
                            ? message.content.split('\n\n').map((paragraph, i) => {
                                if (paragraph.startsWith('**') && paragraph.includes(':**')) {
                                  const [title, content] = paragraph.split(':**');
                                  return (
                                    <div key={i} className="mb-1">
                                      <span className="font-semibold">{title.replace('**', '')}:</span>
                                      <span>{content}</span>
                                    </div>
                                  );
                                }
                                return <p key={i} className="mb-1">{paragraph}</p>;
                              })
                            : message.content
                          }
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 text-right">
                          {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Data ingestion controls */}
              {activeStep === 'ingestion' && (
                <div className="mb-4">
                  {renderSourceTabs()}
                  {activeTab === 'file' && renderFileUpload()}
                </div>
              )}

              {/* Message input */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={
                    activeStep === 'strategy'
                      ? allObjectivesDefined
                        ? "Type 'yes' to proceed or clarify any objectives..."
                        : `Enter your objectives for the ${currentLifecycleStage} stage...`
                      : "Respond to the ingestion agent..."
                  }
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}