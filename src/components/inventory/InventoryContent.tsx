
import React from "react";
import { InventoryItem, SortField, SortDirection } from "@/types/inventory";
import { InventoryGrid } from "./InventoryGrid";
import { InventoryTable } from "./InventoryTable";
import { SimplePagination } from "@/components/common/SimplePagination";
import { ReorderDialog } from "./ReorderDialog";

interface InventoryContentProps {
  items: InventoryItem[];
  isLoading: boolean;
  viewMode: "grid" | "table";
  sortField: SortField;
  sortDirection: SortDirection;
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  selectedItem: InventoryItem | null;
  reorderDialogOpen: boolean;
  onPageChange: (page: number) => void;
  onSort: (field: SortField) => void;
  onSaveItem: (updatedItem: InventoryItem) => void;
  onTransferItem: (item: InventoryItem, quantity: number, newLocation: string) => void;
  onDeleteItem: (itemId: string) => void;
  onReorderItem: (itemId: string, direction: 'up' | 'down') => void;
  onOpenReorderDialog: (item: InventoryItem) => void;
  onReorderStock: (item: InventoryItem, quantity: number) => void;
  onReorderDialogClose: () => void;
}

export const InventoryContent: React.FC<InventoryContentProps> = ({
  items,
  isLoading,
  viewMode,
  sortField,
  sortDirection,
  totalItems,
  itemsPerPage,
  currentPage,
  selectedItem,
  reorderDialogOpen,
  onPageChange,
  onSort,
  onSaveItem,
  onTransferItem,
  onDeleteItem,
  onReorderItem,
  onOpenReorderDialog,
  onReorderStock,
  onReorderDialogClose
}) => {
  if (isLoading) {
    return null; // Loading state is handled by parent component
  }

  if (items.length === 0) {
    return null; // Empty state is handled by parent component
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <>
      {viewMode === "grid" ? (
        <InventoryGrid 
          items={items}
          onSaveItem={onSaveItem}
          onTransferItem={onTransferItem}
          onDeleteItem={onDeleteItem}
          onReorderStock={onReorderStock}
        />
      ) : (
        <InventoryTable 
          items={items}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
          onSaveItem={onSaveItem}
          onTransferItem={onTransferItem}
          onDeleteItem={onDeleteItem}
          onReorderItem={onReorderItem}
          onOpenReorderDialog={onOpenReorderDialog}
        />
      )}

      {totalItems > 0 && (
        <SimplePagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}

      {selectedItem && (
        <ReorderDialog
          item={selectedItem}
          open={reorderDialogOpen}
          onClose={onReorderDialogClose}
          onReorder={onReorderStock}
        />
      )}
    </>
  );
};
