
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { inventoryItems } from "@/data/inventoryData";
import { InventoryItem, SortField, SortDirection } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { InventoryGrid } from "@/components/inventory/InventoryGrid";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { AlertCircle, ShoppingCart, ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function LowStock() {
  const navigate = useNavigate();
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [sortField, setSortField] = useState<SortField>("stock");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  useEffect(() => {
    // Find items with low stock
    const lowStockSkus = new Set<string>();
    
    // First pass: identify low stock SKUs
    inventoryItems.forEach(item => {
      // Find all items with the same SKU to calculate total stock
      const sameSkuItems = inventoryItems.filter(invItem => invItem.sku === item.sku);
      const totalStock = sameSkuItems.reduce((sum, curr) => sum + curr.stock, 0);
      
      if (totalStock <= item.lowStockThreshold) {
        lowStockSkus.add(item.sku);
      }
    });
    
    console.log(`Found ${lowStockSkus.size} unique SKUs with low stock`);
    
    // Second pass: get one representative item for each low-stock SKU
    const uniqueLowStockItems = Array.from(lowStockSkus).map(sku => {
      return inventoryItems.find(item => item.sku === sku);
    }).filter(Boolean) as InventoryItem[];
    
    console.log(`Filtered to ${uniqueLowStockItems.length} unique low stock items`);
    
    // Sort items
    const sortedItems = [...uniqueLowStockItems].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === undefined || bValue === undefined) return 0;
      
      const comparison = typeof aValue === 'string' 
        ? aValue.localeCompare(bValue as string)
        : Number(aValue) - Number(bValue);
        
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setLowStockItems(sortedItems);
  }, [sortField, sortDirection]);

  const handleSort = (field: any) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleReorderStock = (item: InventoryItem, quantity: number = 0) => {
    // This would typically call an API to reorder stock
    toast.success(`Reordered ${quantity} units of ${item.name}`);
    
    // For demo purposes, we'll just simulate a stock update
    const updatedItem = {
      ...item,
      stock: item.stock + quantity,
      lastUpdated: new Date().toISOString()
    };
    
    setLowStockItems(currentItems => 
      currentItems.map(currentItem => 
        currentItem.id === updatedItem.id ? updatedItem : currentItem
      )
    );
  };

  // Stub functions for the inventory components
  const handleSaveItem = (updatedItem: InventoryItem) => {
    setLowStockItems(currentItems => 
      currentItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };
  
  const handleTransferItem = (item: InventoryItem, quantity: number, newLocation: string) => {
    toast.success(`Transferred ${quantity} units of ${item.name} to ${newLocation}`);
  };
  
  const handleDeleteItem = (itemId: string) => {
    setLowStockItems(currentItems => 
      currentItems.filter(item => item.id !== itemId)
    );
    toast.success("Item removed from inventory");
  };
  
  const handleReorderItem = (itemId: string, direction: 'up' | 'down') => {
    // This function would reorder items in the list
  };
  
  const handleOpenReorderDialog = (item: InventoryItem) => {
    // This would open a dialog to reorder stock
  };
  
  const reorderAll = () => {
    toast.success(`Reorder request sent for all ${lowStockItems.length} low stock items`);
  };
  
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-semibold tracking-tight">Low Stock Items</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}>
              {viewMode === "grid" ? "Table View" : "Grid View"}
            </Button>
            <Button onClick={reorderAll}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Reorder All
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              Low Stock Warning
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              These items have stock levels at or below their low stock threshold. 
              Consider reordering soon to maintain optimal inventory levels.
            </p>
          </CardContent>
        </Card>
        
        {lowStockItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg">
            <h3 className="text-xl font-medium mb-2">No Low Stock Items</h3>
            <p className="text-muted-foreground text-center">
              All your inventory items are above their low stock thresholds.
            </p>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <InventoryGrid 
                items={lowStockItems}
                onSaveItem={handleSaveItem}
                onTransferItem={handleTransferItem}
                onDeleteItem={handleDeleteItem}
                onReorderStock={handleReorderStock}
              />
            ) : (
              <InventoryTable 
                items={lowStockItems}
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
          </>
        )}
      </div>
    </MainLayout>
  );
}
