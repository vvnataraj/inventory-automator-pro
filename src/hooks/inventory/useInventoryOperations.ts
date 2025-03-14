
import { useInventoryCrud } from "./useInventoryCrud";
import { useInventoryItemManagement } from "./useInventoryItemManagement";

/**
 * Hook that provides all operations for inventory items
 * This is a facade that composes other specialized hooks
 */
export function useInventoryOperations() {
  // Import operations from specialized hooks
  const { updateItem } = useInventoryCrud();
  const { addItem, deleteItem } = useInventoryItemManagement();

  return {
    updateItem,
    addItem,
    deleteItem
  };
}
