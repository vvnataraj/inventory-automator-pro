
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { SortField, SortDirection } from "@/types/inventory";
import { MainLayout } from "@/components/layout/MainLayout";
import { InventoryHeader } from "@/components/inventory/InventoryHeader";
import { InventoryControls } from "@/components/inventory/InventoryControls";
import { InventoryGrid } from "@/components/inventory/InventoryGrid";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { ReorderDialog } from "@/components/inventory/ReorderDialog";
import { syncInventoryItemsToSupabase } from "@/data/inventory/inventoryService";
import { SimplePagination } from "@/components/common/SimplePagination";
import { logInventoryActivity } from "@/utils/logging";
import { useInventoryPage } from "@/hooks/useInventoryPage";

export default function Inventory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [syncingDb, setSyncingDb] = useState(false);
  
  const { 
    state: { 
      items, 
      isLoading, 
      totalItems, 
      currentPage, 
      searchQuery, 
      viewMode, 
      sortField, 
      sortDirection, 
      categoryFilter, 
      locationFilter, 
      reorderDialogOpen, 
      selectedItem, 
      itemsPerPage 
    },
    actions: { 
      setCurrentPage, 
      setSearchQuery, 
      setViewMode, 
      setCategoryFilter, 
      setLocationFilter, 
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
      fetchItems
    } 
  } = useInventoryPage();
  
  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || undefined;
    const location = searchParams.get("location") || undefined;
    const sort = searchParams.get("sort") as SortField || "name";
    const order = searchParams.get("order") as SortDirection || "asc";
    const view = searchParams.get("view") as "grid" | "table" || "table";
    
    setCurrentPage(page);
    setSearchQuery(search);
    setCategoryFilter(category);
    setLocationFilter(location);
    setSortField(sort);
    setSortDirection(order);
    setViewMode(view);
    
    fetchItems();
  }, [searchParams]);
  
  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    navigate(`?${newParams.toString()}`);
  };
  
  const handleSyncToDatabase = async () => {
    setSyncingDb(true);
    try {
      const result = await syncInventoryItemsToSupabase();
      if (result.success) {
        toast.success(result.message);
        await logInventoryActivity('sync_to_database', 'batch', 'All Items', { 
          result: 'success',
          message: result.message
        });
        await fetchItems(true);
      } else {
        toast.error(result.message);
        await logInventoryActivity('sync_to_database', 'batch', 'All Items', { 
          result: 'error',
          message: result.message
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to sync inventory: ${errorMessage}`);
      await logInventoryActivity('sync_to_database', 'batch', 'All Items', { 
        result: 'error',
        message: errorMessage
      });
    } finally {
      setSyncingDb(false);
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <InventoryHeader 
            onAddItem={handleAddItem} 
            items={items}
            onImportItems={(items) => {
              toast.success(`Successfully imported ${items.length} items`);
              fetchItems(true);
            }}
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
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onSortDirectionChange={setSortDirection}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          locationFilter={locationFilter}
          onLocationFilterChange={setLocationFilter}
        />

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <h3 className="text-xl font-semibold mb-2">No inventory items found</h3>
            <p className="text-muted-foreground mb-4">Try changing your search criteria or add new items.</p>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <InventoryGrid 
                items={items}
                onSaveItem={handleSaveItem}
                onTransferItem={handleTransferItem}
                onDeleteItem={handleDeleteItem}
                onReorderStock={handleReorderStock}
              />
            ) : (
              <InventoryTable 
                items={items}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onSaveItem={handleSaveItem}
                onTransferItem={handleTransferItem}
                onDeleteItem={handleDeleteItem}
                onReorderItem={handleReorderItem}
                onOpenReorderDialog={handleOpenReorderDialog}
              />
            )}

            {totalItems > 0 && (
              <SimplePagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        {selectedItem && (
          <ReorderDialog
            item={selectedItem}
            open={reorderDialogOpen}
            onClose={() => setReorderDialogOpen(false)}
            onReorder={handleReorderStock}
          />
        )}
      </div>
    </MainLayout>
  );
}
