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
import { Card } from "@/components/ui/card";
import { BarChart3, Calendar, ArrowUp, ArrowDown, ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DataGridProps {
  data: DataPoint[];
  maxHeight?: string;
}

export function DataGrid({ data, maxHeight = "400px" }: DataGridProps) {
  const getCategoryColor = (category: string) => {
    const categories: Record<string, string> = {
      social: "bg-blue-100 text-blue-800",
      email: "bg-purple-100 text-purple-800",
      search: "bg-green-100 text-green-800",
      direct: "bg-amber-100 text-amber-800",
      referral: "bg-indigo-100 text-indigo-800",
    };
    
    return categories[category.toLowerCase()] || "bg-gray-100 text-gray-800";
  };
  
  const getTrendIcon = (value: number) => {
    if (value > 75) return <ArrowUp className="h-3 w-3 text-green-500" />;
    if (value < 30) return <ArrowDown className="h-3 w-3 text-red-500" />;
    return <ArrowRight className="h-3 w-3 text-amber-500" />;
  };
  
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card className="overflow-hidden">
      <ScrollArea style={{ maxHeight }}>
        <Table>
          <TableHeader className="bg-muted/50 sticky top-0">
            <TableRow>
              <TableHead className="w-[150px] font-medium">Category</TableHead>
              <TableHead className="font-medium">Value</TableHead>
              <TableHead className="text-right font-medium w-[140px]">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  No data points available
                </TableCell>
              </TableRow>
            ) : (
              data.map((point) => (
                <TableRow key={point.id} className="hover:bg-muted/30">
                  <TableCell>
                    <Badge variant="outline" className={`${getCategoryColor(point.category)}`}>
                      {point.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-1.5">
                      {getTrendIcon(point.value)}
                      <span>{point.value}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-xs whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(point.timestamp.toString())}
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
