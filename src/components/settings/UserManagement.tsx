
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
import { ListControls } from "@/components/common/ListControls";

type User = {
  id: string;
  email: string;
  username: string | null;
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
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  async function fetchUsers() {
    try {
      setLoading(true);
      
      // First fetch all user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (rolesError) throw rolesError;
      
      // Create a map to group roles by user_id
      const userRolesMap = new Map();
      
      if (rolesData && rolesData.length > 0) {
        rolesData.forEach(role => {
          if (!userRolesMap.has(role.user_id)) {
            userRolesMap.set(role.user_id, {
              id: role.user_id,
              email: "", // Will be populated later
              username: null, // Will be populated later
              roles: [role.role],
              created_at: new Date().toISOString(),
              last_sign_in_at: null,
              is_disabled: false
            });
          } else {
            const user = userRolesMap.get(role.user_id);
            user.roles.push(role.role);
          }
        });
        
        // Get profile information including username and creation date
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, created_at');
        
        // Get user emails from auth - note: this requires admin access via server function in production
        // For demonstration, we're using direct auth queries which will work in development
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        
        // Update user information with profile data
        if (profiles && !profilesError) {
          profiles.forEach(profile => {
            if (userRolesMap.has(profile.id)) {
              const user = userRolesMap.get(profile.id);
              user.username = profile.username;
              user.created_at = profile.created_at;
            }
          });
        }
        
        // Update user information with auth data
        if (authUsers?.users && !authError) {
          authUsers.users.forEach(authUser => {
            if (userRolesMap.has(authUser.id)) {
              const user = userRolesMap.get(authUser.id);
              user.email = authUser.email || "";
              user.last_sign_in_at = authUser.last_sign_in_at;
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

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (user.email && user.email.toLowerCase().includes(searchLower)) ||
      (user.username && user.username.toLowerCase().includes(searchLower)) ||
      user.roles.some(role => role.toLowerCase().includes(searchLower))
    );
  });
  
  if (!isAdmin()) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">User Management</h3>
        <p className="text-muted-foreground">You need admin privileges to access this section.</p>
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
          
          <ListControls
            searchPlaceholder="Search users..."
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            showFilter={false}
          />
          
          {loading ? (
            <div className="py-8 text-center">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p>Loading users...</p>
            </div>
          ) : (
            <UserTable users={filteredUsers} loading={loading} onUserUpdated={fetchUsers} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
