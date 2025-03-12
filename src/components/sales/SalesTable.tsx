
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, FileText, ChevronUp, ChevronDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Sale } from "@/types/sale";
import { SaleStatusBadge } from "./SaleStatusBadge";

interface SalesTableProps {
  sales: Sale[];
  isLoading: boolean;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (field: string) => void;
}

export const SalesTable: React.FC<SalesTableProps> = ({ 
  sales, 
  isLoading, 
  sortField, 
  sortDirection, 
  onSort 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <p className="text-muted-foreground">No sales found</p>
      </div>
    );
  }

  const SortableHeader = ({ field, label }: { field: string, label: string }) => {
    const isSorted = sortField === field;

    return (
      <TableHead 
        className={`py-3 px-4 ${onSort ? 'cursor-pointer hover:bg-muted/50' : ''}`}
        onClick={() => onSort && onSort(field)}
      >
        <div className="flex items-center gap-1">
          {label}
          {isSorted && (
            sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </TableHead>
    );
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader field="saleNumber" label="Sale ID" />
            <SortableHeader field="customerName" label="Customer" />
            <SortableHeader field="date" label="Date" />
            <TableHead>Items</TableHead>
            <SortableHeader field="total" label="Total" />
            <SortableHeader field="status" label="Status" />
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell className="font-medium">{sale.saleNumber}</TableCell>
              <TableCell>{sale.customerName}</TableCell>
              <TableCell>{formatDistanceToNow(new Date(sale.date), { addSuffix: true })}</TableCell>
              <TableCell>{sale.items.length} items</TableCell>
              <TableCell>${sale.total.toFixed(2)}</TableCell>
              <TableCell>
                <SaleStatusBadge status={sale.status} />
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button variant="ghost" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Invoice
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
