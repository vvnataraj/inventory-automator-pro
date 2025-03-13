
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from "recharts";
import { Sale } from "@/types/sale";

// Static seasonal data that won't change between reloads
const staticSeasonalData = [
  { month: "Jan", monthNum: 0, revenue: 8500, count: 172, avgOrderValue: 49.42, revenueTrend: 9100, avgOrderTrend: 50.32 },
  { month: "Feb", monthNum: 1, revenue: 7900, count: 155, avgOrderValue: 50.97, revenueTrend: 9800, avgOrderTrend: 54.78 },
  { month: "Mar", monthNum: 2, revenue: 9300, count: 175, avgOrderValue: 53.14, revenueTrend: 10500, avgOrderTrend: 59.24 },
  { month: "Apr", monthNum: 3, revenue: 10600, count: 190, avgOrderValue: 55.79, revenueTrend: 11200, avgOrderTrend: 63.70 },
  { month: "May", monthNum: 4, revenue: 11900, count: 205, avgOrderValue: 58.05, revenueTrend: 11900, avgOrderTrend: 68.16 },
  { month: "Jun", monthNum: 5, revenue: 13100, count: 215, avgOrderValue: 60.93, revenueTrend: 12600, avgOrderTrend: 72.62 },
];

interface SeasonalTrendsProps {
  sales: Sale[];
}

export const SeasonalTrends: React.FC<SeasonalTrendsProps> = ({ sales }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Seasonal Sales Trends (YTD)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={staticSeasonalData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAvgOrder" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(value, name) => {
                if (name === "revenue") {
                  return [`$${typeof value === 'number' ? value.toFixed(2) : value}`, "Revenue"];
                }
                if (name === "avgOrderValue") {
                  return [`$${typeof value === 'number' ? value.toFixed(2) : value}`, "Avg Order Value"];
                }
                if (name === "revenueTrend") {
                  return [`$${typeof value === 'number' ? value.toFixed(2) : value}`, "Revenue Trend"];
                }
                if (name === "avgOrderTrend") {
                  return [`$${typeof value === 'number' ? value.toFixed(2) : value}`, "AOV Trend"];
                }
                return [value, name];
              }} />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#8884d8"
                fill="url(#colorRevenue)"
                fillOpacity={0.3}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="avgOrderValue"
                name="Avg Order Value"
                stroke="#82ca9d"
                fill="url(#colorAvgOrder)"
                fillOpacity={0.3}
              />
              <ReferenceLine 
                yAxisId="left"
                stroke="#ff7300" 
                strokeWidth={2}
                strokeDasharray="5 5" 
                segment={[
                  { x: staticSeasonalData[0].month, y: staticSeasonalData[0].revenueTrend },
                  { x: staticSeasonalData[staticSeasonalData.length-1].month, y: staticSeasonalData[staticSeasonalData.length-1].revenueTrend }
                ]} 
              />
              <ReferenceLine 
                yAxisId="right"
                stroke="#2e4783" 
                strokeWidth={2}
                strokeDasharray="5 5" 
                segment={[
                  { x: staticSeasonalData[0].month, y: staticSeasonalData[0].avgOrderTrend },
                  { x: staticSeasonalData[staticSeasonalData.length-1].month, y: staticSeasonalData[staticSeasonalData.length-1].avgOrderTrend }
                ]} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
