
import { useCallback } from "react";
import { InventoryItem } from "@/types/inventory";
import { inventoryItems } from "@/data/inventoryData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useInventoryDatabase } from "./useInventoryDatabase";

export function useInventoryOperations() {
  const { mapInventoryItemToSupabaseItem } = useInventoryDatabase();

  const updateItem = useCallback(async (updatedItem: InventoryItem) => {
    try {
      const supabaseItem = mapInventoryItemToSupabaseItem(updatedItem);
      
      const { error } = await supabase
        .from('inventory_items')
        .update(supabaseItem)
        .eq('id', updatedItem.id);
      
      if (error) {
        console.error("Error updating item in Supabase:", error);
        throw error;
      }
      
      // Update local inventory items array for fallback
      const itemIndex = inventoryItems.findIndex(item => item.id === updatedItem.id);
      if (itemIndex !== -1) {
        inventoryItems[itemIndex] = updatedItem;
      }
      
      console.log("Item updated successfully:", updatedItem);
      return true;
    } catch (error) {
      console.error("Failed to update item:", error);
      
      // Still update local inventory as fallback
      const itemIndex = inventoryItems.findIndex(item => item.id === updatedItem.id);
      if (itemIndex !== -1) {
        inventoryItems[itemIndex] = updatedItem;
      }
      
      toast.error("Failed to update item in database");
      return false;
    }
  }, [mapInventoryItemToSupabaseItem]);
  
  const addItem = useCallback(async (newItem: InventoryItem) => {
    try {
      const supabaseItem = mapInventoryItemToSupabaseItem(newItem);
      
      const { error } = await supabase
        .from('inventory_items')
        .insert(supabaseItem);
      
      if (error) {
        console.error("Error adding item to Supabase:", error);
        throw error;
      }
      
      // Add to local inventory items array for fallback
      inventoryItems.unshift(newItem);
      
      console.log("Item added successfully:", newItem);
      return true;
    } catch (error) {
      console.error("Failed to add item:", error);
      
      // Still add to local inventory as fallback
      inventoryItems.unshift(newItem);
      
      toast.error("Failed to add item to database");
      return false;
    }
  }, [mapInventoryItemToSupabaseItem]);
  
  const deleteItem = useCallback(async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', itemId);
      
      if (error) {
        console.error("Error deleting item from Supabase:", error);
        throw error;
      }
      
      // Remove from local inventory items array for fallback
      const itemIndex = inventoryItems.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        inventoryItems.splice(itemIndex, 1);
      }
      
      console.log("Item deleted successfully:", itemId);
      return true;
    } catch (error) {
      console.error("Failed to delete item:", error);
      
      // Still remove from local inventory as fallback
      const itemIndex = inventoryItems.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        inventoryItems.splice(itemIndex, 1);
      }
      
      toast.error("Failed to delete item from database");
      return false;
    }
  }, []);

  return {
    updateItem,
    addItem,
    deleteItem
  };
}
