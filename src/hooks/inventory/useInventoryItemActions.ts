
import { useState, useCallback } from "react";
import { InventoryItem } from "@/types/inventory";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

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
        
        // Fallback to local update
        setItems(prev => prev.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        ));
        
        toast.error("Failed to update in database, using local data");
      } else {
        // Refresh data to ensure we're in sync with backend
        refreshData();
      }
      
      return true;
    } catch (error) {
      console.error("Failed to update inventory item:", error);
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
        
        // Fallback to local addition
        setItems(prev => [...prev, newItem]);
        setTotalItems(prev => prev + 1);
        
        toast.error("Failed to add to database, using local data");
      } else {
        // Refresh data to ensure we're in sync with backend
        refreshData();
      }
      
      return true;
    } catch (error) {
      console.error("Failed to add inventory item:", error);
      toast.error("Failed to add item");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setItems, setTotalItems, setIsLoading, refreshData]);

  const deleteItem = useCallback(async (itemId: string) => {
    try {
      setIsLoading(true);
      
      // Try to delete the item from Supabase
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', itemId);
      
      if (error) {
        console.error("Error deleting item from Supabase:", error);
        
        // Fallback to local deletion
        setItems(prev => prev.filter(item => item.id !== itemId));
        setTotalItems(prev => prev - 1);
        
        toast.error("Failed to delete from database, using local data");
      } else {
        // Refresh data to ensure we're in sync with backend
        refreshData();
      }
      
      return true;
    } catch (error) {
      console.error("Failed to delete inventory item:", error);
      toast.error("Failed to delete item");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setItems, setTotalItems, setIsLoading, refreshData]);

  return {
    updateItem,
    addItem,
    deleteItem
  };
}
