
import React from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InventoryItem, LocationStock } from "@/types/inventory";
import { StockDistributionCard } from "./StockDistributionCard";
import { InventoryItemEditForm } from "./InventoryItemForm";

interface EditInventoryDialogProps {
  formData: InventoryItem;
  locationStocks: LocationStock[];
  totalStock: number;
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLocationStockChange: (location: string, newCount: number) => void;
}

export const EditInventoryDialog: React.FC<EditInventoryDialogProps> = ({
  formData,
  locationStocks,
  totalStock,
  isSaving,
  onCancel,
  onSubmit,
  handleChange,
  handleLocationStockChange,
}) => {
  return (
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
          <form onSubmit={onSubmit} className="space-y-4">
            <InventoryItemEditForm 
              formData={formData}
              onChange={handleChange}
              totalStock={totalStock}
              readOnlyStock={true}
            />
            <div className="flex justify-end gap-3 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel} 
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
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
  );
};
