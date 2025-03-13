
import { useState } from "react";
import { useInventoryItems } from "@/hooks/useInventoryItems";
import { InventoryItem, SortField, SortDirection } from "@/types/inventory";
import { useToast } from "@/hooks/use-toast";
import { ReorderDialog } from "@/components/inventory/ReorderDialog";
import { MainLayout } from "@/components/layout/MainLayout";
import { InventoryHeader } from "@/components/inventory/InventoryHeader";
import { InventoryControls } from "@/components/inventory/InventoryControls";
import { InventoryGrid } from "@/components/inventory/InventoryGrid";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { InventoryPagination } from "@/components/inventory/InventoryPagination";

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  
  const { items, isLoading, totalItems, updateItem, addItem, deleteItem, reorderItem, reorderStock } = useInventoryItems(
    currentPage, 
    searchQuery,
    sortField,
    sortDirection
  );
  
  const { toast } = useToast();
  
  const itemsPerPage = 20;

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSaveItem = (updatedItem: InventoryItem) => {
    updateItem(updatedItem);
    toast({
      title: "Item updated",
      description: `Successfully updated ${updatedItem.name}`,
    });
  };

  const handleAddItem = (newItem: InventoryItem) => {
    addItem(newItem);
    toast({
      title: "Item added",
      description: `Successfully added ${newItem.name} to inventory`,
    });
  };

  const handleDeleteItem = (itemId: string) => {
    const itemName = items.find(item => item.id === itemId)?.name || "Item";
    deleteItem(itemId);
    toast({
      title: "Item deleted",
      description: `Successfully deleted ${itemName} from inventory`,
      variant: "destructive"
    });
  };

  const handleReorderItem = (itemId: string, direction: 'up' | 'down') => {
    reorderItem(itemId, direction);
    
    toast({
      title: `Item moved ${direction}`,
      description: `Successfully reordered inventory item`,
    });
  };

  const handleOpenReorderDialog = (item: InventoryItem) => {
    setSelectedItem(item);
    setReorderDialogOpen(true);
  };

  const handleReorderStock = (item: InventoryItem, quantity: number) => {
    reorderStock(item, quantity);
    
    toast({
      title: "Stock reordered",
      description: `Ordered ${quantity} units of ${item.name} from ${item.supplier}`,
    });
  };

  const handleTransferItem = (item: InventoryItem, quantity: number, newLocation: string) => {
    const sourceItem = { ...item, stock: item.stock - quantity };
    
    const existingDestItem = items.find(i => 
      i.sku === item.sku && i.location === newLocation
    );
    
    if (existingDestItem) {
      const destinationItem = { 
        ...existingDestItem, 
        stock: existingDestItem.stock + quantity 
      };
      updateItem(destinationItem);
    }
    
    updateItem(sourceItem);
    
    toast({
      title: "Inventory transferred",
      description: `Successfully transferred ${quantity} units of ${item.name} to ${newLocation}`,
    });
  };

  return (
    <MainLayout>
      <InventoryHeader onAddItem={handleAddItem} />
      
      <InventoryControls 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onSortDirectionChange={setSortDirection}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
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

          <InventoryPagination 
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
          />
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
    </MainLayout>
  );
}
