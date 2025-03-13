
import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InventoryItem } from "@/types/inventory";
import { Separator } from "@/components/ui/separator";
import { StockDistributionCard } from "./edit/StockDistributionCard";
import { InventoryItemEditForm } from "./edit/InventoryItemForm";
import { useEditInventoryItem } from "@/hooks/inventory/useEditInventoryItem";
import { toast } from "sonner";
import { useInventoryOperations } from "@/hooks/inventory/useInventoryOperations";

interface EditInventoryItemProps {
  item: InventoryItem;
  onSave: (updatedItem: InventoryItem) => void;
  showLabel?: boolean;
}

export const EditInventoryItem = ({ item, onSave, showLabel = false }: EditInventoryItemProps) => {
  const {
    formData,
    isOpen,
    setIsOpen,
    locationStocks,
    totalStock,
    handleChange,
    handleLocationStockChange,
    prepareItemsForSave
  } = useEditInventoryItem(item);

  const { updateItem } = useInventoryOperations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Get all items that need to be updated (across all locations)
      const itemsToUpdate = prepareItemsForSave();
      
      // Update each item
      for (const itemToUpdate of itemsToUpdate) {
        await updateItem(itemToUpdate);
      }
      
      // Call the onSave callback with the current item's updated version
      const currentItemUpdate = itemsToUpdate.find(i => i.id === item.id);
      if (currentItemUpdate) {
        onSave(currentItemUpdate);
      }
      
      toast.success("Item updated successfully across all locations");
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating items:", error);
      toast.error("Failed to update item");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size={showLabel ? "sm" : "icon"}
          className={showLabel ? "h-8 flex gap-1" : ""}
        >
          <Pencil className="h-4 w-4" />
          {showLabel && "Edit"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Make changes to the inventory item here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Item Details</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <InventoryItemEditForm 
                formData={formData}
                onChange={handleChange}
                totalStock={totalStock}
                readOnlyStock={true}
              />
              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save changes</Button>
              </div>
            </form>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-3">Location Inventory</h4>
            <StockDistributionCard
              locationStocks={locationStocks}
              totalStock={totalStock}
              reorderQuantity={formData.minStockCount}
              onLocationStockChange={handleLocationStockChange}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
