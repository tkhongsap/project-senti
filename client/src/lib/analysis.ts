import { DataPoint } from "@shared/schema";

export function calculateBasicStats(data: DataPoint[]) {
  const values = data.map(d => d.value);
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / values.length;
  
  const sortedValues = [...values].sort((a, b) => a - b);
  const median = sortedValues[Math.floor(sortedValues.length / 2)];
  
  return {
    mean,
    median,
    min: Math.min(...values),
    max: Math.max(...values),
    total: sum
  };
}

export function identifyTrends(data: DataPoint[]) {
  const sortedData = [...data].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  const trends = [];
  let currentTrend = "stable";
  
  for (let i = 1; i < sortedData.length; i++) {
    const prev = sortedData[i - 1].value;
    const curr = sortedData[i].value;
    const change = ((curr - prev) / prev) * 100;
    
    if (change > 5) currentTrend = "increasing";
    else if (change < -5) currentTrend = "decreasing";
    else currentTrend = "stable";
    
    trends.push({
      timestamp: sortedData[i].timestamp,
      trend: currentTrend,
      change
    });
  }
  
  return trends;
}

export function aggregateByCategory(data: DataPoint[]) {
  const aggregated = new Map<string, number>();
  
  data.forEach(point => {
    const current = aggregated.get(point.category) || 0;
    aggregated.set(point.category, current + point.value);
  });
  
  return Array.from(aggregated.entries()).map(([category, value]) => ({
    category,
    value
  }));
}
