
import { useState, useCallback } from "react";
import { InventoryItem } from "@/types/inventory";

export function useInventoryDialogs() {
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  
  const handleOpenReorderDialog = useCallback((item: InventoryItem) => {
    setSelectedItem(item);
    setReorderDialogOpen(true);
  }, []);
  
  return {
    reorderDialogOpen,
    setReorderDialogOpen,
    selectedItem,
    setSelectedItem,
    handleOpenReorderDialog
  };
}
