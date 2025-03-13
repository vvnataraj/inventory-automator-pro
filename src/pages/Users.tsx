
import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useUserRoles } from "@/hooks/useUserRoles";
import { supabase } from "@/integrations/supabase/client";
import UserManagement from "@/components/settings/UserManagement";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

export default function Users() {
  const { isAdmin, isManager, loading: rolesLoading } = useUserRoles();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    if (!isAdmin() && !isManager()) return;
    
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
  };
  
  useEffect(() => {
    if (!rolesLoading && (isAdmin() || isManager())) {
      fetchUsers();
    }
  }, [rolesLoading, isAdmin, isManager]);
  
  if (rolesLoading) {
    return (
      <MainLayout>
        <div className="container py-10">
          <h1 className="text-2xl font-bold mb-4">User Management</h1>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }
  
  if (!isAdmin() && !isManager()) {
    return (
      <MainLayout>
        <div className="container py-10">
          <h1 className="text-2xl font-bold mb-4">User Management</h1>
          <Card>
            <CardContent className="pt-6">
              <div className="py-6 text-center space-y-3">
                <h3 className="text-lg font-medium">User Management</h3>
                <p className="text-muted-foreground">You need admin or manager privileges to access this section.</p>
                <Button 
                  variant="outline" 
                  onClick={() => toast.info("Please ask an administrator to grant you the necessary privileges.")}
                >
                  Request Access
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container py-10">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>
        <Card>
          <CardContent className="pt-6">
            <UserManagement 
              initialUsers={users} 
              loading={loading} 
              onRefresh={fetchUsers} 
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
