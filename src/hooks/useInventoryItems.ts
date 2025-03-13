
import { useState, useEffect, useCallback, useRef } from "react";
import { InventoryItem, SortField, SortDirection } from "@/types/inventory";
import { inventoryItems } from "@/data/inventoryData";
import { toast } from "sonner";
import { useInventoryDatabase } from "./inventory/useInventoryDatabase";
import { useInventoryOperations } from "./inventory/useInventoryOperations";
import { useInventorySpecialOps } from "./inventory/useInventorySpecialOps";

export function useInventoryItems(
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
  
  const { fetchFromSupabase, fetchFromLocal } = useInventoryDatabase();
  const { updateItem, addItem, deleteItem } = useInventoryOperations();
  const { reorderItem: reorderItemBase, reorderStock: reorderStockBase, reactivateAllItems: reactivateAllItemsBase } = useInventorySpecialOps();
  
  const fetchItems = useCallback(async (forceRefresh = false) => {
    // Prevent duplicate fetches
    if (isFetchingRef.current && !forceRefresh) return;
    
    isFetchingRef.current = true;
    setIsLoading(true);
    
    try {
      console.log("Fetching items with params:", {
        page, searchQuery, sortField, sortDirection, categoryFilter, locationFilter
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
    }
  }, [page, searchQuery, sortField, sortDirection, categoryFilter, locationFilter, fetchFromSupabase, fetchFromLocal]);
  
  // Modified dependency array to prevent continuous refresh
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchItems();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [page, searchQuery, sortField, sortDirection, categoryFilter, locationFilter, fetchItems]);
  
  // Removed lastRefresh from the dependency array above
  // and created a separate method to explicitly trigger refresh
  const refreshData = useCallback(() => {
    setLastRefresh(Date.now());
    fetchItems(true);
  }, [fetchItems]);
  
  const reorderItemWrapper = useCallback((itemId: string, direction: 'up' | 'down') => {
    reorderItemBase(items, setItems, itemId, direction);
  }, [items, reorderItemBase]);
  
  const reorderStockWrapper = useCallback(async (item: InventoryItem, quantity: number = 0) => {
    const updatedItem = await reorderStockBase(item, quantity);
    setItems(currentItems => 
      currentItems.map(currentItem => 
        currentItem.id === updatedItem.id ? updatedItem : currentItem
      )
    );
    return updatedItem;
  }, [reorderStockBase]);
  
  const reactivateAllItemsWrapper = useCallback(async () => {
    setIsLoading(true);
    try {
      await reactivateAllItemsBase();
      
      // Update local inventory items
      inventoryItems.forEach(item => {
        if (!item.isActive) {
          item.isActive = true;
          item.lastUpdated = new Date().toISOString();
        }
      });
      
      await fetchItems(true);
      
      return true;
    } catch (error) {
      console.error("Failed to reactivate items:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [reactivateAllItemsBase, fetchItems]);

  const updateItemWrapper = useCallback(async (updatedItem: InventoryItem) => {
    setIsLoading(true);
    try {
      const success = await updateItem(updatedItem);
      if (success) {
        console.log("Item updated successfully, refreshing item list");
        
        // Update local state immediately for a responsive UI
        setItems(currentItems => 
          currentItems.map(item => 
            item.id === updatedItem.id ? updatedItem : item
          )
        );
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error in updateItemWrapper:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [updateItem]);

  const addItemWrapper = useCallback(async (newItem: InventoryItem) => {
    const success = await addItem(newItem);
    if (success) {
      refreshData(); // Use the new refresh method
      return true;
    }
    return false;
  }, [addItem, refreshData]);

  const deleteItemWrapper = useCallback(async (itemId: string) => {
    const success = await deleteItem(itemId);
    if (success) {
      setItems(currentItems => 
        currentItems.filter(item => item.id !== itemId)
      );
      setTotalItems(prev => prev - 1);
      return true;
    }
    return false;
  }, [deleteItem]);
  
  return { 
    items, 
    totalItems, 
    isLoading, 
    error, 
    updateItem: updateItemWrapper, 
    addItem: addItemWrapper, 
    deleteItem: deleteItemWrapper,
    reorderItem: reorderItemWrapper,
    reorderStock: reorderStockWrapper,
    fetchItems,
    reactivateAllItems: reactivateAllItemsWrapper,
    refresh: refreshData  // Use the new refresh method
  };
}
