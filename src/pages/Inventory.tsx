import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { InventoryItem, SortField, SortDirection } from "@/types/inventory";
import { MainLayout } from "@/components/layout/MainLayout";
import { InventoryHeader } from "@/components/inventory/InventoryHeader";
import { InventoryControls } from "@/components/inventory/InventoryControls";
import { InventoryGrid } from "@/components/inventory/InventoryGrid";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { ReorderDialog } from "@/components/inventory/ReorderDialog";
import { getInventoryItems, syncInventoryItemsToSupabase } from "@/data/inventory/inventoryService";
import { SimplePagination } from "@/components/common/SimplePagination";
import { logInventoryActivity } from "@/utils/logging";

export default function Inventory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [syncingDb, setSyncingDb] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [locationFilter, setLocationFilter] = useState<string | undefined>();
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const itemsPerPage = 20;
  
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
  
  const fetchItems = async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      const result = await getInventoryItems(
        currentPage,
        itemsPerPage,
        searchQuery,
        sortField,
        sortDirection,
        categoryFilter,
        locationFilter,
        forceRefresh
      );
      
      setItems(result.items);
      setTotalItems(result.total);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      toast.error("Failed to load inventory items. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    fetchItems();
  };
  
  const handleSaveItem = async (updatedItem: InventoryItem) => {
    toast.success(`Item "${updatedItem.name}" updated successfully`);
    await logInventoryActivity('update_item', updatedItem.id, updatedItem.name, {
      sku: updatedItem.sku,
      category: updatedItem.category
    });
    fetchItems(true);
  };
  
  const handleAddItem = async (newItem: InventoryItem) => {
    toast.success(`Item "${newItem.name}" added successfully`);
    await logInventoryActivity('add_item', newItem.id, newItem.name, {
      sku: newItem.sku,
      category: newItem.category
    });
    fetchItems(true);
  };
  
  const handleDeleteItem = async (itemId: string) => {
    const itemToDelete = items.find(item => item.id === itemId);
    if (itemToDelete) {
      toast.success(`Item "${itemToDelete.name}" deleted successfully`);
      await logInventoryActivity('delete_item', itemToDelete.id, itemToDelete.name);
      fetchItems(true);
    }
  };
  
  const handleTransferItem = async (item: InventoryItem, quantity: number, newLocation: string) => {
    toast.success(`Transferred ${quantity} items from ${item.location} to ${newLocation}`);
    await logInventoryActivity('transfer_item', item.id, item.name, {
      quantity,
      from_location: item.location,
      to_location: newLocation
    });
    fetchItems(true);
  };
  
  const handleReorderItem = async (itemId: string, direction: 'up' | 'down') => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      toast.success(`Item moved ${direction}`);
      await logInventoryActivity('reorder_item', itemId, item.name, { direction });
      fetchItems(true);
    }
  };
  
  const handleOpenReorderDialog = (item: InventoryItem) => {
    setSelectedItem(item);
    setReorderDialogOpen(true);
  };
  
  const handleReorderStock = async (item: InventoryItem, quantity: number) => {
    toast.success(`Reordered ${quantity} units of "${item.name}"`);
    await logInventoryActivity('reorder_stock', item.id, item.name, { quantity });
    setReorderDialogOpen(false);
    fetchItems(true);
  };
  
  const handleImportItems = async (importedItems: InventoryItem[]) => {
    toast.success(`Successfully imported ${importedItems.length} items`);
    await logInventoryActivity('import_items', 'batch', 'Multiple Items', { 
      count: importedItems.length 
    });
    fetchItems(true);
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
  
  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    navigate(`?${newParams.toString()}`);
    
    setCurrentPage(page);
    fetchItems();
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <InventoryHeader 
            onAddItem={handleAddItem} 
            items={items}
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
