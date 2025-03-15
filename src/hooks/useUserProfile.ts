
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logActivity } from "@/utils/logging";

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
      
      console.log("Fetching profile for user:", user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error("Error fetching profile data:", error);
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
      
      if (!user) {
        console.error("No user found when updating profile");
        toast.error("You must be logged in to update your profile");
        return;
      }
      
      console.log("Updating profile for user:", user.id);
      console.log("New username value:", username);
      
      // Only update the profiles table, not the auth.users table
      const updates = {
        username,
        updated_at: new Date().toISOString(),
      };
      
      console.log("Sending profile update with data:", updates);
      
      // Update the profiles table
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
        
      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
      
      console.log("Profile updated successfully");
      
      // Log the activity
      await logActivity({
        action: 'profile_update',
        target_type: 'profile',
        target_id: user.id,
        details: { fields_updated: ['username'] }
      });
      
      toast.success("Profile updated successfully");
      await fetchProfile(); // Refresh the profile data
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
