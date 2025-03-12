
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRoles } from "@/hooks/useUserRoles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

export default function RolesManagement() {
  const { user } = useAuth();
  const { roles, loading, isAdmin, addRole } = useUserRoles();
  const [isPromoting, setIsPromoting] = useState(false);
  
  const makeAdmin = async () => {
    if (!user) return;
    
    try {
      setIsPromoting(true);
      const success = await addRole('admin');
      
      if (success) {
        toast.success("You now have admin privileges");
      }
    } catch (error) {
      console.error("Error adding admin role:", error);
      toast.error("Failed to add admin role");
    } finally {
      setIsPromoting(false);
    }
  };
  
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <ShieldAlert className="h-4 w-4 mr-1" />;
      case 'manager':
        return <ShieldCheck className="h-4 w-4 mr-1" />;
      default:
        return <Shield className="h-4 w-4 mr-1" />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Roles & Permissions</CardTitle>
        <CardDescription>
          View and manage your access levels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Current roles:</h3>
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="text-sm">Loading roles...</span>
              </div>
            ) : roles.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {roles.map((role, index) => (
                  <Badge 
                    key={index}
                    variant={
                      role === 'admin' 
                        ? 'default' 
                        : role === 'manager' 
                          ? 'secondary' 
                          : 'outline'
                    }
                    className="flex items-center"
                  >
                    {getRoleIcon(role)}
                    {role}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No roles assigned</p>
            )}
          </div>
          
          {!isAdmin() && (
            <div className="pt-2">
              <p className="text-sm mb-2">
                Need admin access? You can grant yourself admin privileges to access all features.
              </p>
              <Button 
                onClick={makeAdmin} 
                disabled={loading || isPromoting}
                className="flex items-center gap-2"
              >
                <ShieldAlert className="h-4 w-4" />
                {isPromoting ? "Granting access..." : "Make Yourself Admin"}
              </Button>
            </div>
          )}
          
          {isAdmin() && (
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">
                You have full administrative access to the system. You can manage users and their roles from the Users tab.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
