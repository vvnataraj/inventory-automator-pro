
import React from "react";
import { InventoryItem, SortField, SortDirection } from "@/types/inventory";
import { SimplePagination } from "@/components/common/SimplePagination";
import { ReorderDialog } from "./ReorderDialog";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InventoryDisplayProps {
  items: InventoryItem[];
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

export const InventoryDisplay: React.FC<InventoryDisplayProps> = ({
  items,
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
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="space-y-4">
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map(item => (
            <InventoryCard 
              key={item.id}
              item={item}
              onOpenReorderDialog={onOpenReorderDialog}
              onSaveItem={onSaveItem}
              onDeleteItem={onDeleteItem}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-md border shadow-sm">
          <ScrollArea className="h-[calc(100vh-300px)]">
            <table className="w-full">
              <InventoryTableHeader 
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <tbody>
                {items.map((item, index) => (
                  <InventoryTableRow 
                    key={item.id}
                    item={item}
                    index={index}
                    totalItems={items.length}
                    onOpenReorderDialog={onOpenReorderDialog}
                    onSaveItem={onSaveItem}
                    onTransferItem={onTransferItem}
                    onDeleteItem={onDeleteItem}
                    onReorderItem={onReorderItem}
                  />
                ))}
              </tbody>
            </table>
          </ScrollArea>
        </div>
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
    </div>
  );
};

// Card view for inventory items
const InventoryCard: React.FC<{
  item: InventoryItem;
  onOpenReorderDialog: (item: InventoryItem) => void;
  onSaveItem: (updatedItem: InventoryItem) => void;
  onDeleteItem: (itemId: string) => void;
}> = ({ item, onOpenReorderDialog, onSaveItem, onDeleteItem }) => {
  return (
    <Card className={cn("overflow-hidden h-full flex flex-col", 
      !item.isActive && "opacity-60")}>
      <div className="relative pt-[60%] bg-gray-100 dark:bg-gray-800">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'placeholder.svg';
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        <Badge 
          className={cn("absolute top-2 right-2 text-xs", 
            item.stock <= item.lowStockThreshold 
              ? "bg-red-500" 
              : item.stock <= item.lowStockThreshold * 2 
                ? "bg-yellow-500" 
                : "bg-green-500")}
        >
          {item.stock}
        </Badge>
      </div>
      <CardContent className="flex-grow p-4">
        <h3 className="font-medium text-sm line-clamp-2 mb-1">{item.name}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">SKU: {item.sku}</p>
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">${item.cost.toFixed(2)}</div>
          <Badge variant="outline" className="text-xs">
            {item.category}
          </Badge>
        </div>
        
        <div className="flex gap-2 mt-3">
          <button 
            onClick={() => onOpenReorderDialog(item)}
            className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md"
          >
            Reorder
          </button>
          <button 
            onClick={() => onSaveItem({...item, isActive: !item.isActive})}
            className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-md"
          >
            {item.isActive ? 'Discontinue' : 'Reactivate'}
          </button>
          <button 
            onClick={() => onDeleteItem(item.id)}
            className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md ml-auto"
          >
            Delete
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

// Table header for inventory table view
const InventoryTableHeader: React.FC<{
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}> = ({ sortField, sortDirection, onSort }) => {
  const SortableHeader: React.FC<{
    field: SortField;
    label: string;
  }> = ({ field, label }) => {
    const isActive = sortField === field;
    
    return (
      <th 
        className={cn(
          "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer",
          isActive ? "text-primary" : "text-gray-500 dark:text-gray-400"
        )}
        onClick={() => onSort(field)}
      >
        <div className="flex items-center space-x-1">
          <span>{label}</span>
          {isActive && (
            <span className="text-xs">
              {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </div>
      </th>
    );
  };
  
  return (
    <thead className="bg-gray-50 dark:bg-gray-700">
      <tr>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Image
        </th>
        <SortableHeader field="sku" label="SKU" />
        <SortableHeader field="name" label="Name" />
        <SortableHeader field="category" label="Category" />
        <SortableHeader field="cost" label="Cost" />
        <SortableHeader field="stock" label="Stock" />
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Status
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
  );
};

// Table row for inventory items
const InventoryTableRow: React.FC<{
  item: InventoryItem;
  index: number;
  totalItems: number;
  onOpenReorderDialog: (item: InventoryItem) => void;
  onSaveItem: (updatedItem: InventoryItem) => void;
  onTransferItem: (item: InventoryItem, quantity: number, newLocation: string) => void;
  onDeleteItem: (itemId: string) => void;
  onReorderItem: (itemId: string, direction: 'up' | 'down') => void;
}> = ({ 
  item, 
  index, 
  totalItems, 
  onOpenReorderDialog, 
  onSaveItem, 
  onTransferItem, 
  onDeleteItem, 
  onReorderItem 
}) => {
  // Simple transfer function for demo
  const handleTransfer = () => {
    const location = prompt("Enter new location");
    const quantity = parseInt(prompt("Enter quantity") || "0");
    if (location && quantity > 0) {
      onTransferItem(item, quantity, location);
    }
  };
  
  return (
    <tr className={cn(
      "border-b hover:bg-gray-50 dark:hover:bg-gray-700",
      !item.isActive && "opacity-60"
    )}>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 overflow-hidden">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'placeholder.svg';
              }}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
              No Img
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm">{item.sku}</td>
      <td className="px-4 py-3 text-sm max-w-[200px] truncate">{item.name}</td>
      <td className="px-4 py-3 text-sm">{item.category}</td>
      <td className="px-4 py-3 text-sm">${item.cost.toFixed(2)}</td>
      <td className="px-4 py-3 whitespace-nowrap">
        <Badge 
          className={cn(
            "text-xs",
            item.stock <= item.lowStockThreshold 
              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" 
              : item.stock <= item.lowStockThreshold * 2 
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" 
                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          )}
        >
          {item.stock}
        </Badge>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <Badge variant={item.isActive ? "default" : "destructive"} className="text-xs">
          {item.isActive ? "Active" : "Discontinued"}
        </Badge>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm space-x-1">
        <button 
          onClick={() => onOpenReorderDialog(item)}
          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md text-xs"
        >
          Reorder
        </button>
        <button 
          onClick={handleTransfer}
          className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-md text-xs"
        >
          Transfer
        </button>
        <button 
          onClick={() => onSaveItem({...item, isActive: !item.isActive})}
          className="px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-md text-xs"
        >
          {item.isActive ? 'Discontinue' : 'Reactivate'}
        </button>
        <button 
          onClick={() => onDeleteItem(item.id)}
          className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md text-xs"
        >
          Delete
        </button>
        <div className="inline-flex">
          <button
            onClick={() => onReorderItem(item.id, 'up')}
            disabled={index === 0}
            className={cn(
              "px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-l-md text-xs",
              index === 0 && "opacity-50 cursor-not-allowed"
            )}
          >
            ↑
          </button>
          <button
            onClick={() => onReorderItem(item.id, 'down')}
            disabled={index === totalItems - 1}
            className={cn(
              "px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-r-md text-xs",
              index === totalItems - 1 && "opacity-50 cursor-not-allowed"
            )}
          >
            ↓
          </button>
        </div>
      </td>
    </tr>
  );
};
