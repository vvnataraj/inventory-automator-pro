
import { useState } from "react";
import { useInventoryOperations } from "./useInventoryOperations";
import { useInventoryReordering } from "./useInventoryReordering";
import { InventoryItem, EditInventoryItemFormData, LocationStock } from "@/types/inventory";
import { useToast } from "@/hooks/use-toast";
import { useLocations } from "@/hooks/useLocations";

export const useEditInventoryItem = (item: InventoryItem | null, onClose: () => void) => {
  const { updateItem } = useInventoryOperations();
  const { reorderStock } = useInventoryReordering();
  const { locations } = useLocations();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<InventoryItem | null>(item);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  const [locationStocks, setLocationStocks] = useState<LocationStock[]>(
    item?.locations?.map(loc => ({ 
      location: loc.name, 
      count: loc.stock 
    })) || 
    locations.map(loc => ({ 
      location: loc.name, 
      count: 0 
    }))
  );
  
  const [reorderQuantity, setReorderQuantity] = useState<number>(
    item?.reorderQuantity || 0
  );
  
  // Calculate total stock from all locations
  const totalStock = locationStocks.reduce((sum, loc) => sum + loc.count, 0);
  
  const handleLocationStockChange = (location: string, newCount: number) => {
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
    
    const updatedItem = {
      ...formData,
      stock: totalStock,
      locations: updatedLocations,
      lastUpdated: new Date().toISOString()
    };
    
    return [updatedItem];
  };
  
  const handleSubmit = (formData: EditInventoryItemFormData) => {
    if (!item) return;
    
    // Calculate total stock from all locations
    const totalStock = locationStocks.reduce((sum, loc) => sum + loc.count, 0);
    
    // Map location stocks back to the format expected by the API
    const updatedLocations = locationStocks.map(loc => ({
      name: loc.location,
      stock: loc.count
    }));
    
    // Add totalStock to formData
    const updatedFormData = {
      ...formData,
      stock: totalStock,
      // Convert to string to fix the TypeScript error
      totalStock: totalStock.toString()
    };
    
    // Update the item with the new data
    try {
      // Fix: Pass one argument (the updated item) to updateItem
      updateItem({
        ...item,
        ...updatedFormData,
        locations: updatedLocations,
        lastUpdated: new Date().toISOString()
      });
      
      // Also update reorder quantity if changed
      if (reorderQuantity !== item.reorderQuantity) {
        // Fix: Pass the updated item with the reorder quantity to reorderStock
        reorderStock({
          ...item,
          reorderQuantity: reorderQuantity
        });
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
