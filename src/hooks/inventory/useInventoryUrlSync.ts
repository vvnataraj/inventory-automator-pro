
import { useState, useEffect } from "react";
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
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Sync URL parameters with state, but only fetch once
  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || undefined;
    const location = searchParams.get("location") || undefined;
    const sort = searchParams.get("sort") as SortField || "name";
    const order = searchParams.get("order") as SortDirection || "asc";
    const view = searchParams.get("view") as "grid" | "table" || "table";
    
    setCurrentPage(page);
    setSearchQuery(search);
    setCategoryFilter(category);
    setLocationFilter(location);
    setSortField(sort);
    setSortDirection(order);
    setViewMode(view);
    
    // Only call fetchItems once during initial load
    if (!initialLoadComplete) {
      fetchItems().catch(err => console.error("Error fetching items:", err));
      setInitialLoadComplete(true);
    }
  }, [searchParams, setSearchQuery, setCategoryFilter, setLocationFilter, setSortField, setSortDirection, setViewMode, fetchItems, initialLoadComplete]);
  
  // Reset to page 1 when filters change, but don't fetch
  useEffect(() => {
    setCurrentPage(1);
  }, [searchParams.get("search"), searchParams.get("category"), searchParams.get("location")]);
  
  return {
    currentPage,
    setCurrentPage
  };
}
