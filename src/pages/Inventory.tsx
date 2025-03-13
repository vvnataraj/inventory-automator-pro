
import { useInventoryPage } from "@/hooks/useInventoryPage";
import { ReorderDialog } from "@/components/inventory/ReorderDialog";
import { MainLayout } from "@/components/layout/MainLayout";
import { InventoryHeader } from "@/components/inventory/InventoryHeader";
import { InventoryControls } from "@/components/inventory/InventoryControls";
import { InventoryGrid } from "@/components/inventory/InventoryGrid";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { InventoryPagination } from "@/components/inventory/InventoryPagination";
import { InventoryItem } from "@/types/inventory";
import { toast } from "sonner";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function Inventory() {
  const { state, actions } = useInventoryPage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Handle category filter from URL when component mounts
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categoryParam !== state.categoryFilter) {
      actions.setCategoryFilter(categoryParam);
    }
  }, [searchParams, actions.setCategoryFilter, state.categoryFilter]); 
  
  // Update URL when category filter changes
  useEffect(() => {
    // Create a new searchParams object to avoid modifying the current one directly
    const newParams = new URLSearchParams(searchParams);
    
    if (state.categoryFilter) {
      newParams.set('category', state.categoryFilter);
    } else {
      newParams.delete('category');
    }
    
    // Only update if the params have actually changed
    if (newParams.toString() !== searchParams.toString()) {
      setSearchParams(newParams);
    }
  }, [state.categoryFilter, setSearchParams, searchParams]);

  // Add specific effect to manually trigger data fetch when the page loads
  useEffect(() => {
    console.log("Inventory page mounted, fetching items...");
    actions.fetchItems();
  }, []); 
  
  const handleImportItems = (importedItems: InventoryItem[]) => {
    // Process each imported item
    importedItems.forEach(item => {
      // Generate a new ID if needed
      if (!item.id) {
        item.id = `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      }
      
      // Add timestamps if missing
      if (!item.dateAdded) {
        item.dateAdded = new Date().toISOString();
      }
      if (!item.lastUpdated) {
        item.lastUpdated = new Date().toISOString();
      }
      
      // Add the item to inventory
      actions.handleAddItem(item);
    });
    
    // Refresh the inventory items
    actions.fetchItems();
    
    // Show a success toast
    toast.success(`Successfully imported ${importedItems.length} items`);
  };
  
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <InventoryHeader 
            onAddItem={actions.handleAddItem} 
            items={state.items}
            onImportItems={handleImportItems}
          />
        </div>
        
        <InventoryControls 
          searchQuery={state.searchQuery}
          setSearchQuery={actions.setSearchQuery}
          viewMode={state.viewMode}
          setViewMode={actions.setViewMode}
          sortField={state.sortField}
          sortDirection={state.sortDirection}
          onSort={actions.handleSort}
          onSortDirectionChange={actions.setSortDirection}
          categoryFilter={state.categoryFilter}
          onCategoryFilterChange={actions.handleCategoryFilterChange}
        />

        {state.isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : state.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <h3 className="text-xl font-semibold mb-2">No inventory items found</h3>
            <p className="text-muted-foreground mb-4">Try changing your search criteria or add new items.</p>
          </div>
        ) : (
          <>
            {state.viewMode === "grid" ? (
              <InventoryGrid 
                items={state.items}
                onSaveItem={actions.handleSaveItem}
                onTransferItem={actions.handleTransferItem}
                onDeleteItem={actions.handleDeleteItem}
                onReorderStock={actions.handleReorderStock}
              />
            ) : (
              <InventoryTable 
                items={state.items}
                sortField={state.sortField}
                sortDirection={state.sortDirection}
                onSort={actions.handleSort}
                onSaveItem={actions.handleSaveItem}
                onTransferItem={actions.handleTransferItem}
                onDeleteItem={actions.handleDeleteItem}
                onReorderItem={actions.handleReorderItem}
                onOpenReorderDialog={actions.handleOpenReorderDialog}
              />
            )}

            <InventoryPagination 
              currentPage={state.currentPage}
              itemsPerPage={state.itemsPerPage}
              totalItems={state.totalItems}
              onPageChange={actions.setCurrentPage}
            />
          </>
        )}

        {state.selectedItem && (
          <ReorderDialog
            item={state.selectedItem}
            open={state.reorderDialogOpen}
            onClose={() => actions.setReorderDialogOpen(false)}
            onReorder={actions.handleReorderStock}
          />
        )}
      </div>
    </MainLayout>
  );
}
