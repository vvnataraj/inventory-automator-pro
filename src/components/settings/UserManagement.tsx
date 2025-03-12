
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUserRoles } from "@/hooks/useUserRoles";
import AddUserDialog from "./AddUserDialog";
import UserTable from "./UserTable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

type User = {
  id: string;
  email: string;
  last_sign_in_at: string | null;
  created_at: string;
  roles: string[];
  is_disabled?: boolean;
};

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const { isAdmin } = useUserRoles();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  async function fetchUsers() {
    try {
      setLoading(true);
      
      // Get all user roles - this will be our primary source of users
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (rolesError) throw rolesError;
      
      if (rolesData && rolesData.length > 0) {
        // Create a map to group roles by user_id
        const userRolesMap = new Map();
        
        rolesData.forEach(role => {
          if (!userRolesMap.has(role.user_id)) {
            userRolesMap.set(role.user_id, {
              id: role.user_id,
              email: `User ${role.user_id.substring(0, 8)}...`, // Placeholder email
              roles: [role.role],
              created_at: new Date().toISOString(), // Default value
              last_sign_in_at: null,
              is_disabled: false
            });
          } else {
            const user = userRolesMap.get(role.user_id);
            user.roles.push(role.role);
          }
        });
        
        // Try to get profile information if available
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, created_at');
        
        // Update user information with profile data if available
        if (profiles && !profilesError) {
          profiles.forEach(profile => {
            if (userRolesMap.has(profile.id)) {
              const user = userRolesMap.get(profile.id);
              user.email = profile.username || `User ${profile.id.substring(0, 8)}...`;
              user.created_at = profile.created_at;
            }
          });
        }
        
        setUsers(Array.from(userRolesMap.values()));
        toast.success("Users loaded successfully");
      } else {
        setUsers([]);
        toast.info("No users found in the system");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }
  
  if (!isAdmin()) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">User Management</h3>
        <p>You need admin privileges to access this section.</p>
      </div>
    );
  }
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">User Management</h3>
              <p className="text-sm text-muted-foreground">
                {users.length} {users.length === 1 ? 'user' : 'users'} in the system
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchUsers}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <AddUserDialog onUserAdded={fetchUsers} />
            </div>
          </div>
          
          {loading ? (
            <div className="py-8 text-center">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p>Loading users...</p>
            </div>
          ) : (
            <UserTable users={users} loading={loading} onUserUpdated={fetchUsers} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
