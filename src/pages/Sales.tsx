
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MainLayout } from "@/components/layout/MainLayout";
import { SalesTable } from "@/components/sales/SalesTable";
import { CreateSaleModal } from "@/components/sales/CreateSaleModal";
import { SalesAnalytics } from "@/components/sales/SalesAnalytics";
import { Search, Filter, ArrowUpDown, PlusCircle, Rows, GripHorizontal, ChevronUp, ChevronDown } from "lucide-react";
import { useSales } from "@/hooks/useSales";
import { Card, CardContent } from "@/components/ui/card";
import { Sale, SaleStatus } from "@/types/sale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortField = "saleNumber" | "customerName" | "date" | "total" | "status";
type SortDirection = "asc" | "desc";

export default function Sales() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [statusFilter, setStatusFilter] = useState<SaleStatus | undefined>(undefined);
  
  const { sales, totalSales, isLoading, addSale } = useSales(currentPage, 10, searchQuery);

  const handleCreateSale = (newSale) => {
    addSale(newSale);
    setIsCreateModalOpen(false);
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedSales = () => {
    return [...sales].sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (sortField) {
        case "saleNumber":
          valueA = a.saleNumber;
          valueB = b.saleNumber;
          break;
        case "customerName":
          valueA = a.customerName;
          valueB = b.customerName;
          break;
        case "date":
          valueA = new Date(a.date).getTime();
          valueB = new Date(b.date).getTime();
          break;
        case "total":
          valueA = a.total;
          valueB = b.total;
          break;
        case "status":
          valueA = a.status;
          valueB = b.status;
          break;
        default:
          valueA = new Date(a.date).getTime();
          valueB = new Date(b.date).getTime();
      }

      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Sales</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            New Sale
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {viewMode === "grid" ? (
                  <GripHorizontal className="h-4 w-4" />
                ) : (
                  <Rows className="h-4 w-4" />
                )}
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Layout</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setViewMode("grid")}>
                <GripHorizontal className="h-4 w-4 mr-2" />
                Grid View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode("table")}>
                <Rows className="h-4 w-4 mr-2" />
                Table View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <SalesAnalytics sales={sales} />
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sales..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleSort('saleNumber')}>
                Sale Number
                {sortField === 'saleNumber' && (
                  sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('customerName')}>
                Customer Name
                {sortField === 'customerName' && (
                  sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('date')}>
                Date
                {sortField === 'date' && (
                  sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('total')}>
                Total
                {sortField === 'total' && (
                  sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('status')}>
                Status
                {sortField === 'status' && (
                  sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />
                )}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setSortDirection('asc')}>
                Ascending
                {sortDirection === 'asc' && <ChevronUp className="h-4 w-4 ml-auto" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortDirection('desc')}>
                Descending
                {sortDirection === 'desc' && <ChevronDown className="h-4 w-4 ml-auto" />}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {viewMode === "table" ? (
        <SalesTable 
          sales={getSortedSales()} 
          isLoading={isLoading}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getSortedSales().map((sale) => (
            <Card key={sale.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold">{sale.saleNumber}</h3>
                    <p className="text-sm text-muted-foreground">{sale.customerName}</p>
                  </div>
                  <div className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                    {sale.status}
                  </div>
                </div>
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{new Date(sale.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items:</span>
                    <span>{sale.items.length}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span>Total:</span>
                    <span>${sale.total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm">View</Button>
                  <Button variant="outline" size="sm">Invoice</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{" "}
          <span className="font-medium">{Math.min(currentPage * 10, totalSales)}</span> of{" "}
          <span className="font-medium">{totalSales}</span> sales
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(totalSales / 10)))}
            disabled={currentPage === Math.ceil(totalSales / 10)}
          >
            Next
          </Button>
        </div>
      </div>

      <CreateSaleModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onCreateSale={handleCreateSale}
      />
    </MainLayout>
  );
}
