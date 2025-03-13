
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
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from "recharts";
import { AlertTriangle, TrendingDown, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { InventoryItem } from "@/types/inventory";

// Static data for demonstration
const shrinkageByMonth = [
  { month: "Jan", value: 120, percentage: 0.6 },
  { month: "Feb", value: 90, percentage: 0.4 },
  { month: "Mar", value: 175, percentage: 0.8 },
  { month: "Apr", value: 210, percentage: 1.1 },
  { month: "May", value: 140, percentage: 0.7 },
  { month: "Jun", value: 250, percentage: 1.3 },
  { month: "Jul", value: 180, percentage: 0.9 },
];

const shrinkageByCategory = [
  { name: "Hardware", value: 35 },
  { name: "Tools", value: 25 },
  { name: "Electrical", value: 15 },
  { name: "Plumbing", value: 10 },
  { name: "Building Materials", value: 8 },
  { name: "Other", value: 7 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658'];

const highRiskItems = [
  { 
    id: "item1", 
    name: "Premium Drill Set", 
    sku: "TLS-123", 
    category: "Tools", 
    shrinkageRate: 2.8, 
    value: 450,
    lastCount: "2024-07-01"
  },
  { 
    id: "item2", 
    name: "Cordless Impact Driver", 
    sku: "TLS-456", 
    category: "Tools", 
    shrinkageRate: 2.5, 
    value: 380,
    lastCount: "2024-07-01"
  },
  { 
    id: "item3", 
    name: "Smart Door Lock", 
    sku: "HRD-789", 
    category: "Hardware", 
    shrinkageRate: 2.3, 
    value: 320,
    lastCount: "2024-07-02"
  },
  { 
    id: "item4", 
    name: "Wireless Security Camera", 
    sku: "ELC-234", 
    category: "Electrical", 
    shrinkageRate: 2.1, 
    value: 290,
    lastCount: "2024-07-02"
  },
  { 
    id: "item5", 
    name: "Copper Pipe Fittings", 
    sku: "PLM-567", 
    category: "Plumbing", 
    shrinkageRate: 1.9, 
    value: 210,
    lastCount: "2024-07-03"
  },
];

interface ShrinkageAnalyticsProps {
  inventoryItems?: InventoryItem[];
  className?: string;
}

export const ShrinkageAnalytics: React.FC<ShrinkageAnalyticsProps> = ({ 
  inventoryItems,
  className 
}) => {
  // Calculate total shrinkage
  const totalShrinkageValue = shrinkageByMonth.reduce((sum, item) => sum + item.value, 0);
  const averageShrinkagePercentage = (
    shrinkageByMonth.reduce((sum, item) => sum + item.percentage, 0) / 
    shrinkageByMonth.length
  ).toFixed(2);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shrinkage Value</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalShrinkageValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 6 months</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Shrinkage Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageShrinkagePercentage}%</div>
            <p className="text-xs text-muted-foreground">Of total inventory value</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Items</CardTitle>
            <Info className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highRiskItems.length}</div>
            <p className="text-xs text-muted-foreground">Items with high shrinkage rates</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Shrinkage Trend (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={shrinkageByMonth}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  yAxisId="left"
                  tickFormatter={(value) => `$${value}`}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === "value") return [`$${value}`, "Value"];
                    if (name === "percentage") return [`${value}%`, "Percentage"];
                    return [value, name];
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="value" 
                  name="Shrinkage Value" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="percentage" 
                  name="Shrinkage %" 
                  stroke="#82ca9d" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Shrinkage by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={shrinkageByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {shrinkageByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, "Value"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>High Risk Items</span>
            <Badge variant="destructive">
              Requires Attention
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Item Name</th>
                  <th className="text-left py-3 px-4 font-medium">SKU</th>
                  <th className="text-left py-3 px-4 font-medium">Category</th>
                  <th className="text-right py-3 px-4 font-medium">Shrinkage Rate</th>
                  <th className="text-right py-3 px-4 font-medium">Value at Risk</th>
                  <th className="text-left py-3 px-4 font-medium">Last Count</th>
                </tr>
              </thead>
              <tbody>
                {highRiskItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="py-3 px-4">{item.sku}</td>
                    <td className="py-3 px-4">{item.category}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-red-500 font-medium">{item.shrinkageRate}%</span>
                    </td>
                    <td className="py-3 px-4 text-right">${item.value}</td>
                    <td className="py-3 px-4">{new Date(item.lastCount).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
