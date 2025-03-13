
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface LocationStock {
  location: string;
  count: number;
}

interface StockDistributionCardProps {
  locationStocks: LocationStock[];
  totalStock: number;
  reorderQuantity: number;
  onLocationStockChange: (location: string, newCount: number) => void;
}

export const StockDistributionCard: React.FC<StockDistributionCardProps> = ({ 
  locationStocks, 
  totalStock,
  reorderQuantity,
  onLocationStockChange
}) => {
  // Calculate percentage for each location
  const getStockPercentage = (count: number) => {
    return totalStock > 0 ? (count / totalStock) * 100 : 0;
  };

  const handleStockChange = (location: string, value: string) => {
    const newCount = parseInt(value, 10) || 0;
    if (newCount >= 0) {
      onLocationStockChange(location, newCount);
    }
  };

  // Calculate if stock is at reorder level (10% of reorder quantity)
  const isAtReorderLevel = totalStock <= (reorderQuantity * 0.1);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Stock Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm font-medium flex justify-between mb-3">
          <span className="text-base font-semibold">Total Stock: {totalStock} units</span>
        </div>
        
        {isAtReorderLevel && reorderQuantity > 0 && (
          <Alert className="my-2 border-amber-500 bg-amber-50 text-amber-900">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertTitle>Reorder Alert</AlertTitle>
            <AlertDescription>
              Stock level is at or below 10% of the recommended reorder quantity.
            </AlertDescription>
          </Alert>
        )}
        
        <Separator className="my-2" />
        <div className="space-y-4 mt-3">
          {locationStocks.map((locationStock, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-primary">{locationStock.location}</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    value={locationStock.count}
                    onChange={(e) => handleStockChange(locationStock.location, e.target.value)}
                    className={cn(
                      "w-20 h-7 text-right",
                      locationStock.count <= 5 ? "text-red-600 font-semibold" : ""
                    )}
                  />
                  <span className="text-sm">units</span>
                </div>
              </div>
              <Progress 
                value={getStockPercentage(locationStock.count)} 
                className={cn(
                  "h-2", 
                  locationStock.count <= 5 ? "bg-red-100" : ""
                )}
                indicatorClassName={locationStock.count <= 5 ? "bg-red-500" : undefined}
              />
              {locationStock.count <= 5 && (
                <p className="text-xs text-red-600 font-medium">Low stock warning</p>
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
