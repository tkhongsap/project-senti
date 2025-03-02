import { DataPoint } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataGridProps {
  data: DataPoint[];
}

export function DataGrid({ data }: DataGridProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((point) => (
            <TableRow key={point.id}>
              <TableCell>{point.category}</TableCell>
              <TableCell>{point.value}</TableCell>
              <TableCell>
                {new Date(point.timestamp).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
