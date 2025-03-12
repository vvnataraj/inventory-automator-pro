
import React from "react";
import { InventoryItem } from "@/types/inventory";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditInventoryItem } from "./EditInventoryItem";
import { TransferInventoryItem } from "./TransferInventoryItem";

interface InventoryItemCardProps {
  item: InventoryItem;
  onSave: (updatedItem: InventoryItem) => void;
  onTransfer: (item: InventoryItem, quantity: number, newLocation: string) => void;
}

export const InventoryItemCard: React.FC<InventoryItemCardProps> = ({ 
  item, 
  onSave,
  onTransfer
}) => {
  return (
    <Card className="h-full flex flex-col transition-all hover:shadow-md">
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
      </div>
      
      <CardHeader className="pb-0">
        <div className="flex flex-col space-y-1.5">
          <h3 className="font-semibold text-base line-clamp-1">{item.name}</h3>
          <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Price</p>
            <p className="font-medium">${item.price.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Cost</p>
            <p className="font-medium">${item.cost.toFixed(2)}</p>
          </div>
          <div className="col-span-2">
            <p className="text-muted-foreground">Location</p>
            <p className="font-medium">{item.location}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 flex gap-2">
        <EditInventoryItem item={item} onSave={onSave} />
        <TransferInventoryItem item={item} onTransfer={onTransfer} />
      </CardFooter>
    </Card>
  );
};
