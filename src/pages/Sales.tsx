import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SalesTable } from "@/components/sales/SalesTable";
import { CreateSaleModal } from "@/components/sales/CreateSaleModal";
import { useSales } from "@/hooks/useSales";
import { Card, CardContent } from "@/components/ui/card";
import { Sale, SaleStatus } from "@/types/sale";
import { ListControls, ViewMode } from "@/components/common/ListControls";

type SortField = "saleNumber" | "customerName" | "date" | "total" | "status";
type SortDirection = "asc" | "desc";

export default function Sales() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [statusFilter, setStatusFilter] = useState<SaleStatus | undefined>(undefined);
  
  const { sales, totalSales, isLoading, addSale } = useSales(currentPage, 10, searchQuery);

  const handleCreateSale = (newSale: any) => {
    addSale(newSale);
    setIsCreateModalOpen(false);
  };

  const handleSort = (field: string) => {
    const saleField = field as SortField;
    if (saleField === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(saleField);
      setSortDirection('asc');
    }
  };

  const sortOptions = [
    { field: 'saleNumber', label: 'Sale Number' },
    { field: 'customerName', label: 'Customer Name' },
    { field: 'date', label: 'Date' },
    { field: 'total', label: 'Total' },
    { field: 'status', label: 'Status' },
  ];

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
        </div>
      </div>

      <ListControls 
        searchPlaceholder="Search sales..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        availableViewModes={["grid", "table"]}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSort}
        onSortDirectionChange={setSortDirection}
        sortOptions={sortOptions}
      />

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
