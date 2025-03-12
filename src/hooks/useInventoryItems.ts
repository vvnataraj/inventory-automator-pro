
import { useState, useEffect, useCallback } from "react";
import { InventoryItem, SortField, SortDirection } from "@/types/inventory";
import { getInventoryItems } from "@/data/inventoryData";

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
    setItems(currentItems => 
      currentItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  }, []);
  
  return { items, totalItems, isLoading, error, updateItem };
}
