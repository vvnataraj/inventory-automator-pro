import { useState, useEffect } from "react";
import { InventoryItem } from "@/types/inventory";
import { inventoryItems } from "@/data/inventoryData";
import { toast } from "sonner";

interface LocationStock {
  location: string;
  count: number;
}

export function useEditInventoryItem(item: InventoryItem) {
  const [formData, setFormData] = useState(item);
  const [isOpen, setIsOpen] = useState(false);
  const [locationStocks, setLocationStocks] = useState<LocationStock[]>([]);
  const [totalStock, setTotalStock] = useState(0);

  useEffect(() => {
    if (isOpen) {
      try {
        // Find all items with the same SKU across different locations
        const sameSkuItems = inventoryItems.filter(
          (inventoryItem) => inventoryItem.sku === item.sku
        );
        
        // Group by location and sum the stock
        const stockByLocation = sameSkuItems.reduce<{ [key: string]: number }>((acc, curr) => {
          if (!acc[curr.location]) {
            acc[curr.location] = 0;
          }
          acc[curr.location] += curr.stock;
          return acc;
        }, {});
        
        // Convert to array for rendering
        const locationStocksArray = Object.entries(stockByLocation).map(([location, count]) => ({
          location,
          count,
        })).sort((a, b) => b.count - a.count); // Sort by count descending
        
        setLocationStocks(locationStocksArray);
        
        // Calculate total stock across all locations
        const total = locationStocksArray.reduce((sum, item) => sum + item.count, 0);
        setTotalStock(total);
        
        // Update the form data with the total stock
        setFormData(prev => ({
          ...prev,
          totalStock: total
        }));
      } catch (error) {
        console.error("Error loading location stock data:", error);
        toast.error("Failed to load stock distribution data");
      }
    }
  }, [isOpen, item.sku]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cost' || name === 'rrp' || name === 'minStockCount' ? Number(value) : value
    }));
  };

  const handleLocationStockChange = (location: string, newCount: number) => {
    // Update the locationStocks array
    const updatedLocationStocks = locationStocks.map(locStock => 
      locStock.location === location 
        ? { ...locStock, count: newCount } 
        : locStock
    );
    
    setLocationStocks(updatedLocationStocks);
    
    // Recalculate the total stock
    const newTotal = updatedLocationStocks.reduce((sum, item) => sum + item.count, 0);
    setTotalStock(newTotal);
    
    // Update the form data with the new total
    setFormData(prev => ({
      ...prev,
      totalStock: newTotal,
      // If this is the item's specific location, update its stock too
      stock: prev.location === location ? newCount : prev.stock
    }));
  };

  // Prepare the updated items for all locations when saving
  const prepareItemsForSave = () => {
    // Find all items with the same SKU
    const sameSkuItems = inventoryItems.filter(
      (inventoryItem) => inventoryItem.sku === item.sku
    );
    
    // Create an array of updated items
    return sameSkuItems.map(inventoryItem => {
      // Find this item's location in our locationStocks
      const locationData = locationStocks.find(
        locStock => locStock.location === inventoryItem.location
      );
      
      // If found, update the stock value, otherwise keep the original
      return {
        ...inventoryItem,
        stock: locationData ? locationData.count : inventoryItem.stock,
        // Copy other updated fields from the form
        name: formData.name,
        description: formData.description,
        cost: formData.cost,
        rrp: formData.rrp,
        minStockCount: formData.minStockCount,
        imageUrl: formData.imageUrl,
        lastUpdated: new Date().toISOString()
      };
    });
  };

  return {
    formData,
    setFormData,
    isOpen,
    setIsOpen,
    locationStocks,
    totalStock,
    handleChange,
    handleLocationStockChange,
    prepareItemsForSave
  };
}
