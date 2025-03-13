import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  LabelList,
  Cell
} from "recharts";
import { Sale } from "@/types/sale";
import { Badge } from "@/components/ui/badge";

interface InventoryPredictionProps {
  sales: Sale[];
  className?: string;
}

export const InventoryPrediction: React.FC<InventoryPredictionProps> = ({ sales, className }) => {
  const stockPredictionData = useMemo(() => {
    // Count sales by product to determine popular items
    const productSales: Record<string, { name: string; count: number; itemId: string }> = {};
    
    sales.forEach(sale => {
      sale.items.forEach(item => {
        const name = item.name;
        if (!productSales[name]) {
          productSales[name] = { name, count: 0, itemId: item.inventoryItemId };
        }
        productSales[name].count += item.quantity;
      });
    });
    
    // Convert to array and sort by count
    const sortedProducts = Object.values(productSales)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 products
    
    // Add specific products with critical and warning levels
    const predictionData = sortedProducts.map((product, index) => {
      // Calculate daily sales rate (assuming sales data is for last 30 days)
      const dailyRate = product.count / 30;
      
      // Set specific stock levels for demonstration
      let currentStock = Math.floor(Math.random() * 50) + 5;
      let daysUntilRestock = dailyRate > 0 ? Math.floor(currentStock / dailyRate) : 100;
      
      // Ensure we have some items at each warning level
      if (index === 0) {
        // First item: critical (less than 7 days)
        currentStock = Math.max(1, Math.floor(dailyRate * 5));
        daysUntilRestock = 5;
      } else if (index === 1 || index === 2) {
        // Second and third items: warning (less than 14 days)
        currentStock = Math.max(1, Math.floor(dailyRate * 10));
        daysUntilRestock = 10;
      }
      
      return {
        name: product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name,
        currentStock,
        daysUntilRestock: Math.min(daysUntilRestock, 30), // Cap at 30 days
        stockStatus: daysUntilRestock <= 7 ? 'critical' : daysUntilRestock <= 14 ? 'warning' : 'good',
        fullName: product.name,
        itemId: product.itemId
      };
    });
    
    // Sort by days until restock (ascending)
    return predictionData.sort((a, b) => a.daysUntilRestock - b.daysUntilRestock);
    
  }, [sales]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'critical': return '#ef4444'; // Red
      case 'warning': return '#f59e0b'; // Yellow/Amber
      case 'good': return '#22c55e'; // Green
      default: return '#3b82f6'; // Blue
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Inventory Restock Prediction</span>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span> Critical (&lt;7 days)
            </Badge>
            <Badge variant="outline" className="text-xs">
              <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span> Warning (&lt;14 days)
            </Badge>
            <Badge variant="outline" className="text-xs">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span> Good
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stockPredictionData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
              barSize={20}
              barGap={12}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis 
                type="number" 
                domain={[0, 30]} 
                label={{ value: 'Days Until Restock Needed', position: 'insideBottom', offset: -5 }} 
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={150} 
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value, name, props) => {
                  if (name === "daysUntilRestock") {
                    return [`${value} days`, props.payload.fullName];
                  }
                  return [value, name];
                }}
                labelFormatter={(label) => ""}
              />
              <ReferenceLine x={7} stroke="#ef4444" strokeDasharray="3 3" />
              <ReferenceLine x={14} stroke="#f59e0b" strokeDasharray="3 3" />
              <Bar 
                dataKey="daysUntilRestock" 
                name="Days Until Restock"
                radius={[0, 4, 4, 0]}
                background={{ fill: '#eee' }}
              >
                <LabelList 
                  dataKey="daysUntilRestock" 
                  position="right" 
                  formatter={(value: number) => `${value} days`}
                  style={{ fontSize: '11px', fill: '#333' }}
                />
                {
                  stockPredictionData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getStatusColor(entry.stockStatus)}
                    />
                  ))
                }
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
