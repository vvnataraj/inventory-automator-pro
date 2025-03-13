
import { useCallback } from "react";
import { InventoryItem } from "@/types/inventory";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useInventoryOperations } from "./useInventoryOperations";

export function useInventorySpecialOps() {
  const { updateItem } = useInventoryOperations();

  const reorderItem = useCallback((
    items: InventoryItem[],
    setItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>,
    itemId: string, 
    direction: 'up' | 'down'
  ) => {
    setItems(currentItems => {
      const itemIndex = currentItems.findIndex(item => item.id === itemId);
      if (itemIndex === -1) return currentItems;
      
      if ((direction === 'up' && itemIndex === 0) || 
          (direction === 'down' && itemIndex === currentItems.length - 1)) {
        return currentItems;
      }
      
      const newItems = [...currentItems];
      const swapIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
      
      [newItems[itemIndex], newItems[swapIndex]] = [newItems[swapIndex], newItems[itemIndex]];
      
      return newItems;
    });
  }, []);
  
  const reorderStock = useCallback(async (item: InventoryItem, quantity: number = 0) => {
    try {
      const reorderedItem = {
        ...item,
        stock: item.stock + (quantity > 0 ? quantity : Math.max(item.minStockCount, item.lowStockThreshold * 2)),
        lastUpdated: new Date().toISOString()
      };
      
      await updateItem(reorderedItem);
      
      return reorderedItem;
    } catch (error) {
      console.error("Failed to reorder stock:", error);
      toast.error("Failed to reorder stock");
      return item;
    }
  }, [updateItem]);
  
  const reactivateAllItems = useCallback(async () => {
    try {
      const { error: updateError } = await supabase
        .from('inventory_items')
        .update({ 
          is_active: true,
          last_updated: new Date().toISOString()
        })
        .eq('is_active', false);
      
      if (updateError) {
        console.error("Error updating items in Supabase:", updateError);
        throw new Error("Failed to update items");
      }
      
      return true;
    } catch (error) {
      console.error("Failed to reactivate items:", error);
      throw error;
    }
  }, []);

  return {
    reorderItem,
    reorderStock,
    reactivateAllItems
  };
}
