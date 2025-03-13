
import { useState, useEffect } from "react";
import { InventoryItem } from "@/types/inventory";
import { inventoryItems } from "@/data/inventoryData";
import { toast } from "sonner";

export interface LocationStock {
  location: string;
  count: number;
}

export function useEditInventoryItem(item: InventoryItem) {
  const [formData, setFormData] = useState<InventoryItem>(item);
  const [isOpen, setIsOpen] = useState(false);
  const [locationStocks, setLocationStocks] = useState<LocationStock[]>([]);
  const [totalStock, setTotalStock] = useState(0);

  // Update the form data when the dialog opens or when the item changes
  useEffect(() => {
    if (isOpen) {
      console.log("Dialog opened, setting form data with item:", item);
      setFormData({...item});
      
      try {
        const sameSkuItems = inventoryItems.filter(
          (inventoryItem) => inventoryItem.sku === item.sku
        );
        
        const stockByLocation = sameSkuItems.reduce<{ [key: string]: number }>((acc, curr) => {
          if (!acc[curr.location]) {
            acc[curr.location] = 0;
          }
          acc[curr.location] += curr.stock;
          return acc;
        }, {});
        
        const locationStocksArray = Object.entries(stockByLocation).map(([location, count]) => ({
          location,
          count,
        })).sort((a, b) => b.count - a.count);
        
        setLocationStocks(locationStocksArray);
        
        const total = locationStocksArray.reduce((sum, item) => sum + item.count, 0);
        setTotalStock(total);
        
        setFormData(prev => ({
          ...prev,
          totalStock: total
        }));
        
        console.log("Set location stocks:", locationStocksArray);
        console.log("Set total stock:", total);
      } catch (error) {
        console.error("Error loading location stock data:", error);
        toast.error("Failed to load stock distribution data");
      }
    }
  }, [isOpen, item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Form field changed: ${name} = ${value}`);
    
    // Convert numeric fields
    let updatedValue = value;
    if (name === 'cost' || name === 'rrp' || name === 'minStockCount' || name === 'stock') {
      updatedValue = Number(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: updatedValue
    }));
    
    // If stock is manually updated (bypassing location stocks)
    if (name === 'stock') {
      const stockValue = Number(value);
      console.log(`Stock directly changed to: ${stockValue}`);
      
      // Update the location stock for this item's location
      if (locationStocks.length > 0) {
        const currentLocation = formData.location;
        handleLocationStockChange(currentLocation, stockValue);
      }
    }
  };

  const handleLocationStockChange = (location: string, newCount: number) => {
    console.log(`Location stock change: ${location} = ${newCount}`);
    
    const updatedLocationStocks = locationStocks.map(locStock => 
      locStock.location === location 
        ? { ...locStock, count: newCount } 
        : locStock
    );
    
    setLocationStocks(updatedLocationStocks);
    
    const newTotal = updatedLocationStocks.reduce((sum, item) => sum + item.count, 0);
    setTotalStock(newTotal);
    
    // Update the form data stock if this is the current item's location
    setFormData(prev => ({
      ...prev,
      totalStock: newTotal,
      stock: prev.location === location ? newCount : prev.stock
    }));
    
    console.log("Updated location stocks:", updatedLocationStocks);
    console.log("New total stock:", newTotal);
    console.log("Updated form data:", formData);
  };

  const prepareItemsForSave = () => {
    const sameSkuItems = inventoryItems.filter(
      (inventoryItem) => inventoryItem.sku === item.sku
    );
    
    // Create updated versions of all items with the same SKU
    const updatedItems = sameSkuItems.map(inventoryItem => {
      const locationData = locationStocks.find(
        locStock => locStock.location === inventoryItem.location
      );
      
      const updatedStock = locationData ? locationData.count : inventoryItem.stock;
      console.log(`Preparing item ${inventoryItem.id} with stock: ${updatedStock}`);
      
      return {
        ...inventoryItem,
        stock: updatedStock,
        name: formData.name,
        description: formData.description,
        cost: formData.cost,
        rrp: formData.rrp,
        minStockCount: formData.minStockCount,
        imageUrl: formData.imageUrl,
        lastUpdated: new Date().toISOString()
      };
    });
    
    console.log("Prepared items for save:", updatedItems);
    return updatedItems;
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
