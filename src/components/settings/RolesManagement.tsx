
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRoles } from "@/hooks/useUserRoles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Check, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  X 
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function RolesManagement() {
  const { user } = useAuth();
  const { role, loading, isAdmin, setUserRole } = useUserRoles();
  const [isPromoting, setIsPromoting] = useState(false);
  
  const makeAdmin = async () => {
    if (!user) return;
    
    try {
      setIsPromoting(true);
      const success = await setUserRole('admin');
      
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

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin':
        return "Full access to all features and settings";
      case 'manager':
        return "Can add/edit/delete items but cannot access settings";
      case 'user':
        return "Read-only access, cannot add/edit/delete";
      default:
        return "Basic access";
    }
  };
  
  // Role permissions matrix
  const permissionsMatrix = [
    { feature: "View items", admin: true, manager: true, user: true },
    { feature: "Add new items", admin: true, manager: true, user: false },
    { feature: "Edit items", admin: true, manager: true, user: false },
    { feature: "Delete items", admin: true, manager: true, user: false },
    { feature: "Transfer items", admin: true, manager: true, user: false },
    { feature: "View sales data", admin: true, manager: true, user: true },
    { feature: "Create sales", admin: true, manager: true, user: false },
    { feature: "View purchase orders", admin: true, manager: true, user: true },
    { feature: "Create purchase orders", admin: true, manager: true, user: false },
    { feature: "Access system settings", admin: true, manager: false, user: false },
    { feature: "Manage users", admin: true, manager: false, user: false },
    { feature: "Assign roles", admin: true, manager: false, user: false },
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Roles & Permissions</CardTitle>
        <CardDescription>
          View and manage your access levels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Current role:</h3>
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="text-sm">Loading role...</span>
              </div>
            ) : role ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge 
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
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2 mt-1">
                    <div className="w-4">{getRoleIcon(role)}</div>
                    <div>{getRoleDescription(role)}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground">No role assigned. You have read-only access.</p>
                <div className="flex items-start gap-2 mt-2">
                  <div className="w-4"><Shield className="h-4 w-4" /></div>
                  <div className="text-sm text-muted-foreground">{getRoleDescription('user')}</div>
                </div>
              </div>
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
          
          <div className="pt-4">
            <h3 className="text-sm font-medium mb-4">Role Permissions Matrix</h3>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Feature / Permission</TableHead>
                    <TableHead className="text-center">Admin</TableHead>
                    <TableHead className="text-center">Manager</TableHead>
                    <TableHead className="text-center">User</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissionsMatrix.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.feature}</TableCell>
                      <TableCell className="text-center">
                        {row.admin ? (
                          <Check className="h-4 w-4 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-red-500 mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {row.manager ? (
                          <Check className="h-4 w-4 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-red-500 mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {row.user ? (
                          <Check className="h-4 w-4 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-red-500 mx-auto" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
