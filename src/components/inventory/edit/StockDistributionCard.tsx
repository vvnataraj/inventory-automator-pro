
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Stock Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm font-medium flex justify-between mb-3">
          <span>Total Stock: {totalStock} units</span>
        </div>
        <Separator className="my-2" />
        <div className="space-y-4 mt-3">
          {locationStocks.map((locationStock, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-primary">{locationStock.location}</span>
                <span className="font-semibold">
                  {locationStock.count} units ({getStockPercentage(locationStock.count).toFixed(1)}%)
                </span>
              </div>
              <Progress 
                value={getStockPercentage(locationStock.count)} 
                className={cn("h-2", locationStock.count <= 5 ? "bg-red-100" : "")}
              />
              {locationStock.count <= 5 && (
                <p className="text-xs text-destructive">Low stock warning</p>
              )}
            </div>
          ))}
          {locationStocks.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-2">
              No stock information available for this item
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
