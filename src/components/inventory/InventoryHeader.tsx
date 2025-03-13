
import React from "react";
import { AddInventoryItem } from "./AddInventoryItem";
import { InventoryItem } from "@/types/inventory";
import { ExportInventoryButton } from "./ExportInventoryButton";

interface InventoryHeaderProps {
  onAddItem: (newItem: InventoryItem) => void;
  items: InventoryItem[];
  onImportItems?: (items: InventoryItem[]) => void;
}

export const InventoryHeader: React.FC<InventoryHeaderProps> = ({ 
  onAddItem, 
  items,
  onImportItems 
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 w-full">
      <h1 className="text-3xl font-semibold tracking-tight">Inventory</h1>
      <div className="flex flex-wrap gap-2 justify-end ml-auto">
        <ExportInventoryButton items={items} onImport={onImportItems} />
        <AddInventoryItem onAdd={onAddItem} />
      </div>
    </div>
  );
};
