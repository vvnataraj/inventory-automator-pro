
import { useAuth } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import ProfileTab from "@/components/settings/ProfileTab";
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
                Manage your personal information and appearance
              </CardDescription>
            </CardHeader>
          </Card>
          
          <ProfileTab />
        </div>
      </div>
    </MainLayout>
  );
}
