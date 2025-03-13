import { useState, useEffect, useCallback } from "react";
import { InventoryItem, SortField, SortDirection } from "@/types/inventory";
import { getInventoryItems, inventoryItems } from "@/data/inventoryData";

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
  
  const fetchItems = useCallback(() => {
    setIsLoading(true);
    try {
      const result = getInventoryItems(page, 20, searchQuery);
      
      // Apply any additional filtering
      let filteredItems = [...result.items];
      
      if (categoryFilter) {
        filteredItems = filteredItems.filter(item => 
          item.category.toLowerCase() === categoryFilter.toLowerCase()
        );
      }
      
      if (locationFilter) {
        filteredItems = filteredItems.filter(item => 
          item.location.toLowerCase() === locationFilter.toLowerCase()
        );
      }
      
      // Apply sorting
      const sortedItems = filteredItems.sort((a, b) => {
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
  }, [page, searchQuery, sortField, sortDirection, categoryFilter, locationFilter]);
  
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
  
  const deleteItem = useCallback((itemId: string) => {
    // Remove from current items
    setItems(currentItems => 
      currentItems.filter(item => item.id !== itemId)
    );
    
    // Remove from global inventory items array
    const itemIndex = inventoryItems.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      inventoryItems.splice(itemIndex, 1);
    }
    
    // Update total count
    setTotalItems(prev => prev - 1);
  }, []);
  
  // Add reordering functionality
  const reorderItem = useCallback((itemId: string, direction: 'up' | 'down') => {
    setItems(currentItems => {
      const itemIndex = currentItems.findIndex(item => item.id === itemId);
      if (itemIndex === -1) return currentItems;
      
      // Can't move first item up or last item down
      if ((direction === 'up' && itemIndex === 0) || 
          (direction === 'down' && itemIndex === currentItems.length - 1)) {
        return currentItems;
      }
      
      const newItems = [...currentItems];
      const swapIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
      
      // Swap the items
      [newItems[itemIndex], newItems[swapIndex]] = [newItems[swapIndex], newItems[itemIndex]];
      
      return newItems;
    });
  }, []);
  
  // Add stock reordering functionality
  const reorderStock = useCallback((item: InventoryItem) => {
    // In a real application, this would send an order to the supplier
    // For now, we'll simulate a reorder by updating the stock
    const reorderedItem = {
      ...item,
      stock: item.stock + Math.max(item.minStockCount, item.lowStockThreshold * 2),
      lastUpdated: new Date().toISOString()
    };

    // Update the item in our local state and global inventory
    updateItem(reorderedItem);

    return reorderedItem;
  }, [updateItem]);
  
  return { 
    items, 
    totalItems, 
    isLoading, 
    error, 
    updateItem, 
    addItem, 
    deleteItem,
    reorderItem,
    reorderStock,
    fetchItems
  };
}
