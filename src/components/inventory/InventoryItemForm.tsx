
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Available locations for the dropdown
const availableLocations = ["Warehouse A", "Warehouse B", "Storefront", "Online"];

export interface InventoryItemFormData {
  name: string;
  sku: string;
  category: string;
  cost: number;
  rrp: number;
  stock: number;
  location: string;
  minStockCount: number;
  lowStockThreshold: number;
}

interface InventoryItemFormProps {
  formData: InventoryItemFormData;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLocationChange: (value: string) => void;
  onCancel: () => void;
}

export const InventoryItemForm = ({
  formData,
  onSubmit,
  onChange,
  onLocationChange,
  onCancel,
}: InventoryItemFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={onChange}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="sku" className="text-right">SKU</Label>
          <Input
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={onChange}
            placeholder="Auto-generated if empty"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="category" className="text-right">Category</Label>
          <Input
            id="category"
            name="category"
            value={formData.category}
            onChange={onChange}
            placeholder="Auto-generated if empty"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="cost" className="text-right">Cost Price *</Label>
          <Input
            id="cost"
            name="cost"
            type="number"
            value={formData.cost}
            onChange={onChange}
            className="col-span-3"
            required
            min="0"
            step="0.01"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="rrp" className="text-right">RRP</Label>
          <Input
            id="rrp"
            name="rrp"
            type="number"
            value={formData.rrp}
            onChange={onChange}
            className="col-span-3"
            min="0"
            step="0.01"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="stock" className="text-right">Initial Stock *</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={onChange}
            className="col-span-3"
            required
            min="0"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="location" className="text-right">Location *</Label>
          <div className="col-span-3">
            <Select
              value={formData.location}
              onValueChange={onLocationChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                {availableLocations.map(location => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="lowStockThreshold" className="text-right">Low Stock Alert</Label>
          <Input
            id="lowStockThreshold"
            name="lowStockThreshold"
            type="number"
            value={formData.lowStockThreshold}
            onChange={onChange}
            className="col-span-3"
            min="0"
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
            min="0"
          />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Item</Button>
      </div>
    </form>
  );
};
