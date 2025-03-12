
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
  const { user: currentUser, assignUserRole } = useAuth();
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
      
      // Get all authenticated users from auth.users via the admin API
      // This is simulated since we can't directly access auth.users from the client
      
      // First get user profiles - this will be our most comprehensive source of users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, created_at, avatar_url');
      
      if (profilesError) throw profilesError;
      
      // Then get all user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (rolesError) throw rolesError;
      
      // Create a map to group roles by user_id and build our user list
      const userRolesMap = new Map();
      
      // Add all profiles first
      if (profiles && profiles.length > 0) {
        profiles.forEach(profile => {
          userRolesMap.set(profile.id, {
            id: profile.id,
            email: profile.username || `User ${profile.id.substring(0, 8)}...`,
            created_at: profile.created_at,
            last_sign_in_at: null,
            roles: [],
            is_disabled: false
          });
        });
      }
      
      // Add roles to users
      if (rolesData && rolesData.length > 0) {
        rolesData.forEach(role => {
          if (!userRolesMap.has(role.user_id)) {
            // If user doesn't exist in map yet, add them
            userRolesMap.set(role.user_id, {
              id: role.user_id,
              email: `User ${role.user_id.substring(0, 8)}...`,
              roles: [role.role],
              created_at: new Date().toISOString(),
              last_sign_in_at: null,
              is_disabled: false
            });
          } else {
            // Otherwise just add the role
            const user = userRolesMap.get(role.user_id);
            user.roles.push(role.role);
          }
        });
      }
      
      setUsers(Array.from(userRolesMap.values()));
      
      if (userRolesMap.size > 0) {
        toast.success(`${userRolesMap.size} users loaded successfully`);
      } else {
        toast.info("No users found in the system");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }
  
  // Immediately try to assign admin role to lucy.tuhill@gmail.com
  useEffect(() => {
    if (users.length > 0) {
      const targetEmail = "lucy.tuhill@gmail.com";
      const targetUser = users.find(u => u.email.toLowerCase() === targetEmail.toLowerCase());
      
      if (targetUser && !targetUser.roles.includes('admin')) {
        assignUserRole(targetEmail, 'admin');
      }
    }
  }, [users, assignUserRole]);
  
  if (!isAdmin()) {
    return (
      <div className="space-y-4 w-full">
        <h3 className="text-lg font-medium">User Management</h3>
        <p>You need admin privileges to access this section.</p>
      </div>
    );
  }
  
  return (
    <Card className="w-full">
      <CardContent className="pt-6 px-0 sm:px-6">
        <div className="space-y-6 w-full">
          <div className="flex items-center justify-between px-6 sm:px-0">
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
            <div className="w-full overflow-x-auto">
              <UserTable users={users} loading={loading} onUserUpdated={fetchUsers} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
