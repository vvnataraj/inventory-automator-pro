
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
    handleChange
  } = useEditInventoryItem(item);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsOpen(false);
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Make changes to the inventory item here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        {locationStocks.length > 1 && (
          <div className="mb-4">
            <h4 className="font-medium text-sm mb-2">Stock Distribution by Location</h4>
            <StockDistributionCard
              locationStocks={locationStocks}
              totalStock={totalStock}
            />
            <Separator className="my-4" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InventoryItemEditForm 
            formData={formData}
            onChange={handleChange}
          />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
