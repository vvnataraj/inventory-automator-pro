
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InventoryItem } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";

interface InventoryItemFormProps {
  formData: InventoryItem;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  totalStock?: number;
}

export const InventoryItemEditForm: React.FC<InventoryItemFormProps> = ({ 
  formData, 
  onChange,
  totalStock
}) => {
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
        <Label htmlFor="image" className="text-right">Image</Label>
        <div className="col-span-3 space-y-2">
          <div className="flex items-center gap-2">
            <Input
              id="image-edit"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => document.getElementById('image-edit')?.click()}
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
        <div className="col-span-3 flex items-center gap-2">
          <Input
            id="stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={onChange}
            className="flex-1"
          />
          {totalStock !== undefined && (
            <div className="text-sm text-muted-foreground">
              (Total across all locations: {totalStock})
            </div>
          )}
        </div>
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
