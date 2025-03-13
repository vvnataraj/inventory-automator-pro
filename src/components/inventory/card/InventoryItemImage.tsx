
import React from "react";
import { Badge } from "@/components/ui/badge";
import { InventoryItem } from "@/types/inventory";

interface InventoryItemImageProps {
  item: InventoryItem;
}

export const InventoryItemImage: React.FC<InventoryItemImageProps> = ({ item }) => {
  return (
    <div className="relative pt-[100%] overflow-hidden bg-muted">
      <div className="absolute inset-0 flex items-center justify-center">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/20">
            <span className="text-muted-foreground">{item.category}</span>
          </div>
        )}
      </div>
      <Badge 
        className={`absolute top-2 right-2 ${
          item.stock <= item.lowStockThreshold
            ? "bg-red-500"
            : item.stock <= item.lowStockThreshold * 2
            ? "bg-yellow-500"
            : "bg-green-500"
        }`}
      >
        {item.stock}
      </Badge>
      {!item.isActive && (
        <Badge variant="destructive" className="absolute top-2 left-2">
          Discontinued
        </Badge>
      )}
    </div>
  );
};
