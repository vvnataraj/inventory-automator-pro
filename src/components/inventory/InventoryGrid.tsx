
import React from "react";
import { InventoryItem } from "@/types/inventory";
import { InventoryItemCard } from "./InventoryItemCard";

interface InventoryGridProps {
  items: InventoryItem[];
  onSaveItem: (updatedItem: InventoryItem) => void;
  onTransferItem: (item: InventoryItem, quantity: number, newLocation: string) => void;
  onDeleteItem: (itemId: string) => void;
  onReorderStock: (item: InventoryItem, quantity: number) => void;
}

export const InventoryGrid: React.FC<InventoryGridProps> = ({
  items,
  onSaveItem,
  onTransferItem,
  onDeleteItem,
  onReorderStock,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((item) => (
        <InventoryItemCard 
          key={item.id} 
          item={item} 
          onSave={onSaveItem}
          onTransfer={onTransferItem}
          onDelete={onDeleteItem}
          onReorderStock={onReorderStock}
        />
      ))}
    </div>
  );
};
