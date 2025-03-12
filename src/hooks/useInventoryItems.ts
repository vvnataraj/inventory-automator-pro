
import { useState, useEffect } from "react";
import { InventoryItem } from "@/types/inventory";
import { getInventoryItems } from "@/data/inventoryData";

export function useInventoryItems(page: number = 1, searchQuery: string = "") {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchItems = () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, we're using our mock data generator
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
    };
    
    // Add a small delay to simulate a network request
    const timeoutId = setTimeout(fetchItems, 500);
    
    return () => clearTimeout(timeoutId);
  }, [page, searchQuery]);
  
  return { items, totalItems, isLoading, error };
}
