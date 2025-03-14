
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

// Improved seasonal data with more realistic trends
const staticSeasonalData = [
  { month: "Jan", monthNum: 0, revenue: 8500, count: 172, avgOrderValue: 49.42, revenueTrend: 8500, avgOrderTrend: 49.50 },
  { month: "Feb", monthNum: 1, revenue: 7900, count: 155, avgOrderValue: 50.97, revenueTrend: 8950, avgOrderTrend: 52.30 },
  { month: "Mar", monthNum: 2, revenue: 9300, count: 175, avgOrderValue: 53.14, revenueTrend: 9400, avgOrderTrend: 55.10 },
  { month: "Apr", monthNum: 3, revenue: 10600, count: 190, avgOrderValue: 55.79, revenueTrend: 9850, avgOrderTrend: 57.90 },
  { month: "May", monthNum: 4, revenue: 11900, count: 205, avgOrderValue: 58.05, revenueTrend: 10300, avgOrderTrend: 60.70 },
  { month: "Jun", monthNum: 5, revenue: 13100, count: 215, avgOrderValue: 60.93, revenueTrend: 10750, avgOrderTrend: 63.50 },
];

interface SeasonalTrendsProps {
  sales: Sale[];
}

export const SeasonalTrends: React.FC<SeasonalTrendsProps> = ({ sales }) => {
  // Calculate trendline points for smoother rendering
  const calculateTrendPoints = () => {
    const revenuePoints = staticSeasonalData.map((item, index) => ({
      x: item.month,
      y: item.revenueTrend
    }));

    const aovPoints = staticSeasonalData.map((item, index) => ({
      x: item.month,
      y: item.avgOrderTrend
    }));

    return { revenuePoints, aovPoints };
  };

  const { revenuePoints, aovPoints } = calculateTrendPoints();

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
                <linearGradient id="colorRevenueTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ff7300" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorAOVTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2e4783" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2e4783" stopOpacity={0.1}/>
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
                strokeWidth={2}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="avgOrderValue"
                name="Avg Order Value"
                stroke="#82ca9d"
                fill="url(#colorAvgOrder)"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              {/* Use smooth curve for trend lines */}
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenueTrend"
                name="Revenue Trend"
                stroke="#ff7300"
                strokeWidth={2}
                fillOpacity={0}
                strokeDasharray="0"
                activeDot={false}
                isAnimationActive={true}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="avgOrderTrend"
                name="AOV Trend"
                stroke="#2e4783"
                strokeWidth={2}
                fillOpacity={0}
                strokeDasharray="0"
                activeDot={false}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
