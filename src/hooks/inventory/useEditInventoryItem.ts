
import { useState, useEffect } from "react";
import { InventoryItem } from "@/types/inventory";
import { inventoryItems } from "@/data/inventoryData";

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
    }
  }, [isOpen, item.sku]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock' || name === 'cost' || name === 'rrp' || name === 'minStockCount' ? Number(value) : value
    }));
  };

  return {
    formData,
    setFormData,
    isOpen,
    setIsOpen,
    locationStocks,
    totalStock,
    handleChange
  };
}
