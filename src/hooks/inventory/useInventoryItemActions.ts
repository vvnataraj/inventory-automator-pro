
import { useCallback } from "react";
import { InventoryItem } from "@/types/inventory";
import { toast } from "sonner";
import { useInventoryOperations } from "./useInventoryOperations";

export function useInventoryItemActions(
  items: InventoryItem[],
  setItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setTotalItems: React.Dispatch<React.SetStateAction<number>>,
  refreshData: () => void
) {
  const { updateItem, addItem, deleteItem } = useInventoryOperations();

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
  }, [updateItem, setItems, setIsLoading]);

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
  }, [deleteItem, setItems, setTotalItems]);

  return {
    updateItem: updateItemWrapper,
    addItem: addItemWrapper,
    deleteItem: deleteItemWrapper
  };
}
