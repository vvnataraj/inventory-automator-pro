
import { useState, useEffect } from "react";
import { inventoryItems } from "@/data/inventoryData";

export interface StatItem {
  name: string;
  value: string;
  change: string;
  icon: any;
  link: string | null;
  subValue?: string | null;
  tooltipContent?: string;
}

export interface CategoryDataItem {
  name: string;
  value: number;
}

export function useDashboardData() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryDataItem[]>([]);
  const [lowStockCount, setLowStockCount] = useState<number>(0);

  useEffect(() => {
    const getInitialStats = () => [
      {
        name: "Total Inventory",
        value: "Loading...",
        change: "+4.75%",
        icon: null, // Will be set in the component
        link: "/inventory",
        subValue: null
      },
      {
        name: "Low Stock Items",
        value: "23",
        change: "-12%",
        icon: null,
        link: "/low-stock",
        tooltipContent: "Consider reordering these items to maintain optimal stock levels"
      },
      {
        name: "Monthly Revenue",
        value: "$45,231",
        change: "+20.1%",
        icon: null,
        link: "/analytics"
      },
      {
        name: "Active Orders",
        value: "56",
        change: "+8%",
        icon: null,
        link: "/orders"
      },
    ];
    
    setStats(getInitialStats());

    calculateTotalInventoryValue();
    calculateCategoryValues();
    calculateLowStockItems();
  }, []);

  const calculateTotalInventoryValue = () => {
    const totalCostValue = inventoryItems.reduce((sum, item) => {
      const itemCostValue = (item.cost || 0) * item.stock;
      return sum + itemCostValue;
    }, 0);
    
    const totalRrpValue = inventoryItems.reduce((sum, item) => {
      const itemRrpValue = (item.rrp || item.price || 0) * item.stock;
      return sum + itemRrpValue;
    }, 0);
    
    const formattedCostValue = `$${totalCostValue.toLocaleString('en-US', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    })}`;
    
    const formattedRrpValue = `$${totalRrpValue.toLocaleString('en-US', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    })}`;
    
    setStats(prevStats => prevStats.map(stat => 
      stat.name === "Total Inventory" 
        ? { ...stat, value: formattedCostValue, subValue: formattedRrpValue } 
        : stat
    ));
  };

  const calculateCategoryValues = () => {
    const categoryValues = inventoryItems.reduce((acc, item) => {
      const category = item.category;
      const itemValue = (item.rrp || item.price || 0) * item.stock;
      
      acc[category] = (acc[category] || 0) + itemValue;
      return acc;
    }, {} as Record<string, number>);

    const data = Object.entries(categoryValues).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2))
    }));

    setCategoryData(data);
  };

  const calculateLowStockItems = () => {
    const lowStockItems = inventoryItems.filter(item => {
      const sameSkuItems = inventoryItems.filter(invItem => invItem.sku === item.sku);
      const totalStock = sameSkuItems.reduce((sum, curr) => sum + curr.stock, 0);
      
      const bufferedThreshold = item.lowStockThreshold * 1.1;
      
      return totalStock <= bufferedThreshold;
    });
    
    const uniqueLowStockItems = Array.from(
      new Set(lowStockItems.map(item => item.sku))
    ).map(sku => lowStockItems.find(item => item.sku === sku));
    
    const count = uniqueLowStockItems.length;
    setLowStockCount(count);
    
    setStats(prevStats => prevStats.map(stat => 
      stat.name === "Low Stock Items" 
        ? { ...stat, value: count.toString() } 
        : stat
    ));
  };

  return {
    stats,
    categoryData,
    lowStockCount
  };
}
