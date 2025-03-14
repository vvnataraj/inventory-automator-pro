
import { useInventoryCore } from "./inventory/useInventoryCore";
import { useInventoryItemActions } from "./inventory/useInventoryItemActions";
import { useInventoryReordering } from "./inventory/useInventoryReordering";
import { InventoryItem, SortField, SortDirection } from "@/types/inventory";

export function useInventoryItems(
  page: number = 1, 
  searchQuery: string = "",
  sortField: SortField = 'name',
  sortDirection: SortDirection = 'asc',
  categoryFilter?: string
) {
  const { 
    items, 
    setItems,
    totalItems, 
    setTotalItems,
    isLoading, 
    setIsLoading,
    error,
    fetchItems,
    refreshData
  } = useInventoryCore(
    page, 
    searchQuery,
    sortField,
    sortDirection,
    categoryFilter
  );
  
  const { 
    updateItem,
    addItem,
    deleteItem
  } = useInventoryItemActions(
    items,
    setItems,
    setIsLoading,
    setTotalItems,
    refreshData
  );
  
  const {
    reorderItem,
    reorderStock,
    reactivateAllItems
  } = useInventoryReordering(
    items,
    setItems,
    setIsLoading,
    fetchItems
  );
  
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
    fetchItems,
    reactivateAllItems,
    refresh: refreshData
  };
}
