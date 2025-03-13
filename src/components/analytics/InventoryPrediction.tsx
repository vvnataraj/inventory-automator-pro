
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
  Legend
} from "recharts";
import { Sale } from "@/types/sale";
import { Badge } from "@/components/ui/badge";

interface InventoryPredictionProps {
  sales: Sale[];
}

export const InventoryPrediction: React.FC<InventoryPredictionProps> = ({ sales }) => {
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
    
    // Calculate predicted days until restock needed
    return sortedProducts.map(product => {
      // Calculate daily sales rate (assuming sales data is for last 30 days)
      const dailyRate = product.count / 30;
      
      // Randomly assign current stock for this example
      // In a real app, this would come from your inventory data
      const currentStock = Math.floor(Math.random() * 50) + 5;
      
      // Calculate days until restock needed
      const daysUntilRestock = dailyRate > 0 ? Math.floor(currentStock / dailyRate) : 100;
      
      return {
        name: product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name,
        currentStock,
        daysUntilRestock: Math.min(daysUntilRestock, 30), // Cap at 30 days
        stockStatus: daysUntilRestock <= 7 ? 'critical' : daysUntilRestock <= 14 ? 'warning' : 'good',
        fullName: product.name,
        itemId: product.itemId
      };
    });
  }, [sales]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'good': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <Card>
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
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stockPredictionData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 30]} label={{ value: 'Days Until Restock Needed', position: 'insideBottom', offset: -5 }} />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip 
                formatter={(value, name, props) => {
                  if (name === "daysUntilRestock") {
                    return [`${value} days`, props.payload.fullName];
                  }
                  return [value, name];
                }}
                labelFormatter={(label) => ""}
              />
              <Legend />
              <ReferenceLine x={7} stroke="red" strokeDasharray="3 3" />
              <ReferenceLine x={14} stroke="orange" strokeDasharray="3 3" />
              <Bar 
                dataKey="daysUntilRestock" 
                fill="#8884d8" 
                background={{ fill: '#eee' }}
                name="Days Until Restock"
                radius={[0, 4, 4, 0]}
              >
                {
                  stockPredictionData.map((entry, index) => (
                    <rect 
                      key={`rect-${index}`} 
                      className={getStatusColor(entry.stockStatus)}
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
