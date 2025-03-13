
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AssignAdminRole from "@/components/settings/AssignAdminRole";
import RolesManagement from "@/components/settings/RolesManagement";
import { useAuth } from "@/contexts/AuthContext";

export default function RolesTab() {
  const { user } = useAuth();
  
  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quick Admin Assignment</CardTitle>
          <CardDescription>
            Assign admin role to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will assign the admin role to your account ({user?.email}), giving you full access to all functionality.
            </p>
            <AssignAdminRole />
          </div>
        </CardContent>
      </Card>
      <RolesManagement />
    </>
  );
}
