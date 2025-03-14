
import { useInventoryFilters } from "@/hooks/inventory/useInventoryFilters";
import { useInventoryView } from "@/hooks/inventory/useInventoryView";
import { useInventoryDialogs } from "@/hooks/inventory/useInventoryDialogs";
import { useInventoryUrlSync } from "@/hooks/inventory/useInventoryUrlSync";
import { useInventoryActions } from "@/hooks/inventory/useInventoryActions";
import { useInventoryItems } from "@/hooks/useInventoryItems";

export function useInventoryPage() {
  // Get filter state
  const {
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    locationFilter,
    setLocationFilter
  } = useInventoryFilters();
  
  // Get view mode and sorting state
  const {
    viewMode,
    setViewMode,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    handleSort
  } = useInventoryView();
  
  // Get dialog state
  const {
    reorderDialogOpen,
    setReorderDialogOpen,
    selectedItem,
    setSelectedItem,
    handleOpenReorderDialog
  } = useInventoryDialogs();
  
  // Get inventory items
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
    reactivateAllItems,
    refresh
  } = useInventoryItems(
    1, // Default page, will be overridden by URL sync
    searchQuery,
    sortField,
    sortDirection,
    categoryFilter,
    locationFilter
  );
  
  // Sync with URL parameters
  const {
    currentPage,
    setCurrentPage
  } = useInventoryUrlSync(
    setSearchQuery,
    setCategoryFilter,
    setLocationFilter,
    setSortField,
    setSortDirection,
    setViewMode,
    // Fix: Properly ensure this always returns a Promise<void>
    async (): Promise<void> => {
      try {
        await fetchItems();
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    }
  );
  
  // Get inventory action handlers
  const {
    handleSaveItem,
    handleAddItem,
    handleDeleteItem,
    handleReorderItem,
    handleReorderStock,
    handleTransferItem,
    handleReactivateAllItems
  } = useInventoryActions(
    items,
    updateItem,
    addItem,
    deleteItem,
    reorderItem,
    reorderStock,
    reactivateAllItems,
    refresh
  );
  
  const itemsPerPage = 20;

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
      itemsPerPage,
      categoryFilter,
      locationFilter
    },
    actions: {
      setSearchQuery,
      setCurrentPage,
      setViewMode,
      setSortField,
      setSortDirection,
      setReorderDialogOpen,
      setSelectedItem,
      setCategoryFilter,
      setLocationFilter,
      handleSort,
      handleSaveItem,
      handleAddItem,
      handleDeleteItem,
      handleReorderItem,
      handleOpenReorderDialog,
      handleReorderStock,
      handleTransferItem,
      // Fix: Properly ensure this always returns a Promise<void>
      fetchItems: async (forceRefresh = false): Promise<void> => {
        console.log("Calling refresh with forceRefresh:", forceRefresh);
        try {
          await refresh();
        } catch (error) {
          console.error("Error refreshing data:", error);
        }
      },
      handleReactivateAllItems
    }
  };
}
