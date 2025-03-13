
import React from "react";
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

// Static prediction data that won't change between reloads
const staticStockPredictionData = [
  { name: "Premium Drill Set", currentStock: 5, daysUntilRestock: 5, stockStatus: 'critical', fullName: "Premium Drill Set", itemId: "inv-101" },
  { name: "Socket Wrench Kit", currentStock: 10, daysUntilRestock: 10, stockStatus: 'warning', fullName: "Socket Wrench Kit", itemId: "inv-102" },
  { name: "Cordless Saw", currentStock: 12, daysUntilRestock: 10, stockStatus: 'warning', fullName: "Cordless Saw", itemId: "inv-103" },
  { name: "Paint Sprayer", currentStock: 15, daysUntilRestock: 12, stockStatus: 'warning', fullName: "Paint Sprayer", itemId: "inv-104" },
  { name: "Power Sander", currentStock: 18, daysUntilRestock: 15, stockStatus: 'good', fullName: "Power Sander", itemId: "inv-105" },
  { name: "Hammer Drill", currentStock: 22, daysUntilRestock: 18, stockStatus: 'good', fullName: "Hammer Drill", itemId: "inv-106" },
  { name: "Measuring Tape", currentStock: 35, daysUntilRestock: 25, stockStatus: 'good', fullName: "Measuring Tape", itemId: "inv-107" },
  { name: "Wood Screws (Box)", currentStock: 42, daysUntilRestock: 28, stockStatus: 'good', fullName: "Wood Screws (Box of 100)", itemId: "inv-108" },
  { name: "Paint Brushes", currentStock: 38, daysUntilRestock: 30, stockStatus: 'good', fullName: "Paint Brushes Set", itemId: "inv-109" },
  { name: "Utility Knife", currentStock: 45, daysUntilRestock: 30, stockStatus: 'good', fullName: "Utility Knife", itemId: "inv-110" },
];

interface InventoryPredictionProps {
  sales: Sale[];
  className?: string;
}

export const InventoryPrediction: React.FC<InventoryPredictionProps> = ({ sales, className }) => {
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
              data={staticStockPredictionData}
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
                  staticStockPredictionData.map((entry, index) => (
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
