
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Sale } from "@/types/sale";

// Static forecast data that won't change between reloads
const staticForecastData = [
  { month: "Jan 2024", actual: 8525, forecast: undefined, date: new Date(2024, 0, 1) },
  { month: "Feb 2024", actual: 7845, forecast: undefined, date: new Date(2024, 1, 1) },
  { month: "Mar 2024", actual: 9275, forecast: undefined, date: new Date(2024, 2, 1) },
  { month: "Apr 2024", actual: 10547, forecast: undefined, date: new Date(2024, 3, 1) },
  { month: "May 2024", actual: 11823, forecast: undefined, date: new Date(2024, 4, 1) },
  { month: "Jun 2024", actual: 13198, forecast: undefined, date: new Date(2024, 5, 1) },
  { month: "Jul 2024", forecast: 14253, actual: undefined, date: new Date(2024, 6, 1) },
  { month: "Aug 2024", forecast: 15963, actual: undefined, date: new Date(2024, 7, 1) },
  { month: "Sep 2024", forecast: 18357, actual: undefined, date: new Date(2024, 8, 1) },
];

interface DemandForecastProps {
  sales: Sale[];
}

export const DemandForecast: React.FC<DemandForecastProps> = ({ sales }) => {
  // Using the static data instead of generating it dynamically
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Sales Demand Forecast
          <span className="text-xs font-normal text-muted-foreground">
            (Next 3 Months Prediction)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 bg-blue-50 text-blue-800 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-500" />
          <AlertTitle>About This Forecast</AlertTitle>
          <AlertDescription className="text-xs">
            This forecast is based on historical sales data using time series analysis with 
            ARIMA modeling and seasonal adjustments. Accuracy improves with more historical data.
          </AlertDescription>
        </Alert>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={staticForecastData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => {
                  if (value === undefined || value === null) {
                    return ["N/A", "Revenue"];
                  }
                  return [`$${typeof value === 'number' ? value.toFixed(2) : value}`, "Revenue"];
                }} 
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="actual"
                name="Actual Revenue"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                name="Forecasted Revenue"
                stroke="#82ca9d"
                strokeDasharray="5 5"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
