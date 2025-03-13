
import { useCallback } from "react";
import { InventoryItem } from "@/types/inventory";
import { useInventorySpecialOps } from "./useInventorySpecialOps";

export function useInventoryReordering(
  items: InventoryItem[],
  setItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  fetchItems: (forceRefresh?: boolean) => Promise<void>
) {
  const { reorderItem: reorderItemBase, reorderStock: reorderStockBase, reactivateAllItems: reactivateAllItemsBase } = useInventorySpecialOps();

  const reorderItemWrapper = useCallback((itemId: string, direction: 'up' | 'down') => {
    reorderItemBase(items, setItems, itemId, direction);
  }, [items, reorderItemBase, setItems]);
  
  const reorderStockWrapper = useCallback(async (item: InventoryItem, quantity: number = 0) => {
    const updatedItem = await reorderStockBase(item, quantity);
    setItems(currentItems => 
      currentItems.map(currentItem => 
        currentItem.id === updatedItem.id ? updatedItem : currentItem
      )
    );
    return updatedItem;
  }, [reorderStockBase, setItems]);
  
  const reactivateAllItemsWrapper = useCallback(async () => {
    setIsLoading(true);
    try {
      await reactivateAllItemsBase();
      
      await fetchItems(true);
      
      return true;
    } catch (error) {
      console.error("Failed to reactivate items:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [reactivateAllItemsBase, fetchItems, setIsLoading]);

  return {
    reorderItem: reorderItemWrapper,
    reorderStock: reorderStockWrapper,
    reactivateAllItems: reactivateAllItemsWrapper
  };
}
