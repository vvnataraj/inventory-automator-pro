
import React from "react";
import { AddInventoryItem } from "./AddInventoryItem";
import { InventoryItem } from "@/types/inventory";
import { ExportInventoryButton } from "./ExportInventoryButton";

interface InventoryHeaderProps {
  onAddItem: (newItem: InventoryItem) => void;
  items: InventoryItem[];
}

export const InventoryHeader: React.FC<InventoryHeaderProps> = ({ onAddItem, items }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-semibold tracking-tight">Inventory</h1>
      <div className="flex gap-2">
        <ExportInventoryButton items={items} />
        <AddInventoryItem onAdd={onAddItem} />
      </div>
    </div>
  );
};
