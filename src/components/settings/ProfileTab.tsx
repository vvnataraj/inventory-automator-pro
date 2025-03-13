
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

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
  const [avatarUrl, setAvatarUrl] = useState("");
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
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        throw error;
      }
      
      setProfile(data);
      setUsername(data.username || "");
      setAvatarUrl(data.avatar_url || "");
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
      
      const updates = {
        id: user.id,
        username,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };
      
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
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`;
      
      // Check if file is an image and is less than 2MB
      if (!file.type.match(/image\/.*/)) {
        toast.error("Please upload an image file");
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }
      
      // Upload file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      // Update profile with new avatar URL
      setAvatarUrl(publicUrl);
      
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
                src={avatarUrl} 
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
                onClick={() => setAvatarUrl("")}
              >
                Remove Avatar
              </Button>
            </div>
          )}
        </div>
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
