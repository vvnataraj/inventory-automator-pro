
import React, { useState } from "react";
import { InventoryItem, SortField } from "@/types/inventory";
import { InventoryTableHeader } from "./table/InventoryTableHeader";
import { InventoryTableRow } from "./table/InventoryTableRow";
import { DiscontinueDialog } from "./table/DiscontinueDialog";

interface InventoryTableProps {
  items: InventoryItem[];
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  onSort: (field: SortField) => void;
  onSaveItem: (updatedItem: InventoryItem) => void;
  onTransferItem: (item: InventoryItem, quantity: number, newLocation: string) => void;
  onDeleteItem: (itemId: string) => void;
  onReorderItem: (itemId: string, direction: 'up' | 'down') => void;
  onOpenReorderDialog: (item: InventoryItem) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  sortField,
  sortDirection,
  onSort,
  onSaveItem,
  onTransferItem,
  onDeleteItem,
  onReorderItem,
  onOpenReorderDialog,
}) => {
  const [discontinueItem, setDiscontinueItem] = useState<InventoryItem | null>(null);
  
  const handleDiscontinue = () => {
    if (discontinueItem) {
      const updatedItem = {
        ...discontinueItem,
        isActive: !discontinueItem.isActive,
        lastUpdated: new Date().toISOString()
      };
      onSaveItem(updatedItem);
      setDiscontinueItem(null);
    }
  };
  
  return (
    <div className="rounded-md border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <InventoryTableHeader 
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          />
          <tbody>
            {items.map((item, index) => (
              <InventoryTableRow 
                key={item.id}
                item={item}
                index={index}
                totalItems={items.length}
                onSaveItem={onSaveItem}
                onTransferItem={onTransferItem}
                onDeleteItem={onDeleteItem}
                onReorderItem={onReorderItem}
                onOpenReorderDialog={onOpenReorderDialog}
                onDiscontinueClick={setDiscontinueItem}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      <DiscontinueDialog 
        item={discontinueItem}
        open={!!discontinueItem}
        onOpenChange={(open) => !open && setDiscontinueItem(null)}
        onConfirm={handleDiscontinue}
      />
    </div>
  );
};
