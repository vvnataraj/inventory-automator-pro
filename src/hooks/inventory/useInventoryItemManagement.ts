
import { useCallback } from "react";
import { InventoryItem } from "@/types/inventory";
import { inventoryItems } from "@/data/inventoryData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { logInventoryActivity } from "@/utils/logging";

/**
 * Hook for inventory item creation and deletion operations
 */
export function useInventoryItemManagement() {
  const addItem = useCallback(async (newItem: InventoryItem) => {
    try {
      console.log("Adding new inventory item:", newItem);
      console.log("Image URL for new item:", newItem.imageUrl);
      
      // Log the creation operation
      await logInventoryActivity('create_item', newItem.id, newItem.name, {
        sku: newItem.sku,
        category: newItem.category,
        stock: newItem.stock,
        cost: newItem.cost,
        location: newItem.location
      });
      
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
        
        // Log the failure
        await logInventoryActivity('create_item_failed', newItem.id, newItem.name, {
          error: error.message,
          code: error.code,
          storage: 'supabase'
        });
        
        throw error;
      }
      
      // Log successful creation
      await logInventoryActivity('create_item_completed', newItem.id, newItem.name, {
        result: 'success',
        storage: 'supabase'
      });
      
      // Add to local inventory items array for fallback
      inventoryItems.unshift(newItem);
      
      console.log("Item added successfully:", newItem);
      return true;
    } catch (error) {
      console.error("Failed to add item:", error);
      
      // Log the error
      await logInventoryActivity('create_item_error', newItem.id, newItem.name, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Still add to local inventory as fallback
      inventoryItems.unshift(newItem);
      
      // Log local fallback success
      await logInventoryActivity('create_item_fallback', newItem.id, newItem.name, {
        result: 'success (local fallback)',
        storage: 'local'
      });
      
      toast.error("Failed to add item to database");
      return false;
    }
  }, []);
  
  const deleteItem = useCallback(async (itemId: string) => {
    try {
      // Find the item to be deleted for logging
      const itemToDelete = inventoryItems.find(item => item.id === itemId);
      if (!itemToDelete) {
        console.error("Item not found for deletion:", itemId);
        
        // Log the failure to find item
        await logInventoryActivity('delete_item_failed', itemId, 'Unknown Item', {
          error: 'Item not found in inventory',
          storage: 'local'
        });
        
        return false;
      }
      
      // Log the delete operation
      await logInventoryActivity('delete_item', itemId, itemToDelete.name, {
        sku: itemToDelete.sku,
        category: itemToDelete.category,
        stock: itemToDelete.stock
      });
      
      // Check if we have a valid UUID, if not, only update local array
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(itemId);
      
      // For non-UUID items, update only the local array
      if (!isValidUUID) {
        console.log("Non-UUID item detected, updating local array only:", itemId);
        
        // Remove from local inventory items array
        const itemIndex = inventoryItems.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
          inventoryItems.splice(itemIndex, 1);
          
          // Log success for local delete
          await logInventoryActivity('delete_item_completed', itemId, itemToDelete.name, {
            result: 'success (local only)',
            storage: 'local'
          });
        }
        
        return true;
      }
      
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', itemId);
      
      if (error) {
        console.error("Error deleting item from Supabase:", error);
        
        // Log the failure
        await logInventoryActivity('delete_item_failed', itemId, itemToDelete.name, {
          error: error.message,
          code: error.code,
          storage: 'supabase'
        });
        
        throw error;
      }
      
      // Log successful deletion
      await logInventoryActivity('delete_item_completed', itemId, itemToDelete.name, {
        result: 'success',
        storage: 'supabase'
      });
      
      // Remove from local inventory items array for fallback
      const itemIndex = inventoryItems.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        inventoryItems.splice(itemIndex, 1);
      }
      
      console.log("Item deleted successfully:", itemId);
      return true;
    } catch (error) {
      console.error("Failed to delete item:", error);
      
      // Find the item to be deleted for logging fallback
      const itemToDelete = inventoryItems.find(item => item.id === itemId);
      
      // Log the error
      await logInventoryActivity('delete_item_error', itemId, itemToDelete?.name || 'Unknown Item', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Still remove from local inventory as fallback
      const itemIndex = inventoryItems.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        inventoryItems.splice(itemIndex, 1);
        
        // Log local fallback success
        await logInventoryActivity('delete_item_fallback', itemId, itemToDelete?.name || 'Unknown Item', {
          result: 'success (local fallback)',
          storage: 'local'
        });
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
