
import React, { useState } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";

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
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;

    setUploading(true);

    try {
      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from('inventory-images')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('inventory-images')
        .getPublicUrl(filePath);

      // Create object URL for preview
      setImagePreview(URL.createObjectURL(file));

      // Update form data with image URL
      const imageChangeEvent = {
        target: {
          name: 'imageUrl',
          value: publicUrl
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      onChange(imageChangeEvent);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

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
          <Label htmlFor="image" className="text-right">Image</Label>
          <div className="col-span-3 space-y-2">
            <div className="flex items-center gap-2">
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => document.getElementById('image')?.click()}
                disabled={uploading}
                className="flex gap-2"
              >
                <Upload className="h-4 w-4" />
                {uploading ? 'Uploading...' : 'Upload Image'}
              </Button>
            </div>
            
            {(imagePreview || formData.imageUrl) && (
              <div className="border rounded-md p-2 w-full">
                <img 
                  src={imagePreview || formData.imageUrl} 
                  alt="Preview" 
                  className="h-32 object-contain mx-auto"
                />
              </div>
            )}
          </div>
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
          <Label htmlFor="minStockCount" className="text-right">Reorder Quantity</Label>
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
