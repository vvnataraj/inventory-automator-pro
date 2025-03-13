
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { Sale } from "@/types/sale";
import { parseISO, getMonth, format } from "date-fns";

interface SeasonalTrendsProps {
  sales: Sale[];
}

export const SeasonalTrends: React.FC<SeasonalTrendsProps> = ({ sales }) => {
  const seasonalData = useMemo(() => {
    // Group sales by month
    const monthlyData: Record<number, { 
      month: string, 
      monthNum: number,
      revenue: number, 
      count: number,
      avgOrderValue: number
    }> = {};
    
    // Initialize months
    for (let i = 0; i < 12; i++) {
      const date = new Date(new Date().getFullYear(), i, 1);
      monthlyData[i] = { 
        month: format(date, 'MMM'), 
        monthNum: i,
        revenue: 0, 
        count: 0,
        avgOrderValue: 0 
      };
    }
    
    // Aggregate sales data by month
    sales.forEach(sale => {
      const saleDate = parseISO(sale.date);
      const month = getMonth(saleDate);
      
      monthlyData[month].revenue += sale.total;
      monthlyData[month].count += 1;
    });
    
    // Calculate average order value
    Object.values(monthlyData).forEach(data => {
      data.avgOrderValue = data.count > 0 ? data.revenue / data.count : 0;
    });
    
    // Convert to sorted array
    return Object.values(monthlyData)
      .sort((a, b) => a.monthNum - b.monthNum);
  }, [sales]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Seasonal Sales Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={seasonalData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(value, name) => {
                if (name === "revenue") return [`$${value.toFixed(2)}`, "Revenue"];
                if (name === "avgOrderValue") return [`$${value.toFixed(2)}`, "Avg Order Value"];
                return [value, name];
              }} />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="avgOrderValue"
                name="Avg Order Value"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
