
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [imagePreview, setImagePreview] = useState<string | null>(imageUrl || null);
  const [error, setError] = useState<string | null>(null);

  // Update local preview when imageUrl prop changes
  useEffect(() => {
    setImagePreview(imageUrl || null);
    setError(null);
  }, [imageUrl]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    
    // Validate file type
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!acceptedTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPEG, PNG, GIF, WEBP, SVG)");
      toast.error("Invalid file type. Please upload an image.");
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum size is 5MB.");
      toast.error("Image is too large. Maximum size is 5MB.");
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;

    setUploading(true);
    setError(null);

    try {
      console.log("Uploading inventory image:", filePath);
      
      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from('inventory-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error("Upload error:", error);
        setError(`Upload failed: ${error.message}`);
        toast.error("Failed to upload image");
        return;
      }

      console.log("Upload successful, data:", data);
      
      // Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('inventory-images')
        .getPublicUrl(filePath);

      console.log("Public URL:", publicUrl);
      
      // Create object URL for preview
      setImagePreview(URL.createObjectURL(file));
      
      // Update form data with image URL
      onImageChange(publicUrl);
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setError(`Upload error: ${error.message || 'Unknown error'}`);
      toast.error("Image upload failed");
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
        {imageUrl && !error && (
          <div className="text-sm text-muted-foreground ml-2 truncate max-w-[200px]">
            Current image set
          </div>
        )}
      </div>
      
      {error && (
        <div className="text-sm text-red-500 flex items-center gap-1 mt-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
      
      {(imagePreview || imageUrl) && !error && (
        <div className="border rounded-md p-2 w-full">
          <img 
            src={imagePreview || imageUrl} 
            alt="Preview" 
            className="h-32 object-contain mx-auto"
            onError={(e) => {
              console.error("Failed to load image preview:", imagePreview || imageUrl);
              setError("Failed to load image preview");
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
};
