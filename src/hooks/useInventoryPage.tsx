
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
  
  // Create a wrapper function that explicitly returns a Promise<void>
  const fetchItemsAsync = async (): Promise<void> => {
    // This is the key fix - we need to make sure fetchItems returns a Promise
    return Promise.resolve(fetchItems());
  };
  
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
    fetchItemsAsync // Pass the properly typed async function
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
      // Create a properly typed async function that returns Promise<void>
      fetchItems: async (forceRefresh = false): Promise<void> => {
        console.log("Calling refresh with forceRefresh:", forceRefresh);
        try {
          await refresh();
          return Promise.resolve();
        } catch (error) {
          console.error("Error refreshing data:", error);
          return Promise.reject(error);
        }
      },
      handleReactivateAllItems
    }
  };
}
