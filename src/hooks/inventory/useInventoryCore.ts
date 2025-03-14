
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
  // Add refs to track previous parameters to detect real changes
  const prevParamsRef = useRef({ page, searchQuery, sortField, sortDirection });
  // Track the first fetch
  const initialFetchDoneRef = useRef(false);
  
  const { fetchFromSupabase, fetchFromLocal } = useInventoryDatabase();
  
  const fetchItems = useCallback(async (forceRefresh = false): Promise<void> => {
    // Prevent duplicate fetches unless forced
    if (isFetchingRef.current && !forceRefresh) {
      console.log("Already fetching, skip duplicate request");
      return Promise.resolve();
    }
    
    // Compare with previous parameters to avoid unnecessary fetches
    const prevParams = prevParamsRef.current;
    const paramsUnchanged = 
      prevParams.page === page && 
      prevParams.searchQuery === searchQuery && 
      prevParams.sortField === sortField && 
      prevParams.sortDirection === sortDirection;
      
    // Skip duplicate fetch calls with the same parameters unless forced
    if (initialFetchDoneRef.current && !forceRefresh && paramsUnchanged) {
      console.log("Parameters unchanged, skipping fetch");
      return Promise.resolve();
    }
    
    console.log("Fetching inventory items with params:", {
      page, searchQuery, sortField, sortDirection, 
      forceRefresh, initialFetchDone: initialFetchDoneRef.current
    });
    
    // Update previous parameters
    prevParamsRef.current = { page, searchQuery, sortField, sortDirection };
    
    isFetchingRef.current = true;
    setIsLoading(true);
    
    try {
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
      initialFetchDoneRef.current = true;
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
    
    return Promise.resolve();
  }, [page, searchQuery, sortField, sortDirection, fetchFromSupabase, fetchFromLocal]);
  
  // Create a separate method to explicitly trigger refresh
  const refreshData = useCallback((): Promise<void> => {
    setLastRefresh(Date.now());
    console.log("Explicitly refreshing data with refreshData()");
    return fetchItems(true); // Always force refresh when explicitly called
  }, [fetchItems]);

  // Use a single effect to fetch items and avoid multiple triggers
  useEffect(() => {
    // Only fetch on mount or when parameters actually change
    if (!initialFetchDoneRef.current || 
        prevParamsRef.current.page !== page || 
        prevParamsRef.current.searchQuery !== searchQuery ||
        prevParamsRef.current.sortField !== sortField ||
        prevParamsRef.current.sortDirection !== sortDirection) {
      fetchItems();
    }
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
