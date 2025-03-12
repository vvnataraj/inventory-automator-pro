
import { useState, useEffect, useCallback } from "react";
import { InventoryItem, SortField, SortDirection } from "@/types/inventory";
import { getInventoryItems, inventoryItems } from "@/data/inventoryData";

export function useInventoryItems(
  page: number = 1, 
  searchQuery: string = "",
  sortField: SortField = 'name',
  sortDirection: SortDirection = 'asc'
) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchItems = useCallback(() => {
    setIsLoading(true);
    try {
      const result = getInventoryItems(page, 20, searchQuery);
      const sortedItems = [...result.items].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (aValue === undefined || bValue === undefined) return 0;
        
        const comparison = typeof aValue === 'string' 
          ? aValue.localeCompare(bValue as string)
          : Number(aValue) - Number(bValue);
          
        return sortDirection === 'asc' ? comparison : -comparison;
      });
      
      setItems(sortedItems);
      setTotalItems(result.total);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch inventory items"));
      console.error("Failed to fetch inventory items:", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, sortField, sortDirection]);
  
  useEffect(() => {
    const timeoutId = setTimeout(fetchItems, 500);
    return () => clearTimeout(timeoutId);
  }, [fetchItems]);
  
  const updateItem = useCallback((updatedItem: InventoryItem) => {
    // Update in-memory items first
    setItems(currentItems => 
      currentItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    
    // Update the global inventory items array
    const itemIndex = inventoryItems.findIndex(item => item.id === updatedItem.id);
    if (itemIndex !== -1) {
      inventoryItems[itemIndex] = updatedItem;
    }
  }, []);
  
  const addItem = useCallback((newItem: InventoryItem) => {
    // Add to global inventory items array
    inventoryItems.unshift(newItem);
    
    // Add to current items if it should appear on the current page
    setItems(currentItems => {
      // If we're on the first page, add the item to the top
      if (page === 1) {
        return [newItem, ...currentItems.slice(0, -1)]; // Remove last item to maintain page size
      }
      return currentItems;
    });
    
    // Update total count
    setTotalItems(prev => prev + 1);
  }, [page]);
  
  return { items, totalItems, isLoading, error, updateItem, addItem };
}
