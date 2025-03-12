
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SalesAnalytics } from "@/components/sales/SalesAnalytics";
import { useSales } from "@/hooks/useSales";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Analytics() {
  const { sales } = useSales(1, 100, ""); // Get a larger dataset for analytics

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="inventory" disabled>Inventory</TabsTrigger>
          <TabsTrigger value="purchases" disabled>Purchases</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales">
          <SalesAnalytics sales={sales} />
        </TabsContent>
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle>Purchases Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
