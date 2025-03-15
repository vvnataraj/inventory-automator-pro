
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  username: string | null;
}

export function useUserProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [username, setUsername] = useState("");
  
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
      
      console.log("Fetched profile data:", data);
      setProfile(data);
      setUsername(data.username || "");
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

  return {
    user,
    profile,
    username,
    setUsername,
    loading,
    updateProfile
  };
}
