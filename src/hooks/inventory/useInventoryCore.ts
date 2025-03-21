
import { useState, useCallback, useRef, useEffect } from "react";
import { InventoryItem, SortField, SortDirection } from "@/types/inventory";
import { toast } from "sonner";
import { useInventoryDatabase } from "./useInventoryDatabase";
import { supabase } from "@/integrations/supabase/client";

export function useInventoryCore(
  page: number = 1, 
  searchQuery: string = "",
  sortField: SortField = 'name',
  sortDirection: SortDirection = 'asc',
  categoryFilter?: string,
  locationFilter?: string
) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  
  // Add a ref to track if we're currently fetching to prevent duplicate requests
  const isFetchingRef = useRef(false);
  // Add a ref to track current page to detect changes
  const currentPageRef = useRef(page);
  
  const { fetchFromSupabase, fetchFromLocal } = useInventoryDatabase();
  
  const fetchItems = useCallback(async (forceRefresh = false) => {
    // Prevent duplicate fetches unless forced
    if (isFetchingRef.current && !forceRefresh) {
      console.log("Already fetching, skip duplicate request");
      return;
    }
    
    console.log("Fetching inventory items with forceRefresh:", forceRefresh);
    console.log("Current page:", page);
    console.log("Search query:", searchQuery);
    console.log("Category filter:", categoryFilter);
    console.log("Location filter:", locationFilter);
    
    isFetchingRef.current = true;
    setIsLoading(true);
    
    try {
      console.log("Fetching items with params:", {
        page, 
        searchQuery, 
        sortField, 
        sortDirection,
        categoryFilter,
        locationFilter
      });
      
      // Try to fetch from Supabase first
      const { items: dbItems, count, error: dbError } = await fetchFromSupabase(
        page, searchQuery, sortField, sortDirection, categoryFilter, locationFilter
      );
      
      if (dbError || dbItems.length === 0) {
        // Fallback to local data if Supabase fetch fails or returns no results
        console.log("Falling back to local data");
        const { items: localItems, total } = fetchFromLocal(
          page, searchQuery, sortField, sortDirection, categoryFilter, locationFilter
        );
        
        setItems(localItems);
        setTotalItems(total);
        
        if (dbError) {
          console.error("Supabase error:", dbError);
          toast.error("Failed to fetch items from database, using local data");
        }
      } else {
        setItems(dbItems);
        setTotalItems(count);
        console.log("Fetched items from Supabase:", dbItems.length);
      }
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch inventory items"));
      console.error("Failed to fetch inventory items:", err);
      
      // Fallback to local data
      const { items: localItems, total } = fetchFromLocal(
        page, searchQuery, sortField, sortDirection, categoryFilter, locationFilter
      );
      
      setItems(localItems);
      setTotalItems(total);
      
      toast.error("Failed to fetch items from database, using local data");
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
      // Update the current page ref after fetch completes
      currentPageRef.current = page;
    }
  }, [page, searchQuery, sortField, sortDirection, categoryFilter, locationFilter, fetchFromSupabase, fetchFromLocal]);
  
  // Create a separate method to explicitly trigger refresh
  const refreshData = useCallback(() => {
    setLastRefresh(Date.now());
    console.log("Explicitly refreshing data with refreshData()");
    console.log("Current page:", page);
    console.log("Current search query:", searchQuery);
    console.log("Current filters - category:", categoryFilter, "location:", locationFilter);
    fetchItems(true); // Always force refresh when explicitly called
  }, [fetchItems, categoryFilter, locationFilter, searchQuery, page]);

  // Use effect to fetch items when dependencies change
  useEffect(() => {
    console.log("Dependencies changed, fetching items...");
    console.log("Current page:", page);
    console.log("Previous page ref:", currentPageRef.current);
    console.log("Current search query:", searchQuery);
    console.log("Current category filter:", categoryFilter);
    
    // Force refresh if page changed
    const pageChanged = currentPageRef.current !== page;
    fetchItems(pageChanged);
  }, [page, searchQuery, sortField, sortDirection, categoryFilter, locationFilter, fetchItems]);

  return { 
    items, 
    setItems,
    totalItems, 
    setTotalItems,
    isLoading, 
    setIsLoading,
    error,
    fetchItems,
    refreshData
  };
}
