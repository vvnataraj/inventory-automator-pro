
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Sale } from "@/types/sale";
import { getStatusDistribution } from "@/utils/analyticsUtils";

interface SalesByStatusChartProps {
  sales: Sale[];
}

export const SalesByStatusChart: React.FC<SalesByStatusChartProps> = ({ sales }) => {
  // Prepare data for status distribution
  const statusData = getStatusDistribution(sales);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Sales By Status</CardTitle>
      </CardHeader>
      <CardContent className="h-[200px] flex justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={statusData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
