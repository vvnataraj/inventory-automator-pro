
import { useState } from "react";
import { getPurchases } from "@/data/inventoryData";
import { Purchase } from "@/types/purchase";

export function usePurchases(initialPage = 1, initialSearchQuery = "") {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch purchases based on current page and search query
  const { items: purchases, total: totalPurchases } = getPurchases(
    currentPage,
    20, // pageSize
    searchQuery
  );
  
  // Update purchase (in a real app, this would send data to an API)
  const updatePurchase = (updatedPurchase: Purchase) => {
    console.log("Updating purchase:", updatedPurchase);
    // In a real app, this would update the database
  };
  
  return {
    purchases,
    totalPurchases,
    currentPage,
    searchQuery,
    isLoading,
    setCurrentPage,
    setSearchQuery,
    updatePurchase
  };
}
