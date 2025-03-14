
import { useState, useCallback, useRef, useEffect } from "react";
import { InventoryItem, SortField, SortDirection } from "@/types/inventory";
import { toast } from "sonner";
import { useInventoryDatabase } from "./useInventoryDatabase";
import { supabase } from "@/integrations/supabase/client";

export function useInventoryCore(
  page: number = 1, 
  searchQuery: string = "",
  sortField: SortField = 'name',
  sortDirection: SortDirection = 'asc'
) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  
  // Add a ref to track if we're currently fetching to prevent duplicate requests
  const isFetchingRef = useRef(false);
  
  const { fetchFromSupabase, fetchFromLocal } = useInventoryDatabase();
  
  const fetchItems = useCallback(async (forceRefresh = false) => {
    // Prevent duplicate fetches unless forced
    if (isFetchingRef.current && !forceRefresh) {
      console.log("Already fetching, skip duplicate request");
      return;
    }
    
    console.log("Fetching inventory items with forceRefresh:", forceRefresh);
    
    isFetchingRef.current = true;
    setIsLoading(true);
    
    try {
      console.log("Fetching items with params:", {
        page, 
        searchQuery, 
        sortField, 
        sortDirection
      });
      
      // Try to fetch from Supabase first
      const { items: dbItems, count, error: dbError } = await fetchFromSupabase(
        page, searchQuery, sortField, sortDirection
      );
      
      if (dbError || dbItems.length === 0) {
        // Fallback to local data if Supabase fetch fails or returns no results
        console.log("Falling back to local data");
        const { items: localItems, total } = fetchFromLocal(
          page, searchQuery, sortField, sortDirection
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
        page, searchQuery, sortField, sortDirection
      );
      
      setItems(localItems);
      setTotalItems(total);
      
      toast.error("Failed to fetch items from database, using local data");
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [page, searchQuery, sortField, sortDirection, fetchFromSupabase, fetchFromLocal]);
  
  // Create a separate method to explicitly trigger refresh
  const refreshData = useCallback(() => {
    setLastRefresh(Date.now());
    console.log("Explicitly refreshing data with refreshData()");
    fetchItems(true); // Always force refresh when explicitly called
  }, [fetchItems]);

  // Use effect to fetch items when dependencies change
  useEffect(() => {
    console.log("Dependencies changed, fetching items...");
    fetchItems();
  }, [page, searchQuery, sortField, sortDirection, fetchItems]);

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
