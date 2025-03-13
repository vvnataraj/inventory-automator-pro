
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InventoryItem } from "@/types/inventory";

interface InventoryItemFormProps {
  formData: InventoryItem;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InventoryItemEditForm: React.FC<InventoryItemFormProps> = ({ 
  formData, 
  onChange 
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="cost" className="text-right">Cost Price</Label>
        <Input
          id="cost"
          name="cost"
          type="number"
          value={formData.cost}
          onChange={onChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="rrp" className="text-right">RRP</Label>
        <Input
          id="rrp"
          name="rrp"
          type="number"
          value={formData.rrp || ""}
          onChange={onChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="stock" className="text-right">Stock</Label>
        <Input
          id="stock"
          name="stock"
          type="number"
          value={formData.stock}
          onChange={onChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="minStockCount" className="text-right">Min Stock</Label>
        <Input
          id="minStockCount"
          name="minStockCount"
          type="number"
          value={formData.minStockCount}
          onChange={onChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="location" className="text-right">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={onChange}
          className="col-span-3"
        />
      </div>
    </div>
  );
};
