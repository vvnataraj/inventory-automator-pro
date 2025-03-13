
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RolesTab from "@/components/settings/RolesTab";
import UsersTab from "@/components/settings/UsersTab";
import { MainLayout } from "@/components/layout/MainLayout";

export default function Settings() {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <MainLayout>
        <div className="container py-10">
          <h1 className="text-2xl font-bold mb-4">Settings</h1>
          <p>Please log in to view this page.</p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container py-10">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
        
        <Tabs defaultValue="roles" className="w-full max-w-3xl">
          <TabsList className="mb-6">
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="roles">
            <RolesTab />
          </TabsContent>
          
          <TabsContent value="users">
            <UsersTab />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
