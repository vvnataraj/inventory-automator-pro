import { useState } from "react";
import { useInventoryItems } from "@/hooks/useInventoryItems";
import { InventoryItem, SortField, SortDirection } from "@/types/inventory";
import { toast } from "sonner";

export function useInventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  
  const { 
    items, 
    isLoading, 
    totalItems, 
    updateItem, 
    addItem, 
    deleteItem, 
    reorderItem, 
    reorderStock,
    fetchItems,
    reactivateAllItems
  } = useInventoryItems(
    currentPage, 
    searchQuery,
    sortField,
    sortDirection
  );
  
  const itemsPerPage = 20;

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSaveItem = (updatedItem: InventoryItem) => {
    updateItem(updatedItem);
    toast.success(`Successfully updated ${updatedItem.name}`);
  };

  const handleAddItem = (newItem: InventoryItem) => {
    addItem(newItem);
    toast.success(`Successfully added ${newItem.name} to inventory`);
  };

  const handleDeleteItem = (itemId: string) => {
    const itemName = items.find(item => item.id === itemId)?.name || "Item";
    deleteItem(itemId);
    toast.error(`Successfully deleted ${itemName} from inventory`);
  };

  const handleReorderItem = (itemId: string, direction: 'up' | 'down') => {
    reorderItem(itemId, direction);
    toast.success(`Item moved ${direction}`);
  };

  const handleOpenReorderDialog = (item: InventoryItem) => {
    setSelectedItem(item);
    setReorderDialogOpen(true);
  };

  const handleReorderStock = (item: InventoryItem, quantity: number) => {
    reorderStock(item, quantity);
    toast.success(`Ordered ${quantity} units of ${item.name} from ${item.supplier}`);
  };

  const handleTransferItem = (item: InventoryItem, quantity: number, newLocation: string) => {
    const sourceItem = { ...item, stock: item.stock - quantity };
    
    const existingDestItem = items.find(i => 
      i.sku === item.sku && i.location === newLocation
    );
    
    if (existingDestItem) {
      const destinationItem = { 
        ...existingDestItem, 
        stock: existingDestItem.stock + quantity 
      };
      updateItem(destinationItem);
    }
    
    updateItem(sourceItem);
    
    toast.success(`Successfully transferred ${quantity} units of ${item.name} to ${newLocation}`);
  };

  const handleReactivateAllItems = async () => {
    await reactivateAllItems();
  };

  return {
    state: {
      searchQuery,
      currentPage,
      viewMode,
      sortField,
      sortDirection,
      reorderDialogOpen,
      selectedItem,
      items,
      isLoading,
      totalItems,
      itemsPerPage
    },
    actions: {
      setSearchQuery,
      setCurrentPage,
      setViewMode,
      setSortField,
      setSortDirection,
      setReorderDialogOpen,
      setSelectedItem,
      handleSort,
      handleSaveItem,
      handleAddItem,
      handleDeleteItem,
      handleReorderItem,
      handleOpenReorderDialog,
      handleReorderStock,
      handleTransferItem,
      fetchItems,
      handleReactivateAllItems
    }
  };
}
