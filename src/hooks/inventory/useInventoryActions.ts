
import { useCallback } from "react";
import { InventoryItem } from "@/types/inventory";
import { toast } from "sonner";

export function useInventoryActions(
  items: InventoryItem[],
  updateItem: (item: InventoryItem) => Promise<boolean>,
  addItem: (item: InventoryItem) => Promise<boolean>,
  deleteItem: (itemId: string) => Promise<boolean>,
  reorderItem: (itemId: string, direction: 'up' | 'down') => void,
  reorderStock: (item: InventoryItem, quantity: number) => Promise<void>,
  reactivateAllItems: () => Promise<void>,
  refresh: () => Promise<void>
) {
  const handleSaveItem = useCallback(async (updatedItem: InventoryItem) => {
    const success = await updateItem(updatedItem);
    if (success) {
      toast.success(`Successfully updated ${updatedItem.name}`);
    }
  }, [updateItem]);

  const handleAddItem = useCallback(async (newItem: InventoryItem) => {
    const success = await addItem(newItem);
    if (success) {
      toast.success(`Successfully added ${newItem.name} to inventory`);
    }
  }, [addItem]);

  const handleDeleteItem = useCallback(async (itemId: string) => {
    const itemName = items.find(item => item.id === itemId)?.name || "Item";
    const success = await deleteItem(itemId);
    if (success) {
      toast.error(`Successfully deleted ${itemName} from inventory`);
    }
  }, [items, deleteItem]);

  const handleReorderItem = useCallback((itemId: string, direction: 'up' | 'down') => {
    reorderItem(itemId, direction);
    toast.success(`Item moved ${direction}`);
  }, [reorderItem]);

  const handleReorderStock = useCallback(async (item: InventoryItem, quantity: number) => {
    await reorderStock(item, quantity);
    toast.success(`Ordered ${quantity} units of ${item.name} from ${item.supplier}`);
  }, [reorderStock]);

  const handleTransferItem = useCallback(async (item: InventoryItem, quantity: number, newLocation: string) => {
    console.log(`Transferring ${quantity} units of ${item.name} from ${item.location} to ${newLocation}`);
    
    const sourceItem = { ...item, stock: item.stock - quantity };
    await updateItem(sourceItem);
    
    const existingDestItem = items.find(i => 
      i.sku === item.sku && i.location === newLocation
    );
    
    if (existingDestItem) {
      const destinationItem = { 
        ...existingDestItem, 
        stock: existingDestItem.stock + quantity 
      };
      await updateItem(destinationItem);
      console.log(`Updated existing item at ${newLocation}, new stock: ${destinationItem.stock}`);
    } else {
      const newDestinationItem = {
        ...item,
        id: `${item.id}-${Date.now()}`,
        location: newLocation,
        stock: quantity
      };
      await addItem(newDestinationItem);
      console.log(`Created new item at ${newLocation} with stock: ${quantity}`);
    }
    
    refresh();
    
    toast.success(`Successfully transferred ${quantity} units of ${item.name} to ${newLocation}`);
  }, [items, updateItem, addItem, refresh]);

  const handleReactivateAllItems = useCallback(async () => {
    try {
      await reactivateAllItems();
      toast.success("Successfully reactivated all inventory items");
    } catch (error) {
      console.error("Failed to reactivate all items:", error);
      toast.error("Failed to reactivate all inventory items");
    }
  }, [reactivateAllItems]);

  return {
    handleSaveItem,
    handleAddItem,
    handleDeleteItem,
    handleReorderItem,
    handleReorderStock,
    handleTransferItem,
    handleReactivateAllItems
  };
}
