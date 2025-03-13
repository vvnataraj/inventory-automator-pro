
import React from "react";
import { AddInventoryItem } from "./AddInventoryItem";
import { InventoryItem } from "@/types/inventory";

interface InventoryHeaderProps {
  onAddItem: (newItem: InventoryItem) => void;
}

export const InventoryHeader: React.FC<InventoryHeaderProps> = ({ onAddItem }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-semibold tracking-tight">Inventory</h1>
      <AddInventoryItem onAdd={onAddItem} />
    </div>
  );
};
