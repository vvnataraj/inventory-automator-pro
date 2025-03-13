
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InventoryItem } from "@/types/inventory";
import { useEditInventoryItem } from "@/hooks/inventory/useEditInventoryItem";
import { toast } from "sonner";
import { useInventoryOperations } from "@/hooks/inventory/useInventoryOperations";
import { EditInventoryDialog } from "./edit/EditInventoryDialog";

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
  } = useEditInventoryItem(item, () => setIsOpen(false));
  
  const [isSaving, setIsSaving] = useState(false);
  const { updateItem } = useInventoryOperations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData) return;
    
    try {
      setIsSaving(true);
      console.log("Submitting form with data:", formData);
      console.log("Current stock value:", formData.stock);
      
      // Get all items that need to be updated (across all locations)
      const itemsToUpdate = prepareItemsForSave();
      console.log("Items to update:", itemsToUpdate);
      
      // Update each item
      const updatePromises = itemsToUpdate.map(itemToUpdate => {
        console.log(`Updating item ${itemToUpdate.id} with stock: ${itemToUpdate.stock}`);
        return updateItem(itemToUpdate);
      });
      
      await Promise.all(updatePromises);
      
      // Call the onSave callback with the current item's updated version
      const currentItemUpdate = itemsToUpdate.find(i => i.id === item.id);
      if (currentItemUpdate) {
        console.log("Calling onSave with updated item:", currentItemUpdate);
        onSave(currentItemUpdate);
      }
      
      toast.success("Item updated successfully across all locations");
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating items:", error);
      toast.error("Failed to update item");
    } finally {
      setIsSaving(false);
    }
  };

  // Controlled dialog to prevent state updates when closed
  const handleOpenChange = (open: boolean) => {
    if (!isSaving) {
      setIsOpen(open);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
      
      {formData && (
        <EditInventoryDialog
          formData={formData}
          locationStocks={locationStocks}
          totalStock={totalStock}
          isSaving={isSaving}
          onCancel={() => handleOpenChange(false)}
          onSubmit={handleSubmit}
          handleChange={handleChange}
          handleLocationStockChange={handleLocationStockChange}
        />
      )}
    </Dialog>
  );
};
