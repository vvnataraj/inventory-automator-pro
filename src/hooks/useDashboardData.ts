
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
        value: "Loading...",
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
    // Group items by SKU to get accurate stock counts
    const skuMap = new Map();
    
    // First collect all items by SKU
    inventoryItems.forEach(item => {
      if (!skuMap.has(item.sku)) {
        skuMap.set(item.sku, {
          ...item,
          totalStock: item.stock,
          items: [item]
        });
      } else {
        const existing = skuMap.get(item.sku);
        existing.totalStock += item.stock;
        existing.items.push(item);
      }
    });
    
    // Then filter for low stock (matches logic in RestockAlerts.tsx)
    const criticalItems = [];
    const warningItems = [];
    
    skuMap.forEach(groupedItem => {
      // Critical: at or below threshold
      if (groupedItem.totalStock <= groupedItem.lowStockThreshold) {
        criticalItems.push(groupedItem);
      } 
      // Warning: within 2x of threshold but not critical
      else if (groupedItem.totalStock <= groupedItem.lowStockThreshold * 2) {
        warningItems.push(groupedItem);
      }
    });
    
    const totalLowStockCount = criticalItems.length + warningItems.length;
    console.log(`Dashboard found ${criticalItems.length} critical and ${warningItems.length} warning stock items`);
    
    setLowStockCount(totalLowStockCount);
    
    setStats(prevStats => prevStats.map(stat => 
      stat.name === "Low Stock Items" 
        ? { ...stat, value: totalLowStockCount.toString() } 
        : stat
    ));
  };

  return {
    stats,
    categoryData,
    lowStockCount
  };
}
