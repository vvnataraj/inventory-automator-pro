
import { useState, useCallback } from "react";
import { InventoryItem } from "@/types/inventory";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { logInventoryActivity } from "@/utils/logging";

export function useInventoryItemActions(
  items: InventoryItem[],
  setItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setTotalItems: React.Dispatch<React.SetStateAction<number>>,
  refreshData: () => void
) {
  const updateItem = useCallback(async (updatedItem: InventoryItem) => {
    try {
      setIsLoading(true);
      
      // Log the update operation before making the change
      await logInventoryActivity('update_item', updatedItem.id, updatedItem.name, {
        sku: updatedItem.sku,
        category: updatedItem.category,
        stock: updatedItem.stock,
        cost: updatedItem.cost,
        location: updatedItem.location
      });
      
      // Update the item in Supabase
      const { error } = await supabase
        .from('inventory_items')
        .update({
          name: updatedItem.name,
          description: updatedItem.description,
          category: updatedItem.category,
          subcategory: updatedItem.subcategory,
          brand: updatedItem.brand,
          price: updatedItem.rrp,
          cost: updatedItem.cost,
          stock: updatedItem.stock,
          low_stock_threshold: updatedItem.lowStockThreshold,
          min_stock_count: updatedItem.minStockCount,
          location: updatedItem.location,
          barcode: updatedItem.barcode,
          last_updated: new Date().toISOString(),
          image_url: updatedItem.imageUrl,
          dimensions: updatedItem.dimensions,
          weight: updatedItem.weight,
          is_active: updatedItem.isActive,
          supplier: updatedItem.supplier,
          tags: updatedItem.tags
        })
        .eq('id', updatedItem.id);
      
      if (error) {
        console.error("Error updating item in Supabase:", error);
        
        // Log the failure
        await logInventoryActivity('update_item_failed', updatedItem.id, updatedItem.name, {
          error: error.message,
          code: error.code
        });
        
        // Fallback to local update
        setItems(prev => prev.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        ));
        
        toast.error("Failed to update in database, using local data");
      } else {
        // Log successful update
        await logInventoryActivity('update_item_completed', updatedItem.id, updatedItem.name, {
          result: 'success'
        });
        
        // Refresh data to ensure we're in sync with backend
        refreshData();
      }
      
      return true;
    } catch (error) {
      console.error("Failed to update inventory item:", error);
      
      // Log the error
      await logInventoryActivity('update_item_error', updatedItem.id, updatedItem.name, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      toast.error("Failed to update item");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setItems, setIsLoading, refreshData]);

  const addItem = useCallback(async (newItem: InventoryItem) => {
    try {
      setIsLoading(true);
      
      // Ensure the new item has an ID
      if (!newItem.id) {
        newItem.id = uuidv4();
      }
      
      // Add timestamps if they don't exist
      if (!newItem.dateAdded) {
        newItem.dateAdded = new Date().toISOString();
      }
      
      newItem.lastUpdated = new Date().toISOString();
      
      // Log the creation operation
      await logInventoryActivity('create_item', newItem.id, newItem.name, {
        sku: newItem.sku,
        category: newItem.category,
        stock: newItem.stock,
        cost: newItem.cost,
        location: newItem.location
      });
      
      // Try to add the item to Supabase
      const { error } = await supabase
        .from('inventory_items')
        .insert({
          id: newItem.id,
          sku: newItem.sku,
          name: newItem.name,
          description: newItem.description,
          category: newItem.category,
          subcategory: newItem.subcategory,
          brand: newItem.brand,
          price: newItem.rrp,
          cost: newItem.cost,
          stock: newItem.stock,
          low_stock_threshold: newItem.lowStockThreshold,
          min_stock_count: newItem.minStockCount,
          location: newItem.location,
          barcode: newItem.barcode,
          date_added: newItem.dateAdded,
          last_updated: newItem.lastUpdated,
          image_url: newItem.imageUrl,
          dimensions: newItem.dimensions,
          weight: newItem.weight,
          is_active: newItem.isActive,
          supplier: newItem.supplier,
          tags: newItem.tags
        });
      
      if (error) {
        console.error("Error adding item to Supabase:", error);
        
        // Log the failure
        await logInventoryActivity('create_item_failed', newItem.id, newItem.name, {
          error: error.message,
          code: error.code
        });
        
        // Fallback to local addition
        setItems(prev => [...prev, newItem]);
        setTotalItems(prev => prev + 1);
        
        toast.error("Failed to add to database, using local data");
      } else {
        // Log successful creation
        await logInventoryActivity('create_item_completed', newItem.id, newItem.name, {
          result: 'success'
        });
        
        // Refresh data to ensure we're in sync with backend
        refreshData();
      }
      
      return true;
    } catch (error) {
      console.error("Failed to add inventory item:", error);
      
      // Log the error
      await logInventoryActivity('create_item_error', newItem.id, newItem.name, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      toast.error("Failed to add item");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setItems, setTotalItems, setIsLoading, refreshData]);

  const deleteItem = useCallback(async (itemId: string) => {
    try {
      setIsLoading(true);
      
      // Find the item to be deleted for logging
      const itemToDelete = items.find(item => item.id === itemId);
      if (!itemToDelete) {
        console.error("Item not found for deletion:", itemId);
        return false;
      }
      
      // Log the delete operation
      await logInventoryActivity('delete_item', itemId, itemToDelete.name, {
        sku: itemToDelete.sku,
        category: itemToDelete.category,
        stock: itemToDelete.stock
      });
      
      // Try to delete the item from Supabase
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', itemId);
      
      if (error) {
        console.error("Error deleting item from Supabase:", error);
        
        // Log the failure
        await logInventoryActivity('delete_item_failed', itemId, itemToDelete.name, {
          error: error.message,
          code: error.code
        });
        
        // Fallback to local deletion
        setItems(prev => prev.filter(item => item.id !== itemId));
        setTotalItems(prev => prev - 1);
        
        toast.error("Failed to delete from database, using local data");
      } else {
        // Log successful deletion
        await logInventoryActivity('delete_item_completed', itemId, itemToDelete.name, {
          result: 'success'
        });
        
        // Refresh data to ensure we're in sync with backend
        refreshData();
      }
      
      return true;
    } catch (error) {
      console.error("Failed to delete inventory item:", error);
      
      // Get item details for logging
      const itemToDelete = items.find(item => item.id === itemId);
      
      // Log the error
      await logInventoryActivity('delete_item_error', itemId, itemToDelete?.name || 'Unknown Item', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      toast.error("Failed to delete item");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [items, setItems, setTotalItems, setIsLoading, refreshData]);

  return {
    updateItem,
    addItem,
    deleteItem
  };
}
