
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
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

  // Update local preview when imageUrl prop changes
  useEffect(() => {
    setImagePreview(imageUrl || null);
  }, [imageUrl]);

  useEffect(() => {
    // Check if the inventory-images bucket exists and create it if needed
    checkAndCreateBucket();
  }, []);

  async function checkAndCreateBucket() {
    try {
      // Check if the bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error("Error checking buckets:", listError);
        return;
      }
      
      const inventoryBucketExists = buckets.some(bucket => bucket.name === 'inventory-images');
      
      if (!inventoryBucketExists) {
        console.log("Creating inventory-images bucket");
        try {
          const { data, error } = await supabase.storage.createBucket('inventory-images', {
            public: true,
            fileSizeLimit: 5 * 1024 * 1024, // 5MB
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
          });
          
          if (error) {
            console.error("Error creating bucket:", error);
            toast.error("Failed to create storage bucket. Image uploads may not work.");
          } else {
            console.log("Successfully created inventory-images bucket", data);
          }
        } catch (createError) {
          console.error("Exception creating bucket:", createError);
        }
      }
    } catch (error) {
      console.error("Error in checkAndCreateBucket:", error);
    }
  }

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
      console.log("Uploading inventory image:", filePath);
      
      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from('inventory-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true // Changed to true to overwrite existing files
        });

      if (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload image: " + error.message);
        setUploading(false);
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
    } catch (error) {
      console.error('Error uploading image:', error);
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
        {imageUrl && (
          <div className="text-sm text-muted-foreground ml-2 truncate max-w-[200px]">
            Current image set
          </div>
        )}
      </div>
      
      {(imagePreview || imageUrl) && (
        <div className="border rounded-md p-2 w-full">
          <img 
            src={imagePreview || imageUrl} 
            alt="Preview" 
            className="h-32 object-contain mx-auto"
            onError={(e) => {
              console.error("Failed to load image:", imagePreview || imageUrl);
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
};
