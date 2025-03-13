
import { useUserRoles } from "@/hooks/useUserRoles";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import UserManagement from "@/components/settings/UserManagement";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw } from "lucide-react";

export default function UsersTab() {
  const { isAdmin, loading: rolesLoading } = useUserRoles();
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState([]);
  
  // Fetch all users when the component mounts (only for admins)
  useEffect(() => {
    if (!rolesLoading && isAdmin()) {
      fetchAllUsers();
    }
  }, [rolesLoading, isAdmin]);
  
  // Function to fetch all users from the database
  const fetchAllUsers = async () => {
    try {
      setLoadingUsers(true);
      
      // Get all profiles
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      
      // Get all user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
      
      if (rolesError) throw rolesError;
      
      // Map roles to profiles
      const usersWithRoles = profiles.map(profile => {
        const userRoles = roles.filter(role => role.user_id === profile.id);
        return {
          id: profile.id,
          email: profile.username || 'Unknown email',
          username: profile.username,
          created_at: profile.created_at,
          last_sign_in_at: null, // We don't have this info with regular access
          roles: userRoles.length > 0 ? userRoles.map(r => r.role) : ['user'],
          is_disabled: false // We don't have this info with regular access
        };
      });
      
      setUsers(usersWithRoles);
      console.log("Fetched users:", usersWithRoles.length);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        {!rolesLoading && isAdmin() ? (
          <UserManagement initialUsers={users} loading={loadingUsers} onRefresh={fetchAllUsers} />
        ) : (
          <div className="py-6 text-center space-y-3">
            <h3 className="text-lg font-medium">User Management</h3>
            <p className="text-muted-foreground">You need admin privileges to access this section.</p>
            <Button 
              variant="outline" 
              onClick={() => toast.info("Please ask an administrator to grant you admin privileges.")}
            >
              Request Admin Access
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
