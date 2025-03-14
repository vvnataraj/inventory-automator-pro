
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { SortField, SortDirection } from "@/types/inventory";

export function useInventoryUrlSync(
  setSearchQuery: (query: string) => void,
  setCategoryFilter: (category: string | undefined) => void,
  setLocationFilter: (location: string | undefined) => void,
  setSortField: (field: SortField) => void,
  setSortDirection: (direction: SortDirection) => void,
  setViewMode: (mode: "grid" | "table") => void,
  fetchItems: () => Promise<void>
) {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const initialSyncDoneRef = useRef(false);
  
  // Sync URL parameters with state only once during initial load
  useEffect(() => {
    if (initialSyncDoneRef.current) {
      return;
    }
    
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") as SortField || "name";
    const order = searchParams.get("order") as SortDirection || "asc";
    const view = searchParams.get("view") as "grid" | "table" || "table";
    
    console.log("Initial URL sync with params:", { page, search, sort, order, view });
    
    setCurrentPage(page);
    setSearchQuery(search);
    setSortField(sort);
    setSortDirection(order);
    setViewMode(view);
    
    // Mark initial sync as done to prevent repeated syncs
    initialSyncDoneRef.current = true;
    
    // Initial data fetch
    fetchItems().catch(err => console.error("Error fetching items:", err));
  }, [searchParams, setSearchQuery, setSortField, setSortDirection, setViewMode, fetchItems]);
  
  // Update page when URL params change, but don't trigger data fetch
  useEffect(() => {
    if (!initialSyncDoneRef.current) {
      return;
    }
    
    const page = parseInt(searchParams.get("page") || "1");
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  }, [searchParams, currentPage]);
  
  return {
    currentPage,
    setCurrentPage
  };
}
