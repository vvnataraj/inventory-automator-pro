import { useState, useEffect } from "react";
import { InventoryItem } from "@/types/inventory";
import { inventoryItems } from "@/data/inventoryData";
import { toast } from "sonner";

export interface LocationStock {
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
      } catch (error) {
        console.error("Error loading location stock data:", error);
        toast.error("Failed to load stock distribution data");
      }
    }
  }, [isOpen, item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cost' || name === 'rrp' || name === 'minStockCount' ? Number(value) : value
    }));
  };

  const handleLocationStockChange = (location: string, newCount: number) => {
    const updatedLocationStocks = locationStocks.map(locStock => 
      locStock.location === location 
        ? { ...locStock, count: newCount } 
        : locStock
    );
    
    setLocationStocks(updatedLocationStocks);
    
    const newTotal = updatedLocationStocks.reduce((sum, item) => sum + item.count, 0);
    setTotalStock(newTotal);
    
    setFormData(prev => ({
      ...prev,
      totalStock: newTotal,
      stock: prev.location === location ? newCount : prev.stock
    }));
  };

  const prepareItemsForSave = () => {
    const sameSkuItems = inventoryItems.filter(
      (inventoryItem) => inventoryItem.sku === item.sku
    );
    
    return sameSkuItems.map(inventoryItem => {
      const locationData = locationStocks.find(
        locStock => locStock.location === inventoryItem.location
      );
      
      return {
        ...inventoryItem,
        stock: locationData ? locationData.count : inventoryItem.stock,
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
