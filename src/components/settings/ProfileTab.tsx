import { useState } from "react";
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
import { useNavigate } from "react-router-dom";

export default function ProfileTab() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar_url || null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  
  async function updateProfile() {
    try {
      setLoading(true);
      
      if (!user) {
        toast.error("You must be logged in to update your profile");
        navigate("/login");
        return;
      }
      
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("Your session has expired. Please log in again.");
        navigate("/login");
        return;
      }
      
      const { error } = await supabase.auth.updateUser({
        data: {
          username,
          avatar_url: avatarUrl,
        }
      });
        
      if (error) {
        if (error.message.includes("Auth session missing")) {
          toast.error("Your session has expired. Please log in again.");
          navigate("/login");
          return;
        }
        throw error;
      }
      
      if (user) {
        user.username = username;
        user.avatar_url = avatarUrl;
      }
      
      toast.success("Profile updated successfully");
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
      
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("Your session has expired. Please log in again.");
        navigate("/login");
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      
      if (!user?.id) {
        toast.error("You must be logged in to upload an avatar");
        return;
      }
      
      const filePath = `${user.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      if (!file.type.match(/image\/.*/)) {
        toast.error("Please upload an image file");
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }
      
      if (avatarUrl) {
        const previousPath = avatarUrl.split('/').slice(-2).join('/');
        if (previousPath.startsWith(user.id)) {
          const { error: deleteError } = await supabase.storage
            .from('avatars')
            .remove([previousPath]);
            
          if (deleteError) {
            console.error("Error removing previous avatar:", deleteError);
          }
        }
      }
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      setAvatarUrl(publicUrl);
      
      await supabase.auth.updateUser({
        data: {
          avatar_url: publicUrl
        }
      });
      
      if (user) {
        user.avatar_url = publicUrl;
      }
      
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      
      if (error instanceof Error && error.message.includes("Auth session missing")) {
        toast.error("Your session has expired. Please log in again.");
        navigate("/login");
        return;
      }
      
      toast.error("Failed to upload avatar");
    } finally {
      setUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  }
  
  async function removeAvatar() {
    try {
      setLoading(true);
      
      if (!user?.id || !avatarUrl) return;
      
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("Your session has expired. Please log in again.");
        navigate("/login");
        return;
      }
      
      const filePath = avatarUrl.split('/').slice(-2).join('/');
      
      if (filePath.startsWith(user.id)) {
        const { error: deleteError } = await supabase.storage
          .from('avatars')
          .remove([filePath]);
          
        if (deleteError) {
          console.error("Error removing avatar:", deleteError);
          throw deleteError;
        }
      }
      
      const { error } = await supabase.auth.updateUser({
        data: {
          avatar_url: null
        }
      });
      
      if (error) {
        throw error;
      }
      
      setAvatarUrl(null);
      
      if (user) {
        user.avatar_url = null;
      }
      
      toast.success("Avatar removed successfully");
    } catch (error) {
      console.error("Error removing avatar:", error);
      
      if (error instanceof Error && error.message.includes("Auth session missing")) {
        toast.error("Your session has expired. Please log in again.");
        navigate("/login");
        return;
      }
      
      toast.error("Failed to remove avatar");
    } finally {
      setLoading(false);
    }
  }
  
  if (!user) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-10">
          <div className="text-center">
            <p className="text-muted-foreground">You need to be logged in to view your profile</p>
            <Button className="mt-4" onClick={() => navigate("/login")}>
              Go to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    );
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
