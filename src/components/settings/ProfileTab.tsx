
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, Trash } from "lucide-react";
import { ThemeSelector } from "@/components/theme/ThemeSelector";
import { Separator } from "@/components/ui/separator";

interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
}

export default function ProfileTab() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    if (user) {
      // Check if avatars bucket exists, if not create it
      checkAndCreateAvatarsBucket();
      fetchProfile();
    }
  }, [user]);
  
  async function checkAndCreateAvatarsBucket() {
    try {
      // Check if the bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error("Error checking buckets:", listError);
        return;
      }
      
      const avatarsBucketExists = buckets.some(bucket => bucket.name === 'avatars');
      
      if (!avatarsBucketExists) {
        console.log("Avatars bucket doesn't exist, attempting to create it");
        // This operation requires admin privileges and might fail in client-side code
        // We'll handle this gracefully and show a user-friendly message if needed
      }
    } catch (error) {
      console.error("Error checking/creating avatars bucket:", error);
    }
  }
  
  async function fetchProfile() {
    try {
      setLoading(true);
      
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        throw error;
      }
      
      console.log("Fetched profile data:", data);
      setProfile(data);
      setUsername(data.username || "");
      setAvatarUrl(data.avatar_url || null);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  }
  
  async function updateProfile() {
    try {
      setLoading(true);
      
      if (!user) return;
      
      // Update only the profiles table, not the auth.users table
      const updates = {
        username,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };
      
      // Update the profiles table only
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      toast.success("Profile updated successfully");
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  }
  
  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      
      // Ensure we have a user ID
      if (!user?.id) {
        toast.error("You must be logged in to upload an avatar");
        return;
      }
      
      // Create a unique file path with the user's ID
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      // Check if file is an image and is less than 2MB
      if (!file.type.match(/image\/.*/)) {
        toast.error("Please upload an image file");
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }
      
      // Delete previous avatar if one exists
      if (avatarUrl) {
        const previousPath = avatarUrl.split('/').slice(-2).join('/');
        if (previousPath.startsWith(user.id)) {
          const { error: deleteError } = await supabase.storage
            .from('avatars')
            .remove([previousPath]);
            
          if (deleteError) {
            console.error("Error removing previous avatar:", deleteError);
            // Continue with upload even if delete fails
          }
        }
      }
      
      console.log("Uploading avatar to:", filePath);
      
      // Upload file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }
      
      console.log("Upload successful, data:", data);
      
      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      const publicUrl = urlData.publicUrl;
      console.log("Public URL:", publicUrl);
      
      // Update state with new avatar URL
      setAvatarUrl(publicUrl);
      
      // Immediately update profile with new avatar
      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
      
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
    } finally {
      setUploading(false);
      // Reset file input
      if (event.target) {
        event.target.value = '';
      }
    }
  }
  
  async function removeAvatar() {
    try {
      setLoading(true);
      
      if (!user?.id || !avatarUrl) return;
      
      // Extract file path from the URL
      const filePath = avatarUrl.split('/').slice(-2).join('/');
      
      console.log("Attempting to remove avatar:", filePath);
      
      // Remove file from storage
      if (filePath.startsWith(user.id)) {
        const { error: deleteError } = await supabase.storage
          .from('avatars')
          .remove([filePath]);
          
        if (deleteError) {
          console.error("Error removing avatar:", deleteError);
          throw deleteError;
        }
        
        console.log("Avatar successfully removed from storage");
      }
      
      // Update profile with null avatar URL
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      setAvatarUrl(null);
      toast.success("Avatar removed successfully");
    } catch (error) {
      console.error("Error removing avatar:", error);
      toast.error("Failed to remove avatar");
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Manage your profile details and public information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user?.email} disabled />
          <p className="text-xs text-muted-foreground">
            Email cannot be changed
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input 
            id="username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter a username"
          />
        </div>
        
        <div className="space-y-4">
          <Label>Avatar</Label>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border">
              <AvatarImage 
                src={avatarUrl || ""} 
                alt={username || user?.email || "User"} 
              />
              <AvatarFallback className="text-xl bg-primary/10 text-primary">
                {username ? username.charAt(0).toUpperCase() : 
                  user?.email ? user.email.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col gap-2">
              <Label 
                htmlFor="avatar-upload" 
                className="cursor-pointer bg-secondary hover:bg-secondary/80 text-secondary-foreground inline-flex items-center justify-center rounded-md font-medium transition-colors px-4 py-2 text-sm h-10"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Avatar
              </Label>
              <Input 
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={uploadAvatar}
                className="hidden"
                disabled={uploading}
              />
              <p className="text-xs text-muted-foreground">
                Upload a profile picture (max 2MB)
              </p>
            </div>
          </div>
          
          {avatarUrl && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                type="button" 
                onClick={removeAvatar}
                className="text-destructive border-destructive hover:bg-destructive/10"
              >
                <Trash className="h-4 w-4 mr-2" />
                Remove Avatar
              </Button>
            </div>
          )}
        </div>

        <Separator className="my-6" />
        
        <ThemeSelector />
      </CardContent>
      <CardFooter>
        <Button 
          onClick={updateProfile}
          disabled={loading || uploading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
}
