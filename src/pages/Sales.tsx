
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MainLayout } from "@/components/layout/MainLayout";
import { SalesTable } from "@/components/sales/SalesTable";
import { CreateSaleModal } from "@/components/sales/CreateSaleModal";
import { SalesAnalytics } from "@/components/sales/SalesAnalytics";
import { Search, Filter, ArrowUpDown, PlusCircle } from "lucide-react";
import { useSales } from "@/hooks/useSales";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Sales() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { sales, totalSales, isLoading, addSale } = useSales(currentPage, 10, searchQuery);

  const handleCreateSale = (newSale) => {
    addSale(newSale);
    setIsCreateModalOpen(false);
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Sales</h1>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          New Sale
        </Button>
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
        <Button variant="outline" className="gap-2">
          <ArrowUpDown className="h-4 w-4" />
          Sort
        </Button>
      </div>

      <SalesTable 
        sales={sales} 
        isLoading={isLoading}
      />

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
