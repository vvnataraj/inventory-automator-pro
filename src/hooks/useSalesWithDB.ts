
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Sale, SaleStatus } from "@/types/sale";
import { 
  fetchSales, 
  fetchTotalSales, 
  addSale, 
  updateSale, 
  deleteSale 
} from "@/services/salesApi";

export const useSales = (
  page = 1, 
  pageSize = 10, 
  searchQuery = ""
) => {
  const [currentPage, setCurrentPage] = useState(page);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);

  // Query for sales
  const { data: sales = [], isLoading, error } = useQuery({
    queryKey: ['sales', currentPage, itemsPerPage, searchQuery],
    queryFn: () => fetchSales(currentPage, itemsPerPage, searchQuery),
  });

  // Query for total sales count
  const { data: totalSales = 0 } = useQuery({
    queryKey: ['salesCount', searchQuery],
    queryFn: () => fetchTotalSales(searchQuery),
  });

  // Mutations
  const queryClient = useQueryClient();
  
  const { mutateAsync: addSaleMutation } = useMutation({
    mutationFn: addSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['salesCount'] });
    },
  });

  const { mutateAsync: updateSaleMutation } = useMutation({
    mutationFn: updateSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
    },
  });

  const { mutateAsync: deleteSaleMutation } = useMutation({
    mutationFn: deleteSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['salesCount'] });
    },
  });

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setItemsPerPage(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return {
    sales,
    totalSales,
    isLoading,
    error,
    page: currentPage,
    pageSize: itemsPerPage,
    setPage: handlePageChange,
    setPageSize: handlePageSizeChange,
    addSale: addSaleMutation,
    updateSale: updateSaleMutation,
    deleteSale: deleteSaleMutation,
  };
};
