
import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LocationStock {
  location: string;
  count: number;
}

interface StockDistributionCardProps {
  locationStocks: LocationStock[];
  totalStock: number;
}

export const StockDistributionCard: React.FC<StockDistributionCardProps> = ({ 
  locationStocks, 
  totalStock 
}) => {
  // Calculate percentage for each location
  const getStockPercentage = (count: number) => {
    return totalStock > 0 ? (count / totalStock) * 100 : 0;
  };

  return (
    <Card className="p-4">
      <div className="text-sm font-medium flex justify-between mb-2">
        <span>Total Stock: {totalStock} units</span>
      </div>
      <div className="space-y-3">
        {locationStocks.map((locationStock, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{locationStock.location}</span>
              <span>
                {locationStock.count} units ({getStockPercentage(locationStock.count).toFixed(1)}%)
              </span>
            </div>
            <Progress value={getStockPercentage(locationStock.count)} className="h-2" />
          </div>
        ))}
      </div>
    </Card>
  );
};
