
import React from "react";
import { InventoryItem } from "@/types/inventory";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { CircleDollarSign, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface InventoryItemDetailsProps {
  item: InventoryItem;
}

export const InventoryItemDetails: React.FC<InventoryItemDetailsProps> = ({ item }) => {
  // Calculate profit margin if RRP exists
  const profitMargin = item.rrp ? ((item.rrp - item.cost) / item.rrp * 100).toFixed(0) : null;
  
  return (
    <>
      <div className="flex flex-col space-y-2">
        <h3 className="font-semibold text-sm tracking-tight break-words line-clamp-2 group-hover:text-primary transition-colors">
          {item.name}
        </h3>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs font-normal bg-secondary/50">
            {item.category}
          </Badge>
          <span className="text-xs text-muted-foreground">
            SKU: {item.sku}
          </span>
        </div>
      </div>
      
      <Separator className="my-3" />
      
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col space-y-1 bg-secondary/30 p-2 rounded-md">
          <div className="flex items-center space-x-1 text-muted-foreground text-xs">
            <CircleDollarSign className="h-3 w-3" />
            <span>Cost</span>
          </div>
          <p className="font-medium text-sm">
            ${item.cost.toFixed(2)}
          </p>
        </div>
        
        <div className="flex flex-col space-y-1 bg-secondary/30 p-2 rounded-md">
          <div className="flex items-center space-x-1 text-muted-foreground text-xs">
            <CircleDollarSign className="h-3 w-3" />
            <span>RRP</span>
          </div>
          <p className="font-medium text-sm">
            ${item.rrp ? item.rrp.toFixed(2) : "-"}
          </p>
        </div>
        
        <div className="flex flex-col space-y-1 bg-secondary/30 p-2 rounded-md">
          <div className="flex items-center space-x-1 text-muted-foreground text-xs">
            <Package className="h-3 w-3" />
            <span>Stock</span>
          </div>
          <p className="font-medium text-sm">
            <span className={cn(
              "px-1.5 py-0.5 rounded-md text-xs inline-flex items-center justify-center",
              item.stock <= item.lowStockThreshold
                ? "bg-red-100 text-red-800"
                : item.stock <= item.lowStockThreshold * 2
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            )}>
              {item.stock}
            </span>
          </p>
        </div>
        
        {profitMargin && (
          <div className="flex flex-col space-y-1 bg-secondary/30 p-2 rounded-md">
            <div className="flex items-center space-x-1 text-muted-foreground text-xs">
              <CircleDollarSign className="h-3 w-3" />
              <span>Margin</span>
            </div>
            <p className={cn(
              "font-medium text-sm",
              Number(profitMargin) <= 15 ? "text-red-500" : 
              Number(profitMargin) <= 30 ? "text-yellow-600" : 
              "text-green-600"
            )}>
              {profitMargin}%
            </p>
          </div>
        )}
      </div>
    </>
  );
};
