
import { useState, useCallback } from "react";
import { InventoryItem } from "@/types/inventory";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useInventoryReordering(
  items: InventoryItem[],
  setItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  fetchItems: (forceRefresh?: boolean) => Promise<void>
) {
  const reorderItem = useCallback((itemId: string, direction: 'up' | 'down') => {
    setItems(prevItems => {
      const itemIndex = prevItems.findIndex(item => item.id === itemId);
      if (itemIndex === -1) return prevItems;
      
      if (direction === 'up' && itemIndex > 0) {
        const newItems = [...prevItems];
        [newItems[itemIndex - 1], newItems[itemIndex]] = [newItems[itemIndex], newItems[itemIndex - 1]];
        return newItems;
      } else if (direction === 'down' && itemIndex < prevItems.length - 1) {
        const newItems = [...prevItems];
        [newItems[itemIndex], newItems[itemIndex + 1]] = [newItems[itemIndex + 1], newItems[itemIndex]];
        return newItems;
      }
      
      return prevItems;
    });
  }, [setItems]);

  const reorderStock = useCallback(async (item: InventoryItem, quantity: number) => {
    try {
      setIsLoading(true);
      
      const updatedItem = {
        ...item,
        stock: item.stock + quantity,
        lastUpdated: new Date().toISOString()
      };
      
      // Try to update the item in Supabase
      const { error } = await supabase
        .from('inventory_items')
        .update({
          stock: updatedItem.stock,
          last_updated: updatedItem.lastUpdated
        })
        .eq('id', item.id);
      
      if (error) {
        console.error("Error reordering stock in Supabase:", error);
        
        // Fallback to local update
        setItems(prev => prev.map(i => 
          i.id === item.id ? updatedItem : i
        ));
        
        toast.error("Failed to update stock in database, using local data");
      } else {
        // Refresh data to ensure we're in sync with backend
        fetchItems(true);
      }
    } catch (error) {
      console.error("Failed to reorder stock:", error);
      toast.error("Failed to reorder stock");
    } finally {
      setIsLoading(false);
    }
  }, [setItems, setIsLoading, fetchItems]);

  const reactivateAllItems = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Try to reactivate all items in Supabase
      const { error } = await supabase
        .from('inventory_items')
        .update({ is_active: true })
        .eq('is_active', false);
      
      if (error) {
        console.error("Error reactivating items in Supabase:", error);
        
        // Fallback to local update
        setItems(prev => prev.map(item => ({ ...item, isActive: true })));
        
        toast.error("Failed to reactivate items in database, using local data");
      } else {
        // Refresh data to ensure we're in sync with backend
        fetchItems(true);
        
        toast.success("Successfully reactivated all inventory items");
      }
      
    } catch (error) {
      console.error("Failed to reactivate all items:", error);
      toast.error("Failed to reactivate all items");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setItems, setIsLoading, fetchItems]);

  return {
    reorderItem,
    reorderStock,
    reactivateAllItems
  };
}
