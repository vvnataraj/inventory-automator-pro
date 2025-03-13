
import { useAuth } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import ProfileTab from "@/components/settings/ProfileTab";
import SecurityTab from "@/components/settings/SecurityTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function UserSettings() {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <MainLayout>
        <div className="container py-10">
          <h1 className="text-2xl font-bold mb-4">User Settings</h1>
          <p>Please log in to view this page.</p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container py-10">
        <h1 className="text-2xl font-bold mb-6">User Settings</h1>
        
        <div className="w-full max-w-3xl">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                Manage your personal information and account security
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Password</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <ProfileTab />
            </TabsContent>
            
            <TabsContent value="security">
              <SecurityTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
