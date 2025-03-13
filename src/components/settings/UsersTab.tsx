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
      
      // Get all users using our secure function
      const { data: authUsers, error: authError } = await supabase
        .rpc('get_users');
      
      if (authError) {
        console.error("Error fetching users:", authError);
        throw authError;
      }
      
      // Get all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
      
      if (rolesError) throw rolesError;
      
      // Map roles to users
      const usersWithRoles = authUsers.map(user => {
        const roles = userRoles
          .filter(role => role.user_id === user.id)
          .map(role => role.role);
        
        return {
          id: user.id,
          email: user.email || 'No email',
          username: user.username || user.email?.split('@')[0] || 'No username',
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          roles: roles.length > 0 ? roles : ['user'],
          is_disabled: false // Not implemented yet
        };
      });
      
      setUsers(usersWithRoles);
      console.log("Fetched users successfully:", usersWithRoles.length);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [isAdmin]); 
  
  // Fetch users once when component mounts and roles are loaded
  useEffect(() => {
    if (!rolesLoading && isAdmin()) {
      fetchUsers();
    }
  }, [rolesLoading, isAdmin, fetchUsers]);
  
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
