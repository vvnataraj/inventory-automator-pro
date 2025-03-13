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

export default function Inventory() {
  const { state, actions } = useInventoryPage();
  
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
      <InventoryHeader 
        onAddItem={actions.handleAddItem} 
        items={state.items}
        onImportItems={handleImportItems}
      />
      
      <InventoryControls 
        searchQuery={state.searchQuery}
        setSearchQuery={actions.setSearchQuery}
        viewMode={state.viewMode}
        setViewMode={actions.setViewMode}
        sortField={state.sortField}
        sortDirection={state.sortDirection}
        onSort={actions.handleSort}
        onSortDirectionChange={actions.setSortDirection}
      />

      {state.isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
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
    </MainLayout>
  );
}
