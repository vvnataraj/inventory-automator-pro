
import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Package, AlertTriangle, ArrowRight } from "lucide-react";
import { Sale } from "@/types/sale";
import { Badge } from "@/components/ui/badge";
import { inventoryItems } from "@/data/inventoryData";

interface RestockAlertsProps {
  sales: Sale[];
  className?: string;
}

export const RestockAlerts: React.FC<RestockAlertsProps> = ({ sales, className }) => {
  const navigate = useNavigate();
  
  // Calculate low stock items based on actual inventory data
  const lowStockItems = useMemo(() => {
    // Group items by SKU to get accurate stock counts
    const skuMap = new Map();
    
    // First collect all items by SKU
    inventoryItems.forEach(item => {
      if (!skuMap.has(item.sku)) {
        skuMap.set(item.sku, {
          ...item,
          totalStock: item.stock,
          items: [item]
        });
      } else {
        const existing = skuMap.get(item.sku);
        existing.totalStock += item.stock;
        existing.items.push(item);
      }
    });
    
    // Then filter those that are below or near threshold
    const critical = [];
    const warning = [];
    
    skuMap.forEach(groupedItem => {
      // Critical: at or below threshold
      if (groupedItem.totalStock <= groupedItem.lowStockThreshold) {
        critical.push(groupedItem);
      } 
      // Warning: within 2x of threshold but not critical
      else if (groupedItem.totalStock <= groupedItem.lowStockThreshold * 2) {
        warning.push(groupedItem);
      }
    });
    
    console.log(`Found ${critical.length} critical and ${warning.length} warning stock items`);
    
    return {
      critical,
      warning
    };
  }, []);
  
  const handleViewDetails = () => {
    navigate("/analytics?tab=predictive");
  };
  
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Inventory Alerts</h3>
        </div>
        
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between bg-red-50 dark:bg-red-950/20 p-3 rounded-md">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="font-medium">Critical Restock</p>
                <p className="text-sm text-muted-foreground">Items needing immediate restock</p>
              </div>
            </div>
            <Badge variant="destructive" className="text-lg h-7 px-2">
              {lowStockItems.critical.length}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                <Package className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-medium">Warning Restock</p>
                <p className="text-sm text-muted-foreground">Items running low on stock</p>
              </div>
            </div>
            <Badge variant="outline" className="text-lg h-7 px-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800">
              {lowStockItems.warning.length}
            </Badge>
          </div>
          
          {(lowStockItems.critical.length > 0 || lowStockItems.warning.length > 0) && (
            <div className="mt-3 space-y-2 max-h-36 overflow-y-auto pr-1">
              {lowStockItems.critical.slice(0, 3).map(item => (
                <div key={`critical-${item.sku}`} className="flex items-center justify-between p-2 rounded-md bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30">
                  <div className="text-sm font-medium truncate max-w-[70%]" title={item.name}>
                    {item.name}
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    {item.totalStock}/{item.lowStockThreshold}
                  </Badge>
                </div>
              ))}
              
              {lowStockItems.warning.slice(0, 3).map(item => (
                <div key={`warning-${item.sku}`} className="flex items-center justify-between p-2 rounded-md bg-amber-50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-900/30">
                  <div className="text-sm font-medium truncate max-w-[70%]" title={item.name}>
                    {item.name}
                  </div>
                  <Badge variant="outline" className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                    {item.totalStock}/{item.lowStockThreshold}
                  </Badge>
                </div>
              ))}
              
              {(lowStockItems.critical.length > 3 || lowStockItems.warning.length > 3) && (
                <div className="text-xs text-center text-muted-foreground pt-1">
                  {lowStockItems.critical.length + lowStockItems.warning.length > 6 ? 
                    `+ ${lowStockItems.critical.length + lowStockItems.warning.length - 6} more items` : ''}
                </div>
              )}
            </div>
          )}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4 justify-between"
          onClick={handleViewDetails}
        >
          View Inventory Prediction 
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};
