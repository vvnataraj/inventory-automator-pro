
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AssignAdminRole from "@/components/settings/AssignAdminRole";
import RolesManagement from "@/components/settings/RolesManagement";

export default function RolesTab() {
  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quick Admin Assignment</CardTitle>
          <CardDescription>
            Assign admin role to a specific user
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will assign the admin role to macpherson.lucym@gmail.com, giving them full access to all functionality.
            </p>
            <AssignAdminRole />
          </div>
        </CardContent>
      </Card>
      <RolesManagement />
    </>
  );
}
