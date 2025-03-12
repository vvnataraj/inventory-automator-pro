
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SalesTable } from "@/components/sales/SalesTable";
import { SalesGrid } from "@/components/sales/SalesGrid";
import { SalesHeader } from "@/components/sales/SalesHeader";
import { SalesPagination } from "@/components/sales/SalesPagination";
import { CreateSaleModal } from "@/components/sales/CreateSaleModal";
import { useSales } from "@/hooks/useSales";
import { ListControls, ViewMode } from "@/components/common/ListControls";
import { Sale, SaleStatus } from "@/types/sale";

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
      <SalesHeader onCreateSale={() => setIsCreateModalOpen(true)} />

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
        <SalesGrid sales={getSortedSales()} />
      )}

      <SalesPagination 
        currentPage={currentPage}
        totalItems={totalSales}
        pageSize={10}
        onPageChange={setCurrentPage}
      />

      <CreateSaleModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onCreateSale={handleCreateSale}
      />
    </MainLayout>
  );
}
