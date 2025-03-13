
import { useUserRoles } from "@/hooks/useUserRoles";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import UserManagement from "@/components/settings/UserManagement";

export default function UsersTab() {
  const { isAdmin, loading: rolesLoading } = useUserRoles();
  
  return (
    <Card>
      <CardContent className="pt-6">
        {!rolesLoading && isAdmin() ? (
          <UserManagement />
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
