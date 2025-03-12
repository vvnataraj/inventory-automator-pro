
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import RolesManagement from "@/components/settings/RolesManagement";
import ProfileTab from "@/components/settings/ProfileTab";
import PasswordChangeForm from "@/components/settings/PasswordChangeForm";
import UsersTab from "@/components/settings/UsersTab";

interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
}

export default function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
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
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  }
  
  async function changePassword(currentPassword: string, newPassword: string) {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  }
  
  if (!user) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <p>Please log in to view this page.</p>
      </div>
    );
  }
  
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      
      <Tabs defaultValue="profile" className="w-full max-w-3xl">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileTab 
            user={user}
            profile={profile}
            loading={loading}
            setLoading={setLoading}
            fetchProfile={fetchProfile}
          />
        </TabsContent>
        
        <TabsContent value="security">
          <PasswordChangeForm 
            onChangePassword={changePassword} 
            loading={loading} 
          />
        </TabsContent>
        
        <TabsContent value="roles">
          <RolesManagement />
        </TabsContent>
        
        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
