import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { uploadCSVData } from "@/lib/data-ingestion";
import { queryClient } from "@/lib/queryClient";

export function UploadForm() {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await uploadCSVData(file);
      
      // Invalidate the data points query to refresh the dashboard
      queryClient.invalidateQueries({ queryKey: ["/api/data-points"] });
      
      toast({
        title: "Upload Successful",
        description: "Your data has been ingested successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "An error occurred during upload",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Ingestion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="flex-1"
          />
          <Button disabled={isUploading}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
