
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
}

interface ProfileTabProps {
  user: User;
  profile: UserProfile | null;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  fetchProfile: () => Promise<void>;
}

export default function ProfileTab({ 
  user,
  profile,
  loading,
  setLoading,
  fetchProfile
}: ProfileTabProps) {
  const [username, setUsername] = useState(profile?.username || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  
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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Manage your profile details and public information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user.email} disabled />
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
        
        <div className="space-y-2">
          <Label htmlFor="avatar">Avatar URL</Label>
          <Input 
            id="avatar" 
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="Enter avatar URL"
          />
          {avatarUrl && (
            <div className="mt-2">
              <p className="text-sm mb-1">Preview:</p>
              <img 
                src={avatarUrl} 
                alt="Avatar preview" 
                className="w-16 h-16 rounded-full object-cover border"
                onError={(e) => {
                  e.currentTarget.src = "https://avatar.vercel.sh/inventory";
                }}
              />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={updateProfile}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
}
