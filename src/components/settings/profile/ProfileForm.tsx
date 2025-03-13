
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type ProfileFormProps = {
  user: any;
  username: string;
  setUsername: (username: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  avatarUrl: string | null;
};

export function ProfileForm({
  user,
  username,
  setUsername,
  loading,
  setLoading,
  avatarUrl,
}: ProfileFormProps) {
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

  return (
    <div className="space-y-6">
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

      <Button 
        onClick={updateProfile}
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
}
