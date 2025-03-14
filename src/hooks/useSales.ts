
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSales } from "@/data/salesData";
import { Sale, SaleStatus } from "@/types/sale";

export function useSales(
  initialPage: number = 1,
  initialPageSize: number = 10,
  initialSearchQuery: string = "",
  initialStatusFilter?: SaleStatus
) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [statusFilter, setStatusFilter] = useState<SaleStatus | undefined>(initialStatusFilter);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['sales', page, pageSize, searchQuery, statusFilter],
    queryFn: async () => {
      const result = await getSales(page, pageSize, searchQuery);
      // Note: In a real app, we would pass statusFilter to getSales and filter on the server
      // For the demo app, we're filtering here
      if (statusFilter && result.items) {
        const filteredItems = result.items.filter(sale => sale.status === statusFilter);
        return {
          items: filteredItems,
          total: filteredItems.length
        };
      }
      return result;
    }
  });
  
  const addSale = (newSale: Sale) => {
    refetch();
  };
  
  return {
    sales: data?.items || [],
    totalSales: data?.total || 0,
    isLoading,
    error,
    page,
    pageSize,
    searchQuery,
    statusFilter,
    setPage,
    setPageSize,
    setSearchQuery,
    setStatusFilter,
    addSale,
    refetch
  };
}
