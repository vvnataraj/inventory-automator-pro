import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MainLayout } from "@/components/layout/MainLayout";
import { InventoryControls } from "@/components/inventory/InventoryControls";
import { InventoryHeaderWithActions } from "@/components/inventory/InventoryHeader";
import { InventoryLoadingState } from "@/components/inventory/InventoryLoadingState";
import { InventoryEmptyState } from "@/components/inventory/InventoryEmptyState";
import { InventoryContent } from "@/components/inventory/InventoryContent";
import { useInventoryPage } from "@/hooks/useInventoryPage";

export default function Inventory() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [initialRender, setInitialRender] = useState(true);
  
  const { 
    state: { 
      items, 
      isLoading, 
      totalItems, 
      currentPage, 
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
  
  // Single effect to handle initial load
  useEffect(() => {
    if (initialRender) {
      console.log("Initial render, fetching items");
      setInitialRender(false);
    }
  }, [initialRender]);
  
  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    navigate(`?${newParams.toString()}`);
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <InventoryHeaderWithActions 
          onAddItem={handleAddItem} 
          items={items}
          onImportItems={(items) => {
            toast.success(`Successfully imported ${items.length} items`);
            fetchItems(true);
          }}
          onRefreshItems={fetchItems}
        />
        
        <InventoryControls 
          searchQuery=""
          setSearchQuery={() => {}}
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
          <InventoryLoadingState />
        ) : items.length === 0 ? (
          <InventoryEmptyState />
        ) : (
          <InventoryContent 
            items={items}
            isLoading={isLoading}
            viewMode={viewMode}
            sortField={sortField}
            sortDirection={sortDirection}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            selectedItem={selectedItem}
            reorderDialogOpen={reorderDialogOpen}
            onPageChange={handlePageChange}
            onSort={handleSort}
            onSaveItem={handleSaveItem}
            onTransferItem={handleTransferItem}
            onDeleteItem={handleDeleteItem}
            onReorderItem={handleReorderItem}
            onOpenReorderDialog={handleOpenReorderDialog}
            onReorderStock={handleReorderStock}
            onReorderDialogClose={() => setReorderDialogOpen(false)}
          />
        )}
      </div>
    </MainLayout>
  );
}
