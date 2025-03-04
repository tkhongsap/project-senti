import { DataPoint } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Calendar, ArrowUp, ArrowDown, ArrowRight, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DataGridProps {
  data: DataPoint[];
  maxHeight?: string;
}

export function DataGrid({ data, maxHeight = "400px" }: DataGridProps) {
  const getCategoryColor = (category: string) => {
    const categories: Record<string, string> = {
      social: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200",
      email: "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200",
      search: "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
      direct: "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200",
      referral: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-indigo-200",
    };
    
    return categories[category.toLowerCase()] || "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200";
  };
  
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      social: <div className="w-2 h-2 rounded-full bg-blue-500"></div>,
      email: <div className="w-2 h-2 rounded-full bg-purple-500"></div>,
      search: <div className="w-2 h-2 rounded-full bg-green-500"></div>,
      direct: <div className="w-2 h-2 rounded-full bg-amber-500"></div>,
      referral: <div className="w-2 h-2 rounded-full bg-indigo-500"></div>,
    };
    
    return icons[category.toLowerCase()] || <div className="w-2 h-2 rounded-full bg-gray-500"></div>;
  };
  
  const getTrendIcon = (value: number) => {
    if (value > 75) return <ArrowUp className="h-3 w-3 text-emerald-500" />;
    if (value < 30) return <ArrowDown className="h-3 w-3 text-rose-500" />;
    return <ArrowRight className="h-3 w-3 text-amber-500" />;
  };
  
  const getValueColor = (value: number) => {
    if (value > 100) return "text-emerald-600";
    if (value < 40) return "text-rose-600";
    return "";
  }
  
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today - show time only
      return new Intl.DateTimeFormat('en-US', { 
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } else if (diffDays < 7) {
      // Within a week - show day and time
      return new Intl.DateTimeFormat('en-US', { 
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } else {
      // Older - show date and time
      return new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    }
  };
  
  const getTimeAgo = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    }
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours} hr${diffHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
    
    return formatDate(date);
  };

  return (
    <Card className="overflow-hidden border-border/60">
      <ScrollArea style={{ maxHeight }}>
        <Table>
          <TableHeader className="bg-muted/50 sticky top-0">
            <TableRow>
              <TableHead className="w-[110px] font-medium text-xs">Channel</TableHead>
              <TableHead className="font-medium text-xs">Value</TableHead>
              <TableHead className="text-right font-medium w-[110px] text-xs">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  <div className="flex flex-col items-center justify-center h-20 gap-2">
                    <BarChart3 className="h-5 w-5 text-muted-foreground/50" />
                    <p className="text-sm">No data points available</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((point) => (
                <TableRow key={point.id} className="hover:bg-muted/30 group">
                  <TableCell className="py-2.5">
                    <div className="flex items-center gap-1.5">
                      {getCategoryIcon(point.category)}
                      <Badge variant="outline" size="sm" className={`${getCategoryColor(point.category)} text-xs px-2 py-0 h-5`}>
                        {point.category}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium py-2.5">
                    <div className="flex items-center gap-1.5">
                      {getTrendIcon(point.value)}
                      <span className={`${getValueColor(point.value)}`}>{point.value}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-xs whitespace-nowrap py-2.5">
                    <div className="flex items-center justify-end gap-1 group-hover:hidden">
                      <Clock className="h-3 w-3 opacity-70" />
                      {formatDate(point.timestamp.toString())}
                    </div>
                    <div className="hidden group-hover:flex items-center justify-end gap-1 text-primary">
                      <span>{getTimeAgo(point.timestamp.toString())}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
}
