
import React from "react";
import { Button } from "@/components/ui/button";
import { FormField, LocationSelect, ImageField } from "./form/FormFields";

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
  imageUrl?: string;
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
  // Custom handler for image URL changes
  const handleImageChange = (url: string) => {
    console.log("Image URL changed in form:", url);
    const imageChangeEvent = {
      target: {
        name: 'imageUrl',
        value: url
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(imageChangeEvent);
  };
  
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 py-4">
        <FormField 
          label="Name"
          name="name"
          value={formData.name}
          onChange={onChange}
          required
        />
        
        <div className="grid grid-cols-4 items-center gap-4">
          <ImageField 
            imageUrl={formData.imageUrl}
            onChange={handleImageChange}
          />
        </div>
        
        <FormField 
          label="SKU"
          name="sku"
          value={formData.sku}
          onChange={onChange}
          placeholder="Auto-generated if empty"
        />
        
        <FormField 
          label="Category"
          name="category"
          value={formData.category}
          onChange={onChange}
          placeholder="Auto-generated if empty"
        />
        
        <FormField 
          label="Cost Price"
          name="cost"
          type="number"
          value={formData.cost}
          onChange={onChange}
          required
          min="0"
          step="0.01"
        />
        
        <FormField 
          label="RRP"
          name="rrp"
          type="number"
          value={formData.rrp}
          onChange={onChange}
          min="0"
          step="0.01"
        />
        
        <FormField 
          label="Initial Stock"
          name="stock"
          type="number"
          value={formData.stock}
          onChange={onChange}
          required
          min="0"
        />
        
        <LocationSelect 
          value={formData.location}
          onValueChange={onLocationChange}
          required
        />
        
        <FormField 
          label="Low Stock Alert"
          name="lowStockThreshold"
          type="number"
          value={formData.lowStockThreshold}
          onChange={onChange}
          min="0"
        />
        
        <FormField 
          label="Reorder Quantity"
          name="minStockCount"
          type="number"
          value={formData.minStockCount}
          onChange={onChange}
          min="0"
        />
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
