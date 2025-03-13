
import { MainLayout } from "@/components/layout/MainLayout";
import { SalesAnalytics } from "@/components/sales/SalesAnalytics";
import { useSales } from "@/hooks/useSales";
import { TopProfitableItems } from "@/components/dashboard/TopProfitableItems";
import { DemandForecast } from "@/components/analytics/DemandForecast";
import { InventoryPrediction } from "@/components/analytics/InventoryPrediction";
import { SeasonalTrends } from "@/components/analytics/SeasonalTrends";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Analytics() {
  const { sales } = useSales(1, 1000, ""); // Get all sales for analytics
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("current");
  
  useEffect(() => {
    // Check for tab query parameter
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    
    if (tabParam === "predictive") {
      setActiveTab("predictive");
    }
  }, [location]);

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Analytics Dashboard</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">Current Analytics</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="mt-4">
          <SalesAnalytics sales={sales} />
          
          <div className="mt-6">
            <TopProfitableItems />
          </div>
        </TabsContent>
        
        <TabsContent value="predictive" className="mt-4">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DemandForecast sales={sales} />
              <InventoryPrediction sales={sales} className="lg:col-span-2" />
            </div>
            
            <SeasonalTrends sales={sales} />
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
