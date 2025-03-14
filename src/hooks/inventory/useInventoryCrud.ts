
import { useCallback } from "react";
import { InventoryItem } from "@/types/inventory";
import { inventoryItems } from "@/data/inventoryData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useInventoryDatabase } from "./useInventoryDatabase";
import { v4 as uuidv4 } from "uuid";

/**
 * Hook for basic CRUD operations on inventory items
 */
export function useInventoryCrud() {
  const { mapInventoryItemToSupabaseItem } = useInventoryDatabase();

  const updateItem = useCallback(async (updatedItem: InventoryItem) => {
    try {
      console.log("Updating inventory item:", updatedItem);
      console.log("Image URL being saved:", updatedItem.imageUrl);
      
      // Calculate total stock from all locations if available
      if (updatedItem.locations && updatedItem.locations.length > 0) {
        const totalStock = updatedItem.locations.reduce((sum, loc) => sum + loc.stock, 0);
        console.log(`Calculated total stock from all locations: ${totalStock}`);
        updatedItem.stock = totalStock;
      }
      
      // Ensure lastUpdated is set to current time
      const itemToUpdate = {
        ...updatedItem,
        lastUpdated: new Date().toISOString()
      };
      
      // Check if we have a valid UUID
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(itemToUpdate.id);
      
      // For non-UUID items, update only the local array
      if (!isValidUUID) {
        console.log("Non-UUID item detected, updating local array only:", itemToUpdate.id);
        
        // Update local inventory items array
        const itemIndex = inventoryItems.findIndex(item => item.id === itemToUpdate.id);
        if (itemIndex !== -1) {
          inventoryItems[itemIndex] = itemToUpdate;
          console.log("Updated local item:", itemToUpdate);
        } else {
          console.error("Item not found in local inventory:", itemToUpdate.id);
          throw new Error("Item not found in local inventory");
        }
        
        return true;
      }
      
      // For UUID items, update in Supabase
      const supabaseItem = mapInventoryItemToSupabaseItem(itemToUpdate);
      
      console.log("Updating item in Supabase:", supabaseItem);
      console.log("Stock value being set:", supabaseItem.stock);
      console.log("Image URL being sent to Supabase:", supabaseItem.image_url);
      
      const { error } = await supabase
        .from('inventory_items')
        .update(supabaseItem)
        .eq('id', itemToUpdate.id);
      
      if (error) {
        console.error("Error updating item in Supabase:", error);
        throw error;
      }
      
      // Update local inventory items array for fallback
      const itemIndex = inventoryItems.findIndex(item => item.id === itemToUpdate.id);
      if (itemIndex !== -1) {
        inventoryItems[itemIndex] = itemToUpdate;
        console.log("Also updated item in local array for consistency, stock now:", itemToUpdate.stock);
      } else {
        // Item not found in local array, add it
        inventoryItems.push(itemToUpdate);
        console.log("Added item to local array as it wasn't found");
      }
      
      console.log("Item updated successfully:", itemToUpdate);
      return true;
    } catch (error) {
      console.error("Failed to update item:", error);
      
      // Still update local inventory as fallback
      const itemIndex = inventoryItems.findIndex(item => item.id === updatedItem.id);
      if (itemIndex !== -1) {
        inventoryItems[itemIndex] = {
          ...updatedItem,
          lastUpdated: new Date().toISOString()
        };
        console.log("Updated local inventory as fallback, stock:", updatedItem.stock);
        return true; // Return true even if Supabase fails but local update succeeds
      }
      
      toast.error("Failed to update item in database");
      return false;
    }
  }, [mapInventoryItemToSupabaseItem]);

  return { updateItem };
}
