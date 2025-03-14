
import { useCallback } from "react";
import { InventoryItem } from "@/types/inventory";
import { inventoryItems } from "@/data/inventoryData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

/**
 * Hook for inventory item creation and deletion operations
 */
export function useInventoryItemManagement() {
  const addItem = useCallback(async (newItem: InventoryItem) => {
    try {
      console.log("Adding new inventory item:", newItem);
      console.log("Image URL for new item:", newItem.imageUrl);
      
      // For Supabase items, don't include the id to let Supabase generate it
      const supabaseItem = {
        sku: newItem.sku,
        name: newItem.name,
        description: newItem.description || "",
        category: newItem.category || "",
        subcategory: newItem.subcategory || "",
        brand: newItem.brand || "",
        price: newItem.price || 0,
        rrp: newItem.rrp || 0,
        cost: newItem.cost || 0,
        stock: newItem.stock || 0,
        low_stock_threshold: newItem.lowStockThreshold || 5,
        min_stock_count: newItem.minStockCount || 1,
        location: newItem.location || "",
        barcode: newItem.barcode || "",
        date_added: newItem.dateAdded || new Date().toISOString(),
        last_updated: newItem.lastUpdated || new Date().toISOString(),
        image_url: newItem.imageUrl || "",
        dimensions: newItem.dimensions || null,
        weight: newItem.weight || null,
        is_active: newItem.isActive !== undefined ? newItem.isActive : true,
        supplier: newItem.supplier || "",
        tags: newItem.tags || []
      };
      
      console.log("Supabase item prepared:", supabaseItem);
      
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
  }, []);
  
  const deleteItem = useCallback(async (itemId: string) => {
    try {
      // Check if we have a valid UUID, if not, only update local array
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(itemId);
      
      // For non-UUID items, update only the local array
      if (!isValidUUID) {
        console.log("Non-UUID item detected, updating local array only:", itemId);
        
        // Remove from local inventory items array
        const itemIndex = inventoryItems.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
          inventoryItems.splice(itemIndex, 1);
        }
        
        return true;
      }
      
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
    addItem,
    deleteItem
  };
}
