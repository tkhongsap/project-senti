import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronRight, Upload, CheckCircle, Network, Database, FileText, AlertCircle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { uploadCSVData } from "@/lib/data-ingestion";

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
    <div className="flex space-x-4 mb-6">
      <button 
        className={`flex items-center space-x-2 p-4 rounded-lg border-2 ${activeTab === 'file' ? 'border-primary bg-primary/10' : 'border-border'}`}
        onClick={() => setActiveTab('file')}
      >
        <FileText className={activeTab === 'file' ? 'text-primary' : 'text-muted-foreground'} />
        <div className="text-left">
          <p className={`font-medium ${activeTab === 'file' ? 'text-primary' : 'text-foreground'}`}>File Upload</p>
          <p className="text-xs text-muted-foreground">CSV, Excel, JSON</p>
        </div>
      </button>

      <button 
        className={`flex items-center space-x-2 p-4 rounded-lg border-2 ${activeTab === 'api' ? 'border-primary bg-primary/10' : 'border-border'}`}
        onClick={() => setActiveTab('api')}
      >
        <Network className={activeTab === 'api' ? 'text-primary' : 'text-muted-foreground'} />
        <div className="text-left">
          <p className={`font-medium ${activeTab === 'api' ? 'text-primary' : 'text-foreground'}`}>API Connection</p>
          <p className="text-xs text-muted-foreground">REST, GraphQL</p>
        </div>
      </button>

      <button 
        className={`flex items-center space-x-2 p-4 rounded-lg border-2 ${activeTab === 'database' ? 'border-primary bg-primary/10' : 'border-border'}`}
        onClick={() => setActiveTab('database')}
      >
        <Database className={activeTab === 'database' ? 'text-primary' : 'text-muted-foreground'} />
        <div className="text-left">
          <p className={`font-medium ${activeTab === 'database' ? 'text-primary' : 'text-foreground'}`}>Database</p>
          <p className="text-xs text-muted-foreground">SQL, NoSQL</p>
        </div>
      </button>
    </div>
  );

  const renderFileUpload = () => {
    if (uploadedFiles.length > 0 && uploadStatus) {
      return (
        <div className="p-4 bg-muted rounded-lg">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              {uploadStatus === 'processing' ? (
                <div className="animate-spin">
                  <Upload className="h-4 w-4" />
                </div>
              ) : uploadStatus === 'complete' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : null}
            </div>
          ))}

          {uploadStatus === 'processing' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {validationResults.map((result, index) => (
            <div key={index} className="flex items-center mt-2">
              {result.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500 mr-2" />}
              {result.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />}
              {result.type === 'info' && <AlertCircle className="h-4 w-4 text-blue-500 mr-2" />}
              <span className="text-sm">{result.message}</span>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center ${dragActive ? 'border-primary bg-primary/10' : 'border-border'}`}
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

        <Upload className={`h-12 w-12 mx-auto mb-4 ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />

        <h3 className="text-lg font-semibold mb-2">
          {dragActive ? 'Drop your file here' : 'Drag & drop your file here'}
        </h3>

        <p className="text-muted-foreground mb-4">
          Support for CSV, Excel, and JSON formats
        </p>

        <Button onClick={() => fileInputRef.current?.click()}>
          Browse Files
        </Button>

        <p className="text-xs text-muted-foreground mt-4">
          Maximum file size: 50MB
        </p>
      </div>
    );
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Campaign Strategy Development</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        {/* Progress Steps */}
        <div className="flex items-center mb-6">
          <div className={`flex items-center ${activeStep === 'strategy' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep === 'strategy' ? 'bg-primary/10 text-primary' : 'bg-muted'}`}>
              <span className="font-semibold">1</span>
            </div>
            <span className="ml-2 font-medium">Strategy</span>
          </div>

          <ChevronRight className="mx-4 text-muted-foreground" />

          <div className={`flex items-center ${activeStep === 'ingestion' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep === 'ingestion' ? 'bg-primary/10 text-primary' : 'bg-muted'}`}>
              <span className="font-semibold">2</span>
            </div>
            <span className="ml-2 font-medium">Data Ingestion</span>
          </div>
        </div>

        <div className="flex gap-4 flex-1 overflow-hidden">
          {/* Left Panel - Lifecycle Stages */}
          <div className="w-64 space-y-2 overflow-y-auto">
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

          {/* Right Panel - Chat Interface & Data Ingestion */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : message.sender === 'ingestion'
                        ? 'bg-green-100 border border-green-200'
                        : 'bg-muted border border-border'
                    }`}
                  >
                    {message.sender !== 'user' && (
                      <div className="text-xs text-muted-foreground mb-1">
                        {message.sender === 'ingestion' ? 'Ingestion Agent' : 'Strategy Agent'}
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {activeStep === 'ingestion' && (
              <div className="mb-4">
                {renderSourceTabs()}
                {activeTab === 'file' && renderFileUpload()}
              </div>
            )}

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
    </Card>
  );
}