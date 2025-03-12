
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRoles } from "@/hooks/useUserRoles";
import { toast } from "sonner";
import UserManagement from "@/components/settings/UserManagement";
import { RefreshCw } from "lucide-react";

export default function UsersTab() {
  const { assignAllUsersAdminRole } = useAuth();
  const { isAdmin, loading: rolesLoading, fetchRoles } = useUserRoles();
  const [assigningRoles, setAssigningRoles] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleAssignAllAdminRole = async () => {
    try {
      setAssigningRoles(true);
      await assignAllUsersAdminRole();
    } finally {
      setAssigningRoles(false);
    }
  };

  const handleRefreshUserData = async () => {
    try {
      setRefreshing(true);
      await fetchRoles();
      toast.success("User data refreshed successfully");
    } catch (error) {
      console.error("Error refreshing user data:", error);
      toast.error("Failed to refresh user data");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {!rolesLoading && isAdmin() ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">User Management</h3>
              <div className="space-x-2 flex">
                <Button 
                  onClick={handleRefreshUserData}
                  disabled={refreshing}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh User Data'}
                </Button>
                <Button 
                  onClick={handleAssignAllAdminRole}
                  disabled={assigningRoles}
                  variant="outline"
                >
                  {assigningRoles ? 'Assigning...' : 'Make All Users Admin'}
                </Button>
              </div>
            </div>
            <UserManagement />
          </>
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
