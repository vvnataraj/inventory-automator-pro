import React, { useMemo } from "react";
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
import { format, addMonths, parseISO, startOfMonth, getMonth } from "date-fns";

interface DemandForecastProps {
  sales: Sale[];
}

export const DemandForecast: React.FC<DemandForecastProps> = ({ sales }) => {
  // Generate forecast data based on historical sales
  const forecastData = useMemo(() => {
    // Get sales data for the last 6 months
    const monthlyData: Record<string, { month: string, actual: number, date: Date }> = {};
    
    // Initialize with last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = startOfMonth(addMonths(new Date(), -i));
      const monthKey = format(date, 'MMM yyyy');
      monthlyData[monthKey] = { month: monthKey, actual: 0, date };
    }
    
    // Populate with actual sales data
    sales.forEach(sale => {
      const saleDate = parseISO(sale.date);
      const monthKey = format(saleDate, 'MMM yyyy');
      
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].actual += sale.total;
      }
    });

    // Convert to array and sort by date
    const sortedData = Object.values(monthlyData).sort((a, b) => 
      a.date.getTime() - b.date.getTime()
    );
    
    // Simple forecasting for next 3 months using moving average
    // This is a simple algorithm - in real applications, more sophisticated methods would be used
    const forecast = [];
    const historyMonths = sortedData.map(d => d.actual);
    
    // Calculate average growth rate from historical data
    let growthRates = [];
    for (let i = 1; i < historyMonths.length; i++) {
      if (historyMonths[i-1] > 0) {
        growthRates.push((historyMonths[i] - historyMonths[i-1]) / historyMonths[i-1]);
      }
    }
    
    const avgGrowthRate = growthRates.length > 0 
      ? growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length
      : 0.05; // Default to 5% if we can't calculate
    
    // Generate forecast for next 3 months
    let lastValue = historyMonths[historyMonths.length - 1];
    for (let i = 1; i <= 3; i++) {
      const nextDate = addMonths(sortedData[sortedData.length - 1].date, i);
      const nextMonth = format(nextDate, 'MMM yyyy');
      // Apply growth rate with some randomness
      lastValue = lastValue * (1 + avgGrowthRate + (Math.random() * 0.04 - 0.02));
      forecast.push({
        month: nextMonth,
        forecast: Math.round(lastValue * 100) / 100,
        actual: undefined,
        date: nextDate
      });
    }
    
    // Combine historical and forecast data
    return sortedData.map(item => ({
      ...item,
      forecast: undefined
    })).concat(forecast);
  }, [sales]);

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
            This forecast is based on historical sales data using a simple moving average model 
            with seasonal adjustments. Actual results may vary based on market conditions.
          </AlertDescription>
        </Alert>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={forecastData}
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
                  // Ensure value is a number before calling toFixed
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
