
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Sale } from "@/types/sale";
import { getDailySalesData } from "@/utils/analyticsUtils";

interface DailySalesChartProps {
  sales: Sale[];
}

export const DailySalesChart: React.FC<DailySalesChartProps> = ({ sales }) => {
  // Prepare data for daily sales chart
  const dailySalesData = getDailySalesData(sales);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Daily Sales (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dailySalesData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
            <Line type="monotone" dataKey="count" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
