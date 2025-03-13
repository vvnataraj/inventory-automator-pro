
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadFieldProps {
  imageUrl?: string;
  onImageChange: (url: string) => void;
  inputId?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({ 
  imageUrl, 
  onImageChange,
  inputId = "image"
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
      onImageChange(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="col-span-3 space-y-2">
      <div className="flex items-center gap-2">
        <Input
          id={inputId}
          name="image"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => document.getElementById(inputId)?.click()}
          disabled={uploading}
          className="flex gap-2"
        >
          <Upload className="h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </div>
      
      {(imagePreview || imageUrl) && (
        <div className="border rounded-md p-2 w-full">
          <img 
            src={imagePreview || imageUrl} 
            alt="Preview" 
            className="h-32 object-contain mx-auto"
          />
        </div>
      )}
    </div>
  );
};
