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
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { syncInventoryItemsToSupabase } from "@/data/inventory/inventoryService";
import { RefreshCw } from "lucide-react";

export default function Inventory() {
  const { state, actions } = useInventoryPage();
  const [searchParams] = useSearchParams();
  const [syncingDb, setSyncingDb] = useState(false);
  
  useEffect(() => {
    console.log("Inventory page mounted, fetching items...");
    
    // Always fetch items after setting/clearing category filter from useInventoryPage
    actions.fetchItems(true);
    
  }, [searchParams]); 
  
  const handleImportItems = (importedItems: InventoryItem[]) => {
    importedItems.forEach(item => {
      if (!item.id) {
        item.id = `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      }
      
      if (!item.dateAdded) {
        item.dateAdded = new Date().toISOString();
      }
      if (!item.lastUpdated) {
        item.lastUpdated = new Date().toISOString();
      }
      
      actions.handleAddItem(item);
    });
    
    actions.fetchItems();
    
    toast.success(`Successfully imported ${importedItems.length} items`);
  };
  
  const handleSyncToDatabase = async () => {
    setSyncingDb(true);
    try {
      const result = await syncInventoryItemsToSupabase();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(`Failed to sync inventory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSyncingDb(false);
      // Refresh the inventory to get latest data
      actions.fetchItems(true);
    }
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
          <Button 
            onClick={handleSyncToDatabase} 
            disabled={syncingDb}
            variant="outline"
            className="ml-2 h-10"
          >
            {syncingDb ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>Sync to Database</>
            )}
          </Button>
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
          onCategoryFilterChange={actions.setCategoryFilter}
          locationFilter={state.locationFilter}
          onLocationFilterChange={actions.setLocationFilter}
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
