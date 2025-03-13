
import { useState, useEffect, useCallback } from "react";
import { useUserRoles } from "@/hooks/useUserRoles";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import UserManagement from "@/components/settings/UserManagement";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw } from "lucide-react";

export default function UsersTab() {
  const { isAdmin, loading: rolesLoading } = useUserRoles();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Memoize the fetchUsers function to prevent recreation on each render
  const fetchUsers = useCallback(async () => {
    if (!isAdmin()) return;
    
    try {
      setLoading(true);
      
      // Get all profiles
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      
      // Get all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
      
      if (rolesError) throw rolesError;
      
      // Map roles to profiles
      const usersWithRoles = profiles.map(profile => {
        const roles = userRoles
          .filter(role => role.user_id === profile.id)
          .map(role => role.role);
        
        return {
          id: profile.id,
          email: profile.username || 'No email',
          username: profile.username,
          created_at: profile.created_at,
          last_sign_in_at: null, // Not available with current permissions
          roles: roles.length > 0 ? roles : ['user'], // Default to user if no roles
          is_disabled: false // Not available with current permissions
        };
      });
      
      setUsers(usersWithRoles);
      console.log("Fetched users:", usersWithRoles.length);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [isAdmin]); // Only depend on isAdmin, not any state that changes frequently
  
  // Fetch users once when component mounts and roles are loaded
  useEffect(() => {
    if (!rolesLoading && isAdmin()) {
      fetchUsers();
    }
  }, [rolesLoading, isAdmin, fetchUsers]); // Include fetchUsers in deps as it's memoized now
  
  // Render the component
  if (rolesLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!isAdmin()) {
    return (
      <Card>
        <CardContent className="pt-6">
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
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="pt-6">
        <UserManagement 
          initialUsers={users} 
          loading={loading} 
          onRefresh={fetchUsers} 
        />
      </CardContent>
    </Card>
  );
}
