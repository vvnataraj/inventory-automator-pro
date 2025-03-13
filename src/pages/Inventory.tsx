
import { useInventoryPage } from "@/hooks/useInventoryPage";
import { ReorderDialog } from "@/components/inventory/ReorderDialog";
import { MainLayout } from "@/components/layout/MainLayout";
import { InventoryHeader } from "@/components/inventory/InventoryHeader";
import { InventoryControls } from "@/components/inventory/InventoryControls";
import { InventoryGrid } from "@/components/inventory/InventoryGrid";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { InventoryPagination } from "@/components/inventory/InventoryPagination";

export default function Inventory() {
  const { state, actions } = useInventoryPage();
  
  return (
    <MainLayout>
      <InventoryHeader 
        onAddItem={actions.handleAddItem} 
        items={state.items}
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
