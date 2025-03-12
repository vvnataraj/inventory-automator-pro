
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserRoles } from "@/hooks/useUserRoles";
import { Shield, Database, Cog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Administration() {
  const { isAdmin, loading } = useUserRoles();
  const [activeTab, setActiveTab] = useState("system");

  // This would be fetched from an API in a real application
  const systemInfo = {
    version: "1.0.0",
    environment: "Production",
    lastUpdated: new Date().toLocaleDateString(),
    database: "Supabase",
    server: "Vercel",
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Administration</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p>Loading administration settings...</p>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  if (!isAdmin()) {
    return (
      <MainLayout>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Administration</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              You need administrator privileges to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This area contains system-wide settings and configurations that
              require administrator access.
            </p>
            <Button 
              variant="outline" 
              onClick={() => toast.info("Contact your system administrator for access.")}
            >
              Request Access
            </Button>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Administration</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                System Information
              </CardTitle>
              <CardDescription>
                Overview of system settings and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Version</p>
                    <p className="text-sm text-muted-foreground">{systemInfo.version}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Environment</p>
                    <p className="text-sm text-muted-foreground">{systemInfo.environment}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">{systemInfo.lastUpdated}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Status</p>
                    <div className="flex items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                      <p className="text-sm text-muted-foreground">Operational</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button onClick={() => toast.success("System check completed")}>
                    Run System Check
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Management
              </CardTitle>
              <CardDescription>
                Database connections and maintenance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Database Provider</p>
                    <p className="text-sm text-muted-foreground">{systemInfo.database}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Status</p>
                    <div className="flex items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                      <p className="text-sm text-muted-foreground">Connected</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 space-x-2">
                  <Button 
                    variant="outline"
                    onClick={() => toast.success("Database backup initiated")}
                  >
                    Backup Database
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => toast.success("Maintenance completed")}
                  >
                    Run Maintenance
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="configuration">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cog className="h-5 w-5" />
                System Configuration
              </CardTitle>
              <CardDescription>
                Configure global application settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This section allows you to modify global system settings. Changes may affect all users.
              </p>
              <Button 
                onClick={() => toast.success("Settings saved successfully")}
                className="mr-2"
              >
                Save Configuration
              </Button>
              <Button 
                variant="outline"
                onClick={() => toast.info("Settings reset to defaults")}
              >
                Reset to Defaults
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
