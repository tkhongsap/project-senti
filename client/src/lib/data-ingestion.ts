import { apiRequest } from "./queryClient";
import { InsertDataPoint } from "@shared/schema";

export async function ingestDataPoint(data: Omit<InsertDataPoint, "id">) {
  try {
    const response = await apiRequest("POST", "/api/data-points", data);
    return await response.json();
  } catch (error) {
    console.error("Error ingesting data:", error);
    throw error;
  }
}

export async function uploadCSVData(file: File) {
  const reader = new FileReader();
  
  return new Promise((resolve, reject) => {
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        
        const dataPoints = [];
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          if (values.length === headers.length) {
            const dataPoint = {
              value: parseInt(values[0], 10),
              category: values[1],
              timestamp: new Date(values[2]),
              campaignId: parseInt(values[3], 10)
            };
            dataPoints.push(dataPoint);
          }
        }
        
        const results = await Promise.all(
          dataPoints.map(point => ingestDataPoint(point))
        );
        
        resolve(results);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
