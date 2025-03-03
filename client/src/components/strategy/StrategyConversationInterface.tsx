import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronRight, Upload, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { uploadCSVData } from "@/lib/data-ingestion";

export function StrategyConversationInterface() {
  const [activeStep, setActiveStep] = useState('strategy'); // 'strategy', 'ingestion'
  const [messages, setMessages] = useState([
    {
      sender: 'agent',
      content: "Hi there! I'm your Strategy Agent. Let's start by defining your campaign objectives across the customer lifecycle. What are your main goals for each stage?",
      timestamp: new Date()
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [objectives, setObjectives] = useState({
    prospecting: '',
    ownership: '',
    inlife: '',
    risky: '',
    churn: ''
  });
  const [currentLifecycleStage, setCurrentLifecycleStage] = useState('prospecting');
  const [allObjectivesDefined, setAllObjectivesDefined] = useState(false);
  const [showIngestion, setShowIngestion] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [processingStatus, setProcessingStatus] = useState<'processing' | 'complete' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fix the lifecycle stages definition
  const lifecycleStages = {
    prospecting: `Attracting and engaging potential customers who aren't yet customers`,
    ownership: `Initial customer onboarding and early relationship building`,
    inlife: `Deepening relationships with active and satisfied customers`,
    risky: `Addressing customers showing signs of dissatisfaction or decreased engagement`,
    churn: `Re-engaging customers who have left or are about to leave`
  };

  // Automatic scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check if all objectives have been defined
  useEffect(() => {
    const allDefined = Object.values(objectives).every(value => value !== '');
    setAllObjectivesDefined(allDefined);
  }, [objectives]);

  // Process strategy agent responses
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].sender === 'user') {
      // Simulate agent thinking
      setTimeout(() => {
        if (!allObjectivesDefined) {
          handleStrategyAgentResponse();
        } else if (activeStep === 'strategy' && messages[messages.length - 1].content.toLowerCase().includes('yes')) {
          handleStrategyComplete();
        }
      }, 1000);
    }
  }, [messages]);

  const handleStrategyAgentResponse = () => {
    // Update the current objective based on user input
    const userResponse = messages[messages.length - 1].content;
    const updatedObjectives = { ...objectives };
    updatedObjectives[currentLifecycleStage] = userResponse;
    setObjectives(updatedObjectives);

    // Determine next lifecycle stage to ask about
    const stages = Object.keys(lifecycleStages);
    const currentIndex = stages.indexOf(currentLifecycleStage);
    
    if (currentIndex < stages.length - 1) {
      // Move to next stage
      const nextStage = stages[currentIndex + 1];
      setCurrentLifecycleStage(nextStage);
      
      setMessages(prevMessages => [
        ...prevMessages,
        {
          sender: 'agent',
          content: `Thanks! Now let's talk about the ${nextStage} stage: ${lifecycleStages[nextStage]}. What are your objectives for this stage?`,
          timestamp: new Date()
        }
      ]);
    } else {
      // All stages completed
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
        sender: 'agent',
        content: "Hello, I'm your Ingestion Agent! Based on your campaign objectives, we'll need customer data across various lifecycle stages. Please upload your customer data files (CSV, Excel, or JSON).",
        timestamp: new Date(),
        sender: 'ingestion'
      }
    ]);
    setActiveStep('ingestion');
    setShowIngestion(true);
  };

  const summarizeObjectives = (objectives: Record<string, string>) => {
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFiles([file]);
      setProcessingStatus('processing');

      try {
        await uploadCSVData(file);
        queryClient.invalidateQueries({ queryKey: ["/api/data-points"] });
        
        setProcessingStatus('complete');
        setMessages(prevMessages => [
          ...prevMessages,
          {
            sender: 'user',
            content: `Uploaded file: ${file.name}`,
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
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Campaign Strategy Development</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Progress Steps */}
        <div className="flex items-center mb-6 px-4">
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

        {/* Left Panel - Lifecycle Stages */}
        <div className="flex gap-4 h-full">
          <div className="w-64 space-y-2">
            {Object.entries(lifecycleStages).map(([stage, description]) => (
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
                    <p className="text-xs text-muted-foreground mt-1">{description}</p>
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

          {/* Right Panel - Chat Interface */}
          <div className="flex-1 flex flex-col">
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

            {/* File Upload Area */}
            {showIngestion && (
              <div className="mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  accept=".csv,.xlsx,.json"
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                  variant="outline"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Data File
                </Button>

                {uploadedFiles.map((file, index) => (
                  <div key={index} className="mt-2 p-2 bg-muted rounded-lg flex items-center">
                    <div className="flex-1">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    {processingStatus === 'processing' ? (
                      <div className="animate-spin">
                        <Upload className="h-4 w-4" />
                      </div>
                    ) : (
                      processingStatus === 'complete' && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Input Area */}
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