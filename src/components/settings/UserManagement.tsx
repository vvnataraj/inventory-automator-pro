
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUserRoles } from "@/hooks/useUserRoles";
import AddUserDialog from "./AddUserDialog";
import UserTable from "./UserTable";

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
      
      // We can only get users indirectly via their profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, created_at');
      
      if (profilesError) throw profilesError;
      
      // Fetch all user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (rolesError) throw rolesError;
      
      // Map roles to users
      if (profiles) {
        const usersWithRoles = profiles.map(profile => {
          const userRoles = rolesData
            ? rolesData
                .filter(r => r.user_id === profile.id)
                .map(r => r.role)
            : [];
          
          return {
            id: profile.id,
            email: profile.username || 'No email available',
            last_sign_in_at: null, // We don't have access to this via profiles
            created_at: profile.created_at,
            roles: userRoles,
            is_disabled: false // Default value, would need server-side check in real app
          };
        });
        
        setUsers(usersWithRoles);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">User Management</h3>
        <AddUserDialog onUserAdded={fetchUsers} />
      </div>
      
      {loading && <div className="py-4 text-center">Loading users...</div>}
      
      <UserTable users={users} loading={loading} onUserUpdated={fetchUsers} />
    </div>
  );
}
