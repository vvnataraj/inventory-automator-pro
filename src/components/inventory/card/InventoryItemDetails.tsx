
import React from "react";
import { InventoryItem } from "@/types/inventory";

interface InventoryItemDetailsProps {
  item: InventoryItem;
}

export const InventoryItemDetails: React.FC<InventoryItemDetailsProps> = ({ item }) => {
  return (
    <>
      <div className="flex flex-col space-y-1.5">
        <h3 className="font-semibold text-base break-words">{item.name}</h3>
        <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-muted-foreground">RRP</p>
          <p className="font-medium">${item.rrp ? item.rrp.toFixed(2) : "-"}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Cost</p>
          <p className="font-medium">${item.cost.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Total Units</p>
          <p className="font-medium">{item.stock}</p>
        </div>
      </div>
    </>
  );
};
