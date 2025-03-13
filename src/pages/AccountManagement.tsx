
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/settings/UserManagement";
import RolesManagement from "@/components/settings/RolesManagement";
import { useAuth } from "@/contexts/AuthContext";

export default function AccountManagement() {
  const { user } = useAuth();
  
  return (
    <MainLayout>
      <div className="container py-10">
        <h1 className="text-2xl font-bold mb-6">Account Management</h1>
        
        <Tabs defaultValue="users" className="w-full max-w-4xl">
          <TabsList className="mb-6">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="roles">
            <RolesManagement />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
