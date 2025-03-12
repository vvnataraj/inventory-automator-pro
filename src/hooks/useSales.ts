
import { useState, useEffect, useCallback } from "react";
import { getSales } from "@/data/salesData";
import { Sale } from "@/types/sale";

export function useSales(
  initialPage: number = 1,
  initialPageSize: number = 10,
  initialSearchQuery: string = ""
) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [sales, setSales] = useState<Sale[]>([]);
  const [totalSales, setTotalSales] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchSales = useCallback(() => {
    setIsLoading(true);
    try {
      const result = getSales(page, pageSize, searchQuery);
      setSales(result.items);
      setTotalSales(result.total);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch sales data"));
      console.error("Failed to fetch sales data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchQuery]);
  
  useEffect(() => {
    const timeoutId = setTimeout(fetchSales, 500);
    return () => clearTimeout(timeoutId);
  }, [fetchSales]);
  
  const addSale = useCallback((newSale: Sale) => {
    setSales(currentSales => [newSale, ...currentSales.slice(0, -1)]);
    setTotalSales(prev => prev + 1);
  }, []);
  
  return {
    sales,
    totalSales,
    isLoading,
    error,
    page,
    pageSize,
    searchQuery,
    setPage,
    setPageSize,
    setSearchQuery,
    addSale,
    refetch: fetchSales
  };
}
