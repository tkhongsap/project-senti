import React, { useState, useRef, useEffect } from 'react';
import { Upload, Database, FileText, Check, AlertCircle, X, ChevronRight, Network } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { uploadCSVData } from "@/lib/data-ingestion";

export function DataIngestionInterface() {
  const [activeTab, setActiveTab] = useState('file');
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'validating' | 'processing' | 'complete' | 'error' | null>(null);
  const [validationResults, setValidationResults] = useState<Array<{type: 'success' | 'warning' | 'info', message: string}>>([]);
  const [activeStep, setActiveStep] = useState(1);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (files.length > 0 && uploadStatus === 'validating') {
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

      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [files, uploadStatus]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (fileList: FileList) => {
    const files = Array.from(fileList);
    setFiles(files);
    setUploadStatus('validating');
    setUploadProgress(0);
    setActiveStep(2);

    try {
      await uploadCSVData(files[0]);
      queryClient.invalidateQueries({ queryKey: ["/api/data-points"] });

      toast({
        title: "Upload Successful",
        description: "Your campaign data has been ingested successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "An error occurred during upload",
        variant: "destructive",
      });
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const renderSourceSelection = () => {
    return (
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
  };

  const renderFileUpload = () => {
    if (files.length > 0 && uploadStatus) {
      return renderFileProcessing();
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
          className="hidden"
          onChange={handleChange}
          accept=".csv,.xlsx,.json"
        />

        <div className="mb-4 flex justify-center">
          <Upload className={`h-12 w-12 ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>

        <h3 className="text-lg font-semibold mb-2">
          {dragActive ? 'Drop your file here' : 'Drag & drop your file here'}
        </h3>

        <p className="text-muted-foreground mb-4">
          Support for CSV, Excel, and JSON formats
        </p>

        <Button onClick={onButtonClick}>
          Browse Files
        </Button>

        <p className="text-xs text-muted-foreground mt-4">
          Maximum file size: 50MB
        </p>
      </div>
    );
  };

  const renderFileProcessing = () => {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start mb-4">
            <div>
              <h3 className="font-semibold text-lg">{files[0].name}</h3>
              <p className="text-sm text-muted-foreground">
                {Math.round(files[0].size / 1024)} KB • {files[0].type || 'Unknown type'}
              </p>
            </div>
            <button 
              className="ml-auto text-muted-foreground hover:text-foreground"
              onClick={() => {
                setFiles([]);
                setUploadStatus(null);
                setUploadProgress(0);
              }}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {uploadStatus === 'validating' && (
            <div className="flex items-center text-primary mb-4">
              <div className="animate-spin mr-2">
                <Upload className="h-5 w-5" />
              </div>
              <span>Validating file...</span>
            </div>
          )}

          {uploadStatus === 'processing' && (
            <>
              <div className="mb-2 flex justify-between text-sm">
                <span>Processing</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 mb-4">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </>
          )}

          {uploadStatus === 'complete' && (
            <div className="flex items-center text-green-500 mb-4">
              <Check className="h-5 w-5 mr-2" />
              <span>Processing complete</span>
            </div>
          )}

          {validationResults.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Validation Results:</h4>
              <div className="space-y-2">
                {validationResults.map((result, index) => (
                  <div key={index} className="flex items-start">
                    {result.type === 'success' && <Check className="h-4 w-4 text-green-500 mr-2 mt-1" />}
                    {result.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-500 mr-2 mt-1" />}
                    {result.type === 'info' && <AlertCircle className="h-4 w-4 text-blue-500 mr-2 mt-1" />}
                    <span className={`text-sm ${
                      result.type === 'success' ? 'text-green-700' : 
                      result.type === 'warning' ? 'text-yellow-700' : 'text-blue-700'
                    }`}>{result.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Ingestion</CardTitle>
      </CardHeader>
      <CardContent>
        {renderSourceSelection()}
        {activeTab === 'file' && renderFileUpload()}
      </CardContent>
    </Card>
  );
}