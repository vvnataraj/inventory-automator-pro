
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Order, OrderStatus } from "@/types/order";
import { getOrders } from "@/data/orderData";

export const useOrders = (initialPage = 1, initialPageSize = 10) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>(undefined);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['orders', page, pageSize, searchQuery, statusFilter],
    queryFn: () => getOrders(page, pageSize, searchQuery, statusFilter),
  });
  
  return {
    orders: data?.items || [],
    totalOrders: data?.total || 0,
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
    refetch,
  };
};
