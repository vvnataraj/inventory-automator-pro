
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

// Define the response type for our custom RPC function
interface ProfileUpdateResponse {
  success: boolean;
  message: string;
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
      fetchProfile();
    }
  }, [user]);
  
  async function fetchProfile() {
    try {
      setLoading(true);
      
      if (!user) return;
      
      // Get profile from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error("Error fetching profile:", error);
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
      
      const currentTime = new Date().toISOString();
      
      // Use our custom function to update the profile
      // Cast the response using 'as any as ProfileUpdateResponse' to handle TypeScript issue
      const { data, error } = await supabase.functions.invoke('update-profile', {
        body: {
          userId: user.id,
          username: username,
          avatarUrl: avatarUrl,
          updatedAt: currentTime
        }
      });
      
      console.log("Update profile response:", data);
        
      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
      
      // Update profile directly as a fallback if the function isn't available yet
      if (!data) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            username: username,
            avatar_url: avatarUrl,
            updated_at: currentTime
          })
          .eq('id', user.id);
          
        if (updateError) throw updateError;
      }
      
      toast.success("Profile updated successfully");
      fetchProfile();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }
  
  async function ensureAvatarsBucket() {
    try {
      // Check if the bucket exists first
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error("Error checking buckets:", listError);
        return false;
      }
      
      const avatarsBucketExists = buckets.some(bucket => bucket.name === 'avatars');
      
      if (!avatarsBucketExists) {
        console.log("Avatars bucket doesn't exist, creating it");
        
        // Create the avatars bucket
        const { data, error } = await supabase.storage.createBucket('avatars', {
          public: true,
          fileSizeLimit: 2 * 1024 * 1024 // 2MB limit
        });
        
        if (error) {
          console.error("Error creating avatars bucket:", error);
          return false;
        }
        
        console.log("Avatars bucket created successfully");
      }
      
      return true;
    } catch (error) {
      console.error("Error ensuring avatars bucket exists:", error);
      return false;
    }
  }
  
  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      // First ensure the avatars bucket exists
      const bucketExists = await ensureAvatarsBucket();
      if (!bucketExists) {
        toast.error("Could not create storage bucket");
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
          console.log("Removing previous avatar:", previousPath);
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
      
      // Update profile with new avatar
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (updateError) {
        console.error("Error updating profile with new avatar:", updateError);
        throw updateError;
      }
      
      toast.success("Avatar uploaded successfully");
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar: " + (error.message || "Unknown error"));
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
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (updateError) {
        console.error("Error updating profile after removing avatar:", updateError);
        throw updateError;
      }
      
      setAvatarUrl(null);
      toast.success("Avatar removed successfully");
    } catch (error: any) {
      console.error("Error removing avatar:", error);
      toast.error("Failed to remove avatar: " + (error.message || "Unknown error"));
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
