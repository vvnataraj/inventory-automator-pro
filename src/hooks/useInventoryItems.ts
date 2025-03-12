
import { useState, useEffect, useCallback } from "react";
import { InventoryItem } from "@/types/inventory";
import { getInventoryItems } from "@/data/inventoryData";

export function useInventoryItems(page: number = 1, searchQuery: string = "") {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchItems = useCallback(() => {
    setIsLoading(true);
    try {
      const result = getInventoryItems(page, 20, searchQuery);
      setItems(result.items);
      setTotalItems(result.total);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch inventory items"));
      console.error("Failed to fetch inventory items:", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery]);
  
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
