
import { useState } from "react";
import { useInventoryOperations } from "./useInventoryOperations";
import { useInventoryReordering } from "./useInventoryReordering";
import { InventoryItem, EditInventoryItemFormData, LocationStock } from "@/types/inventory";
import { useToast } from "@/hooks/use-toast";
import { useLocations } from "@/hooks/useLocations";

export const useEditInventoryItem = (item: InventoryItem | null, onClose: () => void) => {
  // Fix: Create dummy arguments for useInventoryReordering since it expects 4 arguments
  const mockSetItems = () => {};
  const mockSetIsLoading = () => {};
  const mockFetchItems = async () => {};
  const { reorderStock } = useInventoryReordering([], mockSetItems, mockSetIsLoading, mockFetchItems);
  
  const { updateItem } = useInventoryOperations();
  const { locations } = useLocations();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<InventoryItem | null>(item);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  // Initialize locationStocks properly based on item's locations or create a default distribution
  const [locationStocks, setLocationStocks] = useState<LocationStock[]>(() => {
    if (item?.locations && item.locations.length > 0) {
      // Use existing location data if available
      return item.locations.map(loc => ({ 
        location: loc.name, 
        count: loc.stock 
      }));
    } else if (item) {
      // If no locations specified but we have the item, put all stock in the first location
      // and set other locations to 0
      const result = locations.map((loc, index) => ({ 
        location: loc.name, 
        count: index === 0 ? item.stock : 0 
      }));
      return result;
    } else {
      // Fallback for new items
      return locations.map(loc => ({ 
        location: loc.name, 
        count: 0 
      }));
    }
  });
  
  const [reorderQuantity, setReorderQuantity] = useState<number>(
    item?.reorderQuantity || item?.minStockCount || 0
  );
  
  // Calculate total stock from all locations
  const totalStock = locationStocks.reduce((sum, loc) => sum + loc.count, 0);
  
  const handleLocationStockChange = (location: string, newCount: number) => {
    console.log(`Location stock change: ${location} = ${newCount}`);
    setLocationStocks(prev => 
      prev.map(loc => 
        loc.location === location ? { ...loc, count: newCount } : loc
      )
    );
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (!formData) return;
    
    const newValue = type === 'number' ? (value ? Number(value) : 0) : value;
    setFormData({
      ...formData,
      [name]: newValue
    });
  };
  
  const prepareItemsForSave = () => {
    if (!formData) return [];
    
    // Map location stocks back to the format expected by the API
    const updatedLocations = locationStocks.map(loc => ({
      name: loc.location,
      stock: loc.count
    }));
    
    // Calculate total stock from all locations
    const totalStockFromLocations = locationStocks.reduce((sum, loc) => sum + loc.count, 0);
    
    const updatedItem = {
      ...formData,
      stock: totalStockFromLocations, // Update total stock based on sum of locations
      locations: updatedLocations,
      lastUpdated: new Date().toISOString()
    };
    
    return [updatedItem];
  };
  
  const handleSubmit = (formData: EditInventoryItemFormData) => {
    if (!item) return;
    
    // Calculate total stock from all locations
    const totalStockFromLocations = locationStocks.reduce((sum, loc) => sum + loc.count, 0);
    
    // Map location stocks back to the format expected by the API
    const updatedLocations = locationStocks.map(loc => ({
      name: loc.location,
      stock: loc.count
    }));
    
    // Add totalStock to formData
    const updatedFormData = {
      ...formData,
      stock: totalStockFromLocations, // Update total stock based on sum of locations
      // Convert to string to fix the TypeScript error
      totalStock: totalStockFromLocations.toString()
    };
    
    // Update the item with the new data
    try {
      // Fix: Pass only one argument to updateItem
      const updatedItem = {
        ...item,
        ...updatedFormData,
        locations: updatedLocations,
        lastUpdated: new Date().toISOString()
      };
      updateItem(updatedItem);
      
      // Also update reorder quantity if changed
      if (reorderQuantity !== item.reorderQuantity) {
        // Fix: Pass the item and quantity separately to match function signature
        reorderStock(updatedItem, reorderQuantity - (item.reorderQuantity || 0));
      }
      
      toast({
        title: "Inventory Item Updated",
        description: `${formData.name} has been successfully updated.`
      });
      
      onClose();
    } catch (error) {
      console.error("Error updating inventory item:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the inventory item.",
        variant: "destructive"
      });
    }
  };
  
  return {
    formData,
    isOpen,
    setIsOpen,
    locationStocks,
    totalStock,
    reorderQuantity,
    setReorderQuantity,
    handleChange,
    handleLocationStockChange,
    handleSubmit,
    prepareItemsForSave
  };
};
